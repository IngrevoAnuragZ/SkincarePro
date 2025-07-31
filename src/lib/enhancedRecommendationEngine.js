# skincare_ml_engine.py
from datetime import datetime
from typing import Dict, List

class SkincareRecommendationEngine:
    # ---------- INITIALISATION ----------
    def __init__(self):
        self._init_ingredient_db()
        self._init_matrices()
        self._init_constraints()
        self._init_seasonal_rules()

    # ---------- PUBLIC API ----------
    def generate_recommendations(self, user: Dict) -> Dict:
        """Return full recommendation bundle for a single user dict."""
        user = self._validate_input(user)
        raw_scores = self._score_all_ingredients(user)
        raw_scores = self._apply_seasonal_boosts(raw_scores, user)
        chosen = self._apply_medical_rules(raw_scores, user)
        chosen = self._resolve_conflicts(chosen)
        bundles = self._categorise(chosen, raw_scores, user)
        return {
            "user_profile"      : user,
            "generated_at"      : datetime.utcnow().isoformat(),
            "algorithm_version" : "v3.0-comprehensive-ml",
            "recommendations"   : bundles,
            "warnings"          : self._warnings(chosen, user),
            "routine_suggestions": self._routine(chosen),
            "follow_up_timeline": self._timeline()
        }

    # ---------- INGREDIENT DATABASE ----------
    def _init_ingredient_db(self):
        g = "gentle"; m = "moderate"; s = "strong"
        self.db = {
            # cleansers
            "gentle_cleanser":  dict(cat="cleanser",  suit=["all"], addr=["basic_cleansing"],  str=g, price=[300,1200]),
            "salicylic_acid_cleanser":dict(cat="cleanser",suit=["oily","combination"],addr=["acne","oiliness","pores"],str=m,price=[500,2000],conf=["retinoids","benzoyl_peroxide"]),
            # actives
            "retinol":         dict(cat="active",    suit=["normal","oily","combination"],addr=["aging","acne","texture"],str=s,price=[800,3000],conf=["benzoyl_peroxide","vitamin_c","aha_bha"],exp="intermediate"),
            "niacinamide":     dict(cat="active",    suit=["all"],addr=["oiliness","pores","sensitivity","acne"],str=g,price=[400,1500],conf=["vitamin_c_high_concentration"]),
            "vitamin_c":       dict(cat="active",    suit=["normal","dry","oily"],addr=["hyperpigmentation","aging","sun_damage"],str=m,price=[600,2500],conf=["retinoids","niacinamide_high_concentration"],exp="intermediate"),
            "salicylic_acid":  dict(cat="active",    suit=["oily","combination"],addr=["acne","oiliness","pores","texture"],str=m,price=[500,2000],conf=["retinoids","benzoyl_peroxide"]),
            "hyaluronic_acid": dict(cat="hydrating", suit=["all"],addr=["dryness","aging"],str=g,price=[400,1800]),
            "azelaic_acid":    dict(cat="active",    suit=["sensitive","combination"],addr=["acne","sensitivity","hyperpigmentation"],str=g,price=[800,2500],exp="intermediate"),
            "ceramides":       dict(cat="barrier",   suit=["all"],addr=["dryness","sensitivity"],str=g,price=[600,2800]),
            "peptides":        dict(cat="anti_aging",suit=["all"],addr=["aging","firmness"],str=g,price=[800,3500],exp="intermediate"),
            "centella_asiatica":dict(cat="soothing", suit=["all"],addr=["sensitivity","inflammation","healing"],str=g,price=[400,1800]),
            "bakuchiol":       dict(cat="anti_aging",suit=["all"],addr=["aging","firmness"],str=g,price=[1000,4000]),
            # moisturisers
            "lightweight_moisturizer":dict(cat="moisturizer",suit=["oily","combination","normal"],addr=["basic_hydration"],str=g,price=[300,1500]),
            "rich_moisturizer":dict(cat="moisturizer",suit=["dry","sensitive"],addr=["dryness","sensitivity"],str=g,price=[500,2500]),
            # sunscreens
            "mineral_sunscreen":dict(cat="sunscreen",suit=["sensitive","all"],addr=["sun_damage"],str=g,price=[400,2000],essential=True),
            "chemical_sunscreen":dict(cat="sunscreen",suit=["normal","oily","combination"],addr=["sun_damage"],str=m,price=[300,1800]),
        }

    # ---------- MATRICES & CONSTANTS ----------
    def _init_matrices(self):
        self.skin_matrix = {               # compat scores 0-1
            "dry":         dict(dry=1, normal=.6, combination=.4, oily=.2, sensitive=.8),
            "oily":        dict(oily=1, combination=.7, normal=.5, dry=.2, sensitive=.3),
            "combination": dict(combination=1, normal=.8, oily=.7, dry=.4, sensitive=.4),
            "normal":      dict(normal=1, combination=.8, dry=.6, oily=.5, sensitive=.6),
            "sensitive":   dict(sensitive=1, dry=.8, normal=.6, combination=.4, oily=.3),
        }
        self.concern_wt = dict(acne=.9, aging=.8, hyperpigmentation=.75, dryness=.7,
                               oiliness=.65, texture=.6, pores=.55, sensitivity=.85)
        self.budget_range = {
            "budget":[0,500], "mid-range":[500,1500],
            "premium":[1500,3000], "luxury":[3000,10000]
        }
        self.strength_score = dict(gentle=1.0, moderate=.8, strong=.6, very_strong=.4)
        self.exp_level = dict(beginner=1, intermediate=2, advanced=3, expert=4)

    def _init_constraints(self):
        self.medical = {
            "eczema":  dict(req=["gentle_cleanser","ceramides","mineral_sunscreen"],
                            avoid=["retinol","salicylic_acid","vitamin_c"], sens=1.5),
            "psoriasis":dict(req=["gentle_cleanser","rich_moisturizer"],
                            avoid=["salicylic_acid","retinol"], sens=1.3),
            "rosacea": dict(req=["gentle_cleanser","azelaic_acid","mineral_sunscreen"],
                            avoid=["retinol","vitamin_c"], sens=1.4),
            "cystic_acne":dict(req=["gentle_cleanser","niacinamide"], avoid=[])
        }

    def _init_seasonal_rules(self):
        self.seasonal = {
            "summer":  dict(boost=dict(sun_damage=.4, oiliness=.25, pores=.2),
                            rec=["mineral_sunscreen","niacinamide","salicylic_acid"],
                            avoid=["heavy_oils","rich_moisturizer"]),
            "winter":  dict(boost=dict(dryness=.3, sensitivity=.2),
                            rec=["ceramides","hyaluronic_acid","rich_moisturizer"],
                            avoid=["salicylic_acid","retinol"]),
            "monsoon": dict(boost=dict(acne=.2, sensitivity=.15),
                            rec=["gentle_cleanser","niacinamide"],
                            avoid=["heavy_moisturizers"])
        }

    # ---------- VALIDATION ----------
    def _validate_input(self, u: Dict) -> Dict:
        d = dict(skinType="normal", concerns=["hydrate_skin"], medicalConditions=[],
                 ageRange="20-29", gender="prefer_not_to_say", sensitivity=5,
                 climate="moderate", budget="mid-range", experience="beginner",
                 lifestyle="mixed", goals=["hydrate_skin"])
        d.update(u or {})
        for key in ("concerns","medicalConditions","goals"):
            if not isinstance(d[key],list): d[key]=[d[key]]
        d["sensitivity"] = max(1, min(10, int(d["sensitivity"])))
        return d

    # ---------- SCORING ----------
    def _score_all_ingredients(self, user):
        scores={}
        for ing,data in self.db.items():
            skin  = self._skin_score(ing,user["skinType"])
            con   = self._concern_score(ing,user["concerns"])
            safe  = self._safety_score(ing,user)
            exp   = self._exp_score(ing,user["experience"])
            bud   = self._budget_score(ing,user["budget"])
            final = skin*.25 + con*.35 + safe*.20 + exp*.10 + bud*.10
            scores[ing]=dict(final=final,skin=skin,concern=con,
                             safe=safe,exp=exp,budget=bud)
        return scores

    def _skin_score(self, ing, user_skin):
        suits=self.db[ing]["suit"]
        if "all" in suits: return 1
        return max(self.skin_matrix[user_skin].get(t,0) for t in suits)

    def _concern_score(self, ing, concerns):
        addr=self.db[ing]["addr"]
        score=0
        for i,c in enumerate(concerns):
            if c in addr:
                score+= (1-i*0.1)*self.concern_wt.get(c,0.5)
        return min(1,score)

    def _safety_score(self, ing, user):
        base = self.strength_score[self.db[ing]["str"]]
        sens_pen = max(0,(user["sensitivity"]-5)*0.1)
        for cond in user["medicalConditions"]:
            mc=self.medical.get(cond,{}); 
            if ing in mc.get("avoid",[]): base*=0.3
            sens_pen*=mc.get("sens",1)
        return max(0, min(1, base-sens_pen))

    def _exp_score(self, ing, exp):
        need = self.exp_level.get(self.db[ing].get("exp","beginner"),1)
        have = self.exp_level.get(exp,1)
        return 1 if have>=need else max(0,1-(need-have)*0.3)

    def _budget_score(self, ing, budget):
        ir=self.db[ing]["price"]; ur=self.budget_range[budget]
        overlap=min(ur[1],ir[1]) - max(ur[0],ir[0])
        if overlap<=0: return 0
        return min(1, overlap/(ir[1]-ir[0] or 1))

    # ---------- SEASONAL ----------
    def _apply_seasonal_boosts(self,scores,user):
        clim=user["climate"]; m=datetime.utcnow().month
        season= "winter" if clim=="cold" else \
                "summer" if clim.startswith("hot") else \
                "monsoon" if clim=="varied_seasonal" and m in (6,7,8,9) else None
        if not season: return scores
        rule=self.seasonal[season]
        for ing, s in scores.items():
            addr=self.db[ing]["addr"]
            for concern,boost in rule["boost"].items():
                if concern in addr: s["final"]=min(1,s["final"]*(1+boost))
            if ing in rule["rec"]: s["final"]=min(1,s["final"]*1.2)
            if ing in rule["avoid"]: s["final"]*=.7
        return scores

    # ---------- MEDICAL RULES ----------
    def _apply_medical_rules(self,scores,user):
        req=set(); avoid=set()
        for cond in user["medicalConditions"]:
            mc=self.medical.get(cond,{})
            req.update(mc.get("req",[])); avoid.update(mc.get("avoid",[]))
        cand=[i for i,f in scores.items() if f["final"]>=.3 and i not in avoid]
        return list(req)+sorted(cand, key=lambda x:scores[x]["final"], reverse=True)

    # ---------- CONFLICT RESOLUTION ----------
    def _resolve_conflicts(self, ingredients):
        final=[]
        for ing in ingredients:
            conf=self.db[ing].get("conf",[])
            if all(i not in conf and ing not in self.db[i].get("conf",[]) for i in final):
                final.append(ing)
        return final

    # ---------- CATEGORISATION ----------
    def _categorise(self, chosen, scores, user):
        essential=[]; targeted=[]; supporting=[]
        for ing in chosen:
            d=self.db[ing]; sc=scores[ing]["final"]
            if d.get("essential") or d["cat"] in ("cleanser","moisturizer","sunscreen"):
                essential.append(self._fmt(ing,sc))
            elif sc>=.7: targeted.append(self._fmt(ing,sc))
            else: supporting.append(self._fmt(ing,sc))
        return dict(essential=essential,targeted=targeted,supporting=supporting)

    def _fmt(self, ing, score):
        d=self.db[ing]
        return dict(
            ingredient=ing,
            name=ing.replace("_"," ").title(),
            category=d["cat"],
            addresses=d["addr"],
            strength=d["str"],
            price_range=d["price"],
            final_score=round(score,2),
            usage=self._usage(d["cat"]),
        )

    # ---------- OUTPUT HELPERS ----------
    def _warnings(self, chosen, user):
        warn=[]
        if any(self.db[i]["cat"]=="active" for i in chosen):
            warn.append("Always use sunscreen when using active ingredients")
            warn.append("Introduce one active at a time")
        if user["sensitivity"]>7: warn.append("Patch-test all new products")
        if "rosacea" in user["medicalConditions"]:
            warn.append("Consult dermatologist for rosacea management")
        return warn

    def _routine(self, chosen):
        order=["cleanser","active","hydrating","moisturizer","sunscreen"]
        am=[]; pm=[]
        for cat in order:
            for ing in chosen:
                if self.db[ing]["cat"]!=cat: continue
                n=ing.replace("_"," ").title()
                if cat=="sunscreen": am.append(f"{n} (AM only)")
                elif cat=="active" and ing=="retinol": pm.append(f"{n} (PM only)")
                else:
                    am.append(n); 
                    if cat!="sunscreen": pm.append(n)
        return dict(morning=am, evening=pm)

    def _timeline(self):
        return {
            "week_1":"Start with cleanser & moisturiser",
            "week_2":"Add sunscreen (AM)",
            "week_3":"Introduce first active",
            "week_4":"Assess tolerance & adjust",
            "week_6":"Consider second active if needed",
            "week_8":"Full routine review"
        }

    def _usage(self, cat):
        return dict(
            cleanser="Use twice daily",
            active="Begin 2-3x/wk then increase",
            hydrating="Apply to damp skin",
            moisturizer="Apply after actives",
            sunscreen="Apply 15 min before sun & re-apply 2 h"
        ).get(cat,"Follow product instructions")

# ---------------- QUICK DEMO ----------------
if __name__ == "__main__":
    engine=SkincareRecommendationEngine()
    sample_user=dict(
        skinType="combination",
        concerns=["acne","oiliness","pores"],
        sensitivity=4,
        climate="hot_humid",
        budget="mid-range",
        experience="beginner"
    )
    from pprint import pprint
    pprint(engine.generate_recommendations(sample_user)["recommendations"])

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

export type AnswerType = {
  id: string;
  text: string;
  value: string | number | boolean;
  description?: string;
};

interface QuestionCardProps {
  questionId: string;
  questionText: string;
  questionDescription?: string;
  answers: AnswerType[];
  answerType: 'single' | 'multiple' | 'slider' | 'text';
  onAnswer: (questionId: string, value: any) => void;
  currentAnswer?: any;
  onPrevious?: () => void;
  showPreviousButton?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionId,
  questionText,
  questionDescription,
  answers,
  answerType,
  onAnswer,
  currentAnswer,
  onPrevious,
  showPreviousButton = false,
  questionNumber,
  totalQuestions,
}) => {
  const [localAnswer, setLocalAnswer] = useState<any>(currentAnswer);
  const [sliderLabel, setSliderLabel] = useState<string>('');
  
  useEffect(() => {
    if (answerType === 'slider') {
      updateSliderLabel(localAnswer || answers[0].value);
    }
  }, [localAnswer, answerType, questionId]);

  const handleSingleChoice = (value: any) => {
    setLocalAnswer(value);
  };
  
  const handleMultipleChoice = (value: any) => {
    const updatedAnswers = localAnswer ? [...localAnswer] : [];
    const index = updatedAnswers.indexOf(value);
    
    if (index === -1) {
      updatedAnswers.push(value);
    } else {
      updatedAnswers.splice(index, 1);
    }
    
    setLocalAnswer(updatedAnswers);
  };

  const updateSliderLabel = (value: number) => {
    switch (questionId) {
      case 'skinSensitivity':
        setSliderLabel(
          value === 1 ? 'Not Sensitive' :
          value === 2 ? 'Slightly Sensitive' :
          value === 3 ? 'Moderately Sensitive' :
          value === 4 ? 'Very Sensitive' :
          'Extremely Sensitive'
        );
        break;
      case 'budget':
        setSliderLabel(
          value === 1 ? 'Budget-Friendly' :
          value === 2 ? 'Mid-Range' :
          value === 3 ? 'Premium' :
          'Luxury'
        );
        break;
      case 'experience':
        setSliderLabel(
          value === 1 ? 'Beginner' :
          value === 2 ? 'Some Knowledge' :
          value === 3 ? 'Experienced' :
          'Expert'
        );
        break;
      case 'skinSensitivity':
        setSliderLabel(
          value === 1 ? 'Not Sensitive' :
          value === 2 ? 'Slightly Sensitive' :
          value === 3 ? 'Moderately Sensitive' :
          value === 4 ? 'Very Sensitive' :
          'Extremely Sensitive'
        );
        break;
      case 'oiliness':
        setSliderLabel(
          value === 1 ? 'Very Dry' :
          value === 2 ? 'Dry' :
          value === 3 ? 'Normal' :
          value === 4 ? 'Oily' :
          'Very Oily'
        );
        break;
      default:
        setSliderLabel(`Level ${value}`);
        break;
    }
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLocalAnswer(value);
    updateSliderLabel(value);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalAnswer(e.target.value);
  };
  
  const handleContinue = () => {
    onAnswer(questionId, localAnswer);
  };

  const renderAnswerInput = () => {
    switch (answerType) {
      case 'single':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            {answers.map((answer) => (
              <motion.button
                key={answer.id}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  localAnswer === answer.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 hover:border-primary-200 hover:bg-primary-50/50'
                }`}
                onClick={() => handleSingleChoice(answer.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div 
                    className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      localAnswer === answer.value
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-neutral-300'
                    }`}
                  >
                    {localAnswer === answer.value && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-2 w-2 rounded-full bg-white"
                      />
                    )}
                  </div>
                  <div>
                    <span className="font-medium">{answer.text}</span>
                    {answer.description && (
                      <p className="text-sm text-neutral-500 mt-1">{answer.description}</p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );
        
      case 'multiple':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            {answers.map((answer) => (
              <motion.button
                key={answer.id}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  localAnswer && localAnswer.includes(answer.value)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 hover:border-primary-200 hover:bg-primary-50/50'
                }`}
                onClick={() => handleMultipleChoice(answer.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div 
                    className={`h-5 w-5 rounded flex items-center justify-center mr-3 border-2 ${
                      localAnswer && localAnswer.includes(answer.value)
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-neutral-300'
                    }`}
                  >
                    {localAnswer && localAnswer.includes(answer.value) && (
                      <motion.svg 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        width="10" 
                        height="8" 
                        viewBox="0 0 10 8" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">{answer.text}</span>
                    {answer.description && (
                      <p className="text-sm text-neutral-500 mt-1">{answer.description}</p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );
        
      case 'slider':
        return (
          <div className="mt-6">
            <div className="mb-4 text-center">
              <span className="text-lg font-medium text-primary-600">
                {sliderLabel || `Selected: ${localAnswer || answers[0].value}`}
              </span>
            </div>
            <div className="mb-2 flex justify-between text-sm text-neutral-500">
              <span>{answers[0].text}</span>
              <span>{answers[answers.length - 1].text}</span>
            </div>
            <input
              type="range"
              min={answers[0].value as number}
              max={answers[answers.length - 1].value as number}
              value={localAnswer || answers[0].value}
              onChange={handleSliderChange}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="mt-2 flex justify-between px-2">
              {answers.map((answer, index) => (
                <div 
                  key={answer.id}
                  className={`h-1 w-1 rounded-full ${
                    (localAnswer || answers[0].value) >= answer.value
                      ? 'bg-primary-500'
                      : 'bg-neutral-300'
                  }`}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleContinue}
                variant="primary"
                icon={<ChevronRight size={20} />}
                iconPosition="right"
              >
                Next Question
              </Button>
            </div>
          </div>
        );
        
      case 'text':
        return (
          <div className="mt-6">
            <textarea
              value={localAnswer || ''}
              onChange={handleTextChange}
              placeholder={questionId === 'otherConditions' 
                ? "Please describe any other skin conditions, allergies, or specific concerns not mentioned above..."
                : "Type your answer here..."
              }
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleContinue}
                disabled={questionId === 'otherConditions' ? false : !localAnswer?.trim()}
                variant="primary"
                icon={<ChevronRight size={20} />}
                iconPosition="right"
              >
                Next Question
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="card max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {questionNumber && totalQuestions && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-neutral-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="h-1 flex-1 mx-4 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <h3 className="text-xl md:text-2xl font-semibold mb-2">{questionText}</h3>
      
      {questionDescription && (
        <p className="text-neutral-600 mb-4">{questionDescription}</p>
      )}
      
      {renderAnswerInput()}
      
      <div className="mt-8 flex justify-between items-center">
        {showPreviousButton && (
          <Button
            variant="ghost"
            onClick={onPrevious}
            className="text-neutral-600 hover:text-neutral-800"
            icon={<ChevronLeft size={20} />}
            iconPosition="left"
          >
            Previous
          </Button>
        )}
        
        {(answerType === 'single' || answerType === 'multiple') && (
          <Button
            onClick={handleContinue}
            disabled={
              localAnswer === undefined || 
              (Array.isArray(localAnswer) && localAnswer.length === 0) ||
              (typeof localAnswer === 'string' && localAnswer.trim() === '')
            }
            className="ml-auto"
            variant="primary"
            icon={<ChevronRight size={20} />}
            iconPosition="right"
          >
            Next Question
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
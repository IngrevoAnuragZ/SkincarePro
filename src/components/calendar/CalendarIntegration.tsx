import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, AlertCircle, Settings, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { googleCalendarService, getUserTimezone, formatTimeForDisplay } from '../../lib/googleCalendar';
import { calendarService, type CalendarIntegration as CalendarIntegrationType } from '../../lib/supabase';

interface RoutineStep {
  id: string;
  productName: string;
  productType: string;
  timing?: string;
  description?: string;
}

interface SkincareRoutine {
  id: string;
  title: string;
  time: 'morning' | 'afternoon' | 'evening';
  steps: RoutineStep[];
}

interface CalendarIntegrationProps {
  routines: SkincareRoutine[];
  assessmentId?: number;
  userId?: string;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  routines,
  assessmentId,
  userId
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showTimeSettings, setShowTimeSettings] = useState(false);
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>(['morning', 'evening']);
  const [routineTimes, setRoutineTimes] = useState({
    morning: '08:00',
    afternoon: '14:00',
    evening: '20:00'
  });
  const [recurringPattern, setRecurringPattern] = useState('daily');
  const [existingIntegration, setExistingIntegration] = useState<CalendarIntegrationType | null>(null);

  const timezone = getUserTimezone();

  useEffect(() => {
    checkAuthStatus();
    if (userId) {
      loadExistingIntegration();
    }
  }, [userId]);

  const checkAuthStatus = async () => {
    try {
      // Check if Google Calendar API credentials are configured
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!apiKey || !clientId || apiKey === 'your_google_api_key' || clientId === 'your_google_client_id') {
        setError('Google Calendar integration requires API credentials to be configured. Please contact support for setup assistance.');
        return;
      }

      await googleCalendarService.initialize();
      setIsConnected(googleCalendarService.getAuthStatus());
    } catch (error: any) {
      console.error('Failed to initialize Google Calendar:', error);
      
      // Handle specific Google API errors
      if (error.details?.includes('Not a valid origin')) {
        setError('Google Calendar integration is not configured for this domain. Please contact support for setup assistance.');
      } else if (error.details?.includes('idpiframe_initialization_failed')) {
        setError('Google Calendar API configuration issue. Please contact support for assistance.');
      } else {
        setError('Google Calendar integration is currently unavailable. Please try again later.');
      }
    }
  };

  const loadExistingIntegration = async () => {
    if (!userId) return;
    
    try {
      const integrations = await calendarService.getByUserId(userId);
      if (integrations.length > 0) {
        const integration = integrations[0];
        setExistingIntegration(integration);
        
        if (integration.morning_time) {
          setRoutineTimes(prev => ({ ...prev, morning: integration.morning_time! }));
        }
        if (integration.afternoon_time) {
          setRoutineTimes(prev => ({ ...prev, afternoon: integration.afternoon_time! }));
        }
        if (integration.evening_time) {
          setRoutineTimes(prev => ({ ...prev, evening: integration.evening_time! }));
        }
        if (integration.recurring_pattern) {
          setRecurringPattern(integration.recurring_pattern);
        }
      }
    } catch (error) {
      console.error('Failed to load existing integration:', error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await googleCalendarService.signIn();
      setIsConnected(true);
      setShowTimeSettings(true);
    } catch (error: any) {
      console.error('Google Calendar sign-in failed:', error);
      
      if (error.message?.includes('popup_blocked')) {
        setError('Please allow popups for this site and try again.');
      } else if (error.message?.includes('access_denied')) {
        setError('Google Calendar access was denied. Please try again and grant permission.');
      } else {
        setError('Failed to connect to Google Calendar. Please ensure you have a stable internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await googleCalendarService.signOut();
      setIsConnected(false);
      setShowTimeSettings(false);
      setSuccess(null);
    } catch (error) {
      setError('Failed to disconnect from Google Calendar.');
    }
  };

  const handleAddToCalendar = async () => {
    if (!isConnected) {
      await handleConnect();
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedRoutineObjects = routines.filter(routine => 
        selectedRoutines.includes(routine.time)
      );

      const eventIds = await googleCalendarService.addRoutinesToCalendar(
        selectedRoutineObjects,
        routineTimes,
        timezone,
        recurringPattern
      );

      // Save integration to database
      if (userId && assessmentId) {
        const integrationData: CalendarIntegrationType = {
          user_id: userId,
          assessment_id: assessmentId,
          morning_time: selectedRoutines.includes('morning') ? routineTimes.morning : undefined,
          afternoon_time: selectedRoutines.includes('afternoon') ? routineTimes.afternoon : undefined,
          evening_time: selectedRoutines.includes('evening') ? routineTimes.evening : undefined,
          timezone,
          recurring_pattern: recurringPattern,
          active: true,
          google_calendar_id: eventIds.join(',')
        };

        if (existingIntegration) {
          await calendarService.update(existingIntegration.integration_id!, integrationData);
        } else {
          await calendarService.save(integrationData);
        }
      }

      setSuccess(`Successfully added ${selectedRoutineObjects.length} routine${selectedRoutineObjects.length > 1 ? 's' : ''} to your Google Calendar!`);
      setShowTimeSettings(false);
    } catch (error) {
      setError('Failed to add routines to calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoutineToggle = (routineTime: string) => {
    setSelectedRoutines(prev => 
      prev.includes(routineTime)
        ? prev.filter(time => time !== routineTime)
        : [...prev, routineTime]
    );
  };

  const handleTimeChange = (routineTime: string, time: string) => {
    setRoutineTimes(prev => ({ ...prev, [routineTime]: time }));
  };

  const getRoutineIcon = (time: string) => {
    switch (time) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌙';
      default: return '⏰';
    }
  };

  // If there's a configuration error, show a simplified message
  if (error && (error.includes('API credentials') || error.includes('not configured') || error.includes('configuration issue'))) {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <Calendar size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Google Calendar Integration</h3>
              <p className="text-neutral-600">Never miss your skincare routine again</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg flex items-center">
            <AlertCircle size={20} className="text-warning-600 mr-2" />
            <span className="text-warning-700">Google Calendar integration is currently being set up. This feature will be available soon!</span>
          </div>
          <p className="text-neutral-600 mb-6">
            In the meantime, you can export your routine and manually add it to your calendar.
          </p>
        </div>

        <div className="mt-6 text-xs text-neutral-500">
          <p>• Routines will be added as recurring events with 10-minute reminders</p>
          <p>• You can modify or delete events directly in Google Calendar</p>
          <p>• Your timezone: {timezone}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <Calendar size={24} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Google Calendar Integration</h3>
            <p className="text-neutral-600">Never miss your skincare routine again</p>
          </div>
        </div>
        
        {isConnected && (
          <button
            onClick={() => setShowTimeSettings(!showTimeSettings)}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <Settings size={20} className="text-neutral-600" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg flex items-center"
          >
            <AlertCircle size={20} className="text-error-600 mr-2" />
            <span className="text-error-700">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg flex items-center"
          >
            <Check size={20} className="text-success-600 mr-2" />
            <span className="text-success-700">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isConnected ? (
        <div className="text-center">
          <p className="text-neutral-600 mb-6">
            Connect your Google Calendar to automatically schedule your skincare routines with reminders.
          </p>
          <Button
            onClick={handleConnect}
            isLoading={isLoading}
            variant="primary"
            icon={<Calendar size={18} />}
            iconPosition="left"
          >
            Connect Google Calendar
          </Button>
        </div>
      ) : (
        <div>
          {!showTimeSettings && !success ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Check size={24} className="text-success-600 mr-2" />
                <span className="text-success-700 font-medium">Connected to Google Calendar</span>
              </div>
              <Button
                onClick={() => setShowTimeSettings(true)}
                variant="primary"
                icon={<Clock size={18} />}
                iconPosition="left"
              >
                Schedule Routines
              </Button>
              <button
                onClick={handleDisconnect}
                className="ml-3 text-neutral-500 hover:text-neutral-700 text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : showTimeSettings ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="font-semibold mb-3">Select Routines to Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {routines.map((routine) => (
                    <label
                      key={routine.time}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedRoutines.includes(routine.time)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoutines.includes(routine.time)}
                        onChange={() => handleRoutineToggle(routine.time)}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-3">{getRoutineIcon(routine.time)}</span>
                      <div>
                        <div className="font-medium capitalize">{routine.time}</div>
                        <div className="text-sm text-neutral-500">{routine.steps.length} steps</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Set Routine Times</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedRoutines.map((routineTime) => (
                    <div key={routineTime} className="bg-white rounded-lg p-3">
                      <label className="block text-sm font-medium text-neutral-700 mb-2 capitalize">
                        {getRoutineIcon(routineTime)} {routineTime} Routine
                      </label>
                      <input
                        type="time"
                        value={routineTimes[routineTime as keyof typeof routineTimes]}
                        onChange={(e) => handleTimeChange(routineTime, e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatTimeForDisplay(routineTimes[routineTime as keyof typeof routineTimes])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Recurring Pattern</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'daily', label: 'Daily', description: 'Every day' },
                    { value: 'weekdays', label: 'Weekdays', description: 'Monday to Friday' },
                    { value: 'custom', label: 'Custom', description: 'Set your own pattern' }
                  ].map((pattern) => (
                    <label
                      key={pattern.value}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        recurringPattern === pattern.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="recurring"
                        value={pattern.value}
                        checked={recurringPattern === pattern.value}
                        onChange={(e) => setRecurringPattern(e.target.value)}
                        className="sr-only"
                      />
                      <div>
                        <div className="font-medium">{pattern.label}</div>
                        <div className="text-sm text-neutral-500">{pattern.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                <button
                  onClick={() => setShowTimeSettings(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleAddToCalendar}
                  isLoading={isLoading}
                  disabled={selectedRoutines.length === 0}
                  variant="primary"
                  icon={<Calendar size={18} />}
                  iconPosition="left"
                >
                  Add to Calendar
                </Button>
              </div>
            </motion.div>
          ) : null}
        </div>
      )}

      <div className="mt-6 text-xs text-neutral-500">
        <p>• Routines will be added as recurring events with 10-minute reminders</p>
        <p>• You can modify or delete events directly in Google Calendar</p>
        <p>• Your timezone: {timezone}</p>
      </div>
    </div>
  );
};

export default CalendarIntegration;
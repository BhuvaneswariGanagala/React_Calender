import { useState, useEffect } from 'react';
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from 'date-fns';
import EventModal from './EventModal';

interface Event {
  title: string;
  time: string;
  date: string;
}

interface CalendarListProps {
  events: Event[];
  onAddEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
}

const eventColors = [
  'bg-pink-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-red-500',
];

export default function CalendarList({ events, onAddEvent, onDeleteEvent }: CalendarListProps) {
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);



  useEffect(() => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days: Date[] = [];

    let day = start;
    while (day <= end) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }

    setDaysInMonth(days);
  }, []);

  const getEventsForDate = (dateStr: string) => {
    return events.filter(evt => evt.date === dateStr);
  };

  const handleAddEvent = (event: Event) => {
    onAddEvent(event);
    setShowModal(false);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowDayDetail(true);
  };

  const handleAddEventForDay = () => {
    setShowDayDetail(false);
    setShowModal(true);
  };

  const handleAddToday = () => {
    setSelectedDate(new Date());
    setShowModal(true);
  };

  return (
    <div className="relative space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 rounded-2xl shadow-lg bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="z-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-lg">
            {format(new Date(), 'MMMM yyyy')}
          </h2>
          <p className="text-blue-100 mt-1 text-sm">List View</p>
        </div>
        <div className="text-right z-10">
          <div className="text-xl font-bold">{daysInMonth.length} Days</div>
          <div className="text-blue-100 text-sm">{events.length} Total Events</div>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-3 animate-fade-in-up">
        {daysInMonth.map(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayEvents = getEventsForDate(dayStr);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={dayStr}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105
                ${isToday ? 'border border-blue-400 ring-2 ring-blue-200/30 bg-blue-50/50 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              onClick={() => handleDayClick(day)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`text-xl font-bold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {format(day, 'd')}
                  </div>
                  <div>
                    <div className="font-semibold text-base">{format(day, 'EEEE')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{format(day, 'MMMM yyyy')}</div>
                  </div>
                </div>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-400 text-white shadow">
                    Today
                  </span>
                )}
              </div>

              {dayEvents.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-2">📅</div>
                  <p className="text-gray-500 dark:text-gray-400 italic text-sm">No events scheduled</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click to add an event</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🎉</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                      {dayEvents.length} Event{dayEvents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dayEvents.map((evt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-md animate-fade-in-up ${eventColors[idx % eventColors.length]} group hover:shadow-lg transition-all duration-200`}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                          <span className="text-sm">⏰</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-1">{evt.title}</div>
                          <div className="text-xs opacity-90 font-mono flex items-center gap-1">
                            <span>🕐</span>
                            <span>{evt.time}</span>
                          </div>
                        </div>
                        <div className="text-xs opacity-60 font-medium">
                          {format(new Date(day), 'MMM d')}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvent(evt);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs hover:scale-110"
                          title="Delete event"
                        >
                          <span className="text-xs">🗑️</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleAddToday}
        className="fixed bottom-10 right-10 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-blue-400/50 transition-all text-2xl flex items-center justify-center border-4 border-white/40"
        title="Add Event for Today"
        style={{ boxShadow: '0 8px 32px 0 rgba(59,130,246,0.25)' }}
      >
        ＋
      </button>

      {/* Modal */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 relative">
            <EventModal
              date={selectedDate}
              onSave={handleAddEvent}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Day Detail Modal */}
      {showDayDetail && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-lg w-full border border-gray-200 dark:border-gray-700 relative animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h2>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {getEventsForDate(format(selectedDate, 'yyyy-MM-dd')).length} Events
                </p>
              </div>
              <button
                onClick={() => setShowDayDetail(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close modal"
              >
                <span className="text-2xl text-gray-500 dark:text-gray-400">×</span>
              </button>
            </div>

            {/* Events List */}
            <div className="space-y-4 mb-6">
              {getEventsForDate(format(selectedDate, 'yyyy-MM-dd')).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-gray-500 dark:text-gray-400 italic">No events scheduled for this day</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click "Add Event" to schedule something</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getEventsForDate(format(selectedDate, 'yyyy-MM-dd')).map((event, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 ${eventColors[idx % eventColors.length]} group`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                        <span className="text-lg">⏰</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base mb-1">{event.title}</div>
                        <div className="text-sm opacity-90 font-mono flex items-center gap-2">
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(event);
                        }}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white hover:scale-110"
                        title="Delete event"
                      >
                        <span className="text-sm">🗑️</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Event Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDayDetail(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Close
              </button>
              <button
                onClick={handleAddEventForDay}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





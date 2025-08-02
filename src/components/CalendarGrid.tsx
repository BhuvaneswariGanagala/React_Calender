import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  setMonth,
  setYear,
} from 'date-fns';
import { useState } from 'react';
import EventModal from './EventModal';

interface Event {
  title: string;
  time: string;
  date: string; // 'YYYY-MM-DD'
}

interface CalendarGridProps {
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

export default function CalendarGrid({ events, onAddEvent, onDeleteEvent }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayDetail(true);
  };

  const addEvent = (event: Event) => {
    onAddEvent(event);
    setShowModal(false);
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(evt => evt.date === dateStr);
  };

  const handleAddEventForDay = () => {
    setShowDayDetail(false);
    setShowModal(true);
  };

  // Generate month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(setMonth(currentMonth, monthIndex));
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
    setShowYearDropdown(false);
  };

  // Floating Action Button for adding event to today
  const handleAddToday = () => {
    setSelectedDate(new Date());
    setShowModal(true);
  };

  const renderDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayEvents = getEventsForDate(dayStr);
    const isToday = isSameDay(day, new Date());
    const isCurrentMonth = isSameMonth(day, currentMonth);

    return (
      <div
        key={dayStr}
        onClick={() => handleDateClick(day)}
        className={`relative p-1.5 h-24 overflow-y-auto border rounded-xl cursor-pointer transition-all duration-200 shadow-md
          ${!isCurrentMonth ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-900'}
          ${isToday ? 'border border-blue-400 ring-2 ring-blue-200/30 scale-102 z-10' : 'border-gray-200 dark:border-gray-700'}
          hover:shadow-xl hover:border-blue-400 hover:scale-105`}
        style={{ boxShadow: isToday ? '0 0 8px 2px #3b82f6aa' : undefined }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-extrabold drop-shadow-sm">
            {format(day, 'd')}
          </div>
          {isToday && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-blue-400 text-white shadow">Today</span>
          )}
        </div>
        <div className="space-y-0.5 text-xs">
          {dayEvents.map((evt, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-white shadow-md animate-fade-in-up ${eventColors[idx % eventColors.length]} group hover:shadow-lg transition-all duration-200`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-xs">⏰</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs truncate leading-tight">{evt.title}</div>
                  <div className="text-xs opacity-90 font-mono">{evt.time}</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEvent(evt);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs hover:scale-110"
                title="Delete event"
              >
                <span className="text-xs">🗑️</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Remove redundant calculation of monthEnd (not used elsewhere)
  const monthStart = startOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(endOfMonth(monthStart));

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      days.push(renderDay(day));
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="relative space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-2xl min-h-[70vh]">
      {/* Month/Year Dropdowns - moved above header */}
      <div className="flex justify-center gap-4 mb-2">
        {/* Month Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-base font-bold shadow border border-gray-200 dark:border-gray-700 min-w-[120px] text-left flex items-center gap-2 transition-all"
          >
            {format(currentMonth, 'MMMM')}
            <span className="text-sm">▼</span>
          </button>
          {showMonthDropdown && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-30 animate-fade-in-up">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  className={`w-full px-3 py-2 text-left rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-sm ${
                    format(currentMonth, 'M') === String(index + 1) ? 'bg-blue-100 dark:bg-blue-900/40 font-bold' : ''
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Year Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-base font-bold shadow border border-gray-200 dark:border-gray-700 min-w-[90px] text-left flex items-center gap-2 transition-all"
          >
            {format(currentMonth, 'yyyy')}
            <span className="text-sm">▼</span>
          </button>
          {showYearDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-30 animate-fade-in-up max-h-72 overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`w-full px-3 py-2 text-left rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-sm ${
                    format(currentMonth, 'yyyy') === String(year) ? 'bg-blue-100 dark:bg-blue-900/40 font-bold' : ''
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 rounded-2xl shadow-lg bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="flex items-center space-x-2 z-10">
          <button
            onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 shadow transition"
            aria-label="Previous Month"
          >
            <span className="text-xl">◀</span>
          </button>
          <div className="text-lg font-bold px-3 py-1.5 rounded-full bg-white/30 border border-white/30 shadow min-w-[100px] text-center">
            {format(currentMonth, 'MMMM')}
          </div>
          <div className="text-lg font-bold px-3 py-1.5 rounded-full bg-white/30 border border-white/30 shadow min-w-[70px] text-center">
            {format(currentMonth, 'yyyy')}
          </div>
          <button
            onClick={() => setCurrentMonth(addDays(endOfMonth(currentMonth), 1))}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 shadow transition"
            aria-label="Next Month"
          >
            <span className="text-xl">▶</span>
          </button>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-lg z-10">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
      </div>
      {/* Close dropdowns when clicking outside */}
      {(showMonthDropdown || showYearDropdown) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowMonthDropdown(false);
            setShowYearDropdown(false);
          }}
        />
      )}
      {/* Days of week */}
      <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-700 dark:text-gray-200 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-1 uppercase tracking-widest drop-shadow-sm">{day}</div>
        ))}
      </div>
      {/* Calendar grid */}
      <div className="space-y-2 animate-fade-in-up">
        {rows}
      </div>
      {/* Floating Action Button */}
      <button
        onClick={handleAddToday}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-blue-400/50 transition-all text-2xl flex items-center justify-center border-4 border-white/40"
        title="Add Event for Today"
        style={{ boxShadow: '0 8px 32px 0 rgba(59,130,246,0.25)' }}
      >
        <span className="drop-shadow">＋</span>
      </button>
      {/* Modal with glassmorphism effect */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 relative">
            <EventModal
              date={selectedDate}
              onClose={() => setShowModal(false)}
              onSave={addEvent}
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

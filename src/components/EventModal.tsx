import { useState } from 'react';
import { format } from 'date-fns';

// Event interface should match CalendarGrid
interface Event {
  title: string;
  time: string;
  date: string; // 'YYYY-MM-DD'
}

interface EventModalProps {
  date: Date;
  onClose: () => void;
  onSave: (event: Event) => void;
}

export default function EventModal({ date, onClose, onSave }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert to 24-hour format for storage
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    const time12 = `${hour}:${minute} ${period}`;

    const event: Event = {
      title,
      time: time12, // Store in 12-hour format with AM/PM
      date: format(date, 'yyyy-MM-dd'),
    };

    onSave(event);
    setTitle('');
    setHour('12');
    setMinute('00');
    setPeriod('AM');
  };

  // Generate time options
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 relative animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Event
            </h2>
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              {format(date, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <span className="text-2xl text-gray-500 dark:text-gray-400">×</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Enter event title..."
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            />
          </div>

          {/* Event Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Hour
              </label>
              <select
                value={hour}
                onChange={e => setHour(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
              >
                {hours.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Minute
              </label>
              <select
                value={minute}
                onChange={e => setMinute(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
              >
                {minutes.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                AM/PM
              </label>
              <select
                value={period}
                onChange={e => setPeriod(e.target.value as 'AM' | 'PM')}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Event Preview */}
          {title && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Event Preview
              </h3>
              <div className="flex items-center gap-3 p-3 bg-blue-500 rounded-lg text-white">
                <span className="text-lg">🎉</span>
                <div className="flex-1">
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm opacity-90">{`${hour}:${minute} ${period}`}</div>
                </div>
                <div className="text-xs opacity-80">
                  {format(date, 'MMM d')}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              Save Event
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Events are automatically saved to your browser's local storage
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import CalendarGrid from './components/CalendarGrid';
import CalendarList from './components/CalendarList';
import ThemeToggle from './components/ThemeToggle';

interface Event {
  title: string;
  time: string;
  date: string; // 'YYYY-MM-DD'
}

function App() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load events from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('calendarEvents');
      
      if (stored && stored !== 'null' && stored !== 'undefined') {
        const parsedEvents = JSON.parse(stored);
        
        if (Array.isArray(parsedEvents)) {
          setEvents(parsedEvents);
        } else {
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
      setEvents([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
      } catch (error) {
        console.error('Error saving events to localStorage:', error);
      }
    }
  }, [events, isLoaded]);

  const addEvent = useCallback((event: Event) => {
    setEvents(prev => {
      const newEvents = [...prev, event];
      
      // Immediately save to localStorage
      try {
        localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
      } catch (error) {
        console.error('Error immediately saving event:', error);
      }
      
      return newEvents;
    });
  }, []);

  const deleteEvent = useCallback((eventToDelete: Event) => {
    setEvents(prev => {
      const newEvents = prev.filter(event => 
        !(event.title === eventToDelete.title && 
          event.time === eventToDelete.time && 
          event.date === eventToDelete.date)
      );

      // Immediately save to localStorage
      try {
        localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
      } catch (error) {
        console.error('Error immediately saving events after deletion:', error);
      }

      return newEvents;
    });
  }, []);

  // Add z-50 to main container to ensure dropdowns are above other content
  return (
    <div className="min-h-screen p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative z-50">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold"> Calendar App</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1 rounded ${view === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            List View
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main>
        {view === 'grid' ? (
          <CalendarGrid events={events} onAddEvent={addEvent} onDeleteEvent={deleteEvent} />
        ) : (
          <CalendarList events={events} onAddEvent={addEvent} onDeleteEvent={deleteEvent} />
        )}
      </main>
    </div>
  );
}

export default App;

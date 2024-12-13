import React, { useState,useEffect } from 'react'
import EventModal from './EventModal'


const CalendarGrid = () => {
  const days = ["Sun", "Mon","Tue","Wed","Thu","Fri","Sat"]
  const months = ["January", 
    "February",
    "March",
    "April", 
    "May", 
    "June", 
    "July",
    "August", 
    "September",
    "October",
    "November", 
    "December" ]

   
    const currentDate = new Date()

    const [selectedCategory, setSelectedCategory] = useState('Work');
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
    const [selectedDate, setSelectedDate] = useState(currentDate)
    const [showEventPopUp, setShowEventPopUp] = useState(false)
    const [events, setEvents] = useState([])
    const [eventTime, setEventTime] = useState({hours: '00', minutes: '00'})
    const [eventText , setEventText] = useState('')
    const [editingEvent,setEditingEvent] = useState(null)
    const [filterKeyword, setFilterKeyword] = useState('');
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    
    // Load events from localStorage on mount
    useEffect(() => {
      const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
      const formattedEvents = storedEvents.map(event => ({
        ...event,
        date: new Date(event.date),
      }));
      setEvents(formattedEvents);
    }, []);
    

  // Save events to localStorage whenever events state changes
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

    const exportEventsAsJSON = () => {
      // Filter events for the selected date
      const filteredEvents = events.filter((event) =>
        isSameDay(event.date, selectedDate)
      );
    
      // Convert the event date to a local date string (to avoid UTC conversion issues)
      const eventsWithLocalDate = filteredEvents.map((event) => {
        // Convert event.date to a local date string in ISO format (without time)
        const localDate = new Date(event.date).toLocaleDateString('en-GB'); // You can customize this format
        return {
          ...event,
          date: localDate, // Replace event date with formatted date string
        };
      });
    
      // Prepare JSON blob
      const jsonBlob = new Blob([JSON.stringify(eventsWithLocalDate, null, 2)], {
        type: "application/json",
      });
    
      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(jsonBlob);
      downloadLink.download = `events-${selectedDate.toISOString().split("T")[0]}.json`;
    
      // Trigger download
      downloadLink.click();
    };

    
    const prevMonth = () => {
       setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1))
       setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear))
    } 

    const nextMonth = () => {
       setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1))
       setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear))
    }

    const modalClick = (day) => {
      const clickedDate = new Date(currentYear, currentMonth, day)
      const today = new Date();

      if (clickedDate >= today || isSameDay(clickedDate, today)) {
        setSelectedDate(clickedDate);
        setShowEventPopUp(true);
        
      }
    }

    const isSameDay =(date1,date2) => {
      return (
         date1 instanceof Date && date2 instanceof Date &&
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate() 
      )
    }

    const hasEvent = (day) => {
      return events.some((event) => isSameDay(event.date, new Date(currentYear, currentMonth, day)));
    };

    const handleEventSubmit = () => {
      const newEvent = {
        id: editingEvent ? editingEvent.id :Date.now(),
        date: selectedDate,
        time: `${eventTime.hours.padStart(2, '0')}: ${eventTime.minutes.padStart(2, '0')}`,
        text: eventText,
        category: selectedCategory,
      }

     // Prevent overlapping events
     const isOverlapping = events.some((event) =>
      isSameDay(event.date, selectedDate) && event.time === newEvent.time
    );

    if (isOverlapping) {
      alert('An event at the same time already exists!');
      return;
    }

      

    let updatedEvents = [...events];

    if (editingEvent) {
      updatedEvents = updatedEvents.map((event) =>
        event.id === editingEvent.id ? newEvent : event
      );
    } else {
      updatedEvents.push(newEvent);
    }


      updatedEvents.sort((a,b) => new Date(a.date) - new Date(b.date))
      

      setEvents(updatedEvents)
      setEventTime({hours: '00', minutes: '00'})
      setEventText("")
      setShowEventPopUp(false)
      setEditingEvent(null)
    }

    const handleEditEvent = (event) => {
      setSelectedDate(new Date(event.date))
      setEventTime({
        hours : event.time.split(':')[0],
        minutes : event.time.split(':')[1],
      })
      setEventText(event.text)
      setEditingEvent(event)
      setShowEventPopUp(true)
    }

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId)
    
    setEvents(updatedEvents)
  }
  
  
    return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4" >
          <div>
            <h1>Calendar</h1>
            <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="text-gray-600 hover:text-black">
            &lt;
          </button>
          <h2 className="text-xl font-bold">{`${months[currentMonth]} ${currentYear}`}</h2>
          <button onClick={nextMonth} className="text-gray-600 hover:text-black">
            &gt;
          </button>
        </div>
       
          </div>
          <div  className="grid grid-cols-7 gap-2 text-center text-gray-700">
            {days.map((day)=><span key={day}>{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2">
             {[...Array(firstDayOfMonth).keys()].map((_, index) => (
              <span key={`empty-${index}`}/>
             ))}
             {[...Array(daysInMonth).keys()].map((day)=>(
              <span 
              
              key={day+1} onClick={() => modalClick(day + 1)}  className={`relative bg-gray-200 hover:bg-blue-500 hover:text-white rounded p-2 text-sm cursor-pointer ${
                day + 1 === currentDate.getDate() &&
                currentMonth === currentDate.getMonth() &&
                currentYear === currentDate.getFullYear()
                  ? "bg-yellow-400"
                  : ""
              }`}>{day + 1} {hasEvent(day + 1) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}</span>)) }
          </div>
        </div>
        
        {showEventPopUp && (
        <EventModal
          eventTime={eventTime}
          setEventTime={setEventTime}
          eventText={eventText}
          setEventText={setEventText}
          handleEventSubmit={handleEventSubmit}
          closeModal={() => setShowEventPopUp(false)}
          events={events.filter((event) => isSameDay(event.date, selectedDate))}
          handleEditEvent={handleEditEvent}
          handleDeleteEvent={handleDeleteEvent}
          editingEvent={editingEvent}
          filterKeyword={filterKeyword}
          setFilterKeyword={setFilterKeyword}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          exportEventsAsJSON={exportEventsAsJSON}
        />
      )}
         
   </div>

  )
}

export default CalendarGrid;
 

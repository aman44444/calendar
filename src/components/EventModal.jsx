import React from "react";

const EventModal = ({
  eventTime,
  setEventTime,
  eventText,
  setEventText,
  handleEventSubmit,
  closeModal,
  events,
  handleEditEvent,
  handleDeleteEvent,
  editingEvent,
  filterKeyword,
  setFilterKeyword,
  selectedCategory,
  setSelectedCategory,
  exportEventsAsJSON,
}) => {
  const categories = ["Work", "Personal", "Others"]; // Categories for events
 
  // Function to return CSS class based on category
  const getCategoryClass = (category) => {
    switch (category) {
      case "Work":
        return "bg-black text-white";
      case "Personal":
        return "bg-green-500 text-white";
      case "Others":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-black";
    }
  };

  // Filter events based on the filter keyword
  const filteredEvents = events.filter((event) =>
    event.text.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
         {/* Close button */}
        <div className="bg-white rounded-lg pr-8 pb-8 w-full relative">
          <button
            onClick={closeModal}
            className="relative bg-black left-full  text-white hover:text-black w-7 rounded-lg"
          >
            &times;
          </button>
        </div>

         {/* Time input fields */}
        <div className="mb-4 flex">
          <label>Time:</label>
          <input
            type="number"
            value={eventTime.hours}
            onChange={(e) =>
              setEventTime({ ...eventTime, hours: e.target.value })
            }
            className="border ml-8 border-gray-300 rounded p-2 w-1/3 text-center"
            placeholder="HH"
            maxLength={24}
          />
          <input
            type="number"
            value={eventTime.minutes}
            onChange={(e) =>
              setEventTime({ ...eventTime, minutes: e.target.value })
            }
            className="border ml-8 border-gray-300 rounded p-2 w-1/3 text-center"
            placeholder="MM"
            maxLength={60}
          />
        </div>

            {/* Category dropdown */}
        <label
          htmlFor="eventCategory"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="eventCategory"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 mt-2 border rounded-lg mb-2"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <textarea
          value={eventText}
          onChange={(e) => setEventText(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full "
          placeholder="Event details"
        />

         {/* Submit button */}
        <button
          onClick={() => handleEventSubmit()}
          className="bg-black text-white rounded py-2 px-4 w-full"
        >
          {editingEvent ? "Update Event" : "Save Event"}
        </button>

       {/* Events list */}
        <h3 className="mt-4">Events on this day</h3>
        <div className="mb-4">
          <input
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="Filter events"
            className="border p-2 rounded"
          />
        </div>
        <div className="overflow-y-scroll max-h-40 space-y-2 scrollbar-hidden">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`flex justify-between p-4 mb-2 rounded-lg ${getCategoryClass(
              event.category
            )}`}
          >
            <div>
              <p>{event.time}</p>
              <p>{event.text}</p>
            </div>
            <div>
              <button onClick={() => handleEditEvent(event)}>Edit</button>
              <button onClick={() => handleDeleteEvent(event.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>

         {/* Export events button */}
        <button
          onClick={exportEventsAsJSON}
          className="bg-black text-white px-4 py-2 rounded-lg  mt-2"
        >
          Export Events as JSON
        </button>
      </div>
    </div>
  );
};

export default EventModal;

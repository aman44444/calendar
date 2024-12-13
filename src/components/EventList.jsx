

import React ,{useState}from  'react'


const EventList = (props) => {
    const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = props.events.filter(
    (event) =>
      event.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${props.months[event.date.getMonth()]} ${event.date.getDate()}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );
  return (
    // <div  className="mt-6 max-w-4xl mx-auto">

    //   { props.events.length > 0 ? (props.events.map((event, index) =>
    //     (
    //         <div key={index}     className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg mb-2 shadow-sm">
    //         <div>
    //             <div className="text-sm text-gray-600">{`${props.months[event.date.getMonth()]},${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
    //             <div className="font-medium">{event.text}</div>
    //             <div className="text-xs text-gray-500">{event.time}</div>
    //         </div>
           
    //         <div className="space-x-2">
               
    //             <button onClick={() => props.handleEditEvent(event)} className="text-blue-600 hover:underline">
    //                 edit
    //             </button>
    //             <button onClick={() => props.handleDeleteEvent(event.id)}  className="text-red-600 hover:underline">
    //                 delete
    //             </button>
               
    //         </div>
    //     </div>
    //     ))): (
    //         <p className="text-gray-500 text-center">No events scheduled</p>
    //       )
    //   }
    // </div>
    <div className="mt-6 max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 px-2 py-1 border rounded-lg"
      />
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg mb-2 shadow-sm"
          >
            <div>
              <div className="text-sm text-gray-600">{`${props.months[
                event.date.getMonth()
              ]} ${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
              <div className="font-medium">{event.text}</div>
              <div className="text-xs text-gray-500">{event.time}</div>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => props.handleEditEvent(event)}
                className="text-blue-600 hover:underline"
              >
                edit
              </button>
              <button
                onClick={() => props.handleDeleteEvent(event.id)}
                className="text-red-600 hover:underline"
              >
                delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No events found</p>
      )}
    </div>
  )
}

export default EventList
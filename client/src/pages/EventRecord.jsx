import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaPlus, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";
import generatePDF from "../components/InvoicePdf";
import generateDay from "../../handler/generateDayFromDate";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EventRecord = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
 const fetchData=async()=>{
  axios
  .get(BACKEND_URL + "/api/events/all")
  .then((response) => {
    console.log(response);

    if (Array.isArray(response.data)) {
      setEvents(response.data);
    } else {
      toast.error("Unexpected response format");
    }
  })
  .catch((error) => toast.error("Failed to fetch events"));
}
  useEffect(() => {
    // Fetch data from backend
    fetchData();
  }, []);
 const exportInvoice = (event) => {
    generatePDF(event);
 };
  const filteredEvents = events.filter(
    (event) =>
      event.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.includes(searchTerm)
  );

  const pastEvents = filteredEvents
    .filter((event) => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingEvents = filteredEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleSaveEvent = async(event) => {
    console.log(event);
    
    if (currentEvent) {
      // Update existing event

      axios.put(BACKEND_URL + `/api/events/update/${currentEvent._id}`, event)
        .then((res) => {
          console.log(res);
          
          // setEvents(
          //   events.map((e) => (e._id === currentEvent._id ? event : e))
          // );
           fetchData().then(()=>{
             setIsModalOpen(false);

           })
          setCurrentEvent(null);
          toast.success("Event updated successfully");
        })
        .catch((error) =>{
          console.log(error);
          
           toast.error("Failed to update event");
    })
    } else {
      // Add new event
      axios
        .post(BACKEND_URL + "/api/events/add", event)
        .then((response) => {
          // setEvents([...events, response.data]);
          fetchData().then(()=>{
            setIsModalOpen(false);

          })
          toast.success("Event added successfully");
        })
        .catch((error) =>{ toast.error("Failed to add event")
          console.log(error);
          
        });
    }

  };



  return (
    <motion.div
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5 }}
     className="p-6 bg-white shadow-lg max-w-full relative border rounded-md ">
      <Toaster />
      <motion.h1
        className="text-3xl pb-3 font-bold text-blue-600 mb-4 border-b text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Event Record
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <motion.input
          type="text"
          placeholder="Search by name or date"
          className=" p-2 border w-full  mx-3 border-gray-300 rounded outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.button
          className="bg-blue-600 text-white py-2.5 px-4 rounded flex items-center"
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FaPlus className="mr-2" /> Event
        </motion.button>
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 mb-6">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4  min-w-[150px]">Actions</th>
              <th className="py-2 px-4  min-w-[100px]">Event Id</th>
              <th className="py-2 px-4  min-w-[150px]">Date</th>
              <th className="py-2 px-4  min-w-[100px]">Day</th>
              <th className="py-2 px-4  min-w-[250px]">Event Place</th>
              <th className="py-2 px-4 min-w-[250px]">Company</th>
              <th className="py-2 px-4 min-w-[150px]">Phone no</th>
              <th className="py-2 px-4 min-w-[100px]">Ballons </th>
              <th className="py-2 px-4  min-w-[200px]">Employees</th>
              <th className="py-2 px-4  min-w-[200px]">Details</th>
              <th className="py-2 px-4  min-w-[100px]">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pastEvents) && pastEvents.length > 0 ? (
              pastEvents.map((event, index) => (
                <motion.tr
                  key={event._id}
                  className="hover:bg-blue-50 border-b"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <td className="py-2 px-4 realtive my-auto   text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => {
                        setCurrentEvent(event);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
     
                  </td>
                  <td className="py-2 px-4 text-center">{event.index}</td>
                  <td className="py-2 px-4 text-center">{event.date}</td>
                  <td className="py-2 px-4 text-center">{generateDay(event?.date)}</td>
                  <td className="py-2 px-4 text-center">{event.eventPlace}</td>
                  <td className="py-2 px-4 text-center">{event.company}</td>
                  <td className="py-2 px-4 text-center">{event.phone_no}</td>
                  <td className="py-2 px-4 text-center">{event.ballons}</td>
                  <td className="py-2 px-4 text-center">{event.employees}</td>
                  <td className="py-2 px-4 text-center">{event.details}</td>
                  {event.invoice ? (
                    <td className="py-2 px-4 text-center">
                 
                      
                 <button type="button" className="text-blue-300 underline" onClick={()=>exportInvoice(event)}> Generate </button>
                    </td>
                  ) : (
                    <td className="py-2 px-4 text-center">No Invoice</td>
                  )}

                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="py-10 text-red-400 px-4 border-b text-center"
                >
                  No past events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        <h2 className="text-xl font-bold text-blue-600 mb-4">
          Upcoming Events
        </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4  min-w-[150px]">Actions</th>
              <th className="py-2 px-4  min-w-[100px]">Event Id</th>
              <th className="py-2 px-4  min-w-[150px]">Date</th>
              <th className="py-2 px-4  min-w-[100px]">Day</th>
              <th className="py-2 px-4  min-w-[250px]">Event Place</th>
              <th className="py-2 px-4 min-w-[250px]">Company</th>
              <th className="py-2 px-4 min-w-[150px]">Phone no</th>
              <th className="py-2 px-4 min-w-[100px]">ballons</th>
              <th className="py-2 px-4  min-w-[200px]">Employees</th>
              <th className="py-2 px-4  min-w-[200px]">Details</th>
              <th className="py-2 px-4  min-w-[100px]">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <motion.tr
                  key={event._id}
                  className="hover:bg-blue-50 border-b"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <td className="py-2 px-4 realtive my-auto   text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => {
                        setCurrentEvent(event);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td className="py-2 px-4 text-center">{event.index}</td>
                  <td className="py-2 px-4 text-center">{event.date}</td>
                  <td className="py-2 px-4 text-center">{generateDay(event?.date)}</td>
                  <td className="py-2 px-4 text-center">{event.eventPlace}</td>
                  <td className="py-2 px-4 text-center">{event.company}</td>
                  <td className="py-2 px-4 text-center">{event.phone_no}</td>
                  <td className="py-2 px-4 text-center">{event.ballons}</td>
                  <td className="py-2 px-4 text-center">{event.employees}</td>
                  <td className="py-2 px-4 text-center">{event.details}</td>
                  {event.invoice ? (
                    <td className="py-2 px-4 text-center">
                    
                       <button type="button" className="text-blue-300 underline" onClick={()=>exportInvoice(event)}> Generate </button>
                      
                    </td>
                  ) : (
                    <td className="py-2 px-4 text-center">No Invoice</td>
                  )}
        
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="py-10 text-red-400 px-4 border-b text-center"
                >
                  No upcoming events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {isModalOpen && (
        <EventModal
          event={currentEvent}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentEvent(null);
          }}
          onSave={handleSaveEvent}
        />
      )}
    </motion.div>
  );
};

const EventModal = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: event ? event.date : "",
    // day: event ? event.day : "",
    eventPlace: event ? event.eventPlace : "",
    company: event ? event.company : "",
    employees: event ? event.employees : "",
    details: event ? event.details : "",
    phone_no: event ? event.phone_no : "",
    ballons: event ? event.ballons : '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const phonePattern = /^\d{4}-\d{7}$/;
    if (!phonePattern.test(formData.phone_no)) {
      setErrors({ phone_no: "Phone number must be in the format 0300-2345678" });
      return;
    }
    onSave(formData);
  };

  return (
    <motion.div
      className="fixed overflow-auto  inset-0 z-20  bg-gray-600 bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="md:mt-32 bg-white p-6 md:mb-4  rounded shadow-lg w-full md:w-1/2 max-h-full overflow-y-auto"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">
          {event ? "Update Event" : "Add Event"}
        </h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Event Place</label>
              <input
                type="text"
                name="eventPlace"
                value={formData.eventPlace}
                onChange={handleChange}
                placeholder="Enter event place"
                className={`w-full p-2 border ${
                  errors.eventPlace ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.eventPlace && (
                <p className="text-red-500 text-sm">{errors.eventPlace}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className={`w-full p-2 border ${
                  errors.company ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company}</p>
              )}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-gray-700">Ballons</label>
              <input
                type="number"
                name="ballons"
                value={formData.ballons}
                onChange={handleChange}
                placeholder="Enter number of ballons"
                className={`w-full p-2 border ${
                  errors.ballons ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
                min={1}
                required
              />
              {errors.ballons && (
                <p className="text-red-500 text-sm">{errors.ballons}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                placeholder="0300-2345678"
                className={`w-full p-2 border ${
                  errors.phone_no ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.phone_no && (
                <p className="text-red-500 text-sm">{errors.phone_no}</p>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Event Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Enter event date"
                className={`w-full p-2 border ${
                  errors.date ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Employees</label>
              <input
                type="text"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                placeholder="Enter names of employees"
                className={`w-full p-2 border ${
                  errors.employees ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.employees && (
                <p className="text-red-500 text-sm">{errors.employees}</p>
              )}
            </div>
          
          </div>
       
        
          {/* <div className="mb-4">
         <div>
              <label className="block text-gray-700">Day</label>
              <input
                type="text"
                name="day"
                value={formData.day}
                onChange={handleChange}
                placeholder="Enter event day"
                className={`w-full p-2 border ${
                  errors.day ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.day && (
                <p className="text-red-500 text-sm">{errors.day}</p>
              )}
            </div>
          </div> */}
        
          <div className="mb-4">
            <label className="block text-gray-700">Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Enter event details"
              className={`w-full p-2 border ${
                errors.details ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-blue-500`}
              required
            />
            {errors.details && (
              <p className="text-red-500 text-sm">{errors.details}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EventRecord;

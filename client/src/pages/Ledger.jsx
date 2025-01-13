import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Ledger = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null); // New state for selected entry
  const [paymentAmount, setPaymentAmount] = useState(''); // New state for payment amount
  const [description, setDescription] = useState(''); // New state for description
  const [date, setDate] = useState(''); // New state for date

  const fetchLedgerEntries = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "/api/ledgers/groupedByCompany");
      if (Array.isArray(response.data)) {
        setLedgerEntries(response.data);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      toast.error("Failed to fetch ledger entries");
    }
  };

  useEffect(() => {
    fetchLedgerEntries();
  }, []);

  const handleViewClick = (entry) => {
    console.log(entry);
    axios.get(BACKEND_URL + `/api/ledgers/company/${entry.company}`).then((response) => {
     console.log(response);
     
      if (response.data) {
        setSelectedEntry({data:response.data,entry:entry});
      } else {
        toast.error("Failed to fetch ledger entry");
      }
    });

    
    // setSelectedEntry(entry); // Set the selected entry
  };

  const handlePayment = async () => {
    if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (!description) {
      toast.error("Please enter a description");
      return;
    }

    if (!date) {
      toast.error("Please enter a date");
      return;
    }

    try {
      console.log(  selectedEntry.entry.company,paymentAmount);
      
      const response = await axios.post(BACKEND_URL + `/api/ledgers/pay`, {
        company: selectedEntry.entry.company,
        amount: paymentAmount,
        description: description,
        date: date,
      });

      if (response.data) {
        toast.success("Payment successful");
        fetchLedgerEntries(); // Refresh ledger entries
        setSelectedEntry(null); // Clear selected entry
        setPaymentAmount(''); // Clear payment amount
        setDescription(''); // Clear description
        setDate(''); // Clear date
      } else {
        toast.error("Payment failed");
      }
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  return (
    <motion.div
    initial={{ scale: 0.8 }}
    animate={{ scale: selectedEntry ? 1: .95 }}
    transition={{ duration: 0.5 }}
     className="p-6 bg-white shadow-lg min-h-[90%] max-w-full relative border rounded-md">
      <Toaster />
      <motion.h1
        className="text-3xl pb-3 font-bold text-blue-600 mb-4 border-b text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Ledger
      </motion.h1>
 
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 mb-6">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4 min-w-[150px]">Actions</th>
              <th className="py-2 px-4 min-w-[150px]">Company</th>
              <th className="py-2 px-4 min-w-[150px]">Total Amount</th>
              <th className="py-2 px-4 min-w-[150px]">Received Amount</th>
              <th className="py-2 px-4 min-w-[150px]">Remaining Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(ledgerEntries) && ledgerEntries.length > 0 ? (
              ledgerEntries.map((entry, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-blue-50 border-b"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <td className="py-2 px-4 text-center">
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded-md"
                      onClick={() => handleViewClick(entry)} // Handle view button click
                    >
                      View 
                    </button>
                    
                  </td>
                  <td className="py-2 px-4 text-center">{entry.company}</td>
                  <td className="py-2 px-4 text-right">{entry.totalAmount.toFixed(2)}/-</td>
                  <td className="py-2 px-4 text-right">{entry.receivedAmount.toFixed(2)}/-</td>
                  <td className="py-2 px-4 text-right">{entry.remainingAmount.toFixed(2)}/-</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5" // Corrected colspan to 5
                  className="py-10 text-red-400 px-4 border-b text-center"
                >
                  No ledger entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedEntry && ( // Display history if an entry is selected
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 ml-3">History of {selectedEntry.entry.company}</h2>
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 min-w-[150px]">Date</th>
              <th className="py-2 px-4  min-w-[250px]">Event Place</th>
              {/* <th className="py-2 px-4 min-w-[250px]">Company</th> */}
              <th className="py-2 px-4 min-w-[150px]">Ballons</th>
                <th className="py-2 px-4 min-w-[150px]">Type</th>
                <th className="py-2 px-4 min-w-[150px]">Amount</th>
                <th className="py-2 px-4 min-w-[250px]">Description</th>
              </tr>
            </thead>
            <tbody>
              {selectedEntry.data && selectedEntry.data.length>0&&selectedEntry.data.map((historyItem) => (
                <tr key={historyItem?._id} className="hover:bg-blue-50 border-b">
                  <td className="py-2 px-4 text-center">{historyItem?.date}</td>
                  <td className="py-2 px-4 text-center">{historyItem?.eventId?.eventPlace || "------"}</td>
                  {/* <td className="py-2 px-4 text-center">{historyItem?.companyName }</td> */}
                  <td className="py-2 px-4 text-center">{historyItem?.eventId?.ballons || "----" }</td>
                  <td className="py-2 px-4 text-center">{historyItem?.type}</td>
                  <td className="py-2 px-4 text-right">{historyItem?.amount.toFixed(2)}/-</td>
                  <td className="py-2 px-4 text-center">{historyItem?.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            <div className="mt-4 flex flex-col md:items-center">
            <h3 className="text-md  "><strong>Remaining Price :  </strong>     {selectedEntry.entry.remainingAmount.toFixed(2)}</h3>
            <div className="mt-4 flex flex-col md:flex-row gap-5 jus md:items-center ">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
                className="border p-2 rounded-md outline-blue-300 mb-2 sm:mb-0"
                min={1}
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="border p-2 rounded-md outline-blue-300 ml-0 sm:ml-2 mb-2 sm:mb-0"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded-md outline-blue-300 ml-0 sm:ml-2 mb-2 sm:mb-0"
              />
              <button
                onClick={handlePayment}
                className="bg-green-500 text-white py-2 px-4 rounded-md ml-0 sm:ml-2"
              >
                Pay
              </button>
            </div>
            </div>
        </div>
      )}
    </motion.div>
  );
};

export default Ledger;
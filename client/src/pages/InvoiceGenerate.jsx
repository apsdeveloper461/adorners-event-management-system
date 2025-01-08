import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaFileInvoice, FaTrash, FaFileExport, FaDownload, FaCloudDownloadAlt } from "react-icons/fa"; // Added FaFileExport icon
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";
import { useForm, useFieldArray } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
// import { DownloadIcon } from "lucide-react";

import * as XLSX from "xlsx"; // Ensure XLSX library is imported
import generatePDF from "../components/InvoicePdf";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const InvoiceGenerate = () => {
  const [events, setEvents] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const fetchData = async () => {
    axios
      .get(BACKEND_URL + "/api/events/all")
      .then((response) => setEvents(response.data));
    axios
      .get(BACKEND_URL + "/api/inventory/all")
      .then((response) => setInventory(response.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (data) => {
    axios
      .post(BACKEND_URL + "/api/invoice/add", {
        event: selectedEvent,
        itemsArray: data.invoiceItems,
      })
      .then((response) => {
        // Handle response
        fetchData().then(() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        });
        toast.success("Invoice generated successfully");
      })
      .catch((error) => {
        // Handle error
        console.log(error);
        
        toast.error("Failed to generate invoice"+error?.reponse?.data?.message);
      });
  };

  const handleEditSubmit = (data) => {
    // console.log(data,selectedEvent, "data");
    
    // return;
        axios
      .put(BACKEND_URL + `/api/invoice/update/${selectedEvent.invoice._id}`, {
        itemsArray: data.invoiceItems,event:selectedEvent
      })
      .then((response) => {
        // Handle response
        fetchData().then(() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        });
        toast.success("Invoice updated successfully");
      })
      .catch((error) => {
        // Handle error
        toast.error("Failed to update invoice");
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setInvoiceItems([]);
  };

  const handleViewInvoice = (data) => {
    setInvoiceItems(data);
    setIsViewModalOpen(true);
  };

  const handleExport = (event) => {
    // const workbook = XLSX.utils.book_new();
    // const worksheetData = [
    //   ["Company Name", event.company],
    //   ["Date", event.date],
    //   [],
    //   ["Item Name", "Quantity", "Price Per Item", "Total"],
    //   ...event.invoice.items.map(item => [
    //     item.itemsName,
    //     item.quantity,
    //     item.pricePerItem,
    //     item.quantity * item.pricePerItem
    //   ]),
    //   [],
    //   ["Total Price", "", "", event.invoice.items.reduce((total, item) => total + item.quantity * item.pricePerItem, 0)]
    // ];
    // const worksheetData = [
    //   [{},{ v: `Company Name : ${event.company}`, s: { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } } }],
    //   [],
    //   [{ v: "Date", s: { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } } }, { v: event.date, s: { font: { bold: true } } }],
    //   [],
    //   [{ v: "Item Name", s: { font: { bold: true }, fill: { fgColor: { rgb: "ADD8E6" } } } }, { v: "Quantity", s: { font: { bold: true }, fill: { fgColor: { rgb: "ADD8E6" } } } }, { v: "Price Per Item", s: { font: { bold: true }, fill: { fgColor: { rgb: "ADD8E6" } } } }, { v: "Total", s: { font: { bold: true }, fill: { fgColor: { rgb: "ADD8E6" } } } }],
    //   ...event.invoice.items.map(item => [
    //     { v: item.itemsName, s: { fill: { fgColor: { rgb: "FFFFFF" } } } },
    //     { v: item.quantity, s: { fill: { fgColor: { rgb: "FFFFFF" } } } },
    //     { v: item.pricePerItem, s: { fill: { fgColor: { rgb: "FFFFFF" } } } },
    //     { v: item.quantity * item.pricePerItem, s: { fill: { fgColor: { rgb: "FFFFFF" } } } }
    //   ]),
    //   [],
    //   [{ v: "Total Price", s: { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } } }, "", "", { v: event.invoice.items.reduce((total, item) => total + item.quantity * item.pricePerItem, 0), s: { font: { bold: true } } }]
    // ];
    
    // // Create a new workbook and add the worksheet
    // const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // // Merge the "Company Name" cell across two columns
    // worksheet['!merges'] = [
    //   { s: { r: 0, c: 1 }, e: { r: 1, c: 2 } } // Merge "Company Name" cell
    // ];
    
    // // Write the workbook to a file
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
    // XLSX.writeFile(workbook, "invoice.xlsx");
    console.log(event, "event.invoice.items");
    
  };

  return (
    <div className="p-6 bg-white shadow-lg max-w-full relative border rounded-md min-h-[80vh]">
      <Toaster />
      <motion.h1
        className="text-3xl pb-3 font-bold text-blue-600 mb-4 border-b text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Invoice Generate
      </motion.h1>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 mb-6">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4 min-w-[150px]">Actions</th>
              <th className="py-2 px-4 min-w-[150px]">Date</th>
              <th className="py-2 px-4 min-w-[100px]">Day</th>
              <th className="py-2 px-4 min-w-[250px]">Company</th>
              <th className="py-2 px-4 min-w-[250px]">Employees</th>
              <th className="py-2 px-4 min-w-[150px]">Bill</th>
            </tr>
          </thead>
          <tbody>
            {events.length>0 && events.map((event, index) => (
              <motion.tr
                key={event._id}
                className="hover:bg-blue-50 border-b"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <td className="py-2 px-4 text-center">
                  {event.invoice ? (
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => {
                          setSelectedEvent(event);
                          setInvoiceItems(event.invoice.items);
                          // console.log(event.invoice.items,"here");

                          setIsModalOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-600 mr-2"
                        onClick={() => handleViewInvoice(event)}
                      >
                        <FaFileInvoice />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-700"
                        onClick={() => generatePDF(event)}
                      >
                        <FaCloudDownloadAlt />
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => {
                        setSelectedEvent(event);
                        setInvoiceItems([]);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaPlus />
                    </button>
                  )}
                </td>
                <td className="py-2 px-4 text-center">{event.date}</td>
                <td className="py-2 px-4 text-center">{event.day}</td>
                <td className="py-2 px-4 text-center">{event.company}</td>
                <td className="py-2 px-4 text-center">{event.employees}</td>
                {event.invoice ? (
                  <td className="py-2 px-4 text-center">
                    {event.invoice.total}/-
                  </td>
                ) : (
                  <td className="py-2 px-4 text-center">0/-</td>
                )}
              </motion.tr>
            ))}
            {events.length<=0&& 
              <tr className="border-b">
                <td colSpan="6" className="py-14 px-4 text-red-500 text-center">
                  No events found
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <InvoiceModal
          event={selectedEvent}
          inventory={inventory}
          invoiceItems={invoiceItems}
          onSubmit={selectedEvent.invoice ? handleEditSubmit : handleSubmit}
          onClose={handleCancel}
        />
      )}
      {isViewModalOpen && (
        <ViewInvoiceModal
          items={invoiceItems}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
};

const InvoiceModal = ({
  event,
  inventory,
  invoiceItems,
  onSubmit,
  onClose,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      invoiceItems:
        invoiceItems.length > 0
          ? invoiceItems
          : [{ itemsName: "", quantity: 1, pricePerItem: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoiceItems",
  });

  const calculateTotalPrice = (items) => {
    return items.reduce(
      (total, item) => total + item.quantity * item.pricePerItem,
      0
    );
  };

  const watchInvoiceItems = watch("invoiceItems");

  return (
    <motion.div
      className="fixed inset-0 z-20 mt-[60px] md:mt-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-6 rounded shadow-lg w-full md:w-[85%] lg:w-2/3 max-h-full overflow-y-auto"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4 pb-3 border-b">
          {event.invoice ? "Edit Invoice" : "Add Invoice"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, index) => {
            const selectedItem = inventory.find(
              (invItem) => invItem.name === watchInvoiceItems[index]?.itemsName
            );
            // console.log( watchInvoiceItems[index].itemsName, selectedItem, "selectedItem");

            return (
              <div className="flex flex-col md:flex-row  gap-2 md:gap-5">       
                    <button
              type="button"
              className="mb-3 text-red-600 hover:text-red-800"
              onClick={() => remove(index)}
            >
              <FaTrash />
            </button>
              <div
                key={item.id}
                className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-4 border-b pb-5"
              >
                <div>
                  <label className="block text-gray-700">Item Name</label>
                  <select
                    {...register(`invoiceItems.${index}.itemsName`, {
                      required: "Item is required",
                    })}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    defaultValue={item.itemsName}
                  >
                    <option value="">Select Item</option>
                    {inventory.map((invItem) => (
                      <option key={invItem._id} value={invItem.name}>
                        {invItem.name}
                      </option>
                    ))}
                  </select>
                  {errors.invoiceItems?.[index]?.itemsName && (
                    <p className="text-red-500 text-sm">
                      {errors.invoiceItems[index].itemsName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Quantity</label>
                  <input
                    type="number"
                    {...register(`invoiceItems.${index}.quantity`, {
                      required: "Quantity is required",
                      min: { value: 1, message: "Quantity must be at least 1" },
                      max: {
                        value: selectedItem?.quantity || Infinity,
                        message: `Quantity cannot exceed ${selectedItem?.quantity}`,
                      },
                    })}
                    placeholder="Quantity"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  {errors.invoiceItems?.[index]?.quantity && (
                    <p className="text-red-500 text-sm">
                      {errors.invoiceItems[index].quantity.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    {...register(`invoiceItems.${index}.pricePerItem`, {
                      required: "Price is required",
                      min: { value: 1, message: "Price must be at least 1" },
                    })}
                    placeholder="Price"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  {errors.invoiceItems?.[index]?.pricePerItem && (
                    <p className="text-red-500 text-sm">
                      {errors.invoiceItems[index].pricePerItem.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Total</label>
                  <input
                    type="text"
                    value={
                      watchInvoiceItems[index]?.quantity *
                        watchInvoiceItems[index]?.pricePerItem || 0
                    }
                    readOnly
                    className="p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:border-blue-500"
                    placeholder="Total"
                  />
                </div>
               
              </div>
              </div>
 
            );
          })}
          <div className="mb-4 text-right">
            <strong>
              Total Price: {calculateTotalPrice(watchInvoiceItems)}
            </strong>
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            <button
              type="button"
              onClick={() =>
                append({ itemsName: "", quantity: 1, pricePerItem: 0 })
              }
              className="bg-green-600 text-white py-2 px-4 rounded mb-2 md:mb-0 w-full md:w-auto"
            >
              Add Item
            </button>
            <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded w-1/2 md:w-auto"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded w-1/2 md:w-auto"
              >
                Submit Invoice
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ViewInvoiceModal = ({ items, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-20 mt-[60px] md:mt-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-6 rounded shadow-lg w-full md:w-2/3 max-h-full "
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4 pb-3 border-b">
          Invoice Details
        </h2>
        <div className="mb-4">
          <strong>Company:</strong> {items.company}
        </div>
        <div className="mb-4">
          <strong>Date:</strong> {items.date}
        </div>
     <div className="overflow-x-auto">
     <table className="min-w-full bg-white border border-gray-200 mb-6">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4 min-w-[150px]">Item Name</th>
              <th className="py-2 px-4 min-w-[100px]">Quantity</th>
              <th className="py-2 px-4 min-w-[100px]">Price</th>
              <th className="py-2 px-4 min-w-[100px]">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.invoice.items.map((item, index) => (
              <tr key={index} className="hover:bg-blue-50 border-b">
                <td className="py-2 px-4 text-center">{item.itemsName}</td>
                <td className="py-2 px-4 text-center">{item.quantity}</td>
                <td className="py-2 px-4 text-center">{item.pricePerItem}</td>
                <td className="py-2 px-4 text-center">
                  {item.quantity * item.pricePerItem}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
     </div>
        <div className="mb-4 text-right pb- border-b pb-2">
          <strong>
            Total Price:{" "}
            {items?.invoice?.items.reduce(
              (total, item) => total + item.quantity * item.pricePerItem,
              0
            )}
          </strong>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceGenerate;

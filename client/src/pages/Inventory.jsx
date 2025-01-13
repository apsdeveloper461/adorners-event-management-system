import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaMinusCircle,
  FaPlusSquare,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import "tailwindcss/tailwind.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [quantityAction, setQuantityAction] = useState(null);

  const fetchData = async () => {
    axios
      .get(BACKEND_URL + "/api/inventory/all")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else {
          toast.error("Invalid data format received from API");
        }
      })
      .catch((error) => toast.error("Error fetching items: " + error.message));
  };
  useEffect(() => {
    // Fetch items from API
    fetchData();
  }, []);

  const handleAddQuantity = (index, quantity) => {
    const item = items[index];
    axios
      .put(BACKEND_URL + `/api/inventory/add-quantity/${item._id}`, {
        quantity,
      })
      .then(() => {
        const newItems = [...items];
        newItems[index].quantity += quantity;
        setItems(newItems);
        toast.success("Quantity added successfully");
      })
      .catch((error) => toast.error("Error adding quantity: " + error.message));
  };

  const handleRemoveQuantity = (index, quantity) => {
    const item = items[index];
    if (item.quantity >= quantity) {
      axios
        .put(BACKEND_URL + `/api/inventory/remove-quantity/${item._id}`, {
          quantity,
        })
        .then(() => {
          const newItems = [...items];
          newItems[index].quantity -= quantity;
          setItems(newItems);
          toast.success("Quantity removed successfully");
        })
        .catch((error) =>
          toast.error("Error removing quantity: " + error.message)
        );
    } else {
      toast.error("Quantity cannot be greater than currnet quantity");
    }
  };

  const filteredItems = items.filter((item) =>
    item.specification.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveItem = (data) => {
    if (currentItem) {
      // Update existing item
      axios
        .put(BACKEND_URL + `/api/inventory/update/${currentItem._id}`, data)
        .then((res) => {
          fetchData()
            .then(() => {
              setIsModalOpen(false);
            })
            .catch((error) => {
              console.log(error);

              toast.error("Error fetching items: " + error.message);
            });
          setCurrentItem(null);
          toast.success("Item updated successfully");
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "Error updating item ");
        });
    } else {
      // Add new item
      axios
        .post(BACKEND_URL + "/api/inventory/add", data)
        .then((response) => {
          fetchData()
            .then(() => {
              setIsModalOpen(false);
            })
            .catch((error) =>
              toast.error("Error fetching items: " + error.message)
            );
          setIsModalOpen(false);
          toast.success("Item added successfully");
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "Error adding item ");
          console.log(error);
        });
    }
  };

  return (
    <motion.div 
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5 }}
    className="p-6 bg-white shadow-lg max-w-full relative border rounded-md min-h-[80vh]">
      <Toaster />
      <motion.h1
        className="text-3xl pb-3 font-bold text-blue-600 mb-4 border-b text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Inventory
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <motion.input
          type="text"
          placeholder="Search by specification"
          className="p-2 border w-full md:w-[70%] mx-3 border-gray-300 rounded outline-none focus:border-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.button
          className="bg-blue-600 text-white py-2 px-4 rounded flex items-center"
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FaPlus className="mr-2" /> category
        </motion.button>
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 mb-6">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4 min-w-[150px]">Actions</th>
              <th className="py-2 px-4 min-w-[150px]">Category ID</th>
              <th className="py-2 px-4 min-w-[150px]">Name</th>
              <th className="py-2 px-4 min-w-[150px]">Specification</th>
              <th className="py-2 px-4 min-w-[150px]">Quantity</th>
              <th className="py-2 px-4 min-w-[150px]">Quantity Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems && filteredItems.length>0 &&filteredItems.map((item, index) => (
              <motion.tr
                key={item._id}
                className="hover:bg-blue-50 border-b"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <td className="py-2 px-4 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => {
                      setCurrentItem(item);
                      setIsModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                </td>

                <td className="py-2 px-4 text-center">{item.category_id}</td>
                <td className="py-2 px-4 text-center">{item.name}</td>
                <td className="py-2 px-4 text-center">{item.specification}</td>
                <td className="py-2 px-4 text-center">{item.quantity}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => {
                      setCurrentItem(item);
                      setQuantityAction("add");
                      setQuantityModalOpen(true);
                    }}
                  >
                    <FaPlusSquare />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setCurrentItem(item);
                      setQuantityAction("remove");
                      setQuantityModalOpen(true);
                    }}
                  >
                    <FaMinusCircle />
                  </button>
                </td>
              </motion.tr>
            ))}
            {filteredItems && filteredItems.length<=0 && 
            <tr>
              <td colSpan="6" className="text-center py-20 text-red-400">
                No items found
              </td>

            </tr>
            }
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <ItemModal
          item={currentItem}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}
      {quantityModalOpen && (
        <QuantityModal
          item={currentItem}
          action={quantityAction}
          onClose={() => {
            setQuantityModalOpen(false);
            setCurrentItem(null);
            setQuantityAction(null);
          }}
          onSave={(quantity) => {
            if (quantityAction === "add") {
              handleAddQuantity(
                items.findIndex((i) => i._id === currentItem._id),
                quantity
              );
            } else {
              handleRemoveQuantity(
                items.findIndex((i) => i._id === currentItem._id),
                quantity
              );
            }
            setQuantityModalOpen(false);
            setCurrentItem(null);
            setQuantityAction(null);
          }}
        />
      )}
    </motion.div>
  );
};

const ItemModal = ({ item, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_id: item ? item.category_id : "",
      name: item ? item.name : "",
      specification: item ? item.specification : "",
      quantity: item ? item.quantity : 0,
    },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <motion.div
      className="fixed inset-0 z-20 mt-16 md:mt-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 max-h-full overflow-y-auto"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">
          {item ? "Update Item" : "Add Item"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Category ID</label>
              <input
                type="text"
                {...register("category_id", {
                  required: "This field is required",
                })}
                placeholder="Enter category ID"
                className={`w-full p-2 border ${
                  errors.category_id ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
              />
              {errors.category_id && (
                <p className="text-red-500 text-sm">
                  {errors.category_id.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                {...register("name", { required: "This field is required" })}
                placeholder="Enter name"
                className={`w-full p-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Specification</label>
              <input
                type="text"
                {...register("specification", {
                  required: "This field is required",
                })}
                placeholder="Enter specification"
                className={`w-full p-2 border ${
                  errors.specification ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
              />
              {errors.specification && (
                <p className="text-red-500 text-sm">
                  {errors.specification.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                {...register("quantity", {
                  required: "This field is required",
                })}
                placeholder="Enter quantity"
                className={`w-full p-2 border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">
                  {errors.quantity.message}
                </p>
              )}
            </div>
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

const QuantityModal = ({ item, action, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 0,
    },
  });

  const onSubmit = (data) => {
    onSave(parseInt(data.quantity, 10));
  };

  return (
    <motion.div
      className="fixed inset-0 z-20 mt-16 md:mt-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 max-h-full overflow-y-auto"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold pb-3 border-b mb-4">
          {action === "add" ? "Add Quantity" : "Remove Quantity"}
        </h2>
        <div className="mb-4">
          <p className="text-gray-700">
            <strong>Item:</strong> {item.name}
          </p>
          <p className="text-gray-700">
            <strong>Current Quantity:</strong> {item.quantity}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              {...register("quantity", {
                required: "This field is required",
                min: 1,
              })}
              placeholder="Enter quantity"
              className={`w-full p-2 border ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm ml-3">
                Should me greater than 0
              </p>
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

export default Inventory;

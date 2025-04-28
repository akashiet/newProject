import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(""); // Message state for delete feedback

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products:", error);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );

    setFilteredProducts(filtered);
  };

  const handleDelete = async (id) => {
    // Confirmation prompt before delete
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) {
      return; // Stop if the user cancels the delete action
    }

    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      ));
      setDeleteMessage("Product successfully deleted!"); // Success message after delete
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteMessage("Error deleting product. Please try again."); // Error message after delete failure
    }

    // Clear the delete message after 3 seconds
    setTimeout(() => {
      setDeleteMessage("");
    }, 3000);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Feedback Message */}
      {deleteMessage && (
        <div
          className={`text-center py-2 text-sm font-semibold ${
            deleteMessage.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {deleteMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={product.id === selectedProduct?.id ? "bg-gray-600" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww"
                    alt="Product"
                    className="size-10 rounded-full"
                  />
                  {product.name}
                  {product.id === selectedProduct?.id && (
                    <span className="ml-2 text-yellow-400 text-xs">Editing...</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.sales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, name: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Category</label>
              <input
                type="text"
                value={selectedProduct.category}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, category: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Price</label>
              <input
                type="number"
                value={selectedProduct.price}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, price: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Stock</label>
              <input
                type="number"
                value={selectedProduct.stock}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, stock: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setShowEditModal(false)} // Close the modal without saving
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
                onClick={async () => {
                  try {
                    // Update the product via PUT request
                    const response = await axios.put(
                      `http://localhost:8080/api/products/${selectedProduct.id}`,
                      selectedProduct
                    );
                    setShowEditModal(false); // Close modal after save
                    // Update the local products state with the edited product
                    const updatedProducts = products.map((p) =>
                      p.id === selectedProduct.id ? response.data : p
                    );
                    setProducts(updatedProducts);
                    setFilteredProducts(updatedProducts);
                  } catch (error) {
                    console.error("Error updating product:", error);
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTable;

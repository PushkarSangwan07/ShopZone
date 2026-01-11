import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "../api";

const AdminProducts = () => {
  const { getAllProducts, createProduct, updateProduct, deleteProduct } = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: "",
  });
  const [variantEdits, setVariantEdits] = useState([]); // to handle variant updates

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.products || res);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [getAllProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image || "",
      category: product.category,
      stock: product.stock,
    });
    setVariantEdits(Array.isArray(product.variants) ? product.variants : []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await deleteProduct(id, token);
      if (res.success) {
        alert("Product deleted");
        fetchProducts();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const handleOutOfStockToggle = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const updatedStock = product.stock > 0 ? 0 : 10;
      const res = await updateProduct(product._id, { ...product, stock: updatedStock }, token);
      if (res.success) {
        alert(`Product ${updatedStock === 0 ? "marked out of stock" : "restocked"}`);
        fetchProducts();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update stock");
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        variants: variantEdits,
      };

      let res;
      const token = localStorage.getItem("token");
      if (editingProduct) {
        res = await updateProduct(editingProduct._id, payload, token);
      } else {
        res = await createProduct(payload);
      }

      if (res.success) {
        alert(editingProduct ? "Product updated" : "Product created");
        setEditingProduct(null);
        setFormData({
          name: "",
          price: "",
          description: "",
          image: "",
          category: "",
          stock: "",
        });
        fetchProducts();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  // 🔹 Variant Handlers
  const handleVariantChange = (vIndex, key, value) => {
    const updated = [...variantEdits];
    updated[vIndex][key] = value;
    setVariantEdits(updated);
  };

  const handleOptionChange = (vIndex, oIndex, key, value) => {
    const updated = [...variantEdits];
    updated[vIndex].options[oIndex][key] = value;
    setVariantEdits(updated);
  };

  const addVariant = () => {
    setVariantEdits([...variantEdits, { name: "", options: [] }]);
  };

  const removeVariant = (index) => {
    const updated = variantEdits.filter((_, i) => i !== index);
    setVariantEdits(updated);
  };

  const addOption = (vIndex) => {
    const updated = [...variantEdits];
    updated[vIndex].options.push({ value: "", price: 0, stock: 0 });
    setVariantEdits(updated);
  };

  const removeOption = (vIndex, oIndex) => {
    const updated = [...variantEdits];
    updated[vIndex].options.splice(oIndex, 1);
    setVariantEdits(updated);
  };

  // const getDisplayPrice = (product) => {
  //   const now = Date.now();

  //   // Active flash deal
  //   if (
  //     product.isFlashDeal &&
  //     product.flashDealPrice &&
  //     product.flashDealExpiry &&
  //     new Date(product.flashDealExpiry).getTime() > now
  //   ) {
  //     return product.flashDealPrice;
  //   }

  //   // Discount
  //   if (product.discount > 0) {
  //     return product.price - (product.price * product.discount) / 100;
  //   }
  //     if (product.price === 0)
  //   return "⚠️ Price  Missing check on product page ";

  //   // Normal price
  //   return product.price;
  // };
  const getDisplayPrice = (p) => {
    if (p.isFlashDeal && p.flashDealPrice) {
      return p.flashDealPrice;
    }

    if (p.price && p.price > 0) {
      return p.price;
    }

    return "N/A"; // fallback safety
  };



  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="mb-6 space-y-2">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleFormChange} className="border p-2 rounded w-full" required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleFormChange} className="border p-2 rounded w-full" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleFormChange} className="border p-2 rounded w-full" required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleFormChange} className="border p-2 rounded w-full" required />
        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleFormChange} className="border p-2 rounded w-full" required />
        <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleFormChange} className="border p-2 rounded w-full" />

        {/* 🔹 Variant Editor */}
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="text-xl font-bold mb-2">Edit Product Variants</h3>
          {variantEdits.map((variant, vIndex) => (
            <div key={vIndex} className="border p-3 mb-3 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  placeholder="Variant name (e.g. Size, Storage)"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(vIndex, "name", e.target.value)}
                  className="border p-2 rounded w-1/2"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(vIndex)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
              <div>
                {variant.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex gap-2 mb-2 items-center">
                    <input
                      type="text"
                      placeholder="Option value (e.g. 128GB)"
                      value={opt.value}
                      onChange={(e) => handleOptionChange(vIndex, oIndex, "value", e.target.value)}
                      className="border p-2 rounded w-1/3"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={opt.price}
                      onChange={(e) => handleOptionChange(vIndex, oIndex, "price", Number(e.target.value))}
                      className="border p-2 rounded w-1/3"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={opt.stock}
                      onChange={(e) => handleOptionChange(vIndex, oIndex, "stock", Number(e.target.value))}
                      className="border p-2 rounded w-1/3"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(vIndex, oIndex)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(vIndex)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2"
                >
                  + Add Option
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-3"
          >
            + Add Variant
          </button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full bg-white shadow-md rounded border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Stock</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className={`${p.stock === 0 ? "bg-red-50" : ""}`}>
                <td className="py-2 px-4 border">{p.name}</td>
                <td className="py-2 px-4 border">
                  ₹{getDisplayPrice(p)}
                </td>

                <td className="py-2 px-4 border">{p.category}</td>
                <td className="py-2 px-4 border">{p.stock}</td>
                <td className="py-2 px-4 border">{p.description}</td>
                <td className="py-2 px-4 border">
                  {Array.isArray(p.image) && p.image.length > 0 ? (
                    <img src={p.image[0]} alt={p.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                      No Image
                    </div>
                  )}
                </td>
                <td className="py-2 px-4 border space-y-1">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 w-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleOutOfStockToggle(p)}
                    className={`w-full px-3 py-1 rounded text-white ${p.stock === 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-700 hover:bg-gray-800"
                      }`}
                  >
                    {p.stock === 0 ? "Restock" : "Mark Out of Stock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
};

export default AdminProducts;

import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useApi } from "../api";

const AdminCreateProduct = () => {
  const { user } = useContext(AuthContext);
  const { createProduct } = useApi();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    mainCategory: "",   
    subcategory: "",    
  });

  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);

  // ---------------------------
  // FORM HANDLERS
  // ---------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------
  // VARIANT HANDLERS
  // ---------------------------
  const addVariant = () => setVariants([...variants, { name: "", options: [] }]);
  const handleVariantNameChange = (index, value) => {
    const updated = [...variants];
    updated[index].name = value;
    setVariants(updated);
  };
  const addOption = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].options.push({ value: "", price: 0 });
    setVariants(updated);
  };
  const handleOptionChange = (variantIndex, optionIndex, field, value) => {
    const updated = [...variants];
    updated[variantIndex].options[optionIndex][field] =
      field === "price" ? Number(value) : value;
    setVariants(updated);
  };
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
  const removeOption = (variantIndex, optionIndex) => {
    const updated = [...variants];
    updated[variantIndex].options.splice(optionIndex, 1);
    setVariants(updated);
  };

  // ---------------------------
  // IMAGE HANDLERS
  // ---------------------------
  const handleAddImage = () => {
    const url = prompt("Enter Image URL:");
    if (url) setImages([...images, url]);
  };
  const handleRemoveImage = (index) => setImages(images.filter((_, i) => i !== index));

  // ---------------------------
  // SUBMIT HANDLER
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "admin") return alert("Unauthorized: Admins only");

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      variants,
      image: images,
    };

    // console.log("📦 Product Payload Being Sent:", productData);

    try {
      const res = await createProduct(productData, user.jwttok);
      if (res.success) {
        alert("✅ Product created successfully!");
        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          mainCategory: "",
          subcategory: "",
        });
        setVariants([]);
        setImages([]);
      } else {
        alert(res.message || "Failed to create product");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Error creating product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded shadow mt-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* BASIC FIELDS */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g. Shoes, Phones)"
          className="w-full p-2 border rounded"
          required
        />

        {/* MAIN CATEGORY */}
        <select
          name="mainCategory"
          value={form.mainCategory}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Main Category</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Children">Children</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
          <option value="Home & Living">Home & Living</option>

          <option value="Appliances">Appliances</option>
          <option value="Sports & Fitness">Sports & Fitness</option>
          <option value="Books & Media">Books & Media</option>
          <option value="Today’s Deals">Today’s Deals</option>


        </select>

        {/* SUBCATEGORY */}
        <input
          type="text"
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          placeholder="Subcategory (e.g. T-Shirts, Phones)"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full p-2 border rounded"
          required
        />

        {/* VARIANTS */}
        <div className="border-t pt-3 mt-3">
          <h3 className="font-semibold mb-2">Variants</h3>
          {variants.map((variant, vIndex) => (
            <div key={vIndex} className="border p-3 mb-3 rounded bg-gray-50 relative">
              <button
                type="button"
                className="absolute top-1 right-1 text-red-500 text-sm"
                onClick={() => removeVariant(vIndex)}
              >
                ✕
              </button>
              <input
                type="text"
                placeholder="Variant Name (e.g. Size, Color)"
                value={variant.name}
                onChange={(e) => handleVariantNameChange(vIndex, e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              {variant.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Option Value (e.g. Small, Red)"
                    value={opt.value}
                    onChange={(e) =>
                      handleOptionChange(vIndex, oIndex, "value", e.target.value)
                    }
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Extra Price"
                    value={opt.price}
                    onChange={(e) =>
                      handleOptionChange(vIndex, oIndex, "price", e.target.value)
                    }
                    className="w-24 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(vIndex, oIndex)}
                    className="px-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(vIndex)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                + Add Option
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + Add Variant
          </button>
        </div>

        {/* IMAGES */}
        <div className="border-t pt-3 mt-3">
          <h3 className="font-semibold mb-2">Product Images</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            + Add Image
          </button>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AdminCreateProduct;


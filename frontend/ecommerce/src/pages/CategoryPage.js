import React, { useEffect, useState } from "react";
import { useApi } from "../api";
import ProductCard from "../components/ProductCard";
import { useParams,useLocation } from "react-router-dom";


const CategoryPage = () => {
  const { category } = useParams(); 

const location = useLocation(); 
const searchParams = new URLSearchParams(location.search);
const type = searchParams.get("type") || "mainCategory";


    const { getProducts } = useApi(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ [type] : category }); // API call with category filter
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {category.charAt(0).toUpperCase() + category.slice(1)} Products ({products.length})
      </h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default CategoryPage;

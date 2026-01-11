import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";

const SearchResults = () => {
  const location = useLocation();
  const {
    search, setSearch, category, minPrice, maxPrice, brand, inStock, sort,
  } = useContext(SearchContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
   // 🆕 Extract "query" param from URL and update context
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query && query !== search) {
      setSearch(query);
    }
  }, [location.search]);

  // ✅ Get query param from URL and sync with context
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get("query") || "";
    if (queryFromUrl && queryFromUrl !== search) {
      setSearch(queryFromUrl);
    }
  }, [location.search, setSearch, search]);

  // ✅ Build API query string
  const buildQuery = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (brand) params.append("brand", brand);
    if (inStock) params.append("inStock", true);
    if (sort) params.append("sort", sort);
    return params.toString();
  };

  // ✅ Fetch products every time search or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = buildQuery();
        const res = await fetch(`http://localhost:4000/products?${query}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // only fetch if search has text
    if (search?.trim()) fetchProducts();
  }, [search, category, minPrice, maxPrice, brand, inStock, sort]);

  return (
    <section className="max-w-7xl mx-auto p-6 flex gap-6">
      {/* Sidebar filters */}
      <FilterPanel />

      {/* Product grid */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">
          Search Results ({products.length})
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
    </section>
  );
};

export default SearchResults;
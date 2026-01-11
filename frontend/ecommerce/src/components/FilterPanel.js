import React, { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

const FilterPanel = () => {
  const {
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    brand, setBrand,
    inStock, setInStock,
    sort, setSort
  } = useContext(SearchContext);

  return (
    <aside className="w-full md:w-1/4 bg-gray-50 p-4 rounded-md shadow">
      <h3 className="font-bold mb-4">Filters</h3>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block font-semibold">Price</label>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-2 py-1 w-1/2"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-2 py-1 w-1/2"
          />
        </div>
      </div>

      {/* Brand */}
      <div className="mb-4">
        <label className="block font-semibold">Brand</label>
        <input
          type="text"
          placeholder="e.g. Nike"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      {/* In Stock */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In Stock Only
        </label>
      </div>

      {/* Sort */}
      <div>
        <label className="block font-semibold">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-2 py-1 w-full mt-2"
        >
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
};

export default FilterPanel;

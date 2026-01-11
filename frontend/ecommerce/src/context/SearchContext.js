import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [brand, setBrand] = useState("");  // This is where setBrand comes from
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("");

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        category,
        setCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        brand,
        setBrand,  // Make sure setBrand is provided
        inStock,
        setInStock,
        sort,
        setSort,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

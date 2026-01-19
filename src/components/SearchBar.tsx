import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch(""); // Clears the map markers too
  };

  return (
    <div className="search-bar-wrapper">
      <input
        type="text"
        placeholder="Search country..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button className="clear-x" onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
}
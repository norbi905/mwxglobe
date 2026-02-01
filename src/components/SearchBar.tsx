import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
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
import React, { useState } from "react";

type FileItem = {
  _id: string;
  name: string;
  type: "file" | "folder";
  folderId?: string;
  folderName:string;
  downloadToken:{ type: string, unique: true, index: true };
  createdAt?: string;
};

type SearchFilterProps = {
  onResults: (results: FileItem[]) => void;
  onClear?: () => void;
};

function SearchFilter({ onResults, onClear }: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      onClear?.();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/files/search?name=${encodeURIComponent(trimmedQuery)}`
      );

      if (!response.ok) {
        const errMsg = await response.text();
        setError(errMsg || "Search request failed");
        return;
      }

      const result: FileItem[] = await response.json();
      onResults(result);
    } catch (err) {
      setError("Unexpected error occurred");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search files or folders"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-64 px-3 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}

export default SearchFilter;

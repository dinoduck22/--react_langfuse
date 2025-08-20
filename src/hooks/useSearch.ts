// src/hooks/useSearch.ts
import { useState, useMemo } from 'react';

// The hook now uses a generic T that extends an object with a 'name' property.
type Searchable = {
  name: string | null; // Allow name to be string or null to match the Trace type
};

export function useSearch<T extends Searchable>(initialData: T[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return initialData;
    }
    // The filter function now correctly returns the full object of type T.
    return initialData.filter(item =>
      item.name ? item.name.toLowerCase().includes(query) : false
    );
  }, [initialData, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData, // This will now be of type T[]
  };
}
import { useState, useMemo } from 'react';

// 제네릭 타입 T는 'name' 속성을 가진 객체여야 함을 명시
type Searchable = {
  name: string;
  [key: string]: any;
};

export function useSearch<T extends Searchable>(initialData: T[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return initialData;
    }
    return initialData.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }, [initialData, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
  };
}
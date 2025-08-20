import { useState, useMemo } from 'react';

// ✅ T는 'name' 속성을 가진 객체이기만 하면 되도록 제약 조건을 수정합니다.
type Searchable = {
  name: string;
};

export function useSearch<T extends Searchable>(initialData: T[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return initialData;
    }
    // 'T extends Searchable' 제약 조건 덕분에 item.name을 안전하게 사용할 수 있습니다.
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
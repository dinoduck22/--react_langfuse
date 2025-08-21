// src/hooks/useSearch.ts
import { useState, useMemo } from 'react';

// 검색 대상이 될 객체의 최소 요구조건 정의
type Searchable = {
  id?: string;
  name: string | null;
  tags?: string[];
  // [key: string]: unknown; <-- 이 라인을 삭제합니다.
};

// Full Text 검색을 위한 재귀 함수
const deepSearch = (value: unknown, query: string): boolean => {
  if (typeof value === 'string' && value.toLowerCase().includes(query)) {
    return true;
  }
  if (typeof value === 'number' && value.toString().toLowerCase().includes(query)) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some(item => deepSearch(item, query));
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.values(value).some(item => deepSearch(item, query));
  }
  return false;
};


export function useSearch<T extends Searchable>(
  initialData: T[],
  searchType: string
) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return initialData;
    }

    return initialData.filter(item => {
      if (searchType === 'IDs / Names') {
        const idMatch = item.id ? item.id.toLowerCase().includes(query) : false;
        const nameMatch = item.name ? item.name.toLowerCase().includes(query) : false;
        return idMatch || nameMatch;
      }

      if (searchType === 'Names, Tags') {
        const nameMatch = item.name ? item.name.toLowerCase().includes(query) : false;
        const tagMatch = Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(query));
        return nameMatch || tagMatch;
      }

      if (searchType === 'Full Text') {
        return Object.values(item).some(value => deepSearch(value, query));
      }

      return false;
    });
  }, [initialData, searchQuery, searchType]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
  };
}
import React from 'react';
import { Search } from 'lucide-react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  placeholder: string;
  value: string; // value prop 추가
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // onChange prop 추가
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, value, onChange }) => {
  return (
    <div className={styles.searchBox}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
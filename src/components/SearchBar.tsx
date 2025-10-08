import React from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => (
  <div className="search">
    <input
      placeholder="Search by first, last or phone"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default SearchBar;
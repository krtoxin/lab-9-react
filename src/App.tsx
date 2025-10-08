import { useEffect, useMemo, useState } from 'react';
import './App.css';
import type { Book, BookDraft } from './types';
import { loadBooks, saveBooks, generateId } from './storage';
import AddBookForm from './components/AddBookForm';
import SearchBar from './components/SearchBar';
import BooksTable from './components/BooksTable';

function App() {
  const [items, setItems] = useState<Book[]>(() => loadBooks());
  const [query, setQuery] = useState('');

  useEffect(() => {
    saveBooks(items);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(b =>
      [b.firstName, b.lastName, b.phone].some(v => v.toLowerCase().includes(q))
    );
  }, [items, query]);

  function addBook(draft: BookDraft) {
    const newItem: Book = { id: generateId(), ...draft };
    setItems(prev => [newItem, ...prev]);
  }

  function updateBook(id: string, draft: BookDraft) {
    setItems(prev => prev.map(b => (b.id === id ? { ...b, ...draft } : b)));
  }

  return (
    <div className="container">
      <h1>Address Book</h1>
      <AddBookForm onAdd={addBook} />
      <SearchBar value={query} onChange={setQuery} />
      <BooksTable books={filtered} onUpdate={updateBook} />
    </div>
  );
}

export default App;
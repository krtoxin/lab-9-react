import React, { useState } from 'react';
import { validateBook } from '../types';
import type { Book, BookDraft, ValidationErrors } from '../types';

interface Props {
  books: Book[];
  onUpdate: (id: string, draft: BookDraft) => void;
}

const BooksTable: React.FC<Props> = ({ books, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BookDraft>({ firstName: '', lastName: '', phone: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});

  function startEdit(b: Book) {
    setEditingId(b.id);
    setDraft({ firstName: b.firstName, lastName: b.lastName, phone: b.phone });
    setErrors({});
  }

  function cancel() {
    setEditingId(null);
    setDraft({ firstName: '', lastName: '', phone: '' });
    setErrors({});
  }

  function save() {
    const trimmed: BookDraft = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      phone: draft.phone.trim(),
    };
    const v = validateBook(trimmed);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    if (editingId) {
      onUpdate(editingId, trimmed);
    }
    cancel();
  }

  return (
    <table className="grid">
      <thead>
        <tr>
          <th>id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {books.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center' }}>No data to display.</td>
          </tr>
        ) : (
          books.map(b => {
            const isEditing = b.id === editingId;
            return (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  {isEditing ? (
                    <>
                      <input
                        value={draft.firstName}
                        onChange={e => {
                          setDraft(d => ({ ...d, firstName: e.target.value }));
                          setErrors(er => ({ ...er, firstName: undefined }));
                        }}
                      />
                      {errors.firstName && <div className="error">{errors.firstName}</div>}
                    </>
                  ) : (
                    b.firstName
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <input
                        value={draft.lastName}
                        onChange={e => {
                          setDraft(d => ({ ...d, lastName: e.target.value }));
                          setErrors(er => ({ ...er, lastName: undefined }));
                        }}
                      />
                      {errors.lastName && <div className="error">{errors.lastName}</div>}
                    </>
                  ) : (
                    b.lastName
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <input
                        value={draft.phone}
                        onChange={e => {
                          setDraft(d => ({ ...d, phone: e.target.value }));
                          setErrors(er => ({ ...er, phone: undefined }));
                        }}
                      />
                      {errors.phone && <div className="error">{errors.phone}</div>}
                    </>
                  ) : (
                    b.phone
                  )}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {isEditing ? (
                    <>
                      <button onClick={save}>Save</button>
                      <button type="button" onClick={cancel}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(b)}>Edit</button>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default BooksTable;
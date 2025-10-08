import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Book } from './types'
import { loadBooks, saveBooks, generateId } from './storage'

function App() {
  const [items, setItems] = useState<Book[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    setItems(loadBooks())
  }, [])

  useEffect(() => {
    saveBooks(items)
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((b) =>
      [b.firstName, b.lastName, b.phone].some((v) => v.toLowerCase().includes(q))
    )
  }, [items, query])

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const firstName = String(data.get('firstName') || '').trim()
    const lastName = String(data.get('lastName') || '').trim()
    const phone = String(data.get('phone') || '').trim()

    const errors: Record<string, string> = {}
    if (!firstName) errors.firstName = 'The first name is required'
    if (!lastName) errors.lastName = 'The last name is required'
    if (!phone) errors.phone = 'The phone is required'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    const newItem: Book = { id: generateId(), firstName, lastName, phone }
    setItems((prev) => [newItem, ...prev])
    form.reset()
  }

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<Book>>({})

  function startEdit(b: Book) {
    setEditingId(b.id)
    setEditDraft({ ...b })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditDraft({})
  }

  function saveEdit() {
    const firstName = String(editDraft.firstName || '').trim()
    const lastName = String(editDraft.lastName || '').trim()
    const phone = String(editDraft.phone || '').trim()
    if (!firstName || !lastName || !phone) return
    setItems((prev) =>
      prev.map((b) => (b.id === editingId ? { ...b, firstName, lastName, phone } : b))
    )
    cancelEdit()
  }

  return (
    <div className="container">
      <h1>Address Book</h1>

      <form onSubmit={handleAdd} className="add-form">
        <div className="field">
          <label>First Name</label>
          <input name="firstName" />
          {formErrors.firstName && <div className="error">{formErrors.firstName}</div>}
        </div>
        <div className="field">
          <label>Last Name</label>
          <input name="lastName" />
          {formErrors.lastName && <div className="error">{formErrors.lastName}</div>}
        </div>
        <div className="field">
          <label>Phone</label>
          <input name="phone" />
          {formErrors.phone && <div className="error">{formErrors.phone}</div>}
        </div>
        <button type="submit">Add</button>
      </form>

      <div className="search">
        <input
          placeholder="Search by first, last or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>No data to display.</td>
            </tr>
          ) : (
            filtered.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  {editingId === b.id ? (
                    <input
                      value={String(editDraft.firstName || '')}
                      onChange={(e) => setEditDraft((d) => ({ ...d, firstName: e.target.value }))}
                    />
                  ) : (
                    b.firstName
                  )}
                </td>
                <td>
                  {editingId === b.id ? (
                    <input
                      value={String(editDraft.lastName || '')}
                      onChange={(e) => setEditDraft((d) => ({ ...d, lastName: e.target.value }))}
                    />
                  ) : (
                    b.lastName
                  )}
                </td>
                <td>
                  {editingId === b.id ? (
                    <input
                      value={String(editDraft.phone || '')}
                      onChange={(e) => setEditDraft((d) => ({ ...d, phone: e.target.value }))}
                    />
                  ) : (
                    b.phone
                  )}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {editingId === b.id ? (
                    <>
                      <button onClick={saveEdit} disabled={!editDraft.firstName || !editDraft.lastName || !editDraft.phone}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(b)}>Edit</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App

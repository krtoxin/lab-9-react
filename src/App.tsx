import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Book } from './types'
import { loadBooks, saveBooks, generateId } from './storage'

function App() {
  const [items, setItems] = useState<Book[]>(() => loadBooks())
  const [query, setQuery] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<Book>>({})

  useEffect(() => {
    saveBooks(items)
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(b =>
      [b.firstName, b.lastName, b.phone].some(v => v.toLowerCase().includes(q))
    )
  }, [items, query])

  function validate(firstName: string, lastName: string, phone: string) {
    const errors: Record<string, string> = {}
    if (!firstName) errors.firstName = 'The first name is required'
    if (!lastName) errors.lastName = 'The last name is required'
    if (!phone) errors.phone = 'The phone is required'
    return errors
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const firstName = String(data.get('firstName') || '').trim()
    const lastName = String(data.get('lastName') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const errors = validate(firstName, lastName, phone)
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    const newItem: Book = { id: generateId(), firstName, lastName, phone }
    setItems(prev => [newItem, ...prev])
    form.reset()
    form.querySelector<HTMLInputElement>('input[name="firstName"]')?.focus()
  }

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
    const errors = validate(firstName, lastName, phone)
    if (Object.keys(errors).length) return
    setItems(prev =>
      prev.map(b => (b.id === editingId ? { ...b, firstName, lastName, phone } : b))
    )
    cancelEdit()
  }

  return (
    <div className="viewport">
      <div className="main">
        <header className="page-header">
          <h1>Address Book</h1>
          <p className="subtitle">Manage and search your contacts quickly.</p>
        </header>

        <section className="card">
          <form onSubmit={handleAdd} className="add-form" noValidate>
            <div className="field">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" className="input" />
              {formErrors.firstName && <div className="error">{formErrors.firstName}</div>}
            </div>
            <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" className="input" />
              {formErrors.lastName && <div className="error">{formErrors.lastName}</div>}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="input" />
              {formErrors.phone && <div className="error">{formErrors.phone}</div>}
            </div>
            <div className="actions">
              <button type="submit">Add</button>
            </div>
          </form>

          <div className="search-bar">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              className="input"
              placeholder="Type to filter..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </section>

        <section className="card table-card">
          <div className="table-toolbar">
            <h2>
              Contacts <span className="badge">{filtered.length}</span>
            </h2>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <strong>No data to display.</strong>
              <span>Add a contact above to get started.</span>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const editing = editingId === b.id
                  return (
                    <tr key={b.id} data-editing={editing || undefined}>
                      <td data-label="First Name">
                        {editing ? (
                          <input
                            className="inline-input"
                            value={editDraft.firstName || ''}
                            onChange={(e) =>
                              setEditDraft(d => ({ ...d, firstName: e.target.value }))
                            }
                          />
                        ) : b.firstName}
                      </td>
                      <td data-label="Last Name">
                        {editing ? (
                          <input
                            className="inline-input"
                            value={editDraft.lastName || ''}
                            onChange={(e) =>
                              setEditDraft(d => ({ ...d, lastName: e.target.value }))
                            }
                          />
                        ) : b.lastName}
                      </td>
                      <td data-label="Phone" style={{ fontFamily: 'var(--font-mono)' }}>
                        {editing ? (
                          <input
                            className="inline-input"
                            value={editDraft.phone || ''}
                            onChange={(e) =>
                              setEditDraft(d => ({ ...d, phone: e.target.value }))
                            }
                          />
                        ) : b.phone}
                      </td>
                      <td data-label="Actions">
                        <div className="row-actions">
                          {editing ? (
                            <>
                              <button
                                onClick={saveEdit}
                                disabled={
                                  !editDraft.firstName ||
                                  !editDraft.lastName ||
                                  !editDraft.phone
                                }
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="secondary"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEdit(b)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
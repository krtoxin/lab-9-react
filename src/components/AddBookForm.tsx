import React, { useState } from 'react'
import { validateBook } from '../types'
import type { BookDraft, ValidationErrors } from '../types'

interface Props {
  onAdd: (draft: BookDraft) => void
}

const initial: BookDraft = { firstName: '', lastName: '', phone: '' }

const AddBookForm: React.FC<Props> = ({ onAdd }) => {
  const [form, setForm] = useState<BookDraft>(initial)
  const [errors, setErrors] = useState<ValidationErrors>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((err) => ({ ...err, [name]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed: BookDraft = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
    }
    const v = validateBook(trimmed)
    if (Object.keys(v).length) {
      setErrors(v)
      return
    }
    onAdd(trimmed)
    setForm(initial)
  }

  return (
    <form onSubmit={handleSubmit} className="add-form" noValidate>
      <div className="field">
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
        {errors.firstName && <div className="error">{errors.firstName}</div>}
      </div>
      <div className="field">
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
        {errors.lastName && <div className="error">{errors.lastName}</div>}
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
        {errors.phone && <div className="error">{errors.phone}</div>}
      </div>
      <button type="submit">Add</button>
    </form>
  )
}

export default AddBookForm

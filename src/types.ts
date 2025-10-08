export type Book = {
  id: string
  firstName: string
  lastName: string
  phone: string
}

export type BookDraft = Omit<Book, 'id'>

export type ValidationErrors = Partial<Record<keyof BookDraft, string>>

export function validateBook(draft: BookDraft): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!draft.firstName.trim()) errors.firstName = 'The first name is required'
  if (!draft.lastName.trim()) errors.lastName = 'The last name is required'
  if (!draft.phone.trim()) errors.phone = 'The phone is required'
  return errors
}

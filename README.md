# Address Book

Requirements implemented:

- firstName, lastName, phone are required on add with messages like "The first name is required"
- table shows id, First Name, Last Name, Phone
- search by first/last/phone
- inline row editing with non-empty validation
- empty state: "No data to display."

Data persistence: localStorage.

Schema:

```mermaid
flowchart TB
  A[App]\nstate: none --> B[AddressTable]\nuses useAddressBook
  B --> C[useAddressBook\nitems(filtered), query, editingId, editDraft\nadd/remove/startEdit/saveEdit/cancelEdit/setQuery]
  B --> D[AddForm\nprops: onAdd]
  B --> E[Controls\nprops: query, setQuery]
  B --> F[RowItem\nprops: book, isEditing, onStartEdit, onSave, onCancel]
  B --> G[types.Book\nid, firstName, lastName, phone]
  B --> H[storage\nloadBooks, saveBooks, generateId]
  D -. onAdd(book) .-> B
  E -. setQuery .-> B
  F -. onStartEdit/onSave/onCancel .-> B
```

Source file:
```
docs/address-book.drawio
```

Patterns used for table rendering:

- Container-presentational split inside `App` for state and rendering
- Controlled inputs for form, search, and edit fields
- Derived state via memoization for filtered list

Scripts:

- dev: `npm run dev`
- build: `npm run build`
- preview: `npm run preview`
- vercel: uses `vercel.json` and `npm run vercel-build`

# Address Book

Requirements implemented:

- firstName, lastName, phone are required on add with messages like "The first name is required"
- table shows id, First Name, Last Name, Phone
- search by first/last/phone
- inline row editing with non-empty validation
- empty state: "No data to display."

Data persistence: localStorage.

Schema:

![Address Book Diagram](docs/address-book.svg)

Patterns used for table rendering:

- Container-presentational split inside `App` for state and rendering
- Controlled inputs for form, search, and edit fields
- Derived state via memoization for filtered list
- Conditional rendering for empty state ("No data to display.")
- Inline editing with validation before saving

Scripts:

- dev: `npm run dev`
- build: `npm run build`
- preview: `npm run preview`

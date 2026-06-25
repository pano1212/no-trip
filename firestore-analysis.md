# Firestore rules analysis

This project is a React/TypeScript/Vite app using Firebase Auth and Cloud Firestore.

Firestore database inspected with Firebase CLI:
- Project: `notripdb`
- Database: `(default)`
- Edition: `STANDARD`
- Type: `FIRESTORE_NATIVE`

Collections and paths:
- `newtrip/{tripId}`
- `payments/{paymentId}`

Queries:
- `newtrip`: `where("userId", "==", auth.currentUser.uid)`
- `payments`: `where("userId", "==", auth.currentUser.uid)`

Writes:
- Create `newtrip` with `type`, `name`, `budget`, `startDate`, `endDate`, optional `imageUrl`, optional `currency`, `userId`, `createdAt`.
- Create `payments` with `groupId`, `title`, `amount`, `category`, `currency`, `paidBy`, `note`, `userId`, `createdAt`.
- Delete `payments/{paymentId}`.

Access model:
- Firebase Auth email/password.
- Documents are owned by `userId`.
- Users should only read, create, and delete their own documents.
- The app does not currently update funds or payments.

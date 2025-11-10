Task Manager Kanban

A simple, full-stack Kanban board where you can create, move and manage tasks, attach files and assign users.
Built with React + Vite on the front-end and NestJS + MongoDB on the back-end.

What it does

-You can create tasks with title, description, priority and due date.

-Tasks belong to one of three columns: Todo, In Progress, Done.
-You can drag & drop tasks between columns and reorder them in each column.
-You can attach a file (like a PDF, image) to a task.
-When you delete a task, any attached file is also deleted from storage.
-You can create and assign users to tasks (name, email, avatar).
-Everything updates smoothly (optimistic UI) and stays synced.

Tech Stack

Front-end: React + TypeScript + Vite + Tailwind CSS + @dnd-kit.
Back-end: NestJS + TypeScript + Mongoose + MongoDB.
File storage: AWS S3 (or compatible) for attachments.

Getting Started
Prerequisites

Node.js (version 18 or higher).

MongoDB (local or in the cloud).

AWS S3 bucket (or S3-compatible storage).

Setup

Clone the repo and run npm install.

Two sets of environment config:

Server: .env in apps/server/ with variables like MONGO_URI, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY.

Client: .env in apps/client/ with VITE_API_URL=http://localhost:4000/api.

Run server:

cd apps/server && npm run start:dev


Run client:

cd apps/client && npm run dev


Open your browser at http://localhost:5173.

API Endpoints (Backend)
Tasks

GET /api/tasks – list all tasks.

POST /api/tasks – create a task.

PATCH /api/tasks/:id – update a task.

DELETE /api/tasks/:id – delete a task (and its file).

PATCH /api/tasks/reorder – bulk update order and status when dragging tasks.

Users

GET /api/users – list users.

POST /api/users – create a user.

Uploads

POST /api/upload/presign – get a pre-signed URL to upload a file to S3.
Then the front-end uploads the file to that URL and saves the returned key into the task.

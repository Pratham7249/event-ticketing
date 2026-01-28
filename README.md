# Mini Event Ticketing App

A full-stack MERN application for managing events and ticketing. Organizers can create events and manage registrations, while users can explore events and book tickets with QR code generation.

## 🚀 Features

### For Organizers
- **Authentication**: Secure Login/Signup for organizers.
- **Dashboard**: View all created events and their status.
- **Create Event**: Add new events with details like date, venue, ticket visuals, and approval mode (Auto/Manual).
- **Event Management**: View registrations and Approve/Reject tickets manually if required.

### For Attendees
- **Explore Events**: Browse a public gallery of upcoming events.
- **Book Tickets**: Simple registration form for events.
- **Real-time Status**: Immediate confirmation for Auto-Approved events; "Pending" status for Manual ones.
- **Digital Ticket**: View approved ticket with a unique **QR Code** for entry.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router v6.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Supports both Local/Cloud and In-Memory fallback).
- **Authentication**: JWT (JSON Web Tokens).

## 📦 Setup Instructions

### 1. clone the repository
```bash
git clone https://github.com/Pratham7249/event-ticketing.git
cd event-ticketing
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
*The server runs on `http://localhost:5005`. It uses an In-Memory MongoDB by default if no local MongoDB is found.*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

## 🔑 Environment Variables

The app comes with pre-configured defaults, but you can create a `.env` file in the `server` directory for custom settings:

```env
MONGO_URI=mongodb://localhost:27017/mini-event-app
JWT_SECRET=supersecretkey123
PORT=5005
```

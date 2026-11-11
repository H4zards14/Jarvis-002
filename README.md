# Jarvis-002 — Warframe Companion

A personal inventory and progression management application for Warframe players.

## About

Jarvis-002 is an independent Warframe companion application designed to help players organize their collections, manage inventory, and track their in-game progression.

This project is not affiliated with or endorsed by Digital Extremes.

## Features

### Inventory Management

- Add inventory items
- Edit existing items
- Delete inventory items
- Track quantities and item levels
- Track mastery and Forma
- Add personal notes
- Persistent PostgreSQL storage

### Collection Catalogs

- Warframes
- Weapons
- Mods
- Relics
- Resources

### Additional Planned Features

- Player Profile
- Currency Tracking
- Foundry Tracking
- Additional progression tracking

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL client (`pg`)

### Database

- PostgreSQL 18

### Development Tools

- Git and GitHub
- Visual Studio Code
- pgAdmin 4

## Project Structure

```text
Jarvis-002/
├── frontend/
│   ├── public/
│   └── src/
│       ├── context/
│       ├── data/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── index.ts
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/H4zards14/Jarvis-002.git
cd Jarvis-002
```

### 2. Configure the Database

Create a PostgreSQL database named:

```text
Jarvis002
```

Configure the backend environment variables in `backend/.env` using the settings expected by the backend database configuration.

Never commit your actual `.env` file or database credentials.

### 3. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend API runs on:

```text
http://localhost:5000
```

### 4. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL displayed in your terminal, normally:

```text
http://localhost:5173
```

## Build Verification

Frontend production build:

```bash
cd frontend
npm run build
```

Backend TypeScript build:

```bash
cd backend
npm run build
```

## Development Status

**Current Status: Frontend and Core Backend Completed**

- React frontend implemented
- Inventory management interface completed
- Warframe collection catalog integrated
- Mods, weapons, relics, and resources pages implemented
- Express REST API implemented
- PostgreSQL database integration completed
- Inventory CRUD operations implemented
- Local inventory migration implemented
- Frontend and backend production builds verified
- End-to-end inventory testing completed

Additional features and improvements are planned.

## License

To be determined.

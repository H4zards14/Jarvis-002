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
- Mark items as favorites
- Filter favorite inventory items
- Persistent PostgreSQL storage

### Collection Catalogs

- Warframes
- Weapons
- Mods
- Relics
- Resources

### Authentication

- User login and session management
- Persistent authentication sessions
- CSRF protection
- Password hashing

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

- Python 3.13
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- Uvicorn

### Database

- PostgreSQL 18

### Deployment

- Docker
- Docker Compose
- Nginx

### Development Tools

- Git and GitHub
- Visual Studio Code
- pgAdmin 4
- pytest
- Ruff

## Project Structure

```text
Jarvis-002/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   ├── core/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── inventory/
│   │   │   └── users/
│   │   └── main.py
│   ├── migrations/
│   ├── tests/
│   │   └── modules/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── alembic.ini
│   └── pyproject.toml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── features/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── .dockerignore
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Git
- Docker Desktop with Docker Compose
- PostgreSQL 18
- An existing PostgreSQL database named `Jarvis002`

The application uses the existing PostgreSQL database. Docker Compose does not create a separate PostgreSQL container.

### 1. Clone the Repository

```bash
git clone https://github.com/H4zards14/Jarvis-002.git
cd Jarvis-002
```

### 2. Configure Environment Variables

Create the backend environment file using the example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and configure the required database credentials and application secrets.

Never commit your actual `.env` file or expose database credentials and secret keys.

### 3. Start the Application with Docker

From the project root, run:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

The application will be available at:

| Service           | URL                          |
| ----------------- | ---------------------------- |
| Frontend          | http://localhost:5173        |
| Backend API       | http://localhost:5000        |
| API documentation | http://localhost:5000/docs   |
| Health check      | http://localhost:5000/health |

### 4. Stop the Application

```bash
docker compose down
```

This stops and removes the application containers. It does not remove the existing PostgreSQL database.

## Local Development

Docker is the recommended way to run the complete application. For development without Docker, run the backend and frontend separately.

### Backend

Requirements:

- Python 3.13
- PostgreSQL 18

From the project root:

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -e .
```

Configure `backend/.env` with the local PostgreSQL connection settings.

Start the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Testing and Code Quality

### Backend Tests

From the `backend/` directory:

```bash
pytest
```

### Backend Linting

```bash
ruff check app tests
```

### Frontend Build

From the `frontend/` directory:

```bash
npm run build
```

### Frontend Linting

```bash
npm run lint
```

## Database and Migrations

Jarvis-002 uses PostgreSQL with SQLAlchemy models and Alembic migrations.

The existing database is preserved during the backend rebuild. The production database migration history was baselined without recreating or deleting existing application data.

Do not run destructive database commands against the production database.

## Development Status

**Current Status: FastAPI Backend Rebuild and Docker Deployment Completed**

- React frontend preserved
- FastAPI backend implemented
- Modular backend architecture established
- PostgreSQL integration completed
- Authentication and session management implemented
- CSRF protection implemented
- Inventory CRUD operations implemented
- Favorite inventory functionality integrated
- Alembic migration configuration established
- Backend automated tests implemented
- Docker deployment configured for frontend and backend
- Frontend and backend integration verified
- Docker deployment verified
- GitHub feature branch merged into `main`

Additional features and improvements are planned.

## License

To be determined.

## Git Workflow Practice

This section is for practicing feature branches, commits, and pull requests.

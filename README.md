# Link Sharing App - Backend Server

This is the backend server for the **Link Sharing App**, built with **Express.js**, **TypeScript**, and **Sequelize**. It provides RESTful APIs for user authentication, link management, image uploads (via Cloudinary), and more.

## 🚀 Features

- Built with **Express 5**
- Uses **TypeScript** for type safety
- ORM: **Sequelize** + PostgreSQL
- **JWT**-based authentication
- **Cloudinary** integration for image uploads
- Dockerized for easy deployment
- Environment-based configuration via `.env`
- Async error handling with `express-async-handler`

---

## 🧰 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Sequelize & sequelize-typescript
- Docker & Docker Compose
- Cloudinary
- JWT (Access & Refresh Tokens)

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/ebimopondei/link-sharing-app-server.git
cd link-sharing-app-server

```

### 2. Install dependencies

```bash
npm install

```


### 3. Create .env file
Create a .env file in the root directory and add the following:

```bash
PORT=3001
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB=your_db_name
ACCESSTOKENSECRET=your_access_token_secret
REFRESHTOKENSECRET=your_refresh_token_secret

```


### 4. Build the project


```bash
npm run build


```


### 5. Start the server


```bash
npm run start


```


## 🐳 Docker Setup

This project includes a `Dockerfile` and `docker-compose.yml` for easy containerization.

### 🧪 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 🔧 Running with Docker Compose

1. Create a `.env` file in the root directory as described above.

2. Run the following command:

```bash
docker-compose up --build


```

This will:

- Start a **PostgreSQL** container (`db`)
- Build and run the **Express** app container (`app`) on port `3001`

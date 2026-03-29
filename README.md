# 🐾 Patitas Felices — Sistema de Gestión Veterinaria

Sistema de gestión integral para la veterinaria **Patitas Felices**, desarrollado con arquitectura **Full Stack**:

- ⚛️ Frontend: React + Vite
- 🟢 Backend: Node.js + Express + TypeScript
- 🗄️ Base de datos: MySQL + Docker

Permite administrar **dueños, mascotas, veterinarios e historiales clínicos**, con autenticación segura y control de roles.

---

# ✨ Características Principales

## 🔐 Autenticación y Seguridad

- Autenticación con JWT
- Contraseñas encriptadas con bcrypt
- Protección de rutas por rol
- Roles del sistema:
  - **ADMIN**
  - **VETERINARIO**
  - **DUEÑO** (referencial)

---

# 👑 Módulos del Sistema

## Administrador

- Dashboard con estadísticas generales
- CRUD de veterinarios
- CRUD de dueños
- CRUD de mascotas
- Visualización de historiales clínicos
- Búsqueda de dueños por email
- Eliminación de registros

## Veterinario

- Dashboard con estadísticas personales
- Búsqueda de dueños
- Registro de consultas médicas
- Listado de consultas realizadas
- Mascotas atendidas
- Acceso a historiales clínicos

## Mascotas

- Registro de mascotas asociadas a dueños
- Historial clínico por mascota
- Detalle completo de mascota
- Estadísticas de consultas

---

# 🛠️ Tecnologías Utilizadas

## Frontend

- React 18
- React Router DOM 6
- Axios
- Context API
- Vite

## Backend

- Node.js
- Express
- TypeScript
- MySQL
- JWT
- Bcrypt

## Base de Datos

- MySQL 8
- Docker
- phpMyAdmin

---

# 📁 Estructura del Proyecto

```
tp-final-patitas-felices/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── interfaces/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   └── features/
│       ├── contexts/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── duenos/
│       │   ├── mascotas/
│       │   └── veterinarios/
│       ├── providers/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│   ├── .env
│   └── package.json
│
├── database/
│   └── init.sql
│
├── docker-compose.yml
└── README.md
```

---

# 🚀 Instalación y Configuración

## Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- Git
- npm

---

# 📦 Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tp-final-patitas-felices.git
cd tp-final-patitas-felices
```

---

# 🗄️ Configurar Base de Datos (Docker)

```bash
docker-compose up -d
docker ps
```

Accesos:

- MySQL → localhost:3306
- phpMyAdmin → http://localhost:8080
  - Usuario: root
  - Contraseña: rootpassword

---

# 🟢 Configurar Backend

```bash
cd backend
cp .env.example .env
```

## Instalar dependencias del backend

```bash
# Instalar dependencias de producción (versiones estables)
npm install express@4.18.2 cors@2.8.5 dotenv@16.3.1 mysql2@3.6.0 bcrypt@5.1.1 jsonwebtoken@9.0.2 express-validator@7.0.1

# Instalar dependencias de desarrollo (versiones estables)
npm install -D typescript@5.2.2 ts-node@10.9.1 ts-node-dev@2.0.0 nodemon@3.0.1
npm install -D @types/node@20.5.0 @types/express@4.17.17 @types/cors@2.8.13
npm install -D @types/bcrypt@5.0.0 @types/jsonwebtoken@9.0.2 @types/mysql@2.15.21
```

## Ejecutar backend en desarrollo

```bash
npm run dev
```

Backend disponible en:

```
http://localhost:3000
```

---

# ⚛️ Configurar Frontend

```bash
cd frontend
cp .env.example .env
```

## Instalar dependencias del frontend

```bash

# Instalar dependencias de producción
npm install react@18.2.0 react-dom@18.2.0 react-router-dom@6.20.0 axios@1.6.2

# Instalar dependencias de desarrollo
npm install -D vite@4.5.3 @vitejs/plugin-react@4.0.0
```

## Ejecutar frontend en desarrollo

```bash
npm run dev
```

Frontend disponible en:

```
http://localhost:5173
```

---

# 🔐 Credenciales de Prueba

| Rol         | Email                  | Contraseña |
| ----------- | ---------------------- | ---------- |
| ADMIN       | admin@veterinaria.com  | admin123   |
| VETERINARIO | carlos.lopez@email.com | vet123     |

---

# 📊 API REST — Endpoints Backend

## Autenticación

| Método | Endpoint                       | Descripción           | Acceso  |
| ------ | ------------------------------ | --------------------- | ------- |
| POST   | /api/auth/login                | Iniciar sesión        | Público |
| POST   | /api/auth/register/dueno       | Registrar dueño       | ADMIN   |
| POST   | /api/auth/register/veterinario | Registrar veterinario | ADMIN   |

---

## Dueños

| Método | Endpoint                            | Descripción      | Acceso             |
| ------ | ----------------------------------- | ---------------- | ------------------ |
| GET    | /api/duenos                         | Listar dueños    | ADMIN, VETERINARIO |
| GET    | /api/duenos/buscar-por-email/:email | Buscar por email | ADMIN, VETERINARIO |

---

## Mascotas

| Método | Endpoint                     | Descripción        | Acceso             |
| ------ | ---------------------------- | ------------------ | ------------------ |
| GET    | /api/mascotas                | Listar mascotas    | ADMIN, VETERINARIO |
| GET    | /api/mascotas/:id            | Obtener mascota    | ADMIN, VETERINARIO |
| GET    | /api/mascotas/dueno/:duenoId | Mascotas por dueño | ADMIN, VETERINARIO |
| POST   | /api/mascotas                | Crear mascota      | ADMIN, VETERINARIO |
| PUT    | /api/mascotas/:id            | Actualizar mascota | ADMIN, VETERINARIO |
| DELETE | /api/mascotas/:id            | Eliminar mascota   | ADMIN              |

---

## Historial Clínico

| Método | Endpoint                                  | Descripción               | Acceso             |
| ------ | ----------------------------------------- | ------------------------- | ------------------ |
| GET    | /api/historial/mascota/:mascotaId         | Historial por mascota     | ADMIN, VETERINARIO |
| GET    | /api/historial/veterinario/:veterinarioId | Historial por veterinario | ADMIN, VETERINARIO |
| POST   | /api/historial                            | Crear entrada             | VETERINARIO, ADMIN |

---

## Veterinarios

| Método | Endpoint                       | Descripción         | Acceso             |
| ------ | ------------------------------ | ------------------- | ------------------ |
| GET    | /api/veterinarios              | Listar veterinarios | ADMIN, VETERINARIO |
| GET    | /api/veterinarios/email/:email | Buscar por email    | ADMIN, VETERINARIO |

---

# 🎨 Frontend — Rutas

## Públicas

- `/login`

## Admin

- `/`
- `/duenos`
- `/duenos/nuevo`
- `/mascotas`
- `/mascotas/nueva`
- `/mascotas/:id`
- `/veterinarios/nuevo`

## Veterinario

- `/`
- `/duenos`
- `/mascotas`
- `/mascotas/:id`
- `/consulta/nueva`
- `/mis-consultas`
- `/mascotas-atendidas`

---

# 👥 Roles y Permisos

## ADMIN

✔ Dashboard general  
✔ CRUD veterinarios  
✔ CRUD dueños  
✔ CRUD mascotas  
✔ Ver historiales  
✔ Eliminar registros

## VETERINARIO

✔ Dashboard personal  
✔ Ver dueños  
✔ Ver mascotas  
✔ Ver detalle mascotas  
✔ Crear consultas  
✔ Ver consultas propias  
✔ Mascotas atendidas

❌ No gestiona dueños  
❌ No gestiona veterinarios  
❌ No elimina registros

---

# 🧾 Licencia

Proyecto académico — uso educativo.

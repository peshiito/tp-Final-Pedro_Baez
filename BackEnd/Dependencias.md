# Dependencias de producción

npm install express
npm install cors
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
npm install express-validator
npm install mysql2

# Dependencias de desarrollo

npm install -D typescript @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken nodemon ts-node

# Inicializar TypeScript

npx tsc --init

# Como iniciar el proyecto :

## 1. Desde la raíz del proyecto, levantar Docker

docker compose up -d

## 2. Ir a backend

cd backend

## 3. Instalar dependencias (si no lo hiciste)

npm install

## 4. Correr en modo desarrollo

npm run dev

# Cosas del Docker para ver phpmyadmin

🌐 http://localhost:8080
Usuario: root
Contraseña: rootpassword
Base de datos: veterinaria_db

# Esto es para poner el .env.example en el .env

# Ahora copiar a .env

cp .env.example .env

# Curls para la consola para iniciar sesion como admin y para registrar un veterinario

## Login de admin :

curl -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "admin@veterinaria.com",
"password": "admin123"
}'

### Guardar el token en una variable (reemplazá con tu token real)

export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkB2ZXRlcmluYXJpYS5jb20iLCJyb2wiOiJBRE1JTiIsInBlcmZpbElkIjpudWxsLCJpYXQiOjE3NzEyOTU3MzcsImV4cCI6MTc3MTM4MjEzN30.kZVcT6eoDah6BJ7i1mXrj83wS8ieXRhe7Px1B1sYKbY"

## Registro de veterinario (solo el admin puede)

# Esto DEBE funcionar (usando token de admin)

curl -X POST http://localhost:3000/api/auth/register/veterinario \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{
"nombre": "Carlos",
"apellido": "López",
"email": "carlos.lopez@email.com",
"password": "vet123",
"matricula": "VET-001",
"especialidad": "Cirugía"
}'

### Mensaje esperado :

{"message":"Veterinario registrado exitosamente","usuarioId":3,"veterinarioId":1}

## Login como veterinario :

curl -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "carlos.lopez@email.com",
"password": "vet123"
}'

### Guardar token del veterinario

export VET_TOKEN="token_del_veterinario"

# COSAS QUE ME PASO DEEPSEK

# 1. Login como admin

TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@veterinaria.com","password":"admin123"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "Token: $TOKEN"

# 2. Crear veterinario

curl -X POST http://localhost:3000/api/auth/register/veterinario \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{
"nombre": "Carlos",
"apellido": "López",
"email": "carlos.lopez@email.com",
"password": "vet123",
"matricula": "VET-001",
"especialidad": "Cirugía",
"direccion": "Av. Veterinarios 123"
}'

# 3. Crear dueño

curl -X POST http://localhost:3000/api/auth/register/dueno \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{
"nombre": "Juan",
"apellido": "Pérez",
"email": "juan.perez@email.com",
"password": "dueno123",
"direccion": "Av. Principal 123",
"telefono": "123456789",
"dni": "12345678"
}'

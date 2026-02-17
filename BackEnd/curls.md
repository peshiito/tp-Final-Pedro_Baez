# 🐾 VETERINARIA PATITAS FELICES - BACKEND

## 📋 ENDPOINTS Y CURLS DE PRUEBA

### 🔐 AUTENTICACIÓN

## Admin

#### 1. Login como admin

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@veterinaria.com","password":"admin123"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "Token: $TOKEN"
```

#### 2. Crear veterinario (solo como admin)

```bash
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

```

##### Algo para copiar y pegar y que figure como codigo en el md

```bash

```

### 3. Crear dueño

```bash

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

```

## Gestion de mascotas (Dueño)

#### Login como dueño

```bash
DUENO_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan.perez@email.com","password":"dueno123"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "Token Dueño: $DUENO_TOKEN"

```

#### 5. Crear mascota

```bash

curl -X POST http://localhost:3000/api/mascotas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DUENO_TOKEN" \
  -d '{
    "nombre": "Firulais",
    "especie": "Perro",
    "raza": "Labrador",
    "sexo": "MACHO",
    "fecha_nacimiento": "2020-05-15",
    "peso": 25.5
  }'

```

### 5.2 Otra mascota

```bash

curl -X POST http://localhost:3000/api/mascotas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DUENO_TOKEN" \
  -d '{
    "nombre": "Michi",
    "especie": "Gato",
    "raza": "Siames",
    "sexo": "HEMBRA",
    "fecha_nacimiento": "2021-03-10",
    "peso": 4.2
  }'


```

### 6. Listar mascotas

```bash
curl -X GET http://localhost:3000/api/mascotas \
  -H "Authorization: Bearer $DUENO_TOKEN"

```

### 6.2 Listar una mascota en particular

```bash

# Reemplazar 1 con el ID de la mascota
curl -X GET http://localhost:3000/api/mascotas/1 \
  -H "Authorization: Bearer $DUENO_TOKEN"

```

### 6.3 Actualizar una mascota

```bash
curl -X PUT http://localhost:3000/api/mascotas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DUENO_TOKEN" \
  -d '{
    "peso": 26.8,
    "raza": "Labrador Dorado"
  }'
```

### 6.4 Eliminar una mascota

```bash

curl -X DELETE http://localhost:3000/api/mascotas/1 \
  -H "Authorization: Bearer $DUENO_TOKEN"

```

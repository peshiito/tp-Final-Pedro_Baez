# Aca vamos a encontrar todos los curls necesarios para crear usuarios, mascotas, veterinarios, historiales, etc

## Admin :

#### Login como admin

```bash

VET_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.lopez@email.com","password":"vet123"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "Token Veterinario: $VET_TOKEN"

```

### Crear veterinario (solo admin)

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

### Crear dueño (solo admin)

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

### Ver todos los dueños (solo admin)

```bash
curl -X GET http://localhost:3000/api/duenos \
 -H "Authorization: Bearer $TOKEN"
   🐕 GESTIÓN DE MASCOTAS (ADMIN Y VETERINARIO)

```

### Crear mascota (admin o veterinario)

```bash
curl -X POST http://localhost:3000/api/mascotas \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{
"nombre": "Rex",
"especie": "Perro",
"raza": "Pastor Alemán",
"sexo": "MACHO",
"fecha_nacimiento": "2021-08-20",
"peso": 32.5,
"dueno_id": 1
}'
```

### Listar todas las mascotas

```bash
curl -X GET http://localhost:3000/api/mascotas \
 -H "Authorization: Bearer $TOKEN"
```

### Ver una mascota específica

```bash

# Reemplazar 1 con el ID de la mascota

curl -X GET http://localhost:3000/api/mascotas/1 \
 -H "Authorization: Bearer $TOKEN"
```

### Eliminar una mascota (solo admin)

```bash
curl -X DELETE http://localhost:3000/api/mascotas/1 \
 -H "Authorization: Bearer $TOKEN"

```

## Veterinario

### Login como veterinario

```bash
VET_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.lopez@email.com","password":"vet123"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "Token Veterinario: $VET_TOKEN"
```

### Crear mascota (admin o veterinario)

```bash
curl -X POST http://localhost:3000/api/mascotas \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{
"nombre": "Rex",
"especie": "Perro",
"raza": "Pastor Alemán",
"sexo": "MACHO",
"fecha_nacimiento": "2021-08-20",
"peso": 32.5,
"dueno_id": 1
}'
```

### Listar todas las mascotas

```bash


curl -X GET http://localhost:3000/api/mascotas \
 -H "Authorization: Bearer $VET_TOKEN"

```

### Ver una mascota específica

```bash

curl -X GET http://localhost:3000/api/mascotas/1 \
  -H "Authorization: Bearer $VET_TOKEN"


```

### Ver mascota por dueño

```bash
curl -X GET http://localhost:3000/api/mascotas/dueno/1 \
  -H "Authorization: Bearer $VET_TOKEN"

```

### Crear un historial clinico

```bash


curl -X POST http://localhost:3000/api/historial \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VET_TOKEN" \
  -d '{
    "mascota_id": 1,
    "fecha": "2024-02-20",
    "tipo": "CONSULTA",
    "diagnostico": "Infeccion de oido",
    "tratamiento": "Gotas antibioticas por 7 dias",
    "observaciones": "Revisar en 10 dias"
  }'

```

### Ver historial de una mascota

```bash
curl -X GET http://localhost:3000/api/historial/mascota/1 \
  -H "Authorization: Bearer $VET_TOKEN"

```

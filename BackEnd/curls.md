# 🐾 VETERINARIA PATITAS FELICES - BACKEND

## 📋 ENDPOINTS Y CURLS DE PRUEBA

---

### 🔐 AUTENTICACIÓN

## 👑 ADMIN

#### 1. Login como admin

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@veterinaria.com","password":"admin123"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "Token: $TOKEN"
```

### 2. Crear veterinario (solo admin)

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

### 3. Crear dueño (solo admin)

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

### 4. Ver todos los dueños (solo admin)

```bash
curl -X GET http://localhost:3000/api/duenos \
 -H "Authorization: Bearer $TOKEN"
   🐕 GESTIÓN DE MASCOTAS (ADMIN Y VETERINARIO)

```

### 5. Login como veterinario

```bash
   VET*TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"carlos.lopez@email.com","password":"vet123"}' | grep -o '"token":"[^"]\*' | grep -o '[^"]\_$')

echo "Token Veterinario: $VET_TOKEN"

```

### 6. Crear mascota (admin o veterinario)

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

### 7. Listar todas las mascotas

```bash
curl -X GET http://localhost:3000/api/mascotas \
 -H "Authorization: Bearer $TOKEN"
```

### 8. Ver una mascota específica

```bash

# Reemplazar 1 con el ID de la mascota

curl -X GET http://localhost:3000/api/mascotas/1 \
 -H "Authorization: Bearer $TOKEN"
```

### 9. Actualizar una mascota

```bash
curl -X PUT http://localhost:3000/api/mascotas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "peso": 34.8,
    "raza": "Pastor Alemán (Adulto)"
    }'
```

### 10. Ver mascotas por dueño

```bash
    curl -X GET http://localhost:3000/api/mascotas/dueno/1 \
     -H "Authorization: Bearer $TOKEN"
```

### 11. Eliminar una mascota (solo admin)

```bash
curl -X DELETE http://localhost:3000/api/mascotas/1 \
 -H "Authorization: Bearer $TOKEN"

```

📊 VERIFICACIONES EN BASE DE DATOS
Ver todas las mascotas
bash
docker exec -it tp*final_backend mysql -u root -proot123 -e "USE curso_backend; SELECT * FROM mascotas;"
Ver todos los dueños
bash
docker exec -it tp*final_backend mysql -u root -proot123 -e "USE curso_backend; SELECT * FROM duenos;"
Ver usuarios
bash
docker exec -it tp_final_backend mysql -u root -proot123 -e "USE curso_backend; SELECT id, nombre, apellido, email, rol_id FROM usuarios;"

```

```

```

```

```

```

```

```

```

```

```

```

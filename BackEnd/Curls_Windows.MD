# 🐾 VETERINARIA PATITAS FELICES - BACKEND

## 📋 ENDPOINTS Y CURLS DE PRUEBA (PARA WINDOWS - PowerShell)

---

### 🔐 AUTENTICACIÓN

## 👑 ADMIN

#### 1. Login como admin (PowerShell)

```powershell
# Login y guardar token
$RESPONSE = curl.exe -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@veterinaria.com\",\"password\":\"admin123\"}'
$TOKEN = ($RESPONSE | Select-String -Pattern '"token":"([^"]*)"').Matches.Groups[1].Value
Write-Host "Token: $TOKEN"
```

### 2. Crear veterinario (solo admin) - PowerShell

```powershell
curl.exe -X POST http://localhost:3000/api/auth/register/veterinario `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"nombre\":\"Carlos\",\"apellido\":\"López\",\"email\":\"carlos.lopez@email.com\",\"password\":\"vet123\",\"matricula\":\"VET-001\",\"especialidad\":\"Cirugía\",\"direccion\":\"Av. Veterinarios 123\"}'
```

### 3. Crear dueño (solo admin) - PowerShell

```powershell
curl.exe -X POST http://localhost:3000/api/auth/register/dueno `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"nombre\":\"Juan\",\"apellido\":\"Pérez\",\"email\":\"juan.perez@email.com\",\"password\":\"dueno123\",\"direccion\":\"Av. Principal 123\",\"telefono\":\"123456789\",\"dni\":\"12345678\"}'
```

### 🐕 GESTIÓN DE MASCOTAS (DUEÑO)

### 4. Login como dueño - PowerShell

```powershell
$RESPONSE_DUENO = curl.exe -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"juan.perez@email.com\",\"password\":\"dueno123\"}'
$DUENO_TOKEN = ($RESPONSE_DUENO | Select-String -Pattern '"token":"([^"]*)"').Matches.Groups[1].Value
Write-Host "Token Dueño: $DUENO_TOKEN"
```

### 5. Crear mascota - PowerShell

```powershell
   curl.exe -X POST http://localhost:3000/api/mascotas `  -H "Content-Type: application/json"`
   -H "Authorization: Bearer $DUENO_TOKEN" `  -d '{\"nombre\":\"Firulais\",\"especie\":\"Perro\",\"raza\":\"Labrador\",\"sexo\":\"MACHO\",\"fecha_nacimiento\":\"2020-05-15\",\"peso\":25.5}'
```

### 5.1 Crear otra mascota - PowerShell

```powershell
curl.exe -X POST http://localhost:3000/api/mascotas`   -H "Content-Type: application/json"` -H "Authorization: Bearer $DUENO_TOKEN"`   -d '{\"nombre\":\"Michi\",\"especie\":\"Gato\",\"raza\":\"Siames\",\"sexo\":\"HEMBRA\",\"fecha_nacimiento\":\"2021-03-10\",\"peso\":4.2}'
```

### 6. Listar todas mis mascotas - PowerShell

```powershell
curl.exe -X GET http://localhost:3000/api/mascotas`
-H "Authorization: Bearer $DUENO_TOKEN"
```

### 6.1 Ver una mascota específica - PowerShell

```powershell

# Reemplazar 1 con el ID de la mascota

curl.exe -X GET http://localhost:3000/api/mascotas/1 `  -H "Authorization: Bearer $DUENO_TOKEN"
```

### 6.2 Actualizar una mascota - PowerShell

```powershell
curl.exe -X PUT http://localhost:3000/api/mascotas/1`-H "Content-Type: application/json"` -H "Authorization: Bearer $DUENO_TOKEN"`-d '{\"peso\":26.8,\"raza\":\"Labrador Dorado\"}'
```

### 6.3 Eliminar una mascota - PowerShell

```powershell
curl.exe -X DELETE http://localhost:3000/api/mascotas/1`
-H "Authorization: Bearer $DUENO_TOKEN

```

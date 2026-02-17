# 🚀 TRABAJO PRÁCTICO FINAL – BACKEND

## 📝 INTRODUCCIÓN

Este **Trabajo Práctico Final** tiene como objetivo integrar y profundizar todos los conceptos vistos durante la cursada de Backend.

El proyecto se basa directamente en el **Trabajo Práctico Backend Intermedio** y reutiliza, en la medida de lo posible, el **Trabajo Práctico de Base de Datos** de la veterinaria **“Patitas Felices”**.

> [!NOTE]
> El enfoque principal estará en la correcta arquitectura del backend, la seguridad, el manejo de datos, la integración con un frontend y la calidad general del proyecto.

---

## 🏥 CONTEXTO DEL PROYECTO

La veterinaria **“Patitas Felices”** necesita un sistema de gestión que permita administrar su información de manera segura y organizada.

El sistema debe contemplar, como mínimo, las siguientes entidades:

- 👤 **Dueños**
- 🐾 **Mascotas**
- 👨‍⚕️ **Veterinarios**
- 📂 **Historial clínico**

Estas entidades deben estar correctamente relacionadas entre sí, respetando la lógica del dominio del problema.

---

## 🎯 OBJETIVOS

- ✅ Consolidar el uso de **Node.js** con **Express** y **TypeScript**.
- ✅ Aplicar arquitectura **MVC** de forma correcta y consistente.
- ✅ Implementar autenticación y autorización mediante **JWT**.
- ✅ Integrar una base de datos a elección (**MongoDB** o **MySQL**).
- ✅ Desarrollar un **frontend** mínimo que consuma el backend.
- ✅ Demostrar la integración completa frontend-backend mediante un **CRUD funcional**.
- ✅ Mantener buenas prácticas de código, organización y documentación.

---

## 🛠️ REQUISITOS TÉCNICOS OBLIGATORIOS

### 💻 Backend

- **Node.js** & **Express**
- **TypeScript** (⚠️ OBLIGATORIO)
- Arquitectura **MVC**
- **DTOs** cuando corresponda
- Validaciones con **express-validator**
- Autenticación con **JWT**
- Encriptación de contraseñas con **bcrypt**
- Manejo centralizado de errores
- Variables de entorno con archivo `.env`

### 🗄️ Base de Datos (a elección)

#### Opción 1 – MongoDB

- **MongoDB**
- **Mongoose** como ODM

#### Opción 2 – MySQL

- **MySQL** & `mysql2`
- Uso de claves primarias y foráneas
- Integridad referencial

> ⚠️ [IMPORTANT]
> En caso de usar **MySQL**, se debe incluir un **DUMP** de la base de datos.

---

## 🔐 AUTENTICACIÓN Y SEGURIDAD

- La autenticación mediante **JWT** es **OBLIGATORIA**.
- Deben existir endpoints de:
  - 📝 **Registro**
  - 🔑 **Login**
- Las rutas privadas deben estar protegidas mediante **middleware**.
- Los roles de usuario (admin, veterinario, recepcionista) son opcionales.

---

## ⚙️ FUNCIONALIDADES MÍNIMAS DEL BACKEND

El backend debe exponer endpoints **RESTful** para las entidades del sistema.

Como mínimo, debe existir:

- Un **CRUD completo** sobre al menos una entidad principal.
- Operaciones protegidas y asociadas a un usuario autenticado.

### 📡 Endpoints Esperados

- `GET` - Para listar y obtener detalles.
- `POST` - Para creación.
- `PUT` / `PATCH` - Para actualización.
- `DELETE` - Para eliminación.

---

## 🌐 FRONTEND (REQUERIDO)

El proyecto debe incluir un **frontend mínimo** que consuma el backend. Puedes elegir **UNA** de las siguientes opciones:

1.  **HTML, CSS y JavaScript**: Ubicado dentro de la carpeta `/public`.
2.  **Handlebars**: Vistas renderizadas desde el backend.
3.  **React**: Frontend desacoplado (mismo repo o separado).

> ⚠️[IMPORTANT]
>
> - El frontend debe permitir realizar un **CRUD COMPLETO** de al menos una entidad.
> - No se evalúa el diseño visual, sino la **funcionalidad** y la integración real.

---

## 📦 ENTREGABLES

El alumno debe entregar un repositorio **público** en GitHub con el nombre `tp-final-NOMBRE-APELLIDO`:

- 📂 Código fuente completo.
- ⚙️ Backend funcional en **TypeScript**.
- 💻 Frontend integrado.
- 📄 Archivo `.env.example`.
- 📖 **README.md** (Obligatorio).
- 🧪 Colección de pruebas (**Postman**, **Insomnia** o `curl`).
- 💾 **DUMP** de la base de datos (si usa MySQL).

---

## 📖 README (OBLIGATORIO)

Debe incluir como mínimo:

- Descripción general.
- Tecnologías utilizadas.
- Instrucciones de instalación y ejecución.
- Variables de entorno.
- Ejemplos de endpoints.
- Aclaración de opción de frontend.

---

## 📊 CRITERIOS DE EVALUACIÓN

| Criterio                           | Porcentaje |
| :--------------------------------- | :--------: |
| 🏗️ Arquitectura y organización MVC |    25%     |
| 🛡️ Seguridad (JWT, bcrypt, roles)  |    20%     |
| ⚙️ Funcionalidad del backend       |    20%     |
| 🔗 Integración frontend-backend    |    15%     |
| ✨ Calidad del código              |    10%     |
| 📚 Documentación                   |    10%     |
| **TOTAL**                          |  **100%**  |

---

## 💡 CONSIDERACIONES FINALES

- Se valorará la **claridad** y la **coherencia** del dominio.
- El proyecto debe reflejar **buenas prácticas** profesionales.
- Ante dudas, **consultar al instructor**.

> ⚠️ **Aclaración importante**: NO ES NECESARIO REALIZAR EL DEPLOY. El proyecto debe funcionar localmente.

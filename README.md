# 🥢 Sushiro — Backend (API)
API para la app de restaurante Sushiro: gestión de menú, mesas, compras y subida de imágenes (zona admin).
El cliente no usa login tradicional: su sesión se basa en la selección de mesa y un sesionId generado en el frontend.

Demo API: https://sushiro-backend.vercel.app/
Frontend: https://sushiro-frontend.vercel.app/
Repo: https://github.com/JaumeEsquerdo/Sushiro-backend

## 📖 Descripción
Gestiona productos, mesas y compras.

Endpoints admin para añadir/editar productos y subir imágenes.

Compras vinculadas a mesaId + sesionId (creados en el frontend).

Permite consultar el historial de una sesión de mesa con /compras/sesion/:sesionId.

## 🧱 Tech stack
Node.js · Express · MongoDB/Mongoose · CORS · Multer (uploads) · JWT · Dotenv

## 🔌 Endpoints principales
- Auth (admin)
POST /auth/register — crear admin
POST /auth/login — login admin (JWT)
GET /auth/me — info admin autenticado

- Productos
GET /productos — listar productos
GET /productos/:id — detalle
POST /productos — crear (admin)
PUT /productos/:id — actualizar
PUT /productos/:id/image — subir/actualizar imagen (admin)

- Mesas
GET /mesas — listar
GET /mesas/:id — detalle
POST /mesas — crear
PUT /mesas/:id — actualizar

- Compras
POST /compras — crear compra (requiere mesaId + sesionId)
GET /compras/sesion/:sesionId — historial de sesión
PUT /compras/:id/pagar — marcar como pagada

## 📤 Subida de imágenes
Ruta: PUT /productos/:id/image

Formato: multipart/form-data con campo imgprod

Destino: public/uploads/

Límite: 5 MB · solo imágenes

## Variables de entorno
En el archivo `.env.example` está la estructura.

## 🧰 Scripts
```js
npm install
npm run dev      // local
```

## Autor

- Jaume Esquerdo · [LinkedIn](https://www.linkedin.com/in/jaume-esquerdo/) · [GitHub](https://github.com/JaumeEsquerdo)
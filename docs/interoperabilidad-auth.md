# Ficha de interoperabilidad — Autenticación

* **URL base:** `API_URL` configurada en `src/services/authService.ts` (ej. `https://tu-api.ejemplo.com`)
* **Endpoint de login:** `POST /auth/login`
* **Endpoint de registro (opcional / mock):** `POST /auth/register`
* **Headers:** `Content-Type: application/json`
* **Cuerpo de petición (Login y Registro):** `{"username": "string", "password": "string"}`
* **Respuesta exitosa (Login):** `{"token": "string", "user": {"id": 1, "username": "admin", "nombre": "Usuario Prueba"}}`
* **Respuesta exitosa (Registro en modo mock):** `{"ok": true, "username": "nuevo_usuario"}`
* **Respuesta de error:** `{"message": "Credenciales inválidas."}`
* **Códigos HTTP esperados:** `200` (inicio de sesión o registro correcto), `400` (campos incompletos o formato inválido), `401` (usuario o contraseña incorrectos), `500` (error interno del servidor)
* **Modo mock y credenciales de prueba:** Con `USAR_MOCK = true` en `src/services/authService.ts` se simula la demora de red y se valida en memoria (sin persistencia en disco); la credencial base es usuario `admin` y contraseña `1234`, y también se aceptan los usuarios creados desde la pantalla de registro durante la sesión activa. Para pasar a backend real, cambiar `USAR_MOCK = false` y configurar `API_URL`.
# Deploy producción - Inversor (Guía detallada)

Esta guía muestra 3 caminos: **Render/Heroku**, **Docker Compose (self-host / VPS)** y **Docker + Let's Encrypt (nginx + certbot)**.

---

## A. Deploy rápido en Render (Backend + Web)
1. Crea dos servicios en Render:
   - **Backend** (Tipo: Web Service)
     - Branch: main
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
     - Env vars: `JWT_SECRET`, `ALPHAVANTAGE_KEY` (opcional), `FINNHUB_KEY` (opcional), `DATABASE_URL` (si usas Postgres externo)
   - **Web** (Tipo: Static Site)
     - Build Command: `cd web && npm install && npm run build`
     - Publish Directory: `web/dist`
2. Si prefieres Postgres maneja un servicio aparte (p. ej. Render PostgreSQL) y pon `DATABASE_URL` en Backend.

## B. Deploy en Heroku
1. **Backend**:
   - Crea una app Node en Heroku.
   - Sube el contenido de `backend` como la app principal (o configura monorepo buildpack).
   - Configura variables de entorno (JWT_SECRET, etc).
   - Si quieres Postgres: añade Heroku Postgres y pon la URL en `DATABASE_URL`.
2. **Web**:
   - Puedes usar Heroku static buildpack o desplegar en Netlify / Vercel con `web/dist`.

## C. Docker Compose - VPS / Máquina propia
1. Copia el repositorio al servidor.
2. Edita `.env` o `docker-compose.yml` si deseas cambiar credenciales.
3. Ejecuta:
   ```bash
   docker-compose up --build -d
   ```
   Servicios:
   - `postgres` (si lo tienes)
   - `backend` (Node)
   - `web` (nginx sirviendo la build)
   - `nginx` (reverse proxy en el puerto 80)
4. Verifica logs:
   ```bash
   docker-compose logs -f backend
   docker-compose logs -f nginx
   ```

## D. HTTPS / Let's Encrypt (nginx + certbot)
Para emitir certificados Let's Encrypt en un VPS, una aproximación común:
1. Instala Certbot y solicita certificados para tu dominio (ejemplo para nginx):
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
   ```
2. Asegúrate de que `nginx` en Docker tenga acceso al directorio `/etc/letsencrypt` o emite certificados en host y monta los archivos al contenedor.
3. Alternativa: usa el contenedor `certbot/certbot` y un volumen compartido con nginx, o usa servicios como **nginx-proxy + acme-companion** para automatizar la emisión.

## E. Notas y recomendaciones
- Para producción, **Postgres** es recomendado en vez de SQLite.
- Asegura tu `JWT_SECRET` y claves de API en variables de entorno (no en repositorio).
- Habilita backup de la base de datos.
- Revisa límites de llamadas a las APIs de precios (AlphaVantage / Finnhub) y cachea resultados (ya implementado con 5 minutos por ticker).
- Considera añadir autenticación de 2FA o bloqueo por intentos de login para producción.

---

¿Quieres que prepare scripts para:
- Crear imágenes Docker optimizadas para producción (multi-stage, slim)?
- Configurar `nginx-proxy` + `letsencrypt-nginx-proxy-companion` para emitir certificados automáticamente?
- Preparar un `terraform` simple para crear una VM y desplegar con Docker Compose?

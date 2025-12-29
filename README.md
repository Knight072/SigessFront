# SIGESS Front (Angular)

Frontend de **SIGESS** construido con **Angular (standalone components)**. Consume la API (Jersey/Grizzly) publicada normalmente en `http://localhost:8080/api`.

---

## Requisitos

- Node.js (recomendado LTS)
- npm
- Angular CLI (opcional, pero útil)

> Si tu proyecto está usando **Angular 17+ / 18+ / 19+ / 20+ / 21+** con Vite, `ng` ya gestiona el bundling.

---

## Instalación

```bash
npm install
```

---

## Variables de entorno / configuración

Revisa el archivo de entorno que estés usando en tu proyecto. En tu código aparece:

```ts
import { environment } from '../../../enviroments/environment';
```

Asegúrate de que exista esa ruta (nota: **enviroments** vs **environments**).

Ejemplo típico de `environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

> Si cambias el host/puerto del backend, ajusta `apiBaseUrl`.

---

## Correr en desarrollo

```bash
npm start
# o
ng serve
```

Abrirá:

- `http://localhost:4200/`

---

## Build (producción)

```bash
npm run build
```

Esto genera un `dist/<nombre-app>/`.

Si el proyecto tiene SSR/Prerender habilitado, el build puede fallar si tienes rutas paramétricas (por ejemplo `incidents/:id`) en modo prerender sin `getPrerenderParams`.

### Si te falla por prerender params (rutas con `:id`)
Opciones comunes:

1) Cambiar el `renderMode` de esa ruta a `Client` (o deshabilitar prerender para rutas paramétricas), o  
2) Implementar `getPrerenderParams` para devolver una lista de ids.

---

## Estilos globales (styles.scss)

El proyecto usa SCSS global en:

- `src/styles.scss`

### Si no se aplican los estilos

1) Confirma que en `angular.json` esté referenciado:
```json
"styles": ["src/styles.scss"]
```

2) Verifica en DevTools (Network) que cargue el archivo `styles-*.css`.

3) Si cambiaste `angular.json`, reinicia el servidor (`Ctrl + C` y `npm start`).

---

## Login, token y SSR

Si tu app usa SSR o prerender, **no puedes acceder a `localStorage` en el servidor**.

Síntoma típico:
- `ReferenceError: localStorage is not defined`

### Solución recomendada
En tu `TokenStorageService`, protege el acceso a `localStorage` así:

- Verifica si estás en browser (`typeof window !== 'undefined'`) antes de leer/escribir.
- O usa `isPlatformBrowser` (Angular) para una verificación más formal.

> Si el token queda `undefined`, el interceptor enviará `Authorization: Bearer undefined` y el backend puede responder 401/500 según tu implementación.

---

## CORS (backend)

Si el login funciona en Postman pero no desde el navegador, normalmente es CORS (preflight OPTIONS).

Asegúrate que el backend responda:
- `Access-Control-Allow-Origin: http://localhost:4200`
- `Access-Control-Allow-Headers: Authorization, Content-Type, ...`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`

---

## Estructura (rutas principales)

- `/login`
- `/incidents`
- `/incidents/:id`
- `/incidents/new`
- `/reports/top-areas`
- `/reports/critical-by-week`

---

## Troubleshooting rápido

### 1) “No me lista incidentes y se queda cargando”
Revisa en Network:
- ¿La llamada a `/api/incidents` está devolviendo 200?
- ¿El header `Authorization` llega bien?
- ¿Tu `apiBaseUrl` está correcto?

### 2) “Me logueé como supervisor pero aparece ANALISTA”
Revisa el contenido guardado en storage:
- `sigess_user`
- `sigess_token`

Y que `saveUser(res.user)` esté guardando el `role` real que devuelve el backend.

### 3) “El backend no devolvió token”
Imprime en consola el response real del login para confirmar que `accessToken` y `user` existan:
```ts
tap((res) => console.log('LOGIN RES', res))
```

---

## Scripts útiles

```bash
npm start        # dev server
npm run build    # build producción
```

---

## Notas

- Si estás sirviendo el frontend como estático desde el backend (carpeta `static/`), el build debe copiar el contenido correcto y el servidor debe servir `index.html` para rutas SPA.
- Para SSR/prerender, revisa configuración del server Angular y/o renderMode por ruta.


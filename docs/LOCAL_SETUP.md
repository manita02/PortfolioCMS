# Guía paso a paso — probar en local

Esta guía deja el portfolio + admin funcionando en tu máquina con **Supabase Cloud** (no hace falta Docker).

---

## Requisitos

- Node.js 20+ (tenés v24 ✓)
- Cuenta en [supabase.com](https://supabase.com)
- Editor de texto para `.env.local`

---

## Paso 1 — Preparar el proyecto en tu PC

En PowerShell, desde la carpeta del repo:

```powershell
cd C:\Users\aniiii\Desktop\portfolioCMS
npm install
npm run setup
```

Eso asegura dependencias y crea `.env.local` si no existía.

---

## Paso 2 — Crear proyecto en Supabase

1. Entrá a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → elegí nombre, contraseña de DB y región
3. Esperá a que el proyecto quede **Active**

---

## Paso 3 — Copiar claves a `.env.local`

En el dashboard: **Project Settings → API**

Completá en `.env.local`:

| Variable | Dónde sacarla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` |
| `ADMIN_EMAIL` | El email con el que vas a iniciar sesión |
| `NEXT_PUBLIC_ADMIN_EMAIL` | **El mismo** email |
| `NEXT_PUBLIC_SITE_URL` | Dejá `http://localhost:3000` |

Ejemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
ADMIN_EMAIL=tu@email.com
NEXT_PUBLIC_ADMIN_EMAIL=tu@email.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Guardá el archivo.

---

## Paso 4 — Aplicar schema (migraciones)

En Supabase: **SQL Editor → New query**

Ejecutá **en este orden**, pegando el contenido completo de cada archivo (Run en cada uno):

1. `supabase/migrations/0001_init_schema.sql`
2. `supabase/migrations/0002_rls_policies.sql`
3. `supabase/migrations/0003_storage_buckets.sql`
4. `supabase/migrations/0004_indexes.sql`

Si todo sale bien, no debería haber errores rojos.

---

## Paso 5 — Cargar datos de demo (seed)

En el mismo SQL Editor:

5. Pegá y ejecutá `supabase/seed.sql`

Vas a ver persona, orgs, skills, experiencias, proyectos, etc. de ejemplo.

---

## Paso 6 — Crear el usuario admin

1. Dashboard → **Authentication → Providers → Email**  
   - Desactivá **Enable email confirmations** (más fácil en local)  
   - Desactivá signups públicos si querés (opcional)
2. **Authentication → Users → Add user**  
   - Email = el de `.env.local`  
   - Password = la que quieras  
   - Marcá **Auto Confirm User**
3. Copiá el **User UID** del usuario creado
4. SQL Editor → abrí `supabase/setup_admin.sql`, reemplazá UUID y email, y ejecutá

---

## Paso 7 — Arrancar la app

```powershell
cd C:\Users\aniiii\Desktop\portfolioCMS
npm run dev
```

Abrí en el navegador:

| Qué | URL |
|---|---|
| Portfolio | http://localhost:3000 |
| Admin login | http://localhost:3000/admin/login |
| Admin hub | http://localhost:3000/admin |

Login admin: el email/password del Paso 6.

---

## Checklist rápido “¿ya funciona?”

- [ ] Home `/` muestra nombre / título del seed (o empty states)
- [ ] `/proyectos` lista proyectos de demo
- [ ] `/admin/login` acepta tu usuario
- [ ] `/admin` muestra el Welcome Hub
- [ ] Podés editar Persona y ver el cambio en el portfolio

---

## Problemas comunes

| Síntoma | Qué revisar |
|---|---|
| Páginas vacías / errores de fetch | URL y anon key en `.env.local` (reiniciá `npm run dev`) |
| Login OK pero te echa del admin | Email en `admins` ≠ `ADMIN_EMAIL` / `NEXT_PUBLIC_ADMIN_EMAIL` |
| No podés subir imágenes | Migración `0003` (buckets + policies) |
| Error SQL al migrar | Ejecutá de nuevo desde `0001` en un proyecto limpio |
| Puerto 3000 ocupado | `npm run dev -- -p 3001` y actualizá `NEXT_PUBLIC_SITE_URL` |

---

## Modo producción local (opcional)

```powershell
npm run build
npm run start
```

Misma URL: http://localhost:3000

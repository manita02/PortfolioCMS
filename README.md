# Portfolio personal + CMS Admin

Portfolio público en **Español** con panel de administración para **un único administrador**. No es un CMS multi-tenant ni un producto SaaS. El contenido se gestiona 100% desde Supabase.

## Descripción

Sitio profesional con:

- Portfolio público (hero, about, skills, experiencia, educación, proyectos, CV)
- Panel `/admin` con Welcome Hub y CRUD tipado (RHF + Zod)
- Preview del sitio sin iframe (reutiliza componentes públicos)
- Auth Supabase + tabla `admins` + email admin en variables de entorno

## Arquitectura

```
src/
  app/                  # App Router (público + admin)
  components/           # UI compartida (layout, shared, seo, shadcn)
  features/             # Dominios (home, projects, admin, …)
  services/             # Consultas Supabase + mappers
  lib/                  # Supabase clients, SEO helpers
  providers/            # Theme + toast + tooltip
  constants/            # Enums / buckets
  types/                # Tipos de dominio
  config/               # siteConfig
supabase/
  migrations/           # Schema + RLS + Storage
  seed.sql
```

- **Server Components** por defecto en rutas públicas.
- **Server Actions** solo en el CMS (`src/features/admin/actions`).
- **Client Components** para formularios, navegación interactiva y motion.
- RLS en Supabase: lectura pública de contenido; escritura solo admin autenticado.
- Idioma único: Español (sin i18n ni tablas de traducción).

## Tecnologías

| Área | Stack |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui (Base UI), Framer Motion |
| Forms | React Hook Form, Zod, `@hookform/resolvers` |
| Backend | Supabase (Postgres, Auth, Storage, RLS) |
| PDF CV | `@react-pdf/renderer` |
| Hosting | Vercel + Supabase |

## Instalación / probar en local

Guía completa: **[docs/LOCAL_SETUP.md](./docs/LOCAL_SETUP.md)**

```bash
npm install
npm run setup
# Completar .env.local + migraciones Supabase (0001 → 0005)
npm run dev
```

- Público: http://localhost:3000
- Admin: http://localhost:3000/admin

## Variables de entorno

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (cliente + servidor con RLS) |
| `ADMIN_EMAIL` | Email del admin (validación server-side) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Email del admin (chequeo en login client) |
| `NEXT_PUBLIC_SITE_URL` | URL canónica (SEO, sitemap, OG) |

No uses `SUPABASE_SERVICE_ROLE_KEY` en esta app.

## Supabase

1. Crear proyecto en Supabase.
2. Ejecutar migraciones en orden: `0001` → `0005`.
3. Ejecutar `supabase/seed.sql` (opcional / demo).
4. Auth → desactivar signups públicos.
5. Crear usuario admin y registrarlo con `supabase/setup_admin.sql`.

### Buckets Storage

| Bucket | Uso |
|---|---|
| `person` | avatar, banner |
| `projects` | covers |
| `organizations` | logos |
| `educations` | imagen / PDF de título |
| `icons` | iconos de skills |

### Dominio clave

- Textos de contenido en la entidad (sin tablas de traducción)
- Skills — catálogo + N:M
- `experience_types` — tipo de empleo (Jornada completa, Jornada parcial, Por cuenta propia, Autónomo, Contrato por servicio, Prácticas, Prácticas laborales, Trabajo de temporada)
- `experience_modalities` — modalidad (Presencial, Híbrido, Remoto)
- Fechas — `start_month/year` + `end_month/year`
- Proyectos — slug único; sin draft/status

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Deploy (Vercel)

1. Importar el repositorio en Vercel.
2. Configurar variables de entorno.
3. `NEXT_PUBLIC_SITE_URL` = dominio definitivo.
4. Verificar `/`, `/robots.txt`, `/sitemap.xml` y `/admin`.

## Checklist de producción

Ver [docs/PRODUCTION_CHECKLIST.md](./docs/PRODUCTION_CHECKLIST.md).

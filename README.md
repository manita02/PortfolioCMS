# PortfolioCMS

<p align="center">
  <img src="assets/screenshots/portfolioCMS.png" alt="PortfolioCMS preview" width="720" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

Portfolio público con panel de administración para **un único administrador**. El contenido se gestiona desde Supabase (Postgres, Auth, Storage y RLS).

---

## Índice

- [Acerca del proyecto](#acerca-del-proyecto)
- [Programas y software requerido](#programas-y-software-requerido)
- [Preparar el ambiente (paso a paso)](#preparar-el-ambiente-paso-a-paso)
- [Base de datos: correr migraciones](#base-de-datos-correr-migraciones)
- [Compilar proyecto localmente](#compilar-proyecto-localmente)
- [Funcionalidades](#funcionalidades)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Sitio web online](#sitio-web-online)
- [Capturas](#capturas)
- [Autor](#autor)

---

## Acerca del proyecto

**PortfolioCMS** es un portfolio profesional personal con CMS integrado. No es un producto multi-tenant ni un SaaS: un solo admin gestiona todo el contenido.

Incluye:

- Portfolio público (hero, sobre mí, habilidades, experiencia, educación, proyectos y CV)
- Panel `/admin` con Welcome Hub y CRUD tipado (React Hook Form + Zod)
- Preview del sitio reutilizando los mismos componentes públicos
- Autenticación con Supabase + tabla `admins` + email admin en variables de entorno
- Skills destacadas para el Hero, agrupadas por tipo y ordenadas alfabéticamente
- Descarga de CV en PDF (`@react-pdf/renderer`)

---

## Programas y software requerido

| Software | Versión / notas |
|---|---|
| [Node.js](https://nodejs.org/) | 20 o superior (recomendado LTS / 22+) |
| npm | Incluido con Node.js |
| Cuenta en [Supabase](https://supabase.com) | Proyecto cloud (no hace falta Docker) |
| Editor de texto | Para editar `.env.local` (VS Code, Cursor, etc.) |
| Git | Para clonar el repositorio |

---

## Preparar el ambiente (paso a paso)

### 1. Clonar e instalar

```bash
git clone https://github.com/manita02/PortfolioCMS.git
cd PortfolioCMS
npm install
npm run setup
```

`npm run setup` crea `.env.local` desde `.env.example` si aún no existe.

### 2. Crear proyecto en Supabase

1. Entrá a [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → nombre, contraseña de DB y región
3. Esperá a que el proyecto quede **Active**

### 3. Completar variables de entorno

En el dashboard: **Project Settings → API**

Editá `.env.local`:

| Variable | Dónde sacarla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / `public` |
| `ADMIN_EMAIL` | Email con el que vas a iniciar sesión |
| `NEXT_PUBLIC_ADMIN_EMAIL` | **El mismo** email |
| `NEXT_PUBLIC_SITE_URL` | En local: `http://localhost:3000` |

Ejemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
ADMIN_EMAIL=tu@email.com
NEXT_PUBLIC_ADMIN_EMAIL=tu@email.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> No uses `SUPABASE_SERVICE_ROLE_KEY` en esta app. Toda la autorización pasa por RLS + email admin.

### 4. Crear el usuario admin

1. Dashboard → **Authentication → Providers → Email**
   - Desactivá **Enable email confirmations** (más fácil en local)
   - Opcional: desactivar signups públicos
2. **Authentication → Users → Add user**
   - Email = el de `.env.local`
   - Password = la que quieras
   - Marcá **Auto Confirm User**
3. Copiá el **User UID**
4. En SQL Editor, abrí `supabase/setup_admin.sql`, reemplazá UUID y email, y ejecutá

---

## Base de datos: correr migraciones

En Supabase: **SQL Editor → New query**

Ejecutá **en este orden**, pegando el contenido completo de cada archivo (Run en cada uno):

1. `supabase/migrations/0001_init_schema.sql`
2. `supabase/migrations/0002_rls_policies.sql`
3. `supabase/migrations/0003_storage_buckets.sql`
4. `supabase/migrations/0004_indexes.sql`

Si todo sale bien, no debería haber errores.

### Seed (datos de demo, opcional)

En el mismo SQL Editor, ejecutá `supabase/seed.sql`.

Vas a ver persona, organizaciones, skills, experiencias y proyectos de ejemplo.

---

## Compilar proyecto localmente

### Modo desarrollo

```bash
npm run dev
```

Abrí el portfolio en: http://localhost:3000

### Modo producción local

```bash
npm run build
npm run start
```

Misma URL: http://localhost:3000

---

## Funcionalidades

### Portfolio público

- Hero con nombre, título, subtítulo y skills **destacadas**
- Sección Sobre mí + redes sociales
- Habilidades agrupadas por tipo (orden alfabético por nombre)
- Experiencia laboral y educación
- Listado y detalle de proyectos con filtro por skill
- CV web y descarga en PDF
- SEO básico (metadata, sitemap, robots, JSON-LD)

### Panel de administración (`/admin`)

- Login seguro (solo el email admin autorizado)
- Welcome Hub con acceso a cada módulo
- CRUD de: Persona, Organizaciones, Habilidades, Experiencias, Educación, Proyectos, Redes sociales
- Checkbox **Destacada** en habilidades (aparecen en el Hero)
- Carga de medios a Supabase Storage
- Preview del portfolio con los componentes reales

---

## Tecnologías utilizadas

<p align="center">
  <table>
    <tr>
      <td align="center" width="120">
        <img src="assets/tech/nextjs.svg" width="48" height="48" alt="Next.js" /><br />
        <b>Next.js 15</b>
      </td>
      <td align="center" width="120">
        <img src="assets/tech/react.svg" width="48" height="48" alt="React" /><br />
        <b>React 19</b>
      </td>
      <td align="center" width="120">
        <img src="assets/tech/typescript.svg" width="48" height="48" alt="TypeScript" /><br />
        <b>TypeScript</b>
      </td>
      <td align="center" width="120">
        <img src="assets/tech/tailwindcss.svg" width="48" height="48" alt="Tailwind CSS" /><br />
        <b>Tailwind CSS 4</b>
      </td>
    </tr>
    <tr>
      <td align="center" width="120">
        <img src="assets/tech/supabase.svg" width="48" height="48" alt="Supabase" /><br />
        <b>Supabase</b>
      </td>
      <td align="center" width="120">
        <img src="assets/tech/postgresql.svg" width="48" height="48" alt="PostgreSQL" /><br />
        <b>PostgreSQL</b>
      </td>
      <td align="center" width="120">
        <img src="assets/tech/nodejs.svg" width="48" height="48" alt="Node.js" /><br />
        <b>Node.js</b>
      </td>
      <td align="center" width="120">
        <img src="assets/tech/shadcnui.svg" width="48" height="48" alt="shadcn/ui" /><br />
        <b>shadcn/ui</b>
      </td>
    </tr>
    <tr>
      <td align="center" width="120">
        <img src="assets/tech/zod.svg" width="48" height="48" alt="Zod" /><br />
        <b>Zod</b>
      </td>
      <td align="center" width="120">
        <img src="assets/tech/react-hook-form.svg" width="48" height="48" alt="React Hook Form" /><br />
        <b>React Hook Form</b>
      </td>
      <td align="center" width="120">
        <img src="assets/tech/framer-motion.svg" width="48" height="48" alt="Framer Motion" /><br />
        <b>Framer Motion</b>
      </td>
      <td align="center" width="120">
        <!-- celda vacía para mantener la grilla -->
      </td>
    </tr>
  </table>
</p>

También: `@react-pdf/renderer` (CV PDF), Base UI, Sonner (toasts), next-themes.

---

## Sitio web online

[Visitar sitio](https://portfolio-cms-mocha.vercel.app)

---

## Capturas

### Portfolio

<img src="assets/screenshots/portfolioCMS.png" alt="Portfolio" width="720" />

### Vista mobile

<img src="assets/screenshots/mobile.png" alt="Mobile" width="280" />

### Panel admin

<img src="assets/screenshots/admin.png" alt="Admin" width="720" />


---

## Autor

| [<img src="https://i.pinimg.com/736x/ef/65/0e/ef650e4cf5bdd6bc1d40b600e5df87e3.jpg" width=115><br><sub>Ana Lucia Juarez</sub>](https://github.com/manita02) |
| :---: |

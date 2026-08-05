import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envExample = resolve(root, ".env.example");
const envLocal = resolve(root, ".env.local");

if (!existsSync(envLocal)) {
  copyFileSync(envExample, envLocal);
  console.log("✓ Creado .env.local desde .env.example");
} else {
  console.log("✓ .env.local ya existe");
}

if (!existsSync(resolve(root, "node_modules"))) {
  console.log("→ Ejecutá: npm install");
} else {
  console.log("✓ Dependencias instaladas (node_modules)");
}

console.log(`
══════════════════════════════════════════════
 Setup local listo — siguientes pasos
══════════════════════════════════════════════

1) Completá .env.local con URL y anon key de Supabase
2) Aplicá migraciones + seed (ver docs/LOCAL_SETUP.md)
3) Creá usuario admin y ejecutá supabase/setup_admin.sql
4) npm run dev
5) Abrí http://localhost:3000  y  http://localhost:3000/admin

Guía completa: docs/LOCAL_SETUP.md
`);

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getSafeLoginErrorMessage,
  isAdminLoginPath,
  isAdminPath,
  isAllowedAdminEmail,
  isSafeStorageFolder,
  resolveAdminAccess,
} from "./admin-policy.ts";

describe("resolveAdminAccess", () => {
  it("anónimo → unauthenticated", () => {
    assert.equal(
      resolveAdminAccess({
        hasUser: false,
        userEmail: null,
        adminEmail: "admin@example.com",
      }),
      "unauthenticated",
    );
  });

  it("autenticado no admin → forbidden", () => {
    assert.equal(
      resolveAdminAccess({
        hasUser: true,
        userEmail: "otro@example.com",
        adminEmail: "admin@example.com",
      }),
      "forbidden",
    );
  });

  it("admin autorizado → ok", () => {
    assert.equal(
      resolveAdminAccess({
        hasUser: true,
        userEmail: "Admin@Example.com",
        adminEmail: "admin@example.com",
      }),
      "ok",
    );
  });

  it("sin ADMIN_EMAIL → forbidden aunque haya sesión", () => {
    assert.equal(
      resolveAdminAccess({
        hasUser: true,
        userEmail: "admin@example.com",
        adminEmail: undefined,
      }),
      "forbidden",
    );
  });
});

describe("isAllowedAdminEmail", () => {
  it("compara case-insensitive", () => {
    assert.equal(
      isAllowedAdminEmail("Admin@Example.com", "admin@example.com"),
      true,
    );
  });

  it("rechaza emails distintos", () => {
    assert.equal(
      isAllowedAdminEmail("a@example.com", "b@example.com"),
      false,
    );
  });
});

describe("rutas admin", () => {
  it("detecta login y CMS", () => {
    assert.equal(isAdminLoginPath("/admin/login"), true);
    assert.equal(isAdminLoginPath("/admin/proyectos"), false);
    assert.equal(isAdminPath("/admin"), true);
    assert.equal(isAdminPath("/admin/proyectos"), true);
    assert.equal(isAdminPath("/proyectos"), false);
  });
});

describe("getSafeLoginErrorMessage", () => {
  it("no revela detalles de credenciales", () => {
    const msg = getSafeLoginErrorMessage({
      message: "Invalid login credentials",
      status: 400,
    });
    assert.match(msg, /credenciales/i);
    assert.doesNotMatch(msg, /invalid login/i);
  });

  it("mensajes de rate limit son genéricos", () => {
    const msg = getSafeLoginErrorMessage({
      message: "Request rate limit reached",
      status: 429,
    });
    assert.match(msg, /demasiados intentos/i);
  });

  it("no expone JWT / api key", () => {
    const msg = getSafeLoginErrorMessage({
      message: "Invalid API key",
      status: 401,
    });
    assert.doesNotMatch(msg, /api key/i);
    assert.doesNotMatch(msg, /jwt/i);
  });
});

describe("isSafeStorageFolder", () => {
  it("acepta carpetas simples", () => {
    assert.equal(isSafeStorageFolder("uploads"), true);
    assert.equal(isSafeStorageFolder("avatar/covers"), true);
  });

  it("rechaza path traversal", () => {
    assert.equal(isSafeStorageFolder("../secret"), false);
    assert.equal(isSafeStorageFolder("/absolute"), false);
    assert.equal(isSafeStorageFolder("a//b"), false);
  });
});

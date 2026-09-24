# Prototype — idioma, CTAs, login/signup y contacto por perfil

Reutiliza tokens y tipografía del portal (`src/styles/global.css`: violeta, peach, Arial). Descartable: el Builder implementa desde estas capturas, no desde este HTML.

## Screenshots

- `screenshots/01-header-home-es.png` — Cabecera con Login, Registrarse (primario), Contactanos (secundario) y desplegable de idioma cerrado (ES activo).
- `screenshots/02-header-lang-open.png` — Mismo patrón con `<details>` abierto: Español, English, Português.
- `screenshots/03-hero-cta-band-es.png` — Héroe y banda de cierre con Registrarse + Contactanos (sin “Probar las APIs” como CTA principal del héroe).
- `screenshots/04-signup-es.png` — Panel signup: tarjeta centrada, logo, email/contraseña, enlace a login y privacidad (UI sin backend).
- `screenshots/05-login-es.png` — Panel login en español, patrón tipo auth0.com.
- `screenshots/06-contact-profile-step.png` — `/contact/` con paso obligatorio: Desarrollador, Empresa, Telco; formulario bloqueado hasta elegir.
- `screenshots/07-contact-company-industry.png` — Perfil Empresa con selector de rubro (9 opciones incl. Otro) y formulario de APIs.
- `screenshots/08-contact-telco.png` — Perfil Telco preseleccionado, copy orientado a demo de plataforma.
- `screenshots/09-login-en.png` — Login en inglés (paridad de cabecera/auth en EN).
- `screenshots/10-header-mobile-360.png` — Cabecera a 360px: CTAs alcanzables, sin menú hamburguesa.

## Flow

1. Visitante elige idioma en cabecera (pie del sitio real sigue enlaces planos; no prototipado aquí).
2. **Registrarse** / **Login** → rutas futuras `/{lang}/app/signup/` y `/{lang}/app/login/` (formularios inertes en producción).
3. **Contactanos** → un solo formulario: primero perfil; Empresa muestra rubro; luego campos existentes según perfil.

## Copy clave (ES)

- CTAs cabecera: Login, Registrarse, Contactanos.
- Perfiles: Desarrollador (APIs), Empresa + rubro (APIs), Telco (plataforma Open Gateway).
- Auth: “Crear tu cuenta” / “Iniciar sesión” — sin mencionar prototipo ni vista previa (decisión humana D1).

## Pregunta abierta para el humano

¿El botón secundario **Contactanos** debe ir a `/contact/` sin query o preferís un modal intermedio que pregunte el perfil antes de navegar? El prototipo asume navegación directa a la página de contacto unificada.

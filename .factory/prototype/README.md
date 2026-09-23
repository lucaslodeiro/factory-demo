# Prototype — language selector, header CTAs, auth preview, contact chooser

Disposable prototype for issue "Selector de idioma, CTAs de registro y contacto, login y contacto por perfil". Built as static HTML reusing the real `src/styles/global.css` tokens (copied into `assets/`) plus a small `assets/prototype.css` for the new classes (`.lang-switch`, `.nav-actions`, `.auth-card`, `.chooser-grid`). The Builder implements the real markup/CSS from these screenshots and this note — none of this HTML ships.

## Screenshots

1. `01-header-desktop.png` — Home page (es), 1440px. New header: globe-icon "Español" dropdown (closed) replacing the flat ES/EN/PT links, followed by Login (text link) → Contáctanos (outline button) → Registrarse (primary button), replacing the old single "Probar las APIs" nav CTA. Hero body CTAs are untouched.
2. `02-header-lang-open.png` — Same page, dropdown open: Español / English / Português, each shown in its own language, with Español marked active (purple background + bold, matching `aria-current`).
3. `03-header-mobile-360.png` — Same header at 360px: everything wraps onto its own row (logo → nav links → language control → the three CTAs), nothing overlaps or clips. This is the layout the Builder should treat as the floor for AC-12.
4. `04-signup.png` — `/signup/` default state: "Vista previa" badge, name/company/email/password fields, primary "Crear cuenta" button, link to login.
5. `05-signup-preview.png` — Same screen after filling every field (including a password) and submitting: no navigation happens, a purple-bordered banner appears ("Esto es una vista previa. Ningún dato se envió ni se guardó — incluida la contraseña."). Confirms AC-6 — verified in this run with the browser's network tab equivalent (Playwright route interception aborting any non-origin request; no `fetch` exists in the page's script at all).
6. `06-login.png` — `/login/` default state: email/password, "Iniciar sesión" button, link to signup. Same preview-banner behavior as signup (not screenshotted twice — identical pattern).
7. `07-contact-chooser.png` — `/contact/` chooser: two profile cards ("Busco APIs para mi producto" / "Soy un operador y quiero la plataforma"), each captioned with the existing, unmodified destination (`/contact/apis/`, `/contact/demo/`). No form fields appear on this page itself.

## Flow

Header → visitor picks a language (dropdown, same path/new locale) or one of Login / Contáctanos / Registrarse.
- **Registrarse / Login** → preview-only `/signup/` ⇄ `/login/`, cross-linked, never call `fetch`, never log the password.
- **Contáctanos** → `/contact/` chooser → existing `/contact/apis/` or `/contact/demo/` form (unchanged).

## Copy used (es; en/pt are the Builder's direct translations into `src/data/i18n.ts`)

- Language control: `Español`, `English`, `Português` (own-language names, not translated per active locale).
- Header: `Login`, `Contáctanos`, `Registrarse`.
- Signup: "Vista previa", "Creá tu cuenta", "Vas a poder gestionar tu acceso a las APIs y a la plataforma para operadores desde un mismo panel. Esta pantalla es una vista previa: no crea cuentas ni envía datos a ningún servidor.", "Crear cuenta", "¿Ya tenés una cuenta? Iniciar sesión".
- Login: "Iniciá sesión", "Accedé al futuro panel de control para gestionar tu cuenta. Esta pantalla es una vista previa: no inicia sesión ni envía datos a ningún servidor.", "Iniciar sesión", "¿Todavía no tenés una cuenta? Registrarse".
- Preview banner (both screens): "Esto es una vista previa. Ningún dato se envió ni se guardó — incluida la contraseña. El panel de clientes todavía no existe."
- Contact chooser: "¿En qué podemos ayudarte?", "Contanos quién sos para llevarte directo al formulario que corresponde a tu caso.", card eyebrows "EMPRESAS Y DESARROLLADORES" / "OPERADORES DE TELECOMUNICACIONES", titles "Busco APIs para mi producto" / "Soy un operador y quiero la plataforma".

## Open UX questions for the human

- The signup/login preview banner replaces the form in place rather than navigating anywhere or showing a modal — is a static in-page confirmation the right level of "honesty" here, or would you rather the button stay disabled/labeled "Vista previa" so it's clearer before the click that nothing will happen?
- The contact chooser cards show the literal destination path (`→ /es/contact/apis/ (formulario existente, sin cambios)`) as a small caption — useful for this review, but should the shipped version drop that caption (visitors don't need the URL) or keep a short trust line instead?
- Header CTA order follows the brief's Login → Contáctanos → Registrarse; at 950–1100px the language control and the three CTAs wrap to their own row below the main nav (see AC-12) — confirm that's an acceptable trade-off versus, e.g., collapsing the main nav links first.

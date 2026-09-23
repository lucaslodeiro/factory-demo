# Prototipo UX — cabecera, contacto por perfil y pantallas de acceso

## Capturas

- `screenshots/01-home-desktop.png` — Portada en español con la cabecera nueva (Registrarse, Contactanos, Login, desplegable de idioma).
- `screenshots/02-language-open.png` — Misma portada con el desplegable de idioma abierto (Español / English / Português).
- `screenshots/03-home-mobile.png` — Portada a 360×640: marca, titular, bajada y CTAs del héroe siguen en el primer pantallazo.
- `screenshots/04-contact-chooser.png` — Página `contact/`: dos tarjetas de perfil antes del formulario existente.
- `screenshots/05-signup.png` — Prototipo de registro con aviso, campos y desvío para operadores.
- `screenshots/06-login.png` — Prototipo de acceso con aviso y recuperación de contraseña inactiva.

## Flujo

1. Desde cualquier página del sitio, la cabecera ofrece idioma (mundito), **Registrarse** (melocotón), **Contactanos** (contorno) e **Iniciar sesión** (texto).
2. **Contactanos** lleva al selector de perfil; cada tarjeta abre el formulario que ya existe (APIs o demo).
3. **Registrarse** / **Iniciar sesión** abren chrome reducido tipo dashboard, sin enviar datos.

## Copia usada

- CTAs de cabecera: Registrarse, Contactanos, Iniciar sesión.
- Aviso de prototipo: «Vista previa del futuro panel de control: todavía no se crea/accede a ninguna cuenta y nada de lo que escribas se envía a ningún lado.»
- Selector de contacto: reutiliza audiencias «empresas y desarrolladores» vs «operadores de telecomunicaciones».

## Pregunta abierta para vos

¿El orden visual auth0 (idioma → registro → login → contacto) te convence en móvil, o preferís **Contactanos** antes de **Iniciar sesión** en la segunda fila de la cabecera?

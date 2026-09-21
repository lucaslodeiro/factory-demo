import { defineConfig } from 'astro/config';
export default defineConfig({site:'https://openxpand.com', trailingSlash:'always', output:'static', vite:{build:{assetsInlineLimit:0}}});

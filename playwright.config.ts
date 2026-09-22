import {defineConfig} from '@playwright/test';
// Keep 4321 as the default and let PORT move the whole suite when that port belongs to another checkout.
export const origin=`http://127.0.0.1:${process.env.PORT||4321}`;
export default defineConfig({testDir:'./tests/browser',use:{baseURL:origin,headless:true},webServer:{command:'npm run test:server',url:`${origin}/es/`,reuseExistingServer:!process.env.CI},reporter:'list',workers:2});

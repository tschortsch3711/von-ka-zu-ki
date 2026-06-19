import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages: site + base muessen exakt zur Repo-URL passen.
// Ohne korrektes base brechen alle internen Links und Assets unter dem Unterpfad.
export default defineConfig({
  site: 'https://tschortsch3711.github.io',
  base: '/von-ka-zu-ki',
  integrations: [react()],
});

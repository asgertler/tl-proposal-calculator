import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('VITE build command:', command)
  console.log('VITE build mode:', mode)
  return {
    plugins: [react()],
    base: mode === 'production' ? '/tl-proposal-calculator/' : '/',
  }
})
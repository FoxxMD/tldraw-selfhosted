import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
	plugins: [react({ tsDecorators: true })],
	root: path.join(__dirname, 'src/client'),
	publicDir: path.join(__dirname, 'public'),
	server: {
		port: 5757,
		allowedHosts: [process.env.ALLOWED_HOSTED ?? '*']
	},
	optimizeDeps: {
		exclude: ['@tldraw/assets'],
	},
	build: {
    emptyOutDir: true,
    // Forces Vite to use a top-level dist folder,
    // outside the project root defined above
    outDir: path.join(__dirname, 'dist', 'client'),
  },
}))

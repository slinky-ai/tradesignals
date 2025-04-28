
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import strip from '@rollup/plugin-strip';


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isLocal = env.VITE_APP_ENV === "local";

  return {
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    ...(mode === 'development' ? [componentTagger()] : []),
    ...(!isLocal ? [strip({
      include: ['**/*.ts', '**/*.tsx'],
      functions: ['console.*', 'assert.*', 'debug'],
    })] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, 
    minify: 'esbuild',
    target: 'es2015', 
  },
}});

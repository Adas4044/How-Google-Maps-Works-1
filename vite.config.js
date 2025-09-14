import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // Optimize for production
        minify: 'terser',
        sourcemap: false,
        rollupOptions: {
            output: {
                // Manual chunk splitting for better caching
                manualChunks: {
                    'vendor': ['react', 'react-dom'],
                    'mui': ['@mui/material', '@mui/icons-material'],
                    'deck': ['deck.gl', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/geo-layers'],
                    'map': ['maplibre-gl', 'react-map-gl']
                }
            }
        }
    },
    // Optimize dev server
    server: {
        host: true
    }
});

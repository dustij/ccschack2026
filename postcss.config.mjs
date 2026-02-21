// Next.js requires a `plugins` key in PostCSS config.
// Vite uses @tailwindcss/vite instead, but Next.js needs the PostCSS plugin.
export default {
    plugins: {
        '@tailwindcss/postcss': {},
    },
}


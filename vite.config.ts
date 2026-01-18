import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'

const htmlFiles = readdirSync('.').filter(file => file.endsWith('.html'))
const input = Object.fromEntries(
    htmlFiles.map(file => [file.replace('.html', ''), resolve(__dirname, file)])
)

export default defineConfig({
    build: {
        rollupOptions: {
            input
        }
    }
})
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import React from 'react'
import { rolldown } from 'rolldown'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const args = process.argv.slice(2)
const jsonPath = args[0] || 'C:/Users/armaa/Downloads/rhrs.json'
const outPath = args[1] || 'C:/Users/armaa/Downloads/appointment-sample.pdf'

const buildDir = path.join(here, '.build')
const bundleFile = path.join(buildDir, 'appointment.bundle.mjs')
fs.mkdirSync(buildDir, { recursive: true })

const bundle = await rolldown({
  input: path.join(here, '_appointment-entry.jsx'),
  platform: 'node',
  transform: { jsx: 'react-jsx' },
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', '@react-pdf/renderer'],
})
await bundle.write({ format: 'esm', file: bundleFile })
await bundle.close()

const mod = await import(`${pathToFileURL(bundleFile).href}?v=${Date.now()}`)
const { default: AppointmentLetterPDF, buildAppointmentJson } = mod
const { renderToBuffer, Font } = await import('@react-pdf/renderer')

Font.register({
  family: 'NotoDeva',
  fonts: [
    { src: path.join(root, 'public/fonts/NotoSansDevanagari-Regular.ttf'), fontWeight: 400 },
    { src: path.join(root, 'public/fonts/NotoSansDevanagari-Bold.ttf'), fontWeight: 700 },
  ],
})

const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const data = buildAppointmentJson(raw)
const bgImage = `data:image/png;base64,${fs
  .readFileSync(path.join(root, 'public/letter_head.png'))
  .toString('base64')}`

const element = React.createElement(AppointmentLetterPDF, { data, bgImage })
const buffer = await renderToBuffer(element)
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, buffer)
console.log(`wrote ${outPath} (${buffer.length} bytes)`)

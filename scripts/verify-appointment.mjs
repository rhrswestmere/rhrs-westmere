import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import React from 'react'
import { rolldown } from 'rolldown'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const outDir = 'C:/Users/armaa/AppData/Local/Temp/opencode/verify'
const pdfPath = path.join(outDir, 'appointment.pdf')
const expectedPath = path.join(outDir, 'expected.json')

const buildDir = path.join(here, '.build')
const bundleFile = path.join(buildDir, 'appointment.bundle.mjs')
fs.mkdirSync(buildDir, { recursive: true })
fs.mkdirSync(outDir, { recursive: true })

const bundle = await rolldown({
  input: path.join(here, '_appointment-entry.jsx'),
  platform: 'node',
  transform: { jsx: 'react-jsx' },
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', '@react-pdf/renderer'],
})
await bundle.write({ format: 'esm', file: bundleFile })
await bundle.close()

const mod = await import(`${pathToFileURL(bundleFile).href}?v=${Date.now()}`)
const {
  default: AppointmentLetterPDF,
  fmtAppointmentTime,
  fmtAppointmentDate,
} = mod
const { renderToBuffer, Font } = await import('@react-pdf/renderer')

Font.register({
  family: 'NotoDeva',
  fonts: [
    { src: path.join(root, 'public/fonts/NotoSansDevanagari-Regular.ttf'), fontWeight: 400 },
    { src: path.join(root, 'public/fonts/NotoSansDevanagari-Bold.ttf'), fontWeight: 700 },
  ],
})

// Exactly the row shape POST /api/appointments returns (appointments table).
const row = {
  id: '00000000-0000-0000-0000-000000000000',
  appointment_no: 'RHRS-APT-2026-0042',
  full_name: 'WESTMERE TEST',
  designation: 'Membership Enquiry',
  from_date: '2026-09-10',
  duration: '10:00',
  created_at: '2026-09-26T10:15:00.000Z',
}

// What the admin panel (RecordsView) prints for the same row.
const expected = {
  appointment_no: row.appointment_no,
  full_name: row.full_name,
  purpose: row.designation,
  appointment_date: fmtAppointmentDate(row.from_date),
  appointment_time: fmtAppointmentTime(row.duration),
  issue_date: fmtAppointmentDate(row.created_at.split('T')[0]),
  panel_time: fmtAppointmentTime(row.duration),
}

const bgImage = `data:image/png;base64,${fs
  .readFileSync(path.join(root, 'public/letter_head.png'))
  .toString('base64')}`

const buffer = await renderToBuffer(
  React.createElement(AppointmentLetterPDF, { data: row, bgImage }),
)
fs.writeFileSync(pdfPath, buffer)
fs.writeFileSync(expectedPath, JSON.stringify(expected, null, 2))
console.log(`wrote ${pdfPath} (${buffer.length} bytes)`)
console.log(JSON.stringify(expected, null, 2))

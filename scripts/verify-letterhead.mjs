import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import React from 'react'
import { rolldown } from 'rolldown'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const outDir = 'C:/Users/armaa/AppData/Local/Temp/opencode/verify'

const buildDir = path.join(here, '.build')
const bundleFile = path.join(buildDir, 'letterhead.bundle.mjs')
fs.mkdirSync(buildDir, { recursive: true })
fs.mkdirSync(outDir, { recursive: true })

const bundle = await rolldown({
  input: path.join(here, '_letterhead-entry.jsx'),
  platform: 'node',
  transform: { jsx: 'react-jsx' },
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', '@react-pdf/renderer'],
})
await bundle.write({ format: 'esm', file: bundleFile })
await bundle.close()

const mod = await import(`${pathToFileURL(bundleFile).href}?v=${Date.now()}`)
const { AppointmentLetterPDF, PaymentSlipPDF, DonationReportPDF } = mod
const { renderToBuffer, Font } = await import('@react-pdf/renderer')

Font.register({
  family: 'NotoDeva',
  fonts: [
    { src: path.join(root, 'public/fonts/NotoSansDevanagari-Regular.ttf'), fontWeight: 400 },
    { src: path.join(root, 'public/fonts/NotoSansDevanagari-Bold.ttf'), fontWeight: 700 },
  ],
})

const bgImage = `data:image/png;base64,${fs
  .readFileSync(path.join(root, 'public/letter_head.png'))
  .toString('base64')}`

const appointmentRow = {
  id: '00000000-0000-0000-0000-000000000000',
  appointment_no: 'RHRS-APT-2026-0042',
  full_name: 'WESTMERE TEST',
  designation: 'Membership Enquiry',
  from_date: '2026-09-10',
  duration: '10:00',
  created_at: '2026-09-26T10:15:00.000Z',
}

const slip = {
  receipt_no: 'RHRS-RCPT-2026-0042',
  donor_name: 'TEST DONOR',
  donation_type: 'General Donation',
  amount: 5100,
  payment_mode: 'UPI',
  txn_ref: 'UPI1122334455',
}

const report = {
  from: '2026-09-01',
  to: '2026-09-30',
  total: 3,
  summary: { totalAmount: 11100 },
  rows: [
    { id: '1', receipt_no: 'RHRS-RCPT-001', donor_name: 'TEST DONOR A', donation_type: 'General', amount: 5100, payment_mode: 'UPI', created_at: '2026-09-05' },
    { id: '2', receipt_no: 'RHRS-RCPT-002', donor_name: 'TEST DONOR B', donation_type: 'Temple', amount: 2500, payment_mode: 'Cash', created_at: '2026-09-12' },
    { id: '3', receipt_no: 'RHRS-RCPT-003', donor_name: 'TEST DONOR C', donation_type: 'General', amount: 3500, payment_mode: 'Bank', created_at: '2026-09-21' },
  ],
}

const docs = [
  ['appointment', AppointmentLetterPDF, appointmentRow],
  ['payment-slip', PaymentSlipPDF, slip],
  ['donation-report', DonationReportPDF, report],
]

for (const [name, Component, data] of docs) {
  const buffer = await renderToBuffer(React.createElement(Component, { data, bgImage }))
  const file = path.join(outDir, `${name}.pdf`)
  fs.writeFileSync(file, buffer)
  console.log(`wrote ${file} (${buffer.length} bytes)`)
}

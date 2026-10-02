import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import React from 'react'
import { rolldown } from 'rolldown'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const outDir = 'C:/Users/armaa/AppData/Local/Temp/opencode/verify'
const pdfPath = path.join(outDir, 'idcard.pdf')

const buildDir = path.join(here, '.build')
const bundleFile = path.join(buildDir, 'idcard.bundle.mjs')
fs.mkdirSync(buildDir, { recursive: true })
fs.mkdirSync(outDir, { recursive: true })

const bundle = await rolldown({
  input: path.join(here, '_idcard-entry.jsx'),
  platform: 'node',
  transform: { jsx: 'react-jsx' },
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', '@react-pdf/renderer'],
})
await bundle.write({ format: 'esm', file: bundleFile })
await bundle.close()

const mod = await import(`${pathToFileURL(bundleFile).href}?v=${Date.now()}`)
const { default: IdCardPDF, buildCardData, validUpto, buildVerificationUrl } = mod
const { renderToBuffer, Font } = await import('@react-pdf/renderer')

// Same registration pdfUrl() does in the browser (src/pdfs/fonts.js), but with
// a file path since node resolves src from disk.
Font.register({
  family: 'CardValue',
  fonts: [{ src: path.join(root, 'public/fonts/Inter-Black.ttf'), fontWeight: 900 }],
})

const dataUri = (file) =>
  `data:image/png;base64,${fs.readFileSync(path.join(root, 'public', file)).toString('base64')}`

// Long-ish values to exercise fitValueFontSize shrink on every row.
const member = {
  name: 'ARMAAN ADEEL KHAN SHERWANI',
  designation: 'DISTRICT PRESIDENT (WEST MUMBAI)',
  mobile: '+91 98765 43210',
  blood_group: 'O+',
  issue_date: '2026-10-01',
  member_id: 'RHRS-M-2026-0042',
}
const data = buildCardData(member)
data.valid_upto = validUpto(member.issue_date)
data.verification_url = buildVerificationUrl(member.member_id)
const photoPath = path.join(outDir, 'member-photo.png')
if (fs.existsSync(photoPath)) {
  data.photo = `data:image/png;base64,${fs.readFileSync(photoPath).toString('base64')}`
}

const assets = { front: dataUri('id-front.png'), back: dataUri('id-back.png') }

const buffer = await renderToBuffer(React.createElement(IdCardPDF, { data, assets }))
fs.writeFileSync(pdfPath, buffer)
console.log(`wrote ${pdfPath} (${buffer.length} bytes)`)
console.log(JSON.stringify({ ...data, photo: data.photo ? '<data-uri>' : null }, null, 2))

/*
 * Geometry for the appointment confirmation letter.
 *
 * Every raw number in this file was measured directly off the reference
 * appointment PDF, rendered at 1190 x 1671 px (= A4 page x 2). Coordinates are
 * top-left origin, in that canvas' px. X()/Y()/S() convert canvas px -> A4
 * points (pt), so the layout reproduces the reference at any page size while
 * the letterhead keeps filling the whole page.
 *
 * Change a value here only when the reference itself changes.
 */

export const CANVAS = { w: 1190, h: 1671 }
export const PAGE = { w: 595.28, h: 841.89 } // A4 in pt
export const LETTERHEAD = { w: 1414, h: 2000 } // public/letter_head.png

const r2 = (n) => Math.round(n * 100) / 100
const SX = PAGE.w / CANVAS.w
const SY = PAGE.h / CANVAS.h

export const X = (px) => r2(px * SX)
export const Y = (px) => r2(px * SY)
export const S = (px) => r2(px * SY)

export const COLORS = {
  title: '#C44B28',
  subtitle: '#1A1A1A',
  underline: '#C08A2A',
  boxBorder: '#E2DACC',
  boxAccent: '#DA3E0A',
  boxLabel: '#6D6561',
  boxValue: '#0C0B09',
  english: '#1A1916',
  hindi: '#303030',
  tableBorder: '#E9DECB',
  tableLabelBg: '#FAF7EF',
  tableLabel: '#3B3B38',
  tableValue: '#151515',
  instructions: '#74736B',
  signLine: '#2D2A1E',
  signDesignation: '#0C0B09',
  signOrg: '#514E43',
}

/* Measured flow (canvas px). Sections stack from `top`; gaps are the vertical
 * distances between them. Everything below is derived, so longer text simply
 * pushes later sections down until `flowLimit` is hit. */
export const FLOW = {
  content: { left: 135, width: 919, textLeft: 141, textWidth: 907 },
  top: 502,

  title: { h: 40, size: 32, lh: 1.25, tracking: 1.4 },
  subtitle: { h: 36, size: 21, lh: 1.71, gapBefore: 0 },

  underline: { h: 12, w: 132, stroke: 2.6, gapBefore: 7, gapAfter: 12 },

  box: {
    h: 65,
    gapBefore: 0,
    accent: 10,
    radius: 6,
    borderWidth: 1.6,
    padLeft: 29,
    label: { size: 15, tracking: 1, gap: 4 },
    value: { size: 19 },
    rightColLeft: 859, // canvas x of the right-hand block
  },

  english: { size: 18.5, lh: 1.57, gapBefore: 23, gapAfter: 7 },
  hindi: { size: 17, lh: 1.53, gapAfter: 24 },

  table: {
    gapBefore: 0,
    left: 139,
    width: 910,
    rowH: 43.4,
    colLabel: 251,
    padX: 21,
    radius: 5,
    borderWidth: 1.6,
    label: { size: 16.5, tracking: 0.6 },
    value: { size: 18 },
    gapAfter: 11,
  },

  instructions: { size: 13, lh: 1.85, gapAfter: 0 },

  signature: {
    line: { x: 704, y: 1208, w: 345, stroke: 2.6 },
    designation: { x: 670, y: 1214, w: 335, h: 28, size: 17 },
    org: { x: 670, y: 1242, w: 335, h: 30, size: 16 },
  },

  // Flow must end above the signature block.
  flowLimit: 1178,
}

/* --- text helpers -------------------------------------------------------- */

const wrapLines = (text, fontSize, width, ratio) => {
  const charW = fontSize * ratio
  const max = Math.max(1, Math.floor(width / charW))
  let lines = 1
  let used = 0
  for (const word of String(text || '').split(/\s+/)) {
    if (!word) continue
    const len = word.length
    if (used === 0) used = len
    else if (used + 1 + len <= max) used += 1 + len
    else {
      lines += 1
      used = len
    }
  }
  return lines
}

// Bold spans are only styling: the words come from the JSON untouched.
export const richSegments = (text, values = []) => {
  const src = String(text || '')
  if (!src) return []
  const pending = values.filter((v) => v != null && v !== '').map(String)
  const out = []
  let rest = src
  while (rest) {
    let idx = -1
    let hit = ''
    for (const v of pending) {
      const i = rest.indexOf(v)
      if (i >= 0 && (idx === -1 || i < idx)) {
        idx = i
        hit = v
      }
    }
    if (idx === -1) {
      out.push({ text: rest, bold: false })
      break
    }
    if (idx > 0) out.push({ text: rest.slice(0, idx), bold: false })
    out.push({ text: hit, bold: true })
    rest = rest.slice(idx + hit.length)
  }
  return out
}

/* --- layout -------------------------------------------------------------- */

const attemptLayout = (doc, tableRows, scale) => {
  const F = FLOW
  const s = (n) => n * scale
  const cw = F.content
  const T = F.table
  const pos = {}
  let y = F.top

  pos.title = { top: y, h: F.title.h, size: s(F.title.size) }
  y += F.title.h

  pos.subtitle = { top: y + s(F.subtitle.gapBefore), h: F.subtitle.h, size: s(F.subtitle.size) }
  y = pos.subtitle.top + F.subtitle.h

  pos.underline = { top: y + s(F.underline.gapBefore), h: F.underline.h, w: F.underline.w }
  y = pos.underline.top + F.underline.h + s(F.underline.gapAfter)

  const engSize = s(F.english.size)
  const engLh = engSize * F.english.lh
  const engLines = wrapLines(doc.confirmation_text.english, engSize, cw.textWidth, 0.5) || 1

  const boxH = F.box.h
  pos.box = { top: y, h: boxH }
  y += boxH + s(F.english.gapBefore)

  pos.english = { top: y, h: engLines * engLh, size: engSize, lh: engLh, lines: engLines }
  y = pos.english.top + pos.english.h + s(F.english.gapAfter)

  const hinSize = s(F.hindi.size)
  const hinLh = hinSize * F.hindi.lh
  const hinLines = wrapLines(doc.confirmation_text.hindi, hinSize, cw.textWidth, 0.5) || 1
  pos.hindi = { top: y, h: hinLines * hinLh, size: hinSize, lh: hinLh, lines: hinLines }
  y = pos.hindi.top + pos.hindi.h + s(F.hindi.gapAfter)

  const labelSize = s(F.table.label.size)
  const valueSize = s(F.table.value.size)
  const labelColW = T.colLabel - T.padX - 8
  const valueColW = T.width - T.colLabel - T.padX - 10
  const rows = tableRows.map((row) => {
    const lines = Math.max(
      wrapLines(row.label, labelSize, labelColW, 0.52),
      wrapLines(row.value, valueSize, valueColW, 0.5),
    )
    return { ...row, lines, h: Math.max(s(T.rowH), lines * valueSize * 1.35 + 14) }
  })
  const tableH = rows.reduce((sum, row) => sum + row.h, 0)
  pos.table = { top: y, h: tableH, rows: rows.map((row) => row.h), labelSize, valueSize }
  y = pos.table.top + pos.table.h + s(F.table.gapAfter)

  const insSize = s(F.instructions.size)
  const insLh = insSize * F.instructions.lh
  const insLines = wrapLines(doc.instructions.text, insSize, cw.textWidth, 0.5) || 1
  pos.instructions = { top: y, h: insLines * insLh, size: insSize, lh: insLh, lines: insLines }
  y += pos.instructions.h

  pos.flowBottom = y
  return pos
}

export const tableRowsOf = (doc) =>
  (doc.appointment_details_table || []).map((r) => ({ label: r.label, value: r.value }))

/**
 * Positions every section. When the text is longer than the reference sample
 * the flow shrinks (font sizes, in steps) until it fits above the signature.
 * Nothing is ever allowed to cross `flowLimit`.
 */
export const computeLayout = (doc) => {
  const tableRows = tableRowsOf(doc)
  // Start at 0.97: at exactly 1.0 react-pdf drops the details-table text (the
  // row text is never written to the PDF), so the reference size is skipped.
  const scales = [0.97, 0.94, 0.91, 0.88, 0.85, 0.82]
  let chosen = null
  for (const scale of scales) {
    const pos = attemptLayout(doc, tableRows, scale)
    if (pos.flowBottom <= FLOW.flowLimit) {
      chosen = pos
      break
    }
    chosen = pos
  }
  return {
    ...chosen,
    tableRows,
    overflow: chosen.flowBottom > FLOW.flowLimit,
    titleSize: chosen.title.size,
    subtitleSize: chosen.subtitle.size,
  }
}

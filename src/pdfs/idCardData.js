import coords from './RRHRS_CLIENT_FINAL_TEMPLATE_COORDINATES.json'

const REF = coords.coordinate_system
const FRONT_REF = REF.front_reference_size

export const PAGE_W_MM = 85
export const PAGE_H_MM = 55

export const P = (mm) => Number((mm * 2.834645669).toFixed(2))

// Reference-image px -> PDF pt. Single place where scaling lives (JSON is the
// single source of truth for geometry — no coordinates anywhere else).
export const fx = (x) => P((x / FRONT_REF.width) * PAGE_W_MM)
export const fy = (y) => P((y / FRONT_REF.height) * PAGE_H_MM)
export const fw = (w) => P((w / FRONT_REF.width) * PAGE_W_MM)
export const fh = (h) => P((h / FRONT_REF.height) * PAGE_H_MM)

// DD/MM/YYYY, exactly one calendar year after issue_date (not +365 days).
export function validUpto(issueDate) {
  if (!issueDate) return ''
  const d = new Date(issueDate)
  if (Number.isNaN(d.getTime())) return ''
  const out = new Date(d.getTime())
  const wasLeapDay = d.getMonth() === 1 && d.getDate() === 29
  out.setFullYear(out.getFullYear() + 1)
  // 29 Feb + 1 year -> non-leap year rolls to 1 Mar; clamp back to 28 Feb so
  // validity never exceeds one calendar year.
  if (wasLeapDay && (out.getMonth() !== 1 || out.getDate() !== 29)) {
    out.setFullYear(out.getFullYear(), 1, 28)
  }
  const dd = String(out.getDate()).padStart(2, '0')
  const mm = String(out.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${out.getFullYear()}`
}

export function buildVerificationUrl(memberId) {
  if (!memberId) return ''
  return `https://rhrs.co.in/verify?memberId=${encodeURIComponent(memberId)}`
}

// Map a raw member record (API response / admin row) onto the card fields the
// generator accepts. Accepts both raw and already-normalised shapes.
export function buildCardData(member = {}) {
  return {
    name: member.name || member.full_name || '',
    designation: member.designation || member.designation_title || 'ACTIVE MEMBER',
    mobile: member.mobile || member.emergency_contact || '',
    blood_group: member.blood_group || '',
    photo: member.photo || member.photo_url || null,
    issue_date: member.issue_date || member.created_at || null,
    valid_upto: member.valid_upto || validUpto(member.issue_date || member.created_at),
    verification_url: member.verification_url || buildVerificationUrl(member.member_id),
  }
}

// Font size for a value line: the largest size at which the text still fits
// the rect width, so geometry stays JSON-driven. `charWidth` is the average
// glyph advance as a fraction of the font size (Helvetica ~0.55, Inter Black
// ~0.65) — pass a higher value for heavier faces so they shrink before
// overflowing the rectangle.
export function fitValueFontSize(text, rectWidthPt, base = 6, charWidth = 0.55) {
  const len = String(text || '').length
  if (!len) return base
  const fitted = rectWidthPt / (charWidth * len)
  const floor = Math.max(base - 2, 4)
  return Number(Math.min(base, Math.max(floor, fitted)).toFixed(2))
}

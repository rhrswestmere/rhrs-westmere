import { useMemo } from 'react'
import { Page, View, Document, Svg, Rect, Image, Text } from '@react-pdf/renderer'
import qrcode from 'qrcode-generator'

/*
  Design canvas: 768 × 1024
  PDF page:      148mm × 210mm (A5)
  actualX = (x / 768) * 148
  actualY = (y / 1024) * 210
*/

const P = (mm) => Number((mm * 2.834645669).toFixed(2))
const px = (x) => P((x / 768) * 148)
const py = (y) => P((y / 1024) * 210)
const pw = (w) => P((w / 768) * 148)
const ph = (h) => P((h / 1024) * 210)

const fmtDate = (iso) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '—' }
}

function QRBox({ value, size }) {
  const qr = useMemo(() => {
    const q = qrcode(0, 'M')
    q.addData(value)
    q.make()
    return q
  }, [value])
  const count = qr.getModuleCount()
  const cells = []
  for (let r = 0; r < count; r++)
    for (let c = 0; c < count; c++)
      if (qr.isDark(r, c)) cells.push({ x: c, y: r })
  return (
    <View style={{ width: size, height: size, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${count} ${count}`}>
        {cells.map((cell, i) => (
          <Rect key={i} x={cell.x} y={cell.y} width={1} height={1} fill="#1A1100" />
        ))}
      </Svg>
    </View>
  )
}

/* ── Shared value column layout ──
   All 5 dynamic values share the same X, width, and styling.
   Positioned AFTER the ":" with consistent padding. */

// X position: colon is ~x:275, add ~16px padding → x:340
const VAL_X = 340
// Width: from x:340 to ~x:500 (before QR area at x:563)
const VAL_W = 155
// Shared row height
const ROW_H = 26

// Y top-edges: shifted UP ~15px from line center so text sits above the line
const ROW_Y = {
  name: 655,
  designation: 691,
  memberId: 727,
  bloodGroup: 763,
  mobile: 799,
}

const nameFontSize = (name) => {
  if (!name) return 10
  const l = name.length
  if (l <= 14) return 10
  if (l <= 18) return 9
  if (l <= 22) return 8
  return 7
}

const valFontSize = (v) => {
  if (!v) return 8.5
  const l = String(v).length
  if (l <= 14) return 8.5
  if (l <= 20) return 8
  return 7
}

// Shared value container style — text sits at TOP, line is below as underline
const valueContainer = {
  position: 'absolute',
  left: px(VAL_X),
  width: pw(VAL_W),
  height: ph(ROW_H),
  justifyContent: 'flex-start',
  paddingBottom: ph(8),
}

// Shared value text style
const valueText = {
  fontWeight: 'bold',
  color: '#2B2113',
  lineHeight: 1,
}

export default function IdCardPDF({ data }) {
  const memberId = data?.member_id || '—'
  const fullName = data?.full_name || '—'
  const mobile = data?.emergency_contact || '—'
  const photo = data?.photo || null
  const verifyUrl = `https://rhrsdemo2.vercel.app/verify/${memberId}`
  const desig = data?.designation_title || 'ACTIVE MEMBER'
  const blood = data?.blood_group || '—'
  const validDate = fmtDate(data?.created_at)

  return (
    <Document>
      {/* ══════════ FRONT ══════════ */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-front.png" style={bg} />

          {/* Member photo */}
          {photo && (
            <Image src={photo} style={{
              position: 'absolute',
              left: px(277), top: py(443),
              width: pw(221), height: ph(198),
              objectFit: 'cover',
            }} />
          )}

          {/* ── Dynamic values: shared column layout ── */}

          {/* Name */}
          <View style={[valueContainer, { top: py(ROW_Y.name) }]}>
            <Text style={[valueText, { fontSize: nameFontSize(fullName) }]}>{fullName}</Text>
          </View>

          {/* Designation */}
          <View style={[valueContainer, { top: py(ROW_Y.designation) }]}>
            <Text style={[valueText, { fontSize: valFontSize(desig) }]}>{desig}</Text>
          </View>

          {/* Member ID */}
          <View style={[valueContainer, { top: py(ROW_Y.memberId) }]}>
            <Text style={[valueText, { fontFamily: 'Courier', fontSize: 8.5, letterSpacing: 0.8 }]}>{memberId}</Text>
          </View>

          {/* Blood Group */}
          <View style={[valueContainer, { top: py(ROW_Y.bloodGroup) }]}>
            <Text style={[valueText, { fontSize: valFontSize(blood) }]}>{blood}</Text>
          </View>

          {/* Mobile */}
          <View style={[valueContainer, { top: py(ROW_Y.mobile) }]}>
            <Text style={[valueText, { fontFamily: 'Courier', fontSize: 8.5, letterSpacing: 0.8 }]}>{mobile}</Text>
          </View>

          {/* QR Code */}
          <View style={{ position: 'absolute', left: px(563), top: py(670), width: pw(154), height: ph(148), alignItems: 'center', justifyContent: 'center' }}>
            <QRBox value={verifyUrl} size={pw(130)} />
          </View>

          {/* Valid Upto date */}
          <View style={{ position: 'absolute', left: px(115), top: py(895), width: pw(150), height: ph(42), alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: 8, textAlign: 'center' }}>{validDate}</Text>
          </View>
        </View>
      </Page>

      {/* ══════════ BACK ══════════ */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-back.png" style={bg} />

          {/* ── Emergency Contact Section ── */}

          {/* Member name — sits ABOVE the underline, next to phone icon */}
          <View style={{ position: 'absolute', left: px(105), top: py(792), width: pw(150), height: ph(22), justifyContent: 'flex-start' }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: nameFontSize(fullName), lineHeight: 1 }}>{fullName}</Text>
          </View>

          {/* Emergency contact number — sits BELOW the underline */}
          <View style={{ position: 'absolute', left: px(105), top: py(822), width: pw(150), height: ph(20), justifyContent: 'flex-start' }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: 8.5, letterSpacing: 0.5 }}>{mobile}</Text>
          </View>

          {/* ── QR Code in the empty gold-bordered square ── */}
          <View style={{ position: 'absolute', left: px(275), top: py(743), width: pw(76), height: ph(78), alignItems: 'center', justifyContent: 'center' }}>
            <QRBox value={verifyUrl} size={pw(64)} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

const pg = { fontFamily: 'Helvetica', backgroundColor: '#FBF6EC' }
const root = { width: P(148), height: P(210), position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', left: 0, top: 0, width: P(148), height: P(210), objectFit: 'fill' }

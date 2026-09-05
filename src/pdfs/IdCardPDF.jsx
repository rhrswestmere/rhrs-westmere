import { useMemo } from 'react'
import { Page, View, Document, Svg, Rect, Image, Text } from '@react-pdf/renderer'
import qrcode from 'qrcode-generator'

/*
  FRONT canvas: 527 × 697 px → PDF page: 148mm × 210mm (A5)
  BACK  canvas: 531 × 695 px → PDF page: 148mm × 210mm (A5)
*/

const P = (mm) => Number((mm * 2.834645669).toFixed(2))

const frontPx = (x) => P((x / 527) * 148)
const frontPy = (y) => P((y / 697) * 210)
const frontPw = (w) => P((w / 527) * 148)
const frontPh = (h) => P((h / 697) * 210)

const backPx = (x) => P((x / 531) * 148)
const backPy = (y) => P((y / 695) * 210)
const backPw = (w) => P((w / 531) * 148)
const backPh = (h) => P((h / 695) * 210)

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

const nameFontSize = (name) => {
  if (!name) return 8
  const l = name.length
  if (l <= 12) return 8
  if (l <= 16) return 7
  if (l <= 20) return 6
  return 5.5
}

const valFontSize = (v) => {
  if (!v) return 7
  const l = String(v).length
  if (l <= 12) return 7
  if (l <= 16) return 6.5
  return 6
}

export default function IdCardPDF({ data }) {
  const memberId = data?.member_id || '---'
  const fullName = data?.full_name || '---'
  const mobile = data?.emergency_contact || '---'
  const photo = data?.photo || null
  const desig = data?.designation_title || 'ACTIVE MEMBER'
  const blood = data?.blood_group || '---'

  const qrData = JSON.stringify({
    name: fullName,
    designation: desig,
    memberId,
    bloodGroup: blood,
    mobile,
  })

  return (
    <Document>
      {/* FRONT — 527 × 697 */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-front.png" style={bg} />

          {/* Member Photo — x:181 y:314 w:139 h:130 */}
          {photo && (
            <Image src={photo} style={{
              position: 'absolute',
              left: frontPx(181), top: frontPy(314),
              width: frontPw(139), height: frontPh(130),
              objectFit: 'cover',
            }} />
          )}

          {/* Name — x:225 y:451 w:110 h:17 (above underline at y:469) */}
          <View style={{ position: 'absolute', left: frontPx(225), top: frontPy(451), width: frontPw(110), height: frontPh(17), justifyContent: 'flex-end', paddingBottom: frontPh(1) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: nameFontSize(fullName), lineHeight: 1 }}>{fullName}</Text>
          </View>

          {/* Designation — x:225 y:473 w:110 h:17 (above underline at y:491) */}
          <View style={{ position: 'absolute', left: frontPx(225), top: frontPy(473), width: frontPw(110), height: frontPh(17), justifyContent: 'flex-end', paddingBottom: frontPh(1) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: valFontSize(desig), lineHeight: 1 }}>{desig}</Text>
          </View>

          {/* Member ID — x:225 y:494 w:110 h:17 (above underline at y:512) */}
          <View style={{ position: 'absolute', left: frontPx(225), top: frontPy(494), width: frontPw(110), height: frontPh(17), justifyContent: 'flex-end', paddingBottom: frontPh(1) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontFamily: 'Courier', fontSize: 6.5, letterSpacing: 0.3, lineHeight: 1 }}>{memberId}</Text>
          </View>

          {/* Blood Group — x:225 y:516 w:110 h:17 (above underline at y:534) */}
          <View style={{ position: 'absolute', left: frontPx(225), top: frontPy(516), width: frontPw(110), height: frontPh(17), justifyContent: 'flex-end', paddingBottom: frontPh(1) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: valFontSize(blood), lineHeight: 1 }}>{blood}</Text>
          </View>

          {/* Mobile — x:225 y:538 w:110 h:17 (above underline at y:556) */}
          <View style={{ position: 'absolute', left: frontPx(225), top: frontPy(538), width: frontPw(110), height: frontPh(17), justifyContent: 'flex-end', paddingBottom: frontPh(1) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontFamily: 'Courier', fontSize: 6.5, letterSpacing: 0.3, lineHeight: 1 }}>{mobile}</Text>
          </View>

          {/* QR Code — x:388 y:461 w:96 h:96 */}
          <View style={{ position: 'absolute', left: frontPx(388), top: frontPy(461), width: frontPw(96), height: frontPh(96), alignItems: 'center', justifyContent: 'center' }}>
            <QRBox value={qrData} size={frontPw(96)} />
          </View>
        </View>
      </Page>

      {/* BACK — 531 × 695 */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-back.png" style={bg} />

          {/* QR Code — x:191 y:508 w:59 h:59 */}
          <View style={{ position: 'absolute', left: backPx(191), top: backPy(508), width: backPw(59), height: backPh(59), alignItems: 'center', justifyContent: 'center' }}>
            <QRBox value={qrData} size={backPw(59)} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

const pg = { fontFamily: 'Helvetica', backgroundColor: '#FBF6EC' }
const root = { width: P(148), height: P(210), position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', left: 0, top: 0, width: P(148), height: P(210), objectFit: 'fill' }

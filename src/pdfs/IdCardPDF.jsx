import { useMemo } from 'react'
import { Page, View, Document, Svg, Rect, Image, Text } from '@react-pdf/renderer'
import qrcode from 'qrcode-generator'

/*
  FRONT canvas: 520 × 741 px → PDF page: 148mm × 210mm (A5)
  BACK  canvas: 531 × 695 px → PDF page: 148mm × 210mm (A5)
*/

const P = (mm) => Number((mm * 2.834645669).toFixed(2))

const fp = (x) => P((x / 520) * 148)
const fy = (y) => P((y / 741) * 210)
const fw = (w) => P((w / 520) * 148)
const fh = (h) => P((h / 741) * 210)

const bx = (x) => P((x / 531) * 148)
const by = (y) => P((y / 695) * 210)
const bw = (w) => P((w / 531) * 148)
const bh = (h) => P((h / 695) * 210)

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

const fmtValidUpto = (iso) => {
  if (!iso) return '---'
  try {
    const d = new Date(iso)
    d.setFullYear(d.getFullYear() + 1)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return '---' }
}

export default function IdCardPDF({ data }) {
  const memberId = data?.member_id || '---'
  const fullName = data?.full_name || '---'
  const mobile = data?.emergency_contact || '---'
  const photo = data?.photo || null
  const desig = data?.designation_title || 'ACTIVE MEMBER'
  const blood = data?.blood_group || '---'
  const validDate = fmtValidUpto(data?.created_at)

  const qrData = JSON.stringify({
    name: fullName,
    designation: desig,
    memberId,
    bloodGroup: blood,
    mobile,
  })

  return (
    <Document>
      {/* FRONT — 520 × 741 */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-front.png" style={bg} />

          {/* Member Photo — x:184 y:314 w:162 h:145 */}
          {photo && (
            <Image src={photo} style={{
              position: 'absolute',
              left: fp(184), top: fy(314),
              width: fw(162), height: fh(145),
              objectFit: 'cover',
            }} />
          )}

          {/* Name — x:224 y:472 w:111 h:17 */}
          <View style={{ position: 'absolute', left: fp(224), top: fy(472), width: fw(111), height: fh(17), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ fontWeight: '600', color: '#2B2113', fontSize: 8.5, lineHeight: 1 }}>{fullName}</Text>
          </View>

          {/* Designation — x:224 y:500 w:111 h:17 */}
          <View style={{ position: 'absolute', left: fp(224), top: fy(500), width: fw(111), height: fh(17), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ fontWeight: '600', color: '#2B2113', fontSize: desig.length > 14 ? 7 : 8.5, lineHeight: 1 }}>{desig}</Text>
          </View>

          {/* Member ID — x:224 y:529 w:111 h:17 */}
          <View style={{ position: 'absolute', left: fp(224), top: fy(529), width: fw(111), height: fh(17), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ fontWeight: '600', color: '#2B2113', fontFamily: 'Courier', fontSize: 8.5, letterSpacing: 0.3, lineHeight: 1 }}>{memberId}</Text>
          </View>

          {/* Blood Group — x:224 y:557 w:111 h:17 */}
          <View style={{ position: 'absolute', left: fp(224), top: fy(557), width: fw(111), height: fh(17), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ fontWeight: '600', color: '#2B2113', fontSize: 8.5, lineHeight: 1 }}>{blood}</Text>
          </View>

          {/* Mobile — x:224 y:586 w:111 h:17 */}
          <View style={{ position: 'absolute', left: fp(224), top: fy(586), width: fw(111), height: fh(17), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ fontWeight: '600', color: '#2B2113', fontFamily: 'Courier', fontSize: 8.5, letterSpacing: 0.3, lineHeight: 1 }}>{mobile}</Text>
          </View>

          {/* VALID UPTO — x:83 y:649 w:91 h:18 */}
          <View style={{ position: 'absolute', left: fp(83), top: fy(649), width: fw(91), height: fh(18), alignItems: 'center', justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ fontWeight: '600', color: '#2B2113', fontSize: 8, textAlign: 'center' }}>{validDate}</Text>
          </View>

          {/* FRONT QR = SAME as BACK QR — x:386 y:488 w:101 h:101 */}
          <View style={{ position: 'absolute', left: fp(386), top: fy(488), width: fw(101), height: fh(101), alignItems: 'center', justifyContent: 'center' }}>
            <QRBox value={qrData} size={fw(101)} />
          </View>
        </View>
      </Page>

      {/* BACK — 531 × 695 */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-back.png" style={bg} />

          {/* BACK QR — x:191 y:508 w:59 h:59 */}
          <View style={{ position: 'absolute', left: bx(191), top: by(508), width: bw(59), height: bh(59), alignItems: 'center', justifyContent: 'center' }}>
            <QRBox value={qrData} size={bw(59)} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

const pg = { fontFamily: 'Helvetica', backgroundColor: '#FBF6EC' }
const root = { width: P(148), height: P(210), position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', left: 0, top: 0, width: P(148), height: P(210), objectFit: 'fill' }

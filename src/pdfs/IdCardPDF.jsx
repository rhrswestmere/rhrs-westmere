import { useMemo } from 'react'
import { Page, View, Document, Svg, Rect, Image, Text } from '@react-pdf/renderer'
import qrcode from 'qrcode-generator'

/*
  FRONT canvas: 627 × 850 px → PDF page: 148mm × 210mm (A5)
  BACK  canvas: 531 × 695 px → PDF page: 148mm × 210mm (A5)
*/

const P = (mm) => Number((mm * 2.834645669).toFixed(2))

const fp = (x) => P((x / 627) * 148)
const fy = (y) => P((y / 850) * 210)
const fw = (w) => P((w / 627) * 148)
const fh = (h) => P((h / 850) * 210)

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

const fmtDate = (iso) => {
  if (!iso) return '---'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return '---' }
}

const fmtValidUpto = (iso) => {
  if (!iso) return '---'
  try {
    const d = new Date(iso)
    d.setFullYear(d.getFullYear() + 1)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return '---' }
}

const VAL_FONT = 9.5
const VAL_STYLE = { fontWeight: '600', color: '#2B2113', lineHeight: 1 }

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
      {/* FRONT — 627 × 850 */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-front.png" style={bg} />

          {/* Member Photo — x:220 y:389 w:164 h:151 */}
          {photo && (
            <Image src={photo} style={{
              position: 'absolute',
              left: fp(220), top: fy(389),
              width: fw(164), height: fh(151),
              objectFit: 'cover',
            }} />
          )}

          {/* Name — x:267 y:574 w:132 h:20 */}
          <View style={{ position: 'absolute', left: fp(267), top: fy(574), width: fw(132), height: fh(20), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ ...VAL_STYLE, fontSize: VAL_FONT }}>{fullName}</Text>
          </View>

          {/* Designation — x:267 y:603 w:132 h:20 */}
          <View style={{ position: 'absolute', left: fp(267), top: fy(603), width: fw(132), height: fh(20), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ ...VAL_STYLE, fontSize: VAL_FONT }}>{desig}</Text>
          </View>

          {/* Member ID — x:267 y:631 w:132 h:20 */}
          <View style={{ position: 'absolute', left: fp(267), top: fy(631), width: fw(132), height: fh(20), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ ...VAL_STYLE, fontSize: VAL_FONT, fontFamily: 'Courier', letterSpacing: 0.3 }}>{memberId}</Text>
          </View>

          {/* Blood Group — x:267 y:660 w:132 h:20 */}
          <View style={{ position: 'absolute', left: fp(267), top: fy(660), width: fw(132), height: fh(20), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ ...VAL_STYLE, fontSize: VAL_FONT }}>{blood}</Text>
          </View>

          {/* Mobile — x:267 y:689 w:132 h:20 */}
          <View style={{ position: 'absolute', left: fp(267), top: fy(689), width: fw(132), height: fh(20), justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ ...VAL_STYLE, fontSize: VAL_FONT, fontFamily: 'Courier', letterSpacing: 0.3 }}>{mobile}</Text>
          </View>

          {/* VALID UPTO date — x:101 y:791 w:125 h:20 */}
          <View style={{ position: 'absolute', left: fp(101), top: fy(791), width: fw(125), height: fh(20), alignItems: 'center', justifyContent: 'flex-end', paddingBottom: fh(1) }}>
            <Text style={{ ...VAL_STYLE, fontSize: VAL_FONT, textAlign: 'center' }}>{validDate}</Text>
          </View>
        </View>
      </Page>

      {/* BACK — 531 × 695 */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-back.png" style={bg} />

          {/* QR Code — x:191 y:508 w:59 h:59 */}
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

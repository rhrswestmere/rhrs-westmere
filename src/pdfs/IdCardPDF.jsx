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
  if (!iso) return '---'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '---' }
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

export default function IdCardPDF({ data }) {
  const memberId = data?.member_id || '---'
  const fullName = data?.full_name || '---'
  const mobile = data?.emergency_contact || '---'
  const photo = data?.photo || null
  const desig = data?.designation_title || 'ACTIVE MEMBER'
  const blood = data?.blood_group || '---'
  const validDate = fmtDate(data?.created_at)

  const qrData = JSON.stringify({
    name: fullName,
    designation: desig,
    memberId,
    bloodGroup: blood,
    mobile,
  })

  return (
    <Document>
      {/* FRONT */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-front.png" style={bg} />

          {/* Member photo */}
          {photo && (
            <Image src={photo} style={{
              position: 'absolute',
              left: px(265), top: py(310),
              width: pw(240), height: ph(175),
              objectFit: 'cover',
            }} />
          )}

          {/* Name */}
          <View style={{ position: 'absolute', left: px(135), top: py(510), width: pw(260), height: ph(30), justifyContent: 'flex-end', paddingBottom: ph(8) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: nameFontSize(fullName), lineHeight: 1 }}>{fullName}</Text>
          </View>

          {/* Designation */}
          <View style={{ position: 'absolute', left: px(135), top: py(548), width: pw(260), height: ph(30), justifyContent: 'flex-end', paddingBottom: ph(8) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: valFontSize(desig), lineHeight: 1 }}>{desig}</Text>
          </View>

          {/* Member ID */}
          <View style={{ position: 'absolute', left: px(135), top: py(586), width: pw(260), height: ph(30), justifyContent: 'flex-end', paddingBottom: ph(8) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontFamily: 'Courier', fontSize: 8.5, letterSpacing: 0.8, lineHeight: 1 }}>{memberId}</Text>
          </View>

          {/* Blood Group */}
          <View style={{ position: 'absolute', left: px(135), top: py(624), width: pw(260), height: ph(30), justifyContent: 'flex-end', paddingBottom: ph(8) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: valFontSize(blood), lineHeight: 1 }}>{blood}</Text>
          </View>

          {/* Mobile */}
          <View style={{ position: 'absolute', left: px(135), top: py(662), width: pw(260), height: ph(30), justifyContent: 'flex-end', paddingBottom: ph(8) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontFamily: 'Courier', fontSize: 8.5, letterSpacing: 0.8, lineHeight: 1 }}>{mobile}</Text>
          </View>

          {/* QR Code */}
          <View style={{ position: 'absolute', left: px(510), top: py(520), width: pw(120), height: ph(120), alignItems: 'center', justifyContent: 'center' }}>
            <QRBox value={qrData} size={pw(110)} />
          </View>

          {/* Valid Upto date */}
          <View style={{ position: 'absolute', left: px(80), top: py(800), width: pw(130), height: ph(35), alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: 8, textAlign: 'center' }}>{validDate}</Text>
          </View>
        </View>
      </Page>

      {/* BACK */}
      <Page wrap={false} size={[P(148), P(210)]} style={pg}>
        <View style={root}>
          <Image src="/id-back.png" style={bg} />

          {/* Emergency Contact Number */}
          <View style={{ position: 'absolute', left: px(75), top: py(750), width: pw(130), height: ph(22), justifyContent: 'flex-start', paddingBottom: ph(4) }}>
            <Text style={{ fontWeight: 'bold', color: '#2B2113', fontSize: 9, fontFamily: 'Courier', letterSpacing: 0.5, lineHeight: 1 }}>{mobile}</Text>
          </View>

          {/* QR Code */}
          <View style={{ position: 'absolute', left: px(240), top: py(720), width: pw(100), height: ph(100), alignItems: 'center', justifyContent: 'center' }}>
            <QRBox value={qrData} size={pw(90)} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

const pg = { fontFamily: 'Helvetica', backgroundColor: '#FBF6EC' }
const root = { width: P(148), height: P(210), position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', left: 0, top: 0, width: P(148), height: P(210), objectFit: 'fill' }

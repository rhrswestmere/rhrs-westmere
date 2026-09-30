import { useMemo } from 'react'
import { Page, View, Document, Svg, Rect, Image, Text } from '@react-pdf/renderer'
import qrcode from 'qrcode-generator'
import coords from './RRHRS_CLIENT_FINAL_TEMPLATE_COORDINATES.json'
import { P, PAGE_W_MM, PAGE_H_MM, fx, fy, fw, fh, fitValueFontSize } from './idCardData'

/*
  FRONT artwork: 765 × 475 px  -> PDF page 85 × 55 mm (landscape)
  BACK artwork:  762 × 477 px  -> PDF page 85 × 55 mm (landscape)
  All dynamic geometry comes from RRHRS_CLIENT_FINAL_TEMPLATE_COORDINATES.json.
*/

const F = coords.dynamic_fields.front

const VALUE_BASE_PT = 6
const VALUE_COLOR = '#111111'

function QRBox({ value, size }) {
  const qr = useMemo(() => {
    const q = qrcode(0, 'M')
    q.addData(value)
    q.make()
    return q
  }, [value])
  const count = qr.getModuleCount()
  const quiet = 4
  const total = count + quiet * 2
  const cells = []
  for (let r = 0; r < count; r++)
    for (let c = 0; c < count; c++)
      if (qr.isDark(r, c)) cells.push({ x: c + quiet, y: r + quiet })
  return (
    <View style={{ width: size, height: size, backgroundColor: '#FFFFFF' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${total} ${total}`}>
        {cells.map((cell, i) => (
          <Rect key={i} x={cell.x} y={cell.y} width={1} height={1} fill="#111111" />
        ))}
      </Svg>
    </View>
  )
}

function Value({ rect, text }) {
  const widthPt = fw(rect.width)
  const fontSize = fitValueFontSize(text, widthPt, VALUE_BASE_PT)
  return (
    <View
      style={{
        position: 'absolute',
        left: fx(rect.x),
        top: fy(rect.y),
        width: widthPt,
        height: fh(rect.height),
        justifyContent: 'center',
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          fontSize,
          lineHeight: 1,
          fontWeight: 700,
          color: VALUE_COLOR,
        }}
      >
        {text || ''}
      </Text>
    </View>
  )
}

export default function IdCardPDF({ data, assets }) {
  const frontSrc = assets?.front || '/id-front.png'
  const backSrc = assets?.back || '/id-back.png'

  const photo = data?.photo || null
  const qrSize = fw(Math.min(F.qr.width, F.qr.height))

  return (
    <Document>
      {/* FRONT — 765 × 475 reference */}
      <Page wrap={false} size={[P(PAGE_W_MM), P(PAGE_H_MM)]} style={pg}>
        <View style={root}>
          <Image src={frontSrc} style={bg} />

          {photo && (
            <Image
              src={photo}
              style={{
                position: 'absolute',
                left: fx(F.photo.x),
                top: fy(F.photo.y),
                width: fw(F.photo.width),
                height: fh(F.photo.height),
                objectFit: 'cover',
              }}
            />
          )}

          <Value rect={F.name} text={data?.name} />
          <Value rect={F.designation} text={data?.designation} />
          <Value rect={F.contact} text={data?.mobile} />
          <Value rect={F.blood_group} text={data?.blood_group} />
          <Value rect={F.valid_upto} text={data?.valid_upto} />

          {/* QR — white cover fills the whole placeholder rect, square QR centred inside */}
          <View
            style={{
              position: 'absolute',
              left: fx(F.qr.x),
              top: fy(F.qr.y),
              width: fw(F.qr.width),
              height: fh(F.qr.height),
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QRBox value={data?.verification_url || ''} size={qrSize} />
          </View>
        </View>
      </Page>

      {/* BACK — 762 × 477 reference, fully static */}
      <Page wrap={false} size={[P(PAGE_W_MM), P(PAGE_H_MM)]} style={pg}>
        <View style={root}>
          <Image src={backSrc} style={bg} />
        </View>
      </Page>
    </Document>
  )
}

const pg = { fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' }
const root = { width: P(PAGE_W_MM), height: P(PAGE_H_MM), position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', left: 0, top: 0, width: P(PAGE_W_MM), height: P(PAGE_H_MM), objectFit: 'fill' }

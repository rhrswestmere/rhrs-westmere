import { Page, View, Document, Image, Text } from '@react-pdf/renderer'
import {
  computeLayout,
  richSegments,
  FLOW,
  COLORS,
  X,
  Y,
  S,
  PAGE,
  LETTERHEAD,
} from './appointmentLayout'

const LATIN = 'Helvetica'
const DEVA = 'NotoDeva'
const BG_SRC_DEFAULT = '/letter_head.png'

// The letterhead keeps its own aspect ratio and is centred, so it can never be
// stretched: it always covers the whole A4 page.
const bgWidth = PAGE.h * (LETTERHEAD.w / LETTERHEAD.h)
const bgLeft = (PAGE.w - bgWidth) / 2

const box = (top, left, width, height) => ({
  position: 'absolute',
  top: Y(top),
  left: X(left),
  ...(width != null ? { width: X(width) } : {}),
  ...(height != null ? { height: Y(height) } : {}),
})

export default function AppointmentLetterPDF({ data = {}, bgImage }) {
  const doc = data
  const L = computeLayout(doc)
  const cw = FLOW.content
  const B = FLOW.box
  const T = FLOW.table
  const sig = doc.signature || {}
  const appt = doc.appointment || {}
  const values = [
    appt.visitor?.full_name,
    appt.appointment_date,
    appt.appointment_time,
    appt.purpose,
  ]

  const title = doc.document?.title || ''
  const subtitle = doc.document?.subtitle || ''

  return (
    <Document>
      <Page size="A4" style={{ margin: 0, padding: 0 }}>
        <Image
          src={bgImage || BG_SRC_DEFAULT}
          style={{ position: 'absolute', left: bgLeft, top: 0, width: bgWidth, height: PAGE.h }}
        />

        {/* Title */}
        <View style={{ ...box(L.title.top, cw.left, cw.width, L.title.h), alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontFamily: LATIN,
              fontWeight: 'bold',
              fontSize: S(FLOW.title.size),
              lineHeight: FLOW.title.lh,
              letterSpacing: S(FLOW.title.tracking),
              color: COLORS.title,
              textAlign: 'center',
            }}
          >
            {title}
          </Text>
        </View>

        {/* Subtitle */}
        <View
          style={{
            ...box(L.subtitle.top, cw.left, cw.width, L.subtitle.h),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: DEVA,
              fontSize: S(FLOW.subtitle.size),
              lineHeight: FLOW.subtitle.lh,
              color: COLORS.subtitle,
              textAlign: 'center',
            }}
          >
            {subtitle}
          </Text>
        </View>

        {/* Gold rule + centre diamond */}
        <View style={box(L.underline.top + 5, 529, FLOW.underline.w, 0)}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: X(57),
              height: S(FLOW.underline.stroke),
              backgroundColor: COLORS.underline,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: X(57),
              height: S(FLOW.underline.stroke),
              backgroundColor: COLORS.underline,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: X(62),
              top: S(-3.6),
              width: S(7.4),
              height: S(7.4),
              backgroundColor: COLORS.underline,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>

        {/* Appointment header box */}
        <View
          style={{
            ...box(L.box.top, cw.left, cw.width, L.box.h),
            borderWidth: S(B.borderWidth),
            borderColor: COLORS.boxBorder,
            borderRadius: S(B.radius),
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: X(B.accent),
              height: '100%',
              backgroundColor: COLORS.boxAccent,
            }}
          />
          <Text
            style={{
              position: 'absolute',
              left: X(B.padLeft),
              top: Y(7),
              width: X(420),
              fontFamily: LATIN,
              fontSize: S(B.label.size),
              letterSpacing: S(B.label.tracking),
              color: COLORS.boxLabel,
            }}
          >
            {appt.appointment_number_label || 'APPOINTMENT NO.'}
          </Text>
          <Text
            style={{
              position: 'absolute',
              left: X(B.padLeft),
              top: Y(30),
              width: X(420),
              fontFamily: LATIN,
              fontWeight: 'bold',
              fontSize: S(B.value.size),
              color: COLORS.boxValue,
            }}
          >
            {appt.appointment_number || ''}
          </Text>
          <Text
            style={{
              position: 'absolute',
              left: X(B.rightColLeft - cw.left),
              top: Y(7),
              width: X(250),
              fontFamily: LATIN,
              fontSize: S(B.label.size),
              letterSpacing: S(B.label.tracking),
              color: COLORS.boxLabel,
            }}
          >
            {appt.date_of_issue_label || 'DATE OF ISSUE'}
          </Text>
          <Text
            style={{
              position: 'absolute',
              left: X(B.rightColLeft - cw.left),
              top: Y(30),
              width: X(250),
              fontFamily: LATIN,
              fontWeight: 'bold',
              fontSize: S(B.value.size),
              color: COLORS.boxValue,
            }}
          >
            {appt.date_of_issue || ''}
          </Text>
        </View>

        {/* English confirmation */}
        <Text
          style={{
            ...box(L.english.top, cw.textLeft, cw.textWidth),
            fontFamily: LATIN,
            fontSize: S(L.english.size),
            lineHeight: FLOW.english.lh,
            color: COLORS.english,
            textAlign: 'justify',
          }}
        >
          {richSegments(doc.confirmation_text?.english, values).map((seg, i) => (
            <Text key={i} style={seg.bold ? { fontWeight: 'bold' } : undefined}>
              {seg.text}
            </Text>
          ))}
        </Text>

        {/* Hindi confirmation */}
        <Text
          style={{
            ...box(L.hindi.top, cw.textLeft, cw.textWidth),
            fontFamily: DEVA,
            fontSize: S(L.hindi.size),
            lineHeight: FLOW.hindi.lh,
            color: COLORS.hindi,
            textAlign: 'justify',
          }}
        >
          {doc.confirmation_text?.hindi || ''}
        </Text>

        {/* Details table */}
        <View
          style={{
            ...box(L.table.top, T.left, T.width, L.table.h),
            borderWidth: S(T.borderWidth),
            borderColor: COLORS.tableBorder,
            borderRadius: S(T.radius),
            overflow: 'hidden',
          }}
        >
          {L.tableRows.map((row, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                minHeight: Y(L.table.rows[i]),
                borderBottomWidth: i === L.tableRows.length - 1 ? 0 : S(T.borderWidth),
                borderBottomColor: COLORS.tableBorder,
              }}
            >
              <View
                style={{
                  width: X(T.colLabel),
                  backgroundColor: COLORS.tableLabelBg,
                  borderRightWidth: S(T.borderWidth),
                  borderRightColor: COLORS.tableBorder,
                  justifyContent: 'center',
                  paddingLeft: X(T.padX),
                  paddingRight: X(8),
                }}
              >
                <Text
                  style={{
                    fontFamily: LATIN,
                    fontSize: S(L.table.labelSize),
                    letterSpacing: S(T.label.tracking),
                    color: COLORS.tableLabel,
                  }}
                >
                  {row.label}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  paddingLeft: X(T.padX - 2),
                  paddingRight: X(10),
                }}
              >
                <Text
                  style={{
                    fontFamily: LATIN,
                    fontWeight: 'bold',
                    fontSize: S(L.table.valueSize),
                    color: COLORS.tableValue,
                  }}
                >
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <Text
          style={{
            ...box(L.instructions.top, cw.textLeft, cw.textWidth),
            fontFamily: LATIN,
            fontSize: S(L.instructions.size),
            lineHeight: FLOW.instructions.lh,
            color: COLORS.instructions,
            textAlign: 'justify',
          }}
        >
          {doc.instructions?.text || ''}
        </Text>

        {/* Signature */}
        <View
          style={{
            ...box(FLOW.signature.line.y, FLOW.signature.line.x, FLOW.signature.line.w, 0),
            height: S(FLOW.signature.line.stroke),
            backgroundColor: COLORS.signLine,
          }}
        />
        <Text
          style={{
            ...box(
              FLOW.signature.designation.y,
              FLOW.signature.designation.x,
              FLOW.signature.designation.w,
              FLOW.signature.designation.h,
            ),
            textAlign: 'center',
            fontSize: S(FLOW.signature.designation.size),
            fontWeight: 'bold',
            color: COLORS.signDesignation,
          }}
        >
          <Text style={{ fontFamily: DEVA }}>{sig.designation_hindi || ''}</Text>
          <Text style={{ fontFamily: LATIN }}>{` / ${sig.designation_english || ''}`}</Text>
        </Text>
        <Text
          style={{
            ...box(
              FLOW.signature.org.y,
              FLOW.signature.org.x,
              FLOW.signature.org.w,
              FLOW.signature.org.h,
            ),
            textAlign: 'center',
            fontFamily: LATIN,
            fontSize: S(FLOW.signature.org.size),
            color: COLORS.signOrg,
          }}
        >
          {sig.organization || ''}
        </Text>
      </Page>
    </Document>
  )
}

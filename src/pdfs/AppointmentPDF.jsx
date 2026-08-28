import { Page, Text, View, Document, Image } from '@react-pdf/renderer'

const C = {
  saffron: '#DE651A',
  saffronDeep: '#C0550A',
  saffronBg: '#FFF3E8',
  gold: '#B8973A',
  ink: '#1A1100',
  inkSoft: '#3A3020',
  inkMuted: '#7A6F5A',
  border: '#E8E0D4',
}

const P = (mm) => Number((mm * 2.834645669).toFixed(2))

function fmtTime(t) {
  if (!t) return ''
  const [hh, mm] = t.split(':').map(Number)
  const h12 = hh % 12 || 12
  const ampm = hh >= 12 ? 'PM' : 'AM'
  return `${h12}:${String(mm || 0).padStart(2, '0')} ${ampm}`
}

export default function AppointmentPDF({ data, bgImage }) {
  const date = new Date(data.from_date + 'T00:00:00')
  const fromDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const fromTime = fmtTime(data.duration)
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document>
      <Page size="A4" style={{ margin: 0, padding: 0 }}>
        <View style={{ width: P(210), height: P(297) }}>
          {bgImage && (
            <Image src={bgImage} style={{ width: P(210), height: P(296) }} />
          )}

          <View style={{
            position: 'absolute',
            left: P(25), top: P(90),
            width: P(160), height: P(170),
          }}>

            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', letterSpacing: 2, color: C.saffronDeep }}>
                APPOINTMENT CONFIRMATION
              </Text>
              <Text style={{ fontFamily: 'NotoDeva', fontSize: 10, color: C.inkMuted, marginTop: 3 }}>
                मुलाकात की पुष्टि
              </Text>
              <View style={{ width: 60, height: 2, backgroundColor: C.gold, marginTop: 6 }} />
            </View>

            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14,
              backgroundColor: C.saffronBg, paddingVertical: 6, paddingHorizontal: 10,
              borderLeftWidth: 3, borderLeftColor: C.saffron,
            }}>
              <View>
                <Text style={{ fontSize: 6.5, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Appointment No.</Text>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.ink, marginTop: 1 }}>{data.appointment_no}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 6.5, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Date of Issue</Text>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.ink, marginTop: 1 }}>{today}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 9.5, color: C.inkSoft, marginBottom: 8, textAlign: 'justify', lineHeight: 1.5 }}>
              This is to certify that Shri/Smt/Kum. <Text style={{ fontWeight: 'bold' }}>{data.full_name}</Text> has booked an
              appointment with Rashtriya Hindu Rakshak Sangh on{' '}
              <Text style={{ fontWeight: 'bold' }}>{fromDate}</Text> at <Text style={{ fontWeight: 'bold' }}>{fromTime}</Text>{' '}
              for the purpose of <Text style={{ fontWeight: 'bold' }}>{data.designation}</Text>. This letter is the official
              proof of the appointment booked, and may be produced at the time of the visit.
            </Text>

            <Text style={{ fontFamily: 'NotoDeva', fontSize: 9, color: C.inkMuted, marginBottom: 10, lineHeight: 1.5, textAlign: 'justify' }}>
              प्रमाणित किया जाता है कि श्री/श्रीमती {data.full_name} ने राष्ट्रीय हिन्दू रक्षक संघ से दिनांक {fromDate} को
              प्रातः/सायं {fromTime} बजे {data.designation} हेतु मुलाकात का अपॉइंटमेंट बुक किया है। यह पत्र इस बात का आधिकारिक
              प्रमाण है कि उपरोक्त तिथि एवं समय पर अपॉइंटमेंट लिया गया है।
            </Text>

            <View style={{ borderWidth: 1, borderColor: C.border, marginBottom: 10 }}>
              {[
                ['Appointment No.', data.appointment_no],
                ['Full Name', data.full_name],
                ['Purpose of Visit', data.designation],
                ['Appointment Date', fromDate],
                ['Appointment Time', fromTime],
              ].map(([label, value], i) => (
                <View key={i} style={{ flexDirection: 'row', borderBottomWidth: i < 4 ? 1 : 0, borderBottomColor: C.border }}>
                  <Text style={{ width: 120, fontSize: 7.5, fontWeight: 'bold', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5, paddingVertical: 5, paddingLeft: 8, backgroundColor: C.saffronBg }}>{label}</Text>
                  <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.ink, paddingVertical: 5, paddingLeft: 8 }}>{value}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 7, color: C.inkMuted, lineHeight: 1.5, marginBottom: 16 }}>
              Please carry this letter (or note down the appointment number) at the time of your visit and arrive at least
              10 minutes before the scheduled time. This appointment is valid only for the date and time mentioned above;
              rescheduling or cancellation should be informed to the Sangh office in advance.
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ width: '45%' }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: C.ink, marginBottom: 4 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'NotoDeva', fontSize: 8.5, fontWeight: 'bold' }}>अध्यक्ष</Text>
                  <Text style={{ fontSize: 8.5, fontWeight: 'bold' }}> / President</Text>
                </View>
                <Text style={{ fontSize: 7, color: C.inkMuted, textAlign: 'center', marginTop: 1 }}>Rashtriya Hindu Rakshak Sangh</Text>
              </View>
            </View>

          </View>
        </View>
      </Page>
    </Document>
  )
}

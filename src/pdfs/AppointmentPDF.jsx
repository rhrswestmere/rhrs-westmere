import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

const C = {
  saffron: '#DE651A',
  saffronDeep: '#C0550A',
  saffronLight: '#FF8C38',
  saffronBg: '#FFF3E8',
  gold: '#B8973A',
  goldLight: '#D4B86A',
  ink: '#1A1100',
  inkSoft: '#3A3020',
  inkMuted: '#7A6F5A',
  border: '#E8E0D4',
  white: '#FFFFFF',
}

function fmtTime(t) {
  if (!t) return ''
  const [hh, mm] = t.split(':').map(Number)
  const h12 = hh % 12 || 12
  const ampm = hh >= 12 ? 'PM' : 'AM'
  return `${h12}:${String(mm || 0).padStart(2, '0')} ${ampm}`
}

const styles = StyleSheet.create({
  page: {
    padding: 34,
    paddingTop: 28,
    fontFamily: 'Helvetica',
    color: C.ink,
    fontSize: 10,
    lineHeight: 1.5,
    backgroundColor: C.white,
  },
  headerBand: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: C.saffron,
    paddingBottom: 12,
    marginBottom: 18,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.saffron,
    alignItems: 'center',
    justifyContent: 'center',
  },
  om: {
    fontFamily: 'NotoDeva',
    fontSize: 24,
    color: C.white,
  },
  logoImg: {
    width: 36,
    height: 36,
    objectFit: 'contain',
  },
  orgBlock: {
    marginLeft: 12,
    flex: 1,
  },
  orgEn: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: C.ink,
  },
  orgDeva: {
    fontFamily: 'NotoDeva',
    fontSize: 10,
    color: C.saffron,
    marginTop: 2,
  },
  orgTagline: {
    fontSize: 7,
    color: C.inkMuted,
    letterSpacing: 1,
    marginTop: 3,
  },
  titleBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleEn: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: C.saffronDeep,
  },
  titleDeva: {
    fontFamily: 'NotoDeva',
    fontSize: 11,
    color: C.inkMuted,
    marginTop: 4,
  },
  rule: {
    width: 70,
    height: 2,
    backgroundColor: C.gold,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    backgroundColor: C.saffronBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: C.saffron,
  },
  metaLabel: {
    fontSize: 7,
    color: C.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: C.ink,
    marginTop: 2,
  },
  bodyText: {
    fontSize: 10.5,
    color: C.inkSoft,
    marginBottom: 12,
    textAlign: 'justify',
  },
  bodyDeva: {
    fontFamily: 'NotoDeva',
    fontSize: 10,
    color: C.inkMuted,
    marginBottom: 14,
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: C.border,
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  detailLabel: {
    width: 130,
    fontSize: 8,
    fontWeight: 'bold',
    color: C.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: 7,
    paddingLeft: 10,
    backgroundColor: C.saffronBg,
  },
  detailValue: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: C.ink,
    paddingVertical: 7,
    paddingLeft: 10,
  },
  terms: {
    fontSize: 7.5,
    color: C.inkMuted,
    marginTop: 14,
    lineHeight: 1.6,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 46,
  },
  signatureBox: {
    width: '42%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: C.ink,
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  signatureDeva: {
    fontFamily: 'NotoDeva',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signatureRole: {
    fontSize: 7.5,
    color: C.inkMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 34,
    right: 34,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 6.5,
    color: C.inkMuted,
  },
})

export default function AppointmentPDF({ data }) {
  const date = new Date(data.from_date + 'T00:00:00')
  const fromDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const fromTime = fmtTime(data.duration)
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand}>
          <View style={styles.logo}>
            <Image src="/logo.png" style={styles.logoImg} />
          </View>
          <View style={styles.orgBlock}>
            <Text style={styles.orgEn}>RASHTRIYA HINDU RAKSHAK SANGH</Text>
            <Text style={styles.orgDeva}>राष्ट्रीय हिन्दू रक्षक संघ</Text>
            <Text style={styles.orgTagline}>HERITAGE · SERVICE · UNITY</Text>
          </View>
        </View>

        <View style={styles.titleBox}>
          <Text style={styles.titleEn}>APPOINTMENT CONFIRMATION</Text>
          <Text style={styles.titleDeva}>मुलाकात की पुष्टि</Text>
          <View style={styles.rule} />
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Appointment No.</Text>
            <Text style={styles.metaValue}>{data.appointment_no}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Date of Issue</Text>
            <Text style={styles.metaValue}>{today}</Text>
          </View>
        </View>

        <Text style={styles.bodyText}>
          This is to certify that Shri/Smt/Kum. <Text style={{ fontWeight: 'bold' }}>{data.full_name}</Text> has booked an
          appointment with Rashtriya Hindu Rakshak Sangh on{' '}
          <Text style={{ fontWeight: 'bold' }}>{fromDate}</Text> at <Text style={{ fontWeight: 'bold' }}>{fromTime}</Text>{' '}
          for the purpose of <Text style={{ fontWeight: 'bold' }}>{data.designation}</Text>. This letter is the official
          proof of the appointment booked, and may be produced at the time of the visit.
        </Text>
        <Text style={styles.bodyDeva}>
          प्रमाणित किया जाता है कि श्री/श्रीमती {data.full_name} ने राष्ट्रीय हिन्दू रक्षक संघ से दिनांक {fromDate} को
          प्रातः/सायं {fromTime} बजे {data.designation} हेतु मुलाकात का अपॉइंटमेंट बुक किया है। यह पत्र इस बात का आधिकारिक
          प्रमाण है कि उपरोक्त तिथि एवं समय पर अपॉइंटमेंट लिया गया है।
        </Text>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Appointment No.</Text>
            <Text style={styles.detailValue}>{data.appointment_no}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{data.full_name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purpose of Visit</Text>
            <Text style={styles.detailValue}>{data.designation}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Appointment Date</Text>
            <Text style={styles.detailValue}>{fromDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Appointment Time</Text>
            <Text style={styles.detailValue}>{fromTime}</Text>
          </View>
        </View>

        <Text style={styles.terms}>
          Please carry this letter (or note down the appointment number) at the time of your visit and arrive at least
          10 minutes before the scheduled time. This appointment is valid only for the date and time mentioned above;
          rescheduling or cancellation should be informed to the Sangh office in advance.
        </Text>

        <View style={styles.signatureRow}>
          <View style={[styles.signatureBox, { width: '100%', alignItems: 'flex-end' }]}>
            <View style={[styles.signatureLine, { width: '42%' }]} />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.signatureDeva}>अध्यक्ष</Text>
              <Text style={styles.signatureName}> / President</Text>
            </View>
            <Text style={styles.signatureRole}>Rashtriya Hindu Rakshak Sangh</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>RHRS · Heritage | Service | Unity</Text>
          <Text>rhrsdemo2.vercel.app</Text>
        </View>
      </Page>
    </Document>
  )
}

import { Page, Text, View, Document, Image } from '@react-pdf/renderer'
import { amountInWords } from './amountWords'

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

export default function PaymentSlipPDF({ data, bgImage }) {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const amount = Number(data.amount)
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(amount)

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
                DONATION PAYMENT SLIP
              </Text>
              <Text style={{ fontFamily: 'NotoDeva', fontSize: 10, color: C.inkMuted, marginTop: 3 }}>
                दान भुगतान पर्ची
              </Text>
              <View style={{ width: 60, height: 2, backgroundColor: C.gold, marginTop: 6 }} />
            </View>

            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14,
              backgroundColor: C.saffronBg, paddingVertical: 6, paddingHorizontal: 10,
              borderLeftWidth: 3, borderLeftColor: C.saffron,
            }}>
              <View>
                <Text style={{ fontSize: 6.5, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Receipt No.</Text>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.ink, marginTop: 1 }}>{data.receipt_no}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 6.5, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Date of Issue</Text>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.ink, marginTop: 1 }}>{today}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 9.5, color: C.inkSoft, marginBottom: 8, textAlign: 'justify', lineHeight: 1.5 }}>
              This is to certify that Shri/Smt/Kum. <Text style={{ fontWeight: 'bold' }}>{data.donor_name}</Text> has made a
              donation of <Text style={{ fontWeight: 'bold' }}>₹ {formatted}</Text> ({amountInWords(amount)}) to Rashtriya
              Hindu Rakshak Sangh on <Text style={{ fontWeight: 'bold' }}>{today}</Text> towards{' '}
              <Text style={{ fontWeight: 'bold' }}>{data.donation_type}</Text>.
            </Text>

            <Text style={{ fontFamily: 'NotoDeva', fontSize: 9, color: C.inkMuted, marginBottom: 10, lineHeight: 1.5, textAlign: 'justify' }}>
              प्रमाणित किया जाता है कि श्री/श्रीमती {data.donor_name} ने दिनांक {today} को राष्ट्रीय हिन्दू रक्षक संघ को{' '}
              {data.donation_type} हेतु ₹ {formatted} की दान राशि प्रदान की है।
            </Text>

            <View style={{ borderWidth: 1, borderColor: C.border, marginBottom: 10 }}>
              {[
                ['Receipt No.', data.receipt_no],
                ['Donor Name', data.donor_name],
                ['Donation Type', data.donation_type],
                ['Amount', `₹ ${formatted}`],
                ['Payment Mode', data.payment_mode],
                ['Txn / UPI Ref', data.txn_ref],
              ].map(([label, value], i) => (
                <View key={i} style={{ flexDirection: 'row', borderBottomWidth: i < 5 ? 1 : 0, borderBottomColor: C.border }}>
                  <Text style={{ width: 120, fontSize: 7.5, fontWeight: 'bold', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5, paddingVertical: 5, paddingLeft: 8, backgroundColor: C.saffronBg }}>{label}</Text>
                  <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: label === 'Amount' ? C.saffronDeep : C.ink, paddingVertical: 5, paddingLeft: 8 }}>{value}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 7, color: C.inkMuted, lineHeight: 1.5, marginBottom: 16 }}>
              Kindly preserve this receipt for your records. This is a computer-generated receipt issued against the
              donation made as mentioned above and serves as the official proof of the donation.
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

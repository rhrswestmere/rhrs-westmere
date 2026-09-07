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
  green: '#166534',
  greenBg: '#F0FDF4',
}

const P = (mm) => Number((mm * 2.834645669).toFixed(2))

export default function DesignationAppointmentPDF({ data, bgImage }) {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const memberName = data.full_name || 'Member Name'
  const designationTitle = data.designation_title || 'Active Member'
  const designationLevel = data.designation_level || ''
  const designationNumber = data.designation_number || ''
  const designationState = data.designation_state || ''

  const levelLabels = {
    national: 'National Level',
    zonal: 'Zonal Level',
    state: 'State Level',
    district: 'District Level',
    constituency: 'Constituency Level',
    mandal: 'Mandal Level',
    mahila_morcha: 'Mahila Morcha',
    yuva_morcha: 'Yuva Morcha',
  }

  return (
    <Document>
      <Page size="A4" style={{ margin: 0, padding: 0 }}>
        <View style={{ width: P(210), height: P(297) }}>
          {bgImage && (
            <Image src={bgImage} style={{ width: P(210), height: P(296) }} />
          )}

          <View style={{
            position: 'absolute',
            left: P(25), top: P(40),
            width: P(160), height: P(220),
          }}>

            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: 3, color: C.saffronDeep }}>
                APPOINTMENT LETTER
              </Text>
              <Text style={{ fontFamily: 'NotoDeva', fontSize: 10, color: C.inkMuted, marginTop: 2 }}>
                नियुक्ति पत्र
              </Text>
              <View style={{ width: 60, height: 2, backgroundColor: C.gold, marginTop: 5 }} />
            </View>

            {/* Reference Box */}
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12,
              backgroundColor: C.saffronBg, paddingVertical: 6, paddingHorizontal: 10,
              borderLeftWidth: 3, borderLeftColor: C.saffron,
            }}>
              <View>
                <Text style={{ fontSize: 6.5, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Member ID</Text>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.ink, marginTop: 1 }}>{data.member_id || '---'}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 6.5, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Date of Issue</Text>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.ink, marginTop: 1 }}>{today}</Text>
              </View>
              {designationNumber && (
                <View>
                  <Text style={{ fontSize: 6.5, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Designation No.</Text>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.saffronDeep, marginTop: 1 }}>{designationNumber}</Text>
                </View>
              )}
            </View>

            {/* Main Content */}
            <Text style={{ fontSize: 9.5, color: C.inkSoft, marginBottom: 8, textAlign: 'justify', lineHeight: 1.6 }}>
              This is to certify that <Text style={{ fontWeight: 'bold' }}>{memberName}</Text> (Member ID: <Text style={{ fontWeight: 'bold' }}>{data.member_id || '---'}</Text>)
              has been officially appointed as <Text style={{ fontWeight: 'bold', color: C.saffronDeep }}>{designationTitle}</Text>
              {designationLevel && (
                <Text> at <Text style={{ fontWeight: 'bold' }}>{levelLabels[designationLevel] || designationLevel}</Text></Text>
              )}
              {' '}of <Text style={{ fontWeight: 'bold' }}>Rashtriya Hindu Rakshak Sangh (RHRS)</Text>.
              {designationState && (
                <Text> The appointment is applicable for <Text style={{ fontWeight: 'bold' }}>{designationState}</Text> region.</Text>
              )}
            </Text>

            <Text style={{ fontFamily: 'NotoDeva', fontSize: 9, color: C.inkMuted, marginBottom: 12, lineHeight: 1.6, textAlign: 'justify' }}>
              प्रमाणित किया जाता है कि <Text style={{ fontWeight: 'bold' }}>{memberName}</Text> (सदस्य आईडी: <Text style={{ fontWeight: 'bold' }}>{data.member_id || '---'}</Text>)
              को <Text style={{ fontWeight: 'bold', color: C.saffronDeep }}>{designationTitle}</Text>
              {designationLevel && (
                <Text> — <Text style={{ fontWeight: 'bold' }}>{levelLabels[designationLevel] || designationLevel}</Text></Text>
              )}
              {' '}के पद पर <Text style={{ fontWeight: 'bold' }}>राष्ट्रीय हिन्दू रक्षक संघ</Text> में आधिकारिक रूप से नियुक्त किया गया है।
              {designationState && (
                <Text> यह नियुक्ति <Text style={{ fontWeight: 'bold' }}>{designationState}</Text> क्षेत्र के लिए मान्य है।</Text>
              )}
            </Text>

            {/* Designation Details Table */}
            <View style={{ borderWidth: 1, borderColor: C.border, marginBottom: 12 }}>
              {[
                ['Member Name', memberName],
                ['Member ID', data.member_id || '---'],
                ['Designation Title', designationTitle],
                ['Designation Level', levelLabels[designationLevel] || designationLevel || '---'],
                ['Designation Number', designationNumber || '---'],
                ...(designationState ? [['State / Region', designationState]] : []),
                ['Date of Appointment', today],
              ].map(([label, value], i, arr) => (
                <View key={i} style={{ flexDirection: 'row', borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: C.border }}>
                  <Text style={{ width: 120, fontSize: 7.5, fontWeight: 'bold', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5, paddingVertical: 5, paddingLeft: 8, backgroundColor: C.saffronBg }}>{label}</Text>
                  <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.ink, paddingVertical: 5, paddingLeft: 8 }}>{value}</Text>
                </View>
              ))}
            </View>

            {/* Authority Note */}
            <View style={{ backgroundColor: C.greenBg, borderLeftWidth: 3, borderLeftColor: C.green, paddingVertical: 6, paddingHorizontal: 10, marginBottom: 14 }}>
              <Text style={{ fontSize: 7.5, color: C.green, lineHeight: 1.5 }}>
                This appointment is subject to the rules and regulations of Rashtriya Hindu Rakshak Sangh.
                The appointed person shall carry out the duties and responsibilities associated with the said designation.
              </Text>
            </View>

            {/* Signatures */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <View style={{ width: '45%' }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: C.ink, marginBottom: 4 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'NotoDeva', fontSize: 8.5, fontWeight: 'bold' }}>अध्यक्ष</Text>
                  <Text style={{ fontSize: 8.5, fontWeight: 'bold' }}> / President</Text>
                </View>
                <Text style={{ fontSize: 7, color: C.inkMuted, textAlign: 'center', marginTop: 1 }}>Rashtriya Hindu Rakshak Sangh</Text>
              </View>
              <View style={{ width: '45%' }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: C.ink, marginBottom: 4 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 8.5, fontWeight: 'bold' }}>General Secretary</Text>
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

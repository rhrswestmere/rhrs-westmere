import { Page, View, Document, Text } from '@react-pdf/renderer'

const P = (mm) => Number((mm * 2.834645669).toFixed(2))

const fmtDate = (iso) => {
  if (!iso) return '---'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '---' }
}

const styles = {
  page: { padding: P(15), fontFamily: 'Helvetica', fontSize: 9, color: '#1A1100' },
  header: { textAlign: 'center', marginBottom: P(5) },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: P(2) },
  subtitle: { fontSize: 10, color: '#666' },
  meta: { fontSize: 9, color: '#888', marginBottom: P(3) },
  summary: { flexDirection: 'row', gap: P(5), marginBottom: P(5), borderBottom: P(0.5), borderStyle: 'solid', borderColor: '#DDD', paddingBottom: P(3) },
  summaryItem: { },
  summaryLabel: { fontSize: 7, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#C4621A' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#F5F0E8', flexDirection: 'row', borderBottom: P(0.5), borderStyle: 'solid', borderColor: '#CCC' },
  tableRow: { flexDirection: 'row', borderBottom: P(0.3), borderStyle: 'solid', borderColor: '#EEE', minHeight: P(6), alignItems: 'center' },
  th: { padding: P(2), fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.3 },
  td: { padding: P(2), fontSize: 8 },
  footer: { marginTop: P(5), textAlign: 'center', fontSize: 7, color: '#999' },
  empty: { textAlign: 'center', padding: P(10), color: '#999', fontSize: 10 },
}

export default function MemberReportPDF({ data }) {
  const rows = data?.rows || []
  const from = data?.from
  const to = data?.to
  const total = data?.total || 0

  return (
    <Document>
      <Page wrap={false} size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rashtriya Hindu Rakshak Sangh</Text>
          <Text style={styles.subtitle}>Member Report</Text>
        </View>
        <Text style={styles.meta}>Period: {fmtDate(from)} — {fmtDate(to)}</Text>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Members</Text>
            <Text style={styles.summaryValue}>{total}</Text>
          </View>
        </View>

        {rows.length === 0 ? (
          <Text style={styles.empty}>No records found for the selected period.</Text>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <View style={{ width: '18%' }}><Text style={styles.th}>Member ID</Text></View>
              <View style={{ width: '22%' }}><Text style={styles.th}>Name</Text></View>
              <View style={{ width: '15%' }}><Text style={styles.th}>Contact</Text></View>
              <View style={{ width: '10%' }}><Text style={styles.th}>Blood</Text></View>
              <View style={{ width: '20%' }}><Text style={styles.th}>Designation</Text></View>
              <View style={{ width: '15%' }}><Text style={styles.th}>Joined</Text></View>
            </View>
            {rows.map((r, i) => (
              <View key={r.id || i} style={styles.tableRow}>
                <View style={{ width: '18%' }}><Text style={styles.td}>{r.member_id}</Text></View>
                <View style={{ width: '22%' }}><Text style={styles.td}>{r.full_name}</Text></View>
                <View style={{ width: '15%' }}><Text style={styles.td}>{r.emergency_contact || '---'}</Text></View>
                <View style={{ width: '10%' }}><Text style={styles.td}>{r.blood_group}</Text></View>
                <View style={{ width: '20%' }}><Text style={styles.td}>{r.designation_title || 'Active Member'}</Text></View>
                <View style={{ width: '15%' }}><Text style={styles.td}>{fmtDate(r.created_at)}</Text></View>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>Generated on {fmtDate(new Date().toISOString())} · RHRS Admin System</Text>
      </Page>
    </Document>
  )
}

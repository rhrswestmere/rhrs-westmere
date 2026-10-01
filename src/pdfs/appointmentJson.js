const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const RHRS_DOCUMENT = {
  type: 'appointment_confirmation',
  title: 'APPOINTMENT CONFIRMATION',
  subtitle: 'सुवागत की पुष्टि',
  language: 'English + Hindi',
  base_template: 'RHRS_LETTERHEAD',
}

export const DEFAULT_INSTRUCTIONS =
  'Please carry this letter (or note down the appointment number) at the time of your visit and arrive at least 10 minutes before the scheduled time. This appointment is valid only for the date and time mentioned above; rescheduling or cancellation should be informed to the Sangh office in advance.'

export const DEFAULT_SIGNATURE = {
  designation_hindi: 'अध्यक्ष',
  designation_english: 'President',
  organization: 'Rashtriya Hindu Rakshak Sangh',
}

export const DEFAULT_STYLE = {
  content_background: '#FFFDF5',
  primary_heading_color: '#B42318',
  secondary_heading_color: '#C94A22',
  body_text_color: '#1F2937',
  accent_color: '#D97706',
  border_color: '#D8C7A0',
  table_border_color: '#D8D0BD',
}

const ENGLISH_TEMPLATE = (name, date, time, purpose) =>
  `This is to certify that Shri/Smt/Kum. ${name} has booked an appointment with Rashtriya Hindu Rakshak Sangh on ${date} at ${time} for the purpose of ${purpose}. This letter is the official proof of the appointment booked, and may be produced at the time of the visit.`

const HINDI_TEMPLATE = (name, date, time, purpose) =>
  `प्रमाणित किया जाता है कि श्री/श्रीमती/कुमारी ${name} ने राष्ट्रीय हिन्दू रक्षक संघ में दिनांक ${date} को प्रातः/समय ${time} बजे ${purpose} हेतु मुलाकात का अपॉइंटमेंट बुक किया है। यह पत्र इस बात का आधिकारिक प्रमाण है कि उपरोक्त तिथि एवं समय पर अपॉइंटमेंट लिया गया है।`

const clean = (value) => (value == null ? '' : String(value).trim())

export function fmtAppointmentDate(value) {
  const text = clean(value)
  if (!text) return ''
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) return `${Number(iso[3])} ${MONTHS[Number(iso[2]) - 1]} ${iso[1]}`
  return text
}

export function fmtAppointmentTime(value) {
  const text = clean(value)
  if (!text) return ''
  if (/[ap]\.?m\.?$/i.test(text)) return text.replace(/\./g, '').toUpperCase()
  const clock = text.split(' ').pop()
  const parts = clock.match(/^(\d{1,2}):(\d{2})/)
  if (!parts) return text
  const hour = Number(parts[1])
  const suffix = hour >= 12 ? 'PM' : 'AM'
  return `${hour % 12 || 12}:${parts[2]} ${suffix}`
}

export function fmtIssueDate(value) {
  const text = clean(value)
  if (text) return fmtAppointmentDate(text)
  const now = new Date()
  return `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
}

function derivedTable(appointment) {
  return [
    { label: 'APPOINTMENT NO.', value: appointment.appointment_number },
    { label: 'FULL NAME', value: appointment.visitor?.full_name },
    { label: 'PURPOSE OF VISIT', value: appointment.purpose },
    { label: 'APPOINTMENT DATE', value: appointment.appointment_date },
    { label: 'APPOINTMENT TIME', value: appointment.appointment_time },
  ].map((row) => ({ label: row.label, value: clean(row.value) }))
}

function withDefaults(doc) {
  const appointment = doc.appointment || {}
  const visitor = appointment.visitor || {}
  const name = clean(visitor.full_name)
  const date = clean(appointment.appointment_date)
  const time = clean(appointment.appointment_time)
  const purpose = clean(appointment.purpose)
  const number = clean(appointment.appointment_number)

  return {
    document: { ...RHRS_DOCUMENT, ...(doc.document || {}) },
    header_content: doc.header_content || {},
    appointment: {
      appointment_number_label: 'APPOINTMENT NO.',
      date_of_issue_label: 'DATE OF ISSUE',
      ...appointment,
      appointment_number: number,
      // Issue date follows the booking, so the letter always matches the
      // admin panel's "Booked On" column; only falls back to today.
      date_of_issue: fmtIssueDate(appointment.date_of_issue || doc.created_at),
      visitor: { ...visitor, full_name: name },
      purpose,
      appointment_date: date,
      appointment_time: time,
    },
    confirmation_text: doc.confirmation_text || {
      english: ENGLISH_TEMPLATE(name, date, time, purpose),
      hindi: HINDI_TEMPLATE(name, date, time, purpose),
    },
    appointment_details_table: doc.appointment_details_table?.length
      ? doc.appointment_details_table.map((row) => ({
          label: clean(row.label),
          value: clean(row.value),
        }))
      : derivedTable(appointment),
    instructions: {
      text: DEFAULT_INSTRUCTIONS,
      ...(doc.instructions || {}),
    },
    signature: { ...DEFAULT_SIGNATURE, ...(doc.signature || {}) },
    contact: doc.contact || {},
    visual_style: { ...DEFAULT_STYLE, ...(doc.visual_style || {}) },
  }
}

export function buildAppointmentJson(input = {}) {
  if (input.document || input.confirmation_text || input.appointment_details_table) {
    return withDefaults(input)
  }

  const issueSource = clean(input.date_of_issue) || clean(input.created_at)
  const appointment = {
    appointment_number: clean(input.appointment_no ?? input.appointment_number),
    date_of_issue: issueSource ? issueSource.split('T')[0] : '',
    visitor: { full_name: clean(input.full_name ?? input.visitor?.full_name) },
    purpose: clean(input.designation ?? input.purpose),
    appointment_date: fmtAppointmentDate(input.from_date ?? input.appointment_date),
    appointment_time: fmtAppointmentTime(input.duration ?? input.appointment_time),
  }
  const name = appointment.visitor.full_name

  return withDefaults({
    appointment,
    confirmation_text: {
      english: ENGLISH_TEMPLATE(
        name,
        appointment.appointment_date,
        appointment.appointment_time,
        appointment.purpose,
      ),
      hindi: HINDI_TEMPLATE(
        name,
        appointment.appointment_date,
        appointment.appointment_time,
        appointment.purpose,
      ),
    },
    appointment_details_table: derivedTable(appointment),
  })
}

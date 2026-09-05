export const DESIGNATION_LEVELS = [
  'national',
  'zonal',
  'state',
  'district',
  'constituency',
  'mandal',
  'mahila_morcha',
  'yuva_morcha',
]

export const DESIGNATION_LABELS = {
  national: 'National Level',
  zonal: 'Zonal Level',
  state: 'State Level',
  district: 'District Level',
  constituency: 'Constituency Level',
  mandal: 'Mandal Level',
  mahila_morcha: 'Mahila Morcha',
  yuva_morcha: 'Yuva Morcha',
}

export const DESIGNATION_QUOTA = 100

export const padSerial = (n) => String(n).padStart(10, '0')

export function isValidLevel(level) {
  return DESIGNATION_LEVELS.includes(level)
}

// Diese Datei listet alle unterstützten Schlosstypen samt Icons.
export const LOCK_TYPE_OPTIONS = [
  { value: 'house', label: 'Haustür / Wohnungstür', icon: '🚪' },
  { value: 'car_mechanical', label: 'Auto (mechanisch)', icon: '🚗' },
  { value: 'car_electronic', label: 'Auto (elektronisch / Wegfahrsperre)', icon: '🚘' },
  { value: 'bike', label: 'Fahrradschloss', icon: '🚲' },
  { value: 'padlock', label: 'Vorhängeschloss', icon: '🔒' },
  { value: 'safe', label: 'Tresor', icon: '🧰' },
  { value: 'smart', label: 'Bluetooth-/Smartlock', icon: '📱' },
  { value: 'mailbox', label: 'Briefkasten', icon: '📬' },
  { value: 'other', label: 'Sonstiges', icon: '🧩' }
]

export const LOCK_TYPE_LABELS = Object.fromEntries(
  LOCK_TYPE_OPTIONS.map(o => [o.value, o.label])
)
export const LOCK_TYPE_ICONS = Object.fromEntries(
  LOCK_TYPE_OPTIONS.map(o => [o.value, o.icon])
)

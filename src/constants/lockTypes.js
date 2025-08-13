export const LOCK_TYPE_OPTIONS = [
  { value: 'house', label: 'Haustür / Wohnungstür' },
  { value: 'car_mechanical', label: 'Auto (mechanisch)' },
  { value: 'car_electronic', label: 'Auto (elektronisch / Wegfahrsperre)' },
  { value: 'bike', label: 'Fahrradschloss' },
  { value: 'padlock', label: 'Vorhängeschloss' },
  { value: 'safe', label: 'Tresor' },
  { value: 'smart', label: 'Bluetooth-/Smartlock' },
  { value: 'mailbox', label: 'Briefkasten' },
  { value: 'other', label: 'Sonstiges' }
]

export const LOCK_TYPE_LABELS = Object.fromEntries(LOCK_TYPE_OPTIONS.map(o => [o.value, o.label]))

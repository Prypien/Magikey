# Standortbestimmung: Warum ist der Standort nicht immer exakt?

Wenn Nutzer:innen in Magikey den Standort ermitteln lassen, verwenden wir die Geolocation-API des Browsers. Diese Schnittstelle kann je nach Gerät, Verbindung und Berechtigungen unterschiedlich genaue Koordinaten liefern. Die wichtigsten Einflussfaktoren:

- **Art der Standortquelle:** Smartphones mit aktivem GPS bestimmen den Standort oft auf wenige Meter genau. Auf Desktop-Geräten oder in Gebäuden nutzt der Browser häufig WLAN- oder IP-Daten – hier sind Abweichungen im Bereich von mehreren hundert Metern normal.
- **WLAN- und Mobilfunkabdeckung:** Die Genauigkeit steigt, wenn bekannte WLAN-Netze oder Mobilfunkmasten in der Nähe sind. In ländlichen Regionen oder Neubauten, die noch nicht in Datenbanken erfasst sind, kann der Standort leicht in der Nachbarstraße oder im nächsten Ortsteil landen.
- **Browser-Berechtigungen:** Blockiert der oder die Nutzer:in die präzise Standortfreigabe (z. B. „Ungefähren Standort teilen“ in iOS), liefert der Browser absichtlich einen weniger genauen Punkt.
- **Zeitpunkt der Messung:** Einige Browser cachen Koordinaten. Direkt nach dem Aktivieren des Standortdienstes kann deshalb kurzfristig ein älterer Messpunkt zurückgegeben werden.

## Empfohlene Hinweise für Support & Produkt

- Weisen Sie Kund:innen darauf hin, dass leichte Abweichungen normal sind und vor allem die richtige Stadt bzw. Postleitzahl erkannt werden sollte.
- Bitten Sie Nutzer:innen, GPS zu aktivieren, nach Möglichkeit ins Freie zu gehen und den Standort erneut zu ermitteln, wenn sie eine höhere Genauigkeit benötigen.
- Prüfen Sie bei wiederholten Abweichungen, ob das verwendete Gerät Geolocation grundsätzlich unterstützt und ob der Browser in den Einstellungen eine präzisere Freigabe erlaubt.
- Dokumentieren Sie größere Abweichungen (mehrere Kilometer) mit Gerät, Browser und Zeitstempel. So kann das Team die Anfrage gezielt prüfen und z. B. Vergleichstests durchführen.

Diese Hinweise können im Help-Center oder in einer FAQ-Sektion eingebunden werden, damit Nutzer:innen verstehen, warum ihr Standort nicht immer zu 100 % exakt angezeigt wird.

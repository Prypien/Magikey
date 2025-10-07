# Google-Rezensionen einbinden

Damit die Google-Bewertungen eines Unternehmens direkt im Magikey-Profil erscheinen, benötigt das Frontend einen geeigneten Link zum Unternehmensprofil oder zu den Bewertungen. Die folgenden Schritte helfen dir bei der Einrichtung.

## 1. Link aus Google Maps kopieren
1. Öffne das Unternehmensprofil in Google Maps.
2. Klicke auf **Teilen**.
3. Wähle **Link kopieren**. Der kopierte Link enthält in der Regel die sogenannte `cid`-Kennung.
4. Hinterlege den Link im Admin-Dashboard im Feld **Google Unternehmensprofil** oder **Google Rezensionen**.

Das Frontend erkennt seit diesem Update auch Links, deren Kennung in der Form `:0x...` im Pfad steckt, und wandelt sie automatisch in einen einbettbaren Link um.

## 2. Optional: Einbettungscode verwenden
1. Öffne erneut das Unternehmensprofil in Google Maps.
2. Klicke auf **Teilen** und dann auf **In Karte einbetten**.
3. Kopiere den HTML-Code und entnimm daraus den Wert des `src`-Attributs (`https://www.google.com/maps/embed?...`).
4. Trage diese URL ebenfalls in einem der beiden Google-Felder ein.

## 3. Ergebnis prüfen
* Öffne die Unternehmensansicht im Frontend.
* Im Abschnitt **Bewertungen** sollte nun die Google-Einbettung sichtbar sein.
* Falls weiterhin der Hinweis erscheint, dass die Bewertungen nicht geladen werden konnten, prüfe den hinterlegten Link erneut und stelle sicher, dass er von einer Google-Domain stammt.

> Tipp: Du kannst denselben Link sowohl für das Unternehmensprofil als auch für die Rezensionen hinterlegen. Wichtig ist nur, dass mindestens eines der beiden Felder gefüllt ist.

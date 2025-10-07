# E-Mail-Versand prüfen

Wenn aus Magikey keine Bewertungs-E-Mails mehr verschickt werden, gehe die folgenden Schritte durch.

## 1. Cloud Functions Konfiguration prüfen

Der Versand läuft über die Firebase Function `onReviewRequestCreated`. Diese benötigt die in [`docs/functions-config.md`](./functions-config.md) beschriebenen Konfigurationswerte. Prüfe sie mit:

```bash
firebase functions:config:get
```

Stelle sicher, dass mindestens folgende Werte gesetzt sind:

- `mailjet.api_key`
- `mailjet.api_secret`
- `reviews.sender_email`
- optional: `reviews.form_url`, `reviews.sender_name`, `reviews.reply_to_email`, `reviews.template_id`

Fehlen Werte, kannst du sie so setzen (Beispielwerte ersetzen):

```bash
firebase functions:config:set \
  mailjet.api_key="MJ_API_KEY" \
  mailjet.api_secret="MJ_API_SECRET" \
  reviews.sender_email="support@example.com" \
  reviews.form_url="https://example.com/review"
```

## 2. Firestore Trigger testen

Lege manuell ein Dokument in `review_requests` mit einer `customer_email` an. In der Firebase Console solltest du anschließend in den Logs der Funktion `onReviewRequestCreated` sehen, ob der Versand ausgelöst wurde.

Achte auf Fehlermeldungen vom Typ `Missing Mailjet/Firebase config`. Diese weisen direkt auf fehlende Konfigurationswerte hin.

## 3. Mailjet Konto prüfen

- Ist das Konto verifiziert und nicht im Sandbox-Modus?
- Gibt es Limitüberschreitungen oder geblockte Empfänger?
- Siehst du die Requests in den Mailjet Logs?

## 4. Client-Fehler ausschließen

Überprüfe, ob im Admin-Dashboard die Review-Anfrage erfolgreich erstellt wurde. Im Browser-Log solltest du nach einer erfolgreichen Anfrage eine ID für den Firestore-Eintrag sehen.

---

Wenn die Schritte nicht helfen, notiere dir die Fehlermeldungen aus den Cloud-Function-Logs und melde dich mit diesen Details.

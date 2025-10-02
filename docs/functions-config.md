# Funktionen-Konfiguration für den Bewertungsversand

Damit der Firestore-Trigger `onReviewRequestCreated` E-Mails über Mailjet versenden kann, müssen die folgenden Konfigurationswerte gesetzt werden. Verwende dafür die Firebase CLI in deinem Projektverzeichnis:

```bash
firebase functions:config:set \
  mailjet.api_key="MJ_API_KEY" \
  mailjet.api_secret="MJ_API_SECRET" \
  reviews.sender_email="support@example.com" \
  reviews.form_url="https://example.com/review" \
  reviews.subject="Bitte bewerten Sie unser Unternehmen" \
  reviews.template_id="123456"
```

Erläuterungen:

- `mailjet.api_key` / `mailjet.api_secret`: Zugangsdaten deines Mailjet-Accounts.
- `reviews.sender_email`: Absenderadresse, die in der E-Mail angezeigt wird.
- `reviews.form_url`: Basis-Link zum Bewertungsformular. Die Function hängt automatisch `companyId` und `requestId` als Query-Parameter an.
- `reviews.subject`: Optionaler Betreff, wenn kein Mailjet-Template verwendet wird.
- `reviews.template_id`: Optional. Wenn angegeben, wird das Mailjet-Template (ID als Zahl) mit folgenden `Variables` versorgt:
  - `companyName`
  - `contactType`
  - `reviewLink`
  - `companyId`
  - `requestId`

Weitere optionale Konfigurationswerte:

```bash
firebase functions:config:set reviews.reply_to_email="service@example.com"
```

Wenn `reviews.reply_to_email` gesetzt ist, wird es als Reply-To-Adresse verwendet.

Weitere optionale Felder:

- `reviews.sender_name`: Überschreibt den Absendernamen (Standard: Firmenname aus der Review-Anfrage).
- `reviews.reply_to_name`: Name für die Reply-To-Adresse.

> Hinweis: In der lokalen Entwicklung wird kein echter Mailversand ausgelöst. Stattdessen schreibt der Client-Service `src/services/review.js` einen Hinweis in die Konsole, welche E-Mail simuliert wurde.

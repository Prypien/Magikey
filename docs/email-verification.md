# E-Mail-Verifizierung konfigurieren

Damit Firebase-Verifizierungslinks korrekt auf die Magikey-Web-App zeigen, führe diese Schritte aus.

## 1. Template-Platzhalter verwenden

Öffne in der Firebase Console den Bereich **Authentication → Templates → Email Address Verification**.

- Nutze im Nachrichtentext den Platzhalter `%LINK%`. Firebase ersetzt ihn automatisch durch den vollständigen Verifizierungslink inklusive `oobCode`.
- Weitere Platzhalter wie `%DISPLAY_NAME%` oder `%APP_NAME%` können nach Bedarf verwendet werden.

Der relevante Ausschnitt kann zum Beispiel so aussehen:

```
Hallo %DISPLAY_NAME%,

Klicken Sie auf den folgenden Link, um Ihre E-Mail-Adresse zu bestätigen:

%LINK%

Viele Grüße,
Ihr %APP_NAME%-Team
```

Verzichte darauf, statische Links im Template zu hinterlegen – sonst ignoriert Firebase die Action-Link-Einstellungen.

## 2. Autorisierte Domains pflegen

Gehe zu **Authentication → Sign-in method → Authorized domains** und füge mindestens folgende Einträge hinzu:

- `magikey.de`
- `www.magikey.de`

Firebase verwendet diese Domains, um den Basis-Link für die E-Mail zu erstellen.

## 3. Action URL hinterlegen

Im Abschnitt für die E-Mail-Verifizierung findest du den Button **Neu beginnen**. Hinterlege dort als Action- bzw. Redirect-URL:

```
https://magikey.de/verify
```

Diese Route verarbeitet in der Web-App den Bestätigungs-Code.

## 4. Versand aus der App konfigurieren

Der Aufruf von `sendEmailVerification` stellt sicher, dass Firebase den Link auf die App lenkt:

```js
await sendEmailVerification(user, {
  url: 'https://magikey.de/verify',
  handleCodeInApp: true,
})
```

In der Codebasis wird die URL dynamisch über `getAppUrl()` ermittelt, sodass lokale Entwicklungs-Hosts ebenfalls funktionieren.【F:src/core/services/auth.js†L15-L101】

## 5. Verifizierung in der App verarbeiten

Die Route `/verify` liest den `oobCode` aus der URL und ruft `applyActionCode`, um die Verifizierung abzuschließen. Anschließend werden Unternehmensdaten aktualisiert und dem Nutzer eine Erfolgsmeldung angezeigt.【F:src/features/auth/pages/VerifyEmailView.vue†L1-L87】

Wenn der `oobCode` fehlt oder ungültig ist, blendet die Seite eine Fehlermeldung ein.

---

Mit dieser Konfiguration erzeugt Firebase Links im Format `https://magikey.de/verify?mode=verifyEmail&oobCode=...`, die direkt in der Magikey-App bestätigt werden können.

# Email Service Setup

Val Store uses **Resend** for transactional emails.

## Setup

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Create a free account (3,000 emails/month free tier)
3. Go to **API Keys** and create a new key

### 2. Add Environment Variables

```env
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Val Store <noreply@yourdomain.com>"
```

> **Note:** For production, you'll need to verify your domain in Resend.

### 3. Domain Verification (Production)

1. In Resend dashboard, go to **Domains**
2. Add your domain
3. Add the DNS records (SPF, DKIM, DMARC)
4. Wait for verification

## Email Types

| Email              | Trigger         | Template                   |
| ------------------ | --------------- | -------------------------- |
| Verification       | User signup     | `sendVerificationEmail()`  |
| Password Reset     | Forgot password | `sendPasswordResetEmail()` |
| Order Confirmation | Order placed    | `sendOrderConfirmation()`  |
| Welcome            | Email verified  | `sendWelcomeEmail()`       |

## Architecture

```
src/
├── application/interfaces/
│   └── email.interface.ts        # Contract definition
└── infrastructure/services/
    └── resend-email.service.ts   # Resend implementation
```

## Testing

Send a test email:

```typescript
import { container } from "@/application/container";

const emailService = container.getEmailService();
await emailService.sendEmail({
  to: "test@example.com",
  subject: "Test Email",
  html: "<p>Hello World</p>",
});
```

## Troubleshooting

- **Emails not sending:** Check `RESEND_API_KEY` is set
- **Emails going to spam:** Verify domain DNS records
- **Rate limits:** Free tier allows 100 emails/day

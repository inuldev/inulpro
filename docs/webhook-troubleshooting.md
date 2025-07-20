# Webhook Troubleshooting Guide

## Masalah Umum Webhook di Production

### 1. Middleware Memblokir Webhook

**Masalah**: Middleware Arcjet memblokir request webhook dari Stripe.

**Solusi**: Pastikan endpoint webhook dikecualikan dari middleware:

```javascript
// middleware.ts
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/webhook).*)",
  ],
};
```

### 2. Webhook Secret Tidak Sesuai

**Masalah**: `STRIPE_WEBHOOK_SECRET` di production berbeda dengan yang dikonfigurasi di Stripe.

**Cara Cek**:

1. Login ke Stripe Dashboard
2. Pergi ke Developers > Webhooks
3. Pilih webhook endpoint production
4. Copy "Signing secret"
5. Pastikan sama dengan `STRIPE_WEBHOOK_SECRET` di environment variables

### 3. URL Webhook Tidak Benar

**Masalah**: URL webhook di Stripe Dashboard tidak mengarah ke production URL.

**Cara Cek**:

1. Stripe Dashboard > Developers > Webhooks
2. Pastikan endpoint URL: `https://your-domain.com/api/webhook/stripe`
3. Pastikan event `checkout.session.completed` diaktifkan

### 4. Database Connection Issues

**Masalah**: Database tidak dapat diakses dari production environment.

**Cara Cek**:

1. Pastikan `DATABASE_URL` benar di production
2. Cek koneksi database dari production server
3. Pastikan Prisma client ter-generate dengan benar

## Debugging Steps

### 1. Cek Logs Production

```bash
# Vercel
vercel logs

# Railway
railway logs

# Heroku
heroku logs --tail
```

### 2. Test Webhook Manually

```bash
# Set environment variables
export WEBHOOK_URL="https://your-domain.com/api/webhook/stripe"
export STRIPE_WEBHOOK_SECRET="whsec_your_secret"

# Run test script
node scripts/test-webhook.mjs
```

### 3. Cek Stripe Webhook Logs

1. Stripe Dashboard > Developers > Webhooks
2. Pilih webhook endpoint
3. Lihat tab "Attempts" untuk melihat response dari server

### 4. Monitoring Database

```sql
-- Cek enrollment yang masih pending
SELECT * FROM "Enrollment" WHERE status = 'Pending' ORDER BY "createdAt" DESC;

-- Cek user dengan stripe customer ID
SELECT id, email, "stripeCustomerId" FROM "User" WHERE "stripeCustomerId" IS NOT NULL;
```

## Environment Variables Checklist

### Development

- `STRIPE_SECRET_KEY`: `sk_test_...`
- `STRIPE_WEBHOOK_SECRET`: `whsec_...` (dari test webhook)
- `BETTER_AUTH_URL`: `http://localhost:3000`

### Production

- `STRIPE_SECRET_KEY`: `sk_live_...`
- `STRIPE_WEBHOOK_SECRET`: `whsec_...` (dari live webhook)
- `BETTER_AUTH_URL`: `https://your-domain.com`

## Common Error Messages

### "Webhook signature verification failed"

- Cek `STRIPE_WEBHOOK_SECRET`
- Pastikan tidak ada middleware yang mengubah request body

### "Course ID missing" / "Enrollment ID missing"

- Cek metadata di Stripe checkout session
- Pastikan `courseId` dan `enrollmentId` dikirim dengan benar

### "User not found"

- Cek apakah user memiliki `stripeCustomerId`
- Pastikan customer ID di Stripe sesuai dengan database

### "Enrollment not found"

- Cek apakah enrollment dibuat sebelum checkout
- Pastikan `enrollmentId` di metadata benar

## Testing Checklist

- [ ] Webhook endpoint dapat diakses dari internet
- [ ] Middleware tidak memblokir `/api/webhook/stripe`
- [ ] Environment variables benar di production
- [ ] Database connection berfungsi
- [ ] Stripe webhook secret sesuai
- [ ] Event `checkout.session.completed` diaktifkan
- [ ] Metadata `courseId` dan `enrollmentId` dikirim dengan benar

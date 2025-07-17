# Setup Email OTP dengan Gmail

## Konfigurasi Gmail SMTP

### 1. Persiapan Akun Gmail

1. **Aktifkan 2-Factor Authentication**

   - Buka [Google Account Security](https://myaccount.google.com/security)
   - Aktifkan "2-Step Verification"

2. **Generate App Password**
   - Setelah 2FA aktif, buka [App Passwords](https://myaccount.google.com/apppasswords)
   - Pilih "Mail" sebagai app
   - Pilih "Other" sebagai device, masukkan "InulPRO"
   - Copy password yang dihasilkan (16 karakter)

### 2. Environment Variables

Tambahkan ke file `.env`:

```env
# Email Server Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="465"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-16-char-app-password"
```

### 3. Fitur yang Diimplementasikan

#### ✅ **Optimasi Performa**

- **Singleton Transporter**: Koneksi SMTP di-reuse untuk efisiensi
- **Timeout Optimization**: Konfigurasi timeout yang optimal (60s connection, 30s greeting)
- **TLS Security**: Enforced SSL/TLS dengan certificate validation

#### ✅ **Rate Limiting**

- **Maksimal 5 OTP per 15 menit** per email
- **Minimum 1 menit** antara request OTP
- **Auto cleanup** expired entries

#### ✅ **Template Email Professional**

- **Responsive HTML template** dengan branding InulPRO
- **Fallback text version** untuk email client lama
- **Security warnings** dalam bahasa Indonesia
- **Professional styling** dengan gradient header

#### ✅ **Error Handling & Retry**

- **Retry mechanism** dengan exponential backoff
- **Detailed error logging** untuk debugging
- **Graceful error messages** untuk user

#### ✅ **Security Features**

- **Environment validation** dengan Zod schema
- **TLS/SSL enforcement** untuk koneksi aman
- **Email headers** untuk better deliverability

### 4. Penggunaan

```typescript
import { sendOTPEmail, getOTPRateLimit } from "@/lib/email";

// Kirim OTP
try {
  await sendOTPEmail("user@example.com", "123456");
  console.log("OTP sent successfully");
} catch (error) {
  console.error("Failed to send OTP:", error.message);
}

// Check rate limit
const stats = getOTPRateLimit("user@example.com");
console.log(`Remaining attempts: ${stats.remaining}`);
```

### 5. Monitoring & Debugging

#### Rate Limit Stats

```typescript
import { getOTPRateLimit } from "@/lib/auth";

const stats = getOTPRateLimit("user@example.com");
console.log({
  requests: stats.requests,
  remaining: stats.remaining,
  resetTime: stats.resetTime,
  lastRequest: stats.lastRequest,
});
```

#### Reset Rate Limit (untuk testing)

```typescript
import { resetOTPRateLimit } from "@/lib/auth";

resetOTPRateLimit("user@example.com");
```

### 6. Troubleshooting

#### Error: "Invalid login credentials"

- Pastikan menggunakan App Password, bukan password biasa
- Pastikan 2FA sudah aktif di akun Gmail

#### Error: "Rate limit exceeded"

- User sudah mencapai batas maksimal request
- Tunggu hingga window reset (15 menit)

#### Error: "Connection timeout"

- Periksa koneksi internet
- Pastikan firewall tidak memblokir port 465

### 7. Production Considerations

1. **Redis Rate Limiting**: Untuk production, ganti in-memory rate limiting dengan Redis
2. **Email Queue**: Implementasikan queue system untuk high volume
3. **Monitoring**: Setup monitoring untuk email delivery rates
4. **Backup SMTP**: Siapkan backup SMTP provider (SendGrid, Mailgun)

### 8. Alternative SMTP Providers

Jika tidak ingin menggunakan Gmail:

#### SendGrid

```env
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"
```

#### Mailgun

```env
EMAIL_SERVER_HOST="smtp.mailgun.org"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-mailgun-smtp-user"
EMAIL_SERVER_PASSWORD="your-mailgun-smtp-password"
```

# 🎓 InulPRO - Modern Learning Management System

InulPRO adalah platform Learning Management System (LMS) modern yang dibangun dengan teknologi terdepan untuk memberikan pengalaman pembelajaran online yang interaktif dan berkualitas tinggi.

![InulPRO Logo](./public/logo.png)

## ✨ Fitur Utama

- 🎯 **Manajemen Kursus Lengkap** - Sistem hierarki Course → Chapter → Lesson
- 💳 **Pembayaran Terintegrasi** - Stripe payment gateway untuk enrollment
- 📊 **Progress Tracking** - Pelacakan kemajuan belajar real-time
- 🔐 **Autentikasi Modern** - Better-Auth dengan email OTP
- 🛡️ **Keamanan Tingkat Tinggi** - Arcjet protection (rate limiting, bot detection)
- 📱 **Responsive Design** - UI modern dengan Shadcn/ui components
- ☁️ **Cloud Storage** - AWS S3 integration untuk media files
- 👨‍💼 **Multi-Role System** - Admin dan user management

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework dengan App Router
- **React 19** - Latest React version
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components

### Backend

- **PostgreSQL** - Primary database
- **Prisma ORM** - Database toolkit
- **Better-Auth** - Authentication system
- **Stripe** - Payment processing
- **AWS S3** - File storage

### Security & Performance

- **Arcjet** - Security layer
- **Zod** - Schema validation
- **Rate Limiting** - API protection
- **Image Optimization** - Next.js built-in

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS S3 bucket
- Stripe account

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd inulpro
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env.local
```

Isi file `.env.local` dengan konfigurasi berikut:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/inulpro"

# Authentication
AUTH_SECRET="your-auth-secret"
AUTH_GITHUB_CLIENT_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="your-region"
AWS_BUCKET_NAME="your-bucket-name"

# Arcjet Security
ARCJET_KEY="your-arcjet-key"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

4. **Setup database**

```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run development server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Proyek

```
inulpro/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── api/               # API routes
│   └── data/              # Server actions & data fetching
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── sidebar/          # Navigation components
│   └── general/          # Custom components
├── lib/                   # Utilities & configurations
│   ├── auth.ts           # Authentication config
│   ├── db.ts             # Database connection
│   ├── stripe.ts         # Stripe configuration
│   └── s3-utils.ts       # AWS S3 utilities
├── prisma/               # Database schema
├── hooks/                # Custom React hooks
└── docs/                 # Documentation
```

## 🗄️ Database Schema

### Core Models

- **User** - User accounts dengan role management
- **Course** - Kursus dengan metadata lengkap
- **Chapter** - Bab dalam kursus
- **Lesson** - Pelajaran individual
- **Enrollment** - Pendaftaran kursus
- **LessonProgress** - Progress tracking

### Relationships

```
User 1:N Course (sebagai creator)
User 1:N Enrollment
Course 1:N Chapter
Chapter 1:N Lesson
User N:M Lesson (melalui LessonProgress)
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Development server dengan Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint checking
npm run postinstall  # Generate Prisma client
```

### Database Operations

```bash
npx prisma studio              # Database GUI
npx prisma migrate dev         # Create migration
npx prisma migrate reset       # Reset database
npx prisma generate           # Generate client
npx prisma db push            # Push schema changes
```

## 🚀 Deployment

### Environment Setup

1. **Production Database** - Setup PostgreSQL
2. **AWS S3** - Configure bucket dan permissions
3. **Stripe** - Setup webhook endpoints
4. **Environment Variables** - Set semua required vars

### Vercel Deployment

```bash
npm run build
vercel --prod
```

### Docker Deployment

```dockerfile
# Dockerfile tersedia untuk containerization
docker build -t inulpro .
docker run -p 3000:3000 inulpro
```

## 🔐 Security Features

- **Rate Limiting** - API endpoint protection
- **Bot Detection** - Automated bot filtering
- **Input Validation** - Zod schema validation
- **CSRF Protection** - Built-in Next.js protection
- **SQL Injection Prevention** - Prisma ORM protection

## 📊 Monitoring & Analytics

- **Performance Monitoring** - Built-in Next.js analytics
- **Error Tracking** - Ready for Sentry integration
- **User Analytics** - Course completion tracking
- **Payment Analytics** - Stripe dashboard integration

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@inulpro.com
- 📖 Documentation: [docs/](./docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

### Learning Resources

This project was built following the excellent tutorial series by **Jan Marshal**:

- 📺 **YouTube Tutorial**: [Create an LMS Course Platform with Next.js, Arcjet, Better-Auth, and Stripe](https://www.youtube.com/channel/UCxxxxxx)
  - [Part 1/2](https://www.youtube.com/watch?v=xqoYkX4hfwg) - Project Setup & Authentication
  - [Part 2/2](https://www.youtube.com/watch?v=XCLKnEKwRa0) - Course Management & Payment Integration

### Technologies & Libraries

- [Next.js](https://nextjs.org/) - React framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Prisma](https://prisma.io/) - Database toolkit
- [Better-Auth](https://better-auth.com/) - Authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Arcjet](https://arcjet.com/) - Security & rate limiting

# Kantine Gjest Portal

[![Next.js Version](https://img.shields.io/badge/Next.js-14.2-blue?logo=next.js)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-3178C6)](https://www.typescriptlang.org/)

A modern canteen management system bootstrapped with Next.js, featuring a admin panel for fishing of mobile numbers

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+
- npm 9+ (or yarn/pnpm/bun)
- PostgreSQL 15+

### Installation
```bash
git clone https://github.com/DanielOM999/kantine-gjest-portal.git
cd kantine-gjest-portal
npm install  # or yarn/pnpm/bun install
```

### Environment Setup
1. Create `.env` file:
```env
DATABASE_URL="postgres://user:password@localhost:5432/dbname"
DB_SSL="false"
ADMIN_PASSWORD="your_secure_password"
```

2. Make an `.env.local` for client-side variables:
```bash
npm run keyGen  # generates ADMIN_HASH to place in the .env.local
```

### Development
```bash
npm run dev  # or yarn/pnpm/bun dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.  

## 🔧 Built With
- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Geist Font](https://vercel.com/font) - Optimized through next/font

## 📚 Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Interactive Next.js Tutorial](https://nextjs.org/learn)
- [Vercel Deployment Guide](https://nextjs.org/docs/deployment)

## 📄 License
MIT License - See [LICENSE.md](LICENSE.md) for details.

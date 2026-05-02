# Prode 2026 - Agente Context

## Project Overview

World Cup 2026 predictions app (Prode). Built with Next.js 14, TypeScript, Tailwind, Firebase (Firestore + Auth).

**Goal:** Friends group competition to predict match results and individual awards.

## Tech Stack

- **Frontend:** Next.js 14.2.35 (App Router)
- **Styling:** Tailwind CSS v3
- **Backend:** Firebase (Firestore + Auth)
- **Deployment:** Vercel

## Project Structure

```
prode26/
├── src/
│   ├── app/
│   │   ├── auth/           # Login/Register page
│   │   ├── dashboard/      # Protected routes (requires auth)
│   │   │   ├── pronosticos/   # Predictions for group stage (72 matches)
│   │   │   ├── posiciones/    # Leaderboard with points calculation
│   │   │   ├── premios/       # Individual awards (goleador, asistidor, MVP)
│   │   │   ├── eliminatoria/ # Knockout phase predictions (locked until groups end)
│   │   │   └── reglamento/  # Rules and scoring system
│   │   └── layout.tsx    # Main layout
│   ├── context/
│   │   └── AuthContext.tsx  # Firebase auth state
│   ├── hooks/
│   │   └── usePartidos.ts    # Firestore hooks for matches and predictions
│   ├── lib/
│   │   ├── firebase.ts      # Firebase config
│   │   └── banderas.ts      # Country flag emoji mapping
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces and point calculation
│   ├── data/
│   │   └── partidos.ts     # 72 group stage matches data
│   └── scripts/            # Firebase loading scripts
└── public/
```

## Key Concepts

### Scoring System

| Phase | Exact | Winner | Max Points |
|-------|-------|--------|------------|
| Group Stage (72 matches) | 5 pts | 2 pts | 360 |
| Knockout (16 matches) | 7 pts | 3 pts | 112 |
| Awards (3 items) | 5 pts each | - | 15 |
| **TOTAL** | | | **487 pts** |

### Tie/Draw Handling
- Exact score (e.g., 1-1 predicted, 1-1 result) = 5 pts (groups) / 7 pts (knockout)
- Predicted any draw (0-0, 1-1, 2-2) + actual draw = Winner = 2 pts (groups) / 3 pts (knockout)
- Predicted winner + actual draw = 0 pts

### Firestore Collections

- `usuarios` - User accounts (uid, email, displayName)
- `partidos` - All 72 group stage matches
  - Fields: id, fase, grupo, fechaInicio, equipoA/B, nombreA/B, resultado{golesA, golesB}, estadio
- `pronosticos` - User predictions
  - Fields: usuarioId, partidoId, golesPredichoA, golesPredichoA, creadoEn, actualizadoEn
- `pronosticosPremios` - Individual awards predictions
  - Fields: usuarioId, tipo (goleador/asistidor/mvp), valorPredicho, creadoEn

## Routes & Access

- `/` - Landing (unauthenticated redirect to /auth)
- `/auth` - Login/Register
- `/dashboard` - Main dashboard (requires auth)
- `/dashboard/pronosticos` - Group stage predictions
- `/dashboard/posiciones` - Leaderboard
- `/dashboard/premios` - Individual awards
- `/dashboard/eliminatoria` - Knockout (currently locked placeholder)
- `/dashboard/reglamento` - Rules

## Test Users

| Name | Email | Password |
|------|-------|----------|
| test | test@email.com | test123 |
| test2 | test2@email.com | test123 |
| Carlos Test | carlos.test@prode26.com | CarlosTest123! |
| María Test | maria.test@prode26.com | MariaTest123! |

## Scripts (src/scripts/)

- `cargarPartidosCorregido.ts` - Load 72 matches to Firestore with correct IDs
- `recargarPredicciones.ts` - Regenerate all predictions for all users
- `cargarResultadosTest.ts` - Load random test results for all matches
- `diagnosticar.ts` - Debug script to check Firestore data

Run with: `npx tsx src/scripts/<script-name>.ts`

## UI Conventions

- Dark theme with slate-900 backgrounds
- Amber-400 primary accent color
- Mobile-first responsive design
- Touch targets minimum 44x44px
- SVG icons from Lucide React (no emoji for UI elements)

## Common Issues

1. **Build fails with TypeScript errors** - Check for unused imports and `any` types in scripts
2. **Points showing 0** - Usually means partidoId mismatch; run the correction scripts
3. **Firebase not connecting** - Check .env.local has correct VITE_ variables

## Environment Variables (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Admin

- Admin UID for special access: YANsZ4IXZ6WmtaRRemOqh17UOOJ3 (test@email.com)
- Firestore rules currently open (allow read, write: if true) - needs restriction for production
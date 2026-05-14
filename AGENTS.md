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
│   │   │   ├── eliminatoria/  # Knockout phase predictions (16 matches)
│   │   │   ├── reglamento/    # Rules and scoring system
│   │   │   └── admin/         # Admin panel for configuration
│   │   └── layout.tsx        # Main layout
│   ├── context/
│   │   ├── AuthContext.tsx      # Firebase auth state
│   │   └── LanguageContext.tsx  # i18n (ES/IT)
│   ├── hooks/
│   │   ├── usePartidos.ts       # Firestore hooks for matches and predictions
│   │   └── useAdmin.ts          # Admin check hook
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
| Awards (3 items) | 15 pts each | - | 45 |
| **TOTAL** | | | **517 pts** |

### Tie/Draw Handling
- Exact score (e.g., 1-1 predicted, 1-1 result) = 5 pts (groups) / 7 pts (knockout)
- Predicted any draw (0-0, 1-1, 2-2) + actual draw = Winner = 2 pts (groups) / 3 pts (knockout)
- Predicted winner + actual draw = 0 pts

### Firestore Collections

- `usuarios` - User accounts (uid, email, displayName)
- `partidos` - All matches (72 group stage + 16 knockout)
  - Fields: id, fase, grupo, fechaInicio, equipoA/B, nombreA/B, resultado{golesA, golesB}, estadio
  - fase: 'grupos' | 'eliminatoria'
  - ronda (eliminatoria only): '16avos' | 'octavos' | 'cuartos' | 'semis' | 'tercer-puesto' | 'final'
- `pronosticos` - User predictions
  - Fields: usuarioId, partidoId, golesPredichoA, golesPredichoB, creadoEn, actualizadoEn
- `pronosticosPremios` - Individual awards predictions
  - Fields: usuarioId, tipo (goleador/asistidor/mvp), valorPredicho, creadoEn
- `config/admin` - Admin configuration (uid, pozo percentages, etc.)

### Match Status Logic

Matches have 3 states based on current time vs fechaInicio:
- **countdown**: Match hasn't started yet
- **live**: Match is in progress (assumed ~2h45m duration)
- **cerrado**: Match has finished

## Routes & Access

- `/` - Landing (unauthenticated redirect to /auth)
- `/auth` - Login/Register
- `/dashboard` - Main dashboard (requires auth)
- `/dashboard/pronosticos` - Group stage predictions with group tabs (A-L)
- `/dashboard/posiciones` - Leaderboard with position vs leader
- `/dashboard/premios` - Individual awards
- `/dashboard/eliminatoria` - Knockout phase with phase tabs (16avos-final)
- `/dashboard/reglamento` - Rules
- `/dashboard/admin` - Admin panel (only admin user)

## Test Users

| Name | Email | Password |
|------|-------|----------|
| test | test@email.com | test123 |
| test2 | test2@email.com | test123 |
| Carlos Test | carlos.test@prode26.com | CarlosTest123! |
| María Test | maria.test@prode26.com | MariaTest123! |

## Scripts (src/scripts/)

### Admin Configuration

- `inicializarAdmin.ts` - Inicializa la configuración del admin en Firestore
  - Crea documento `config/admin` con tu UID y configuración inicial del pozo
  - Run: `npx tsx src/scripts/inicializarAdmin.ts`
  - Run con flag `--ver` para ver config actual: `npx tsx src/scripts/inicializarAdmin.ts --ver`

### Loading/Correcting Data

- `cargarPartidosCorregido.ts` - Load 72 group stage matches to Firestore
  - Run: `npx tsx src/scripts/cargarPartidosCorregido.ts`

- `cargarEliminatoria.ts` - Load 32 knockout matches to Firestore (M73-M104)
  - Creates matches with "TBD" (Por definir) as team names
  - Run: `npx tsx src/scripts/cargarEliminatoria.ts`

### Assigning Teams

- `asignarEquiposEliminatoria.ts` - Assign actual teams to knockout matches
  - Edit EQUIPOS object in script before running
  - Maps partido numero (73-104) to team pairs according to FIFA regulations
  - Run: `npx tsx src/scripts/asignarEquiposEliminatoria.ts`

### Regenerating/Correcting

- `recargarPredicciones.ts` - Regenerate all predictions for all users
  - Run: `npx tsx src/scripts/recargarPredicciones.ts`

- `cargarResultadosTest.ts` - Load random test results for all matches
  - Run: `npx tsx src/scripts/cargarResultadosTest.ts`

### Debugging

- `diagnosticar.ts` - Debug script to check Firestore data
  - Run: `npx tsx src/scripts/diagnosticar.ts`

## UI Conventions

- Dark theme with slate-900 backgrounds
- Amber-400 primary accent color
- Mobile-first responsive design
- Touch targets minimum 44x44px
- SVG icons from Lucide React (no emoji for UI elements)
- Match status badges: countdown (amber), live (green pulse), cerrado (red lock)

## Common Issues

1. **Build fails with TypeScript errors** - Check for unused imports and `any` types in scripts
2. **Points showing 0** - Usually means partidoId mismatch; run the correction scripts
3. **Firebase not connecting** - Check .env.local has correct VITE_ variables
4. **Partidos "Por definir"** - Team names in eliminatoria need to be assigned via `asignarEquiposEliminatoria.ts`

## Environment Variables (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREMASES_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Admin Panel (/dashboard/admin)

Admin configurable via Firestore (colección `config/doc`). Solo el usuario con el UID configurado puede acceder.

### Primera vez: Inicializar Admin

1. Run: `npx tsx src/scripts/inicializarAdmin.ts`
   - Esto crea el documento `config/admin` con tu UID
   - Por defecto: pozo 50% / 30% / 20%, inscripción 25€

2. Accedé a `/dashboard/admin` (solo vos puedes ver esta página)

3. Desde el panel admin podés:
   - Ver participantes y pozo total
   - Modificar porcentajes del pozo (debe sumar 100%)
   - Ver cálculos automáticos de premios

### Si necesitas cambiar el Admin

1. **Editá** `src/scripts/inicializarAdmin.ts`
2. **Cambiá** el `adminUid` por el UID del nuevo admin
3. **Ejecutá** `npx tsx src/scripts/inicializarAdmin.ts`

```typescript
// En src/scripts/inicializarAdmin.ts, línea 10:
const CONFIG = {
  adminUid: 'TU_NUEVO_UID_AQUI',  // <-- Cambiar este valor
  // ...
};
```

### Para saber tu UID

1. Login en la app con tu usuario
2. Abrí Firebase Console → Authentication → usuarios
3. Copiá el UID del usuario

### Nota importante

- Solo **1 admin** a la vez (el UID configurado en `config/admin`)
- Si no existe el documento `config/admin`, nadie tiene acceso al panel admin

## Features Implemented

- **Countdown/Live status**: Match cards show countdown timer, live indicator (green glow + animated dot), or closed badge
- **Leaderboard vs leader**: Your position shows "Estás a X pts del líder" if not leading
- **Eliminatoria predictions**: Full knockout phase with phase tabs, predictions locked for "TBD" teams
- **Admin panel**: Configure admin UID and pozo percentages from /dashboard/admin
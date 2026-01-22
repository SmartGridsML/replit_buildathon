# FitForm - Fitness Planning App

## Overview
FitForm is a React Native/Expo fitness planning application that helps users create personalized workout plans based on their goals, equipment access, experience level, and any injuries. The app features guided workout sessions with timers, progress tracking, and form coaching.

## Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Web bundler**: Metro (Expo's built-in bundler)
- **Language**: TypeScript
- **Navigation**: React Navigation (native stack + bottom tabs)
- **Storage**: AsyncStorage for local data persistence

## Project Structure
```
├── App.tsx              # Main app entry point
├── navigation/          # Navigation configuration
├── screens/             # Screen components
│   ├── Home.tsx         # Dashboard with progress stats
│   ├── Plan.tsx         # Weekly workout plan
│   ├── Library.tsx      # Filterable exercise library
│   ├── FormCoach.tsx    # Pose detection with feedback
│   ├── WorkoutSession.tsx # Guided workout with timer
│   ├── WorkoutComplete.tsx # Completion celebration
│   └── Onboarding.tsx   # User profile setup
├── components/          # Reusable UI components
│   ├── ScreenBackground.tsx
│   ├── PlanCard.tsx
│   └── ExerciseCard.tsx
├── data/               # Data utilities and storage logic
│   ├── exercises.ts    # Exercise database (15 exercises)
│   ├── planGenerator.ts # Workout plan generation logic
│   └── storage.ts      # AsyncStorage keys
├── assets/             # Static assets (HTML for poses)
├── types.ts            # TypeScript type definitions
├── theme.ts            # App theming/styling constants
├── app.json            # Expo configuration
├── metro.config.js     # Metro bundler configuration
└── tsconfig.json       # TypeScript configuration
```

## Core Features
1. **Onboarding** - Collects goal, equipment, experience, injuries
2. **Weekly Plan Generator** - Creates personalized 3-5 day workout schedules
3. **Workout Session** - Guided timer with exercise progression and rest periods
4. **Progress Tracking** - Completed workouts count and day streaks
5. **Exercise Library** - Filterable by category (upper, lower, core, mobility)
6. **Form Coach** - Pose detection with real-time feedback cues

## Running the App
The app runs on port 5000 using Expo's web bundler:
```bash
npm run web
```

## Design System
The app uses a **minimalist white and black** aesthetic:
- **Background**: Clean white (#FFFFFF)
- **Accent**: Dark black (#1A1A1A)
- **Typography**: System fonts with clear hierarchy
- **Components**: Rounded pill buttons, subtle borders, soft shadows
- **Style**: iOS/Android native feel with elegant simplicity

Key design elements:
- Full-rounded (pill) buttons for primary actions
- Subtle card shadows with light borders
- Fitness/strength emoji illustrations (💪, 🏋️)
- Clean section headers with muted labels
- Filter chips for exercise categories
- Circular progress rings for timers

## Development Notes
- Uses Expo's Metro bundler for web (configured in app.json)
- AsyncStorage is used for local data persistence (workout plans, progress, preferences)
- React Navigation handles both stack and tab-based navigation
- Theme constants in `theme.ts` include COLORS, FONT, RADIUS, and SHADOWS
- Form Coach uses WebView with MediaPipe for pose detection

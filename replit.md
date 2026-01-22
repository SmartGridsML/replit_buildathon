# FitForm - Fitness Planning App

## Overview
FitForm is a React Native/Expo fitness planning application that helps users create personalized workout plans based on their goals, equipment access, experience level, and any injuries.

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
├── components/          # Reusable UI components
├── data/               # Data utilities and storage logic
│   ├── exercises.ts    # Exercise database
│   ├── planGenerator.ts # Workout plan generation logic
│   └── storage.ts      # AsyncStorage operations
├── assets/             # Static assets (HTML for poses, etc.)
├── types.ts            # TypeScript type definitions
├── theme.ts            # App theming/styling constants
├── app.json            # Expo configuration
├── metro.config.js     # Metro bundler configuration
└── tsconfig.json       # TypeScript configuration
```

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
- Yoga/fitness emoji illustrations
- Clean section headers with muted labels

## Development Notes
- Uses Expo's Metro bundler for web (configured in app.json)
- AsyncStorage is used for local data persistence (workout plans, preferences)
- React Navigation handles both stack and tab-based navigation
- Theme constants in `theme.ts` include COLORS, FONT, RADIUS, and SHADOWS

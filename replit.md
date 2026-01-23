# Pinnacle - Reach Your Peak

## Overview
Pinnacle is a React Native/Expo wellness application that helps users reach their pinnacle — physically, mentally, and intellectually. The app provides personalized workout plans, guided exercise sessions with timers, AI-powered form coaching, and educational content about fitness, nutrition, and recovery. The core ethos is empowering users to become the best version of themselves across body, mind, and spirit.

## Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Web bundler**: Metro (Expo's built-in bundler)
- **Language**: TypeScript
- **Navigation**: React Navigation (native stack + bottom tabs)
- **Storage**: AsyncStorage for local data persistence
- **Testing**: Jest with ts-jest

## Project Structure
```
├── App.tsx              # Main app entry point
├── navigation/          # Navigation configuration
├── screens/             # Screen components
│   ├── Landing.tsx      # Bold landing page with Pinnacle branding
│   ├── Home.tsx         # Dashboard with personalized greeting and stats
│   ├── Plan.tsx         # Weekly workout plan
│   ├── Library.tsx      # Filterable exercise library
│   ├── Learn.tsx        # Educational content about muscles/injuries
│   ├── FormCoach.tsx    # Pose detection with feedback
│   ├── WorkoutSession.tsx # Guided workout with timer
│   ├── WorkoutComplete.tsx # Completion celebration with XP rewards
│   ├── Achievements.tsx # Gamification: levels, badges, XP
│   └── Onboarding.tsx   # User profile setup with name
├── lib/                 # External integrations
│   └── spotify.ts       # Spotify API client (Replit integration)
├── components/          # Reusable UI components
│   ├── ScreenBackground.tsx
│   ├── PlanCard.tsx
│   └── ExerciseCard.tsx
├── data/               # Data utilities and storage logic
│   ├── exercises.ts    # Exercise database (15 exercises)
│   ├── learnContent.ts # Educational articles about fitness
│   ├── gamification.ts # XP, levels, achievements system
│   ├── planGenerator.ts # Workout plan generation logic
│   └── storage.ts      # AsyncStorage keys
├── __tests__/          # Jest unit tests
│   ├── gamification.test.ts
│   └── planGenerator.test.ts
├── __mocks__/          # Test mocks
├── assets/             # Static assets (HTML for poses)
├── types.ts            # TypeScript type definitions
├── theme.ts            # App theming/styling constants
├── jest.config.js      # Jest configuration
├── app.json            # Expo configuration
├── metro.config.js     # Metro bundler configuration
└── tsconfig.json       # TypeScript configuration
```

## Core Features
1. **Onboarding** - Collects name, goal, equipment, experience, injuries
2. **Personalized Dashboard** - "Hi {name}" greeting with XP level, workout stats, weekly progress, inspiration links (Spotify/YouTube)
3. **Gamification System** - 13 achievements, 10 levels, XP rewards for workouts and learning
4. **Weekly Plan Generator** - Creates personalized 3-5 day workout schedules
5. **Workout Session** - Guided timer with animated circular progress, exercise progression and rest periods
6. **Progress Tracking** - Completed workouts count, day streaks, weekly progress bar
7. **Exercise Library** - Filterable by category (upper, lower, core, mobility) with polished white-theme modals
8. **Learn Section** - Educational content about muscle groups, injury prevention, recovery, nutrition (11 topics)
9. **Form Coach** - Camera-based AI pose detection with MediaPipe, real-time rep counting and form feedback
10. **Achievements Screen** - View badges, level progress, and stats
11. **Content Links** - Direct links to Spotify workout playlists and YouTube form tutorials

## Gamification Details
### Levels (10 total)
- Level 1: Beginner (0 XP)
- Level 2: Novice (100 XP)
- Level 3: Apprentice (300 XP)
- Level 4: Intermediate (600 XP)
- Level 5: Skilled (1000 XP)
- Level 6: Advanced (1500 XP)
- Level 7: Expert (2200 XP)
- Level 8: Master (3000 XP)
- Level 9: Champion (4000 XP)
- Level 10: Legend (5500 XP)

### XP Sources
- Complete workout: 25 XP + 5 XP per exercise
- Read educational topic: 10 XP
- Unlock achievement: Varies (50-1000 XP)

### Achievements (13 total)
- Workout milestones (1, 5, 10, 25, 50 workouts)
- Streak milestones (3, 7, 14, 30 days)
- Exercise milestones (50, 200 exercises)
- Learning milestones (3 topics, all topics)

## Running the App
```bash
# Development
npm run web

# Run tests
npm test

# Run tests with coverage
npm test:coverage
```

## Expo Go Mobile Preview
To preview on a physical device:
1. Install Expo Go from expo.dev/go
2. In the Replit workspace, click "Preview on mobile device" button
3. Scan the QR code with Expo Go app

## Design System
The app uses a **minimalist white and black** aesthetic:
- **Background**: Clean white (#FFFFFF)
- **Accent**: Dark black (#1A1A1A)
- **Success**: Green (#22C55E)
- **Typography**: System fonts with clear hierarchy
- **Components**: Rounded pill buttons, subtle borders, soft shadows
- **Style**: iOS/Android native feel with elegant simplicity

Key design elements:
- Full-rounded (pill) buttons for primary actions
- Subtle card shadows with light borders
- Fitness/strength emoji illustrations (💪, 🏋️, 🧠)
- Clean section headers with muted labels
- Filter chips for exercise categories
- Progress bars and circular timers
- Level badges and XP displays
- Achievement cards with progress indicators

## Accessibility
- Semantic accessibility labels on interactive elements
- Clear role definitions (button, link)
- State descriptions (disabled, selected)
- High contrast text on backgrounds

## Development Notes
- Uses Expo's Metro bundler for web (configured in app.json)
- AsyncStorage is used for local data persistence (workout plans, progress, preferences, achievements)
- React Navigation handles both stack and tab-based navigation
- Theme constants in `theme.ts` include COLORS, FONT, RADIUS, and SHADOWS
- Form Coach uses WebView with MediaPipe for pose detection
- Learn section provides educational content about anatomy and injury prevention
- Gamification system tracks XP, levels, and achievements across the app
- Jest tests cover core gamification and plan generation logic

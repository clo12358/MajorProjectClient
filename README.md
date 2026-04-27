# Míra — Cycle Tracking App

Míra is a cross-platform mobile app for tracking menstrual cycles, logging symptoms and mood, writing journal entries, and visualising health trends over time. Built with Expo and React Native, it runs on iOS, Android, and web.

---

## Features

- **Period tracking** — log daily flow (Light / Medium / Heavy / Blood Clots), start and end periods, and see them marked on a visual calendar
- **Symptom logging** — choose from categorised symptoms (Mood, Pain, Energy, Sleep, Skin, and more) for any day
- **Journal** — write dated journal entries with a 5-level mood indicator; view and scroll your full history
- **Insights** — average cycle and period length, trend line charts, mood bar chart, and top logged symptoms
- **Calendar** — monthly view with period days and sex-drive days highlighted; tap any date for a full summary and quick log shortcut
- **Profile** — edit your name, DOB, height, and weight; upload a profile photo; export a PDF health report
- **Themes** — six built-in colour themes: Light, Dark, Rose, Sage, Lavender, Sunset

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo 55 (managed workflow) |
| Language | TypeScript 5.9 |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind 4 + Tailwind CSS 3 |
| API client | Axios 1.13 |
| Charts | react-native-gifted-charts |
| Calendar | react-native-calendars |
| Local storage | AsyncStorage |
| PDF export | expo-print + expo-sharing |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx          # Email/password login
│   │   └── register.tsx       # New account registration
│   ├── (tabs)/
│   │   ├── home.tsx           # Main dashboard
│   │   ├── calendar.tsx       # Monthly calendar view
│   │   ├── insights.tsx       # Analytics and charts
│   │   ├── profile.tsx        # User profile and settings
│   │   └── _layout.tsx        # Bottom tab navigator
│   ├── _layout.tsx            # Root layout (theme provider)
│   ├── index.tsx              # Redirects to login
│   ├── journal.tsx            # Journal entry editor
│   ├── all-journals.tsx       # Full journal history
│   ├── edit-profile.tsx       # Edit profile details
│   └── privacy-data.tsx       # Privacy policy
│
├── components/custom/         # App-specific UI components
│   ├── calendar-card.tsx
│   ├── date-chips.tsx
│   ├── day-card.tsx
│   ├── form-input.tsx
│   ├── info-card.tsx
│   ├── journal-card.tsx
│   ├── large-button.tsx
│   ├── legend.tsx
│   ├── mood-card.tsx
│   ├── pill-button.tsx
│   ├── privacy-data.tsx
│   ├── profile-card.tsx
│   ├── profile-image-card.tsx
│   ├── quote-card.tsx
│   ├── section-card.tsx
│   ├── settings-row.tsx
│   ├── stat-card.tsx
│   ├── symptom-category.tsx
│   ├── symptom-stat-card.tsx
│   └── toast.tsx
│
├── constants/
│   └── theme.ts               # Colour tokens for all 6 themes
│
├── context/
│   └── ThemeContext.tsx        # Global theme provider (persisted)
│
├── lib/
│   ├── axios.ts               # Axios instance with auth interceptor
│   ├── generateReport.ts      # PDF report generation
│   └── utils.ts               # Shared utility functions
│
└── global.css                 # Tailwind base imports
```

---

## Screens

### Home
The main daily logging screen. Shows a 63-day scrollable date chip strip (±30 days from today), the current cycle day, a random inspirational quote, period flow logging, symptom quick-select, and a journal preview. Navigating here from the Calendar with a date pre-selected will jump the chip strip to that date automatically.

### Calendar
A full monthly calendar with period days marked with water icons and sex & sex-drive days marked with heart icons. Tapping a date shows a summary card with the cycle day, flow level, and any logged symptoms, plus a **Log for this date** button that navigates to Home with that date pre-selected.

### Insights
Analytics for the logged history: average cycle length, average period length, cycle length trend (line chart, last 6 cycles), period length trend (line chart, last 6 periods), mood over time (bar chart), and top 3 most logged symptoms.

### Profile
View and edit profile details (name, date of birth, height, weight, avatar). Toggle notifications, choose a colour theme, export a PDF health report, view the privacy policy, and log out.

### Journal
Dated rich-text entry with a 5-level mood picker (Great / Good / Okay / Low / Awful). Accessible from the Home screen for any selected date.

---

## API

The backend is hosted at `https://majorprojectserver-production.up.railway.app/api`.

Authentication uses a Bearer token stored in AsyncStorage. The Axios instance in `src/lib/axios.ts` attaches this token automatically to every request.

Key endpoints:

| Method | Path | Purpose |
|---|---|---|
| POST | `/login` | Authenticate and receive token |
| POST | `/register` | Create new account |
| GET | `/me` | Fetch current user |
| POST | `/me` | Update user profile |
| GET/POST | `/periods` | List or start a period |
| PUT | `/periods/:id` | End a period |
| PUT | `/periods/:id/days` | Log flow for a specific day |
| GET | `/cycles` | All cycles |
| GET/POST | `/daily-logs` | Daily health logs |
| POST | `/daily-logs/:id/symptoms` | Save symptoms for a log |
| GET/POST | `/journals` | Journal entries |
| GET | `/categories` | Symptom categories |
| GET | `/symptoms` | All symptoms |

---

## Themes

Six colour themes are available, all switchable from the Profile screen and persisted across sessions:

| Name | Style |
|---|---|
| Light (Cloud) | Clean light with teal accents |
| Dark (Midnight) | Deep teal with bright highlights |
| Rose | Soft warm pinks |
| Sage | Calm natural greens |
| Lavender | Dreamy soft purples |
| Sunset | Warm peachy tones |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go on a physical device, or an iOS Simulator / Android Emulator

### Install and run

```bash
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

### Web

```bash
npx expo start --web
```

---

## Dependencies

Key runtime dependencies:

```
expo                             55.0.4
expo-router                      55.0.3
react-native                     0.83.2
typescript                       5.9.2
nativewind                       4.2.2
tailwindcss                      3.4.19
axios                            1.13.6
@react-native-async-storage/async-storage  2.2.0
react-native-gifted-charts       1.4.76
react-native-calendars           1.1314.0
react-native-svg                 15.15.3
expo-linear-gradient             55.0.13
expo-image-picker                55.0.11
expo-print                       55.0.9
expo-sharing                     55.0.14
@react-navigation/native         7.1.28
@react-navigation/bottom-tabs    7.7.3
```

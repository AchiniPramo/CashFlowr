# 💰 CashFlowr - Personal Finance Tracker(React Native + Expo + Firebase)

CashFlowr is a modern, intuitive personal finance management application built with React Native and Expo. Track your income and expenses, visualize your spending patterns, and take control of your financial health.

<div align="center">

[![Expo](https://img.shields.io/badge/Expo-54.0.0-000020?style=for-the-badge\&logo=expo\&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%2FFirestore%2FStorage-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🔥 Live Demo & Downloads

> **Video walkthrough:** Add your YouTube demo link here (optional)

> **APK download:** Add a Google Drive or release link here (optional)

---

## ✨ What is CashFlowr

CashFlowr helps users track income, expenses, accounts, and savings goals from a clean, fast mobile app. Built with Expo and Firebase, the project focuses on realtime sync, secure authentication, and a smooth mobile-first UX.

---

## 🚀 Key Features

* 🔐 **Authentication**: Email/password, Google Sign-In (Android), Apple Sign-In (iOS)
* 💳 **Accounts & Categories**: Create and manage accounts and categories with realtime listeners
* 💸 **Transactions**: Add/edit/delete transactions with balance updates and date-range filters
* 🎯 **Goals**: Create savings goals and track progress with visual indicators
* 🖼️ **Profile images**: Upload from camera/gallery to Firebase Storage
* 📊 **Dashboard**: Charts and summaries powered by `react-native-chart-kit` and animated UI with Moti

---

## 🛠 Tech Stack

* **Framework**: Expo (SDK 54), React Native 0.81, TypeScript
* **Navigation**: Expo Router / React Navigation
* **UI**: NativeWind (Tailwind for RN), Moti, LinearGradient
* **Backend**: Firebase Auth, Firestore, Storage
* **Build**: EAS (Expo Application Services)

---

## 📁 Project Structure

```
app/            # Screens & routing (Expo Router)
components/     # Reusable UI components
context/        # Auth & global contexts
services/       # Domain services (Account, Transaction, Goal, etc.)
types/          # TypeScript types & interfaces
utils/          # Helpers & utilities
firebase.ts     # Firebase initialization
eas.json        # EAS build profiles
```

---

## ⚙️ Setup (Local Development)

### Prerequisites

* Node.js (LTS)
* Expo CLI (`npm install -g expo-cli`)
* Android Studio (or a physical device)

### Install & run

```bash
git clone https://github.com/AchiniPramo/CashFlowr.git
cd CashFlowr
npm install
npm run start
# to run on Android
npm run android
```

> If you want to run in a dev client with native modules, use EAS dev builds.

---

## 🔑 Firebase Configuration

1. Create a Firebase project and enable **Authentication** (Email, Google, Apple)
2. Create Firestore database and set rules to protect user data
3. Create Storage bucket for profile images
4. Copy SDK config values into `firebase.ts` or use environment variables / EAS secrets

**Important:** Never commit API keys or service account files to the repo. Use `eas secret` or environment variables for production secrets.

---

## 📦 EAS Builds (APK)

```bash
npm install -g eas-cli
eas login
eas build:configure
# Build Android production APK
eas build -p android --profile production
```

Configure `eas.json` to match your versioning, keystore, and distribution preferences.

---

## 🧩 Services Architecture

Services encapsulate Firestore logic and provide a clean API for the UI:

* `AccountService` — CRUD, balances, realtime subscriptions
* `CategoryService` — default categories, search
* `TransactionService` — transaction CRUD, balance reconciliation
* `GoalService` — create/track/pay toward goals
* `UserProfileService` — upload profile images and update user metadata

---

## ✅ Troubleshooting

* **Google Sign-In issue**: Check SHA-1 fingerprint and `webClientId` in Firebase console
* **Storage upload fails**: Check Storage rules and Android permissions
* **App crashes / metro bundler**: Clear cache `expo start -c` and reinstall the app

---

## ✨ Contributing

Contributions are welcome! Please open issues for bugs and feature requests, and use pull requests for fixes. Keep commits small and include clear descriptions.

Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Open a pull request against `main`

---

## 📝 License

This project is released under the **MIT License**. See `LICENSE` for details.

---

## 🙌 Credits

Built with ❤️ using Expo, React Native, Firebase and the React Native community.

---

> *Replace demo / apk links and screenshots in this README with actual URLs and images from your project to make it production-ready.*


# 💰 CashFlowr - Personal Finance Tracker

CashFlowr is a modern, intuitive personal finance management application built with React Native and Expo. Track your income and expenses, visualize your spending patterns, and take control of your financial health.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=#D04A37)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

## ✨ Features

### 📊 Financial Tracking
- **Income & Expense Management**: Easily add, edit, and delete transactions
- **Categorization**: Organize transactions by custom categories
- **Real-time Updates**: Instant synchronization across all devices
- **Transaction History**: Complete history of all financial activities

### 📱 Beautiful Interface
- **Modern UI/UX**: Clean, intuitive design with smooth animations
- **Dark/Light Mode**: Support for both themes (coming soon)
- **Responsive Design**: Optimized for both mobile and web
- **Visual Charts**: Graphical representation of your finances (coming soon)

### 🔒 Security & Privacy
- **User Authentication**: Secure login with Firebase Auth
- **Data Encryption**: Your financial data is protected
- **Private by Design**: Your data stays yours - we don't sell or share it

### 🌟 Advanced Features
- **Budget Planning**: Set and track monthly budgets
- **Export Data**: Download your transactions as CSV/PDF
- **Recurring Transactions**: Set up automatic recurring entries
- **Multi-Currency Support**: Handle transactions in different currencies

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AchiniPramo/CashFlowr.git
   cd CashFlowr


2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**

   * Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   * Enable Authentication and Firestore
   * Copy your Firebase config and create a `firebase.ts` file in the `src` directory

4. **Run the application**

   ```bash
   npx expo start
   ```

   * Press `a` to run on Android emulator
   * Press `i` to run on iOS simulator
   * Scan QR code with Expo Go app for physical device

## 📸 Screenshots

| Dashboard                                                                      | Transactions                                                                         | Analytics                                                                      | Profile                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| ![Dashboard](https://via.placeholder.com/200x400/3B82F6/FFFFFF?text=Dashboard) | ![Transactions](https://via.placeholder.com/200x400/10B981/FFFFFF?text=Transactions) | ![Analytics](https://via.placeholder.com/200x400/F59E0B/FFFFFF?text=Analytics) | ![Profile](https://via.placeholder.com/200x400/8B5CF6/FFFFFF?text=Profile) |

## 🎥 Demo

Watch the full demo of **CashFlowr** on YouTube:
👉 [https://youtu.be/ylVvGL7jzUo?si=Sa9Svm9dtnKA7ooq](https://youtu.be/ylVvGL7jzUo?si=Sa9Svm9dtnKA7ooq)

## 🏗️ Project Structure

```
CashFlowr/
├── app/                    # Main application screens
│   ├── (tabs)/            # Tab navigation
│   ├── _layout.tsx        # Root layout configuration
│   └── ...                # Various screens
├── assets/                # Static assets (images, fonts)
├── components/            # Reusable UI components
├── constants/             # App constants and configurations
├── hooks/                 # Custom React hooks
├── src/                   # Source code
│   ├── auth/              # Authentication related code
│   ├── transactions/      # Transaction management
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── firebase.ts            # Firebase configuration
└── ...
```

## 🛠️ Technology Stack

* **Frontend Framework**: React Native with Expo
* **Language**: TypeScript
* **Navigation**: Expo Router
* **Backend**: Firebase (Auth, Firestore, Storage)
* **State Management**: React Context API
* **UI Components**: React Native Elements + Custom Components
* **Build Tool**: Expo CLI

## 📈 Upcoming Features

* [ ] Data visualization with charts and graphs
* [ ] Budget alerts and notifications
* [ ] Receipt scanning with OCR
* [ ] Investment tracking integration
* [ ] Bill reminders and payment scheduling
* [ ] Multi-language support
* [ ] Dark/light theme toggle
* [ ] Data export functionality

## 🙏 Acknowledgments

* React Native community for excellent documentation
* Expo team for amazing developer experience
* Firebase for robust backend services
* Contributors and testers who help improve CashFlowr

## 📞 Support

Having trouble with CashFlowr?

* Open an issue on GitHub
* Email us at [achinipramodhya4@gmail.com](mailto:achinipramodhya4@gmail.com)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/AchiniPramo">Achini Pramod</a>
</div>

<p align="center">
⭐ Don't forget to star this repository if you find it useful!
</p>
```

Do you want me to place the **YouTube demo link** also in the **top introduction (under the badges)** for more visibility, or keep it only in the `Demo` section?

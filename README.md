# ExpenseTrack237

A modern expense tracking application built with React, TypeScript, and Firebase. Track your spending, manage budgets, and gain insights into your financial habits with an intuitive dashboard and real-time data synchronization.

## Features

- **User Authentication**: Secure signup and login powered by Firebase Authentication
- **Dashboard**: View your expenses at a glance with real-time updates
- **Expense Tracking**: Log and categorize your expenses efficiently
- **Data Persistence**: All data is securely stored in Firebase Realtime Database
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and DaisyUI for a polished interface
- **Data Visualization**: Charts and graphs to analyze spending patterns with Recharts

## Tech Stack

### Frontend
- **React 19**: Latest React framework for building UI components
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library built on Tailwind CSS

### Form & Validation
- **React Hook Form**: Efficient form handling
- **Zod**: TypeScript-first schema validation
- **Hook Form Resolvers**: Integration between React Hook Form and Zod

### Routing & Animation
- **React Router DOM**: Client-side routing
- **Framer Motion**: Smooth animations and transitions

### Backend & Database
- **Firebase**: Authentication and Realtime Database
- **React Firebase**: Firebase hooks and utilities

### UI Icons
- **Lucide React**: Beautiful, customizable SVG icons

### Development Tools
- **ESLint**: Code quality and style enforcement
- **TypeScript**: Static type checking

## Project Structure

```
src/
├── components/        # Reusable React components
│   └── Header.tsx
├── pages/            # Page components
│   ├── Dashboard.tsx  # Main dashboard view
│   ├── Home.tsx       # Landing page
│   ├── Login.tsx      # User login page
│   └── SignUp.tsx     # User registration page
├── database/         # Firebase configuration
│   ├── auth.ts        # Authentication utilities
│   └── config.ts      # Firebase configuration
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── App.css          # Global styles
└── index.css        # Base styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project (get one at [firebase.google.com](https://firebase.google.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DeveloperRucel07/expenses_tracker.git
   cd expensetrack237
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Copy your Firebase configuration
   - Update `src/database/config.ts` with your Firebase credentials
   - Enable Authentication and Realtime Database in Firebase Console

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:5173`

## Available Scripts

- **`npm run dev`** - Start the development server with hot module replacement
- **`npm run build`** - Build the project for production
- **`npm run lint`** - Run ESLint to check code quality
- **`npm run preview`** - Preview the production build locally

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your account with your credentials
3. **Dashboard**: View your expense overview and financial insights
4. **Add Expenses**: Log new expenses with categories and amounts
5. **Track Spending**: Monitor your spending patterns with visual charts

## Authentication Flow

```
Home Page
    ↓
Login/SignUp
    ↓
Firebase Authentication
    ↓
Dashboard (Authenticated Users)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Developer Rucel** - [GitHub](https://github.com/DeveloperRucel07)

## Support

For support, issues, or questions, please open an issue on the GitHub repository.

---

**Happy tracking! 📊💰**
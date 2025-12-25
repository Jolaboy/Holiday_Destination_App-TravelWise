# TravelWise ✈️

A modern, responsive travel destination search application built with React. TravelWise helps users discover new places by providing real-time weather data, stunning photography, and smart search capabilities.

## ✨ Features

- **Smart Search**: Typeahead suggestions and fuzzy matching (typo correction) to find destinations easily.
- **Rich Content**:
  - Real-time weather updates via OpenWeatherMap.
  - High-quality photo galleries via Unsplash.
- **Interactive UI**:
  - Glassmorphism design aesthetic.
  - Smooth animations and transitions.
  - Full-screen photo modal with keyboard navigation.
- **Personalization**:
  - "Favourites" system persisted to local storage.
  - Trip planning tools (mockups).
- **Responsive Design**: Fully responsive layout built with Bootstrap 5 and custom CSS.

## 🛠️ Technologies Used

- **Frontend Framework**: React 19 (Vite)
- **Styling**:
  - Bootstrap 5 (Grid system, utilities, components)
  - Custom CSS (Glassmorphism, animations, gradients)
- **Routing**: React Router v7
- **State Management**: React Hooks (useState, useEffect, useMemo, useCallback, useRef)
- **APIs**:
  - OpenWeatherMap API
  - Unsplash API

## 🚀 Skills Demonstrated

- **Modern UI/UX Implementation**: Migrated from Tailwind CSS to **Bootstrap 5**, implementing a custom glassmorphism theme (`.glass-card`, `.glass-navbar`) and CSS animations (`animate-fade-in`, `hover-lift`).
- **Advanced React Patterns**:
  - Custom hooks (`useFetch`) for data fetching with caching and race-condition handling.
  - Performance optimization using `useMemo` and `useCallback`.
  - Portal-like behavior for Modals.
- **Algorithm Implementation**: Implemented a Levenshtein distance algorithm for fuzzy string matching to handle search typos.
- **API Integration**: robust error handling, loading states, and data normalization for third-party APIs.

## 📦 Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd travelwise
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (copy from `.env.example` if available) and add your API keys:

   ```env
   VITE_OPENWEATHER_KEY=your_openweathermap_api_key
   VITE_UNSPLASH_KEY=your_unsplash_access_key
   ```

   - Get a free OpenWeatherMap API key: [https://openweathermap.org/api](https://openweathermap.org/api)
   - Get a free Unsplash Access Key: [https://unsplash.com/developers](https://unsplash.com/developers)

4. **Start the development server**

   ```bash
   npm run dev
   ```

## 📂 Project Structure

```src/
   ├── assets/          # Static assets
   ├── components/      # Reusable UI components (Navbar, Cards, Modals)
   ├── hooks/           # Custom React hooks (useFetch)
   ├── pages/           # Page components (Home, Explore, Favourites)
   ├── utils/           # Helper functions (destinationMatcher)
   ├── App.jsx          # Main application layout and routing
   ├── main.jsx         # Entry point
   └─  index.css        # Style sheet
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

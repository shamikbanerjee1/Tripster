import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import HomePage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./pages/AppLayout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Liked from "./pages/Liked/Liked";
import Wishlist from "./pages/WishList/WishList";
import MainApp from "./components/MainApp";
import UserReviews from "./pages/UserReviews/UserReviews";
import ProtectedRoute from "./pages/ProtectedRoute";
import Iternary from "./pages/Iternary/Iternary";
import ItineraryContainer from "./pages/IternaryList/ItineraryContainer";
import Quiz from "./components/Quiz/Quiz";
import Schedule from "./pages/Iternary/Schedule";
import React, { useState, useEffect } from "react";
import { categories, categoriesHeader } from "./constants/categories";
import IternaryMap from "./pages/IternaryMap/IternaryMap";
import { useAuth } from './contexts/AuthContext';
import { graphQLFetch } from "./Api";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
  },
});

const App = () => {
  const [userPreferences, setUserPreferences] = useState({});
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const auth = useAuth();
  const userId = auth?.user?._id || auth?.user?.sub;
  useEffect(() => {
    if (!userId) {
      return;
    }
    // Fetch user preferences from the server and update the state
    const fetchUserPreferencesByUserId = async () => {
      const query = `
        query getUserPreferencesByUserId($userId: ID!) {
          getUserPreferencesByUserId(userId: $userId) {
            userId
            preferences
          }
        }`;
      const data = await graphQLFetch(query, { userId });
      if (data && data.getUserPreferencesByUserId && data.getUserPreferencesByUserId.preferences) {
        checkAndUpdatePreferences(JSON.parse(data.getUserPreferencesByUserId.preferences));
      } else {
        console.error("Failed to fetch User Preferences");
      }
    };
    fetchUserPreferencesByUserId();
  }, [userId]);

  const checkAndUpdatePreferences = (newPreferences) => {
    console.log("Updating preferences to:", newPreferences);
    setUserPreferences(newPreferences);

    const result = Object.keys(newPreferences).reduce((acc, pref) => {
      if (newPreferences[pref] && categories[pref]) {
        acc[pref] = categories[pref];
      }
      return acc;
    }, {});
    setFilteredCategories(result);
    console.log("Filtered categories:", result);
    console.log("User preferences:", userPreferences);
  };
  const userPreferencesKey = JSON.stringify(userPreferences);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="product" element={<Product />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route
            path="app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<MainApp categories={filteredCategories} />}
            />
            <Route path="liked" element={<Liked />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="reviews" element={<UserReviews />} />
            <Route
              path="quiz"
              element={
                <Quiz
                  categories={categoriesHeader}
                  setUserPreferences={checkAndUpdatePreferences}
                />
              }
            />
            <Route
              path="itinerary"
              element={<Iternary userPreferences={userPreferences} />}
            />
            <Route path="schedule" element={<Schedule />} />
            <Route path="itineraryList" element={<ItineraryContainer />} />
            <Route path="itineraryMap" element={<IternaryMap />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider >
  );
};

export default App;

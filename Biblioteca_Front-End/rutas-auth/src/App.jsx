// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ReaderDashboard from "./pages/reader-dashboard";
import Profile from "./pages/profile";
import Users from "./pages/users";
import Authors from "./pages/authors";
import Books from "./pages/books";
import Borrow from "./pages/borrow";
import Returns from "./pages/returns";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


export default function App() {
  return (
    <>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/reader-dashboard"
            element={
              <PrivateRoute>
                <ReaderDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/authors"
            element={
              <PrivateRoute requiredRole="admin">
                <Authors />
              </PrivateRoute>
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <Books />
              </PrivateRoute>
            }
          />
          <Route
            path="/borrow"
            element={
              <PrivateRoute>
                <Borrow />
              </PrivateRoute>
            }
          />
          <Route
            path="/returns"
            element={
              <PrivateRoute>
                <Returns />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute requiredRole="admin">
                <Users />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
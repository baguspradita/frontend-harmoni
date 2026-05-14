import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import PageTransition from "./components/PageTransition";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";
  const isLoginPage = location.pathname === "/login";
  const isForgotPasswordPage = location.pathname === "/forgot-password";

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && !isLoginPage && !isForgotPasswordPage && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/packages" element={<PageTransition><Packages /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            {/* ✅ Protected Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <PageTransition><Admin /></PageTransition>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminPage && !isLoginPage && !isForgotPasswordPage && <Footer />}
      {!isAdminPage && <FloatingWhatsApp />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
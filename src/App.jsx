import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdminPage && !isLoginPage && !isForgotPasswordPage && <Footer />}
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
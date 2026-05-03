import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }) {
  const isLoggedIn = authService.isLoggedIn();
  
  if (!isLoggedIn) {
    console.log('🔒 Akses ditolak - tidak ada token. Redirect ke login...');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
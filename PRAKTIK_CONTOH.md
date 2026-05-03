# 💻 PRAKTIK CONTOH - Code Examples & How to Use

## 1️⃣ LOGIN EXAMPLE

### HTML Form (Login.jsx)
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Call authService.login() dengan credentials
      const response = await authService.login({ email, password });
      
      // Step 2: Backend return token & email
      // response = { token: "eyJhbGc...", email: "user@email.com" }
      
      // Step 3: Save ke localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Step 4: Redirect to /admin
      navigate('/admin');
    } catch (err) {
      // Error handling: show message ke user
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
```

### How it Works:
```
User Input email + password
         ↓
handleSubmit() trigger
         ↓
authService.login({ email, password })
         ↓
api.post('/auth/login', credentials)
         ↓
REQUEST INTERCEPTOR add Bearer token (jika ada)
         ↓
Backend receive, validate, return token
         ↓
RESPONSE INTERCEPTOR log response
         ↓
response.data = { token: "...", email: "..." }
         ↓
localStorage.setItem('authToken', token)
         ↓
navigate('/admin')
```

---

## 2️⃣ TOKEN VERIFICATION EXAMPLE

### Check Token di Component
```jsx
import { useEffect } from 'react';
import { authService } from '../services/authService';

export function MyComponent() {
  useEffect(() => {
    // Check apakah user login
    if (!authService.isLoggedIn()) {
      console.log('User tidak login');
      // Do something: redirect, disable features, etc
    }
  }, []);

  return <div>User is logged in</div>;
}
```

### How isLoggedIn() Works:
```javascript
// Method 1: Check token ada
const token = localStorage.getItem('authToken');
if (!token) return false;  // Tidak login

// Method 2: Check token expired
const payload = JSON.parse(atob(token.split('.')[1]));
const currentTime = Date.now() / 1000;
if (payload.exp < currentTime) return false;  // Expired

// Method 3: Return true jika valid
return true;
```

### Praktik: Check Token Status di Console
```javascript
// Browser console
const token = localStorage.getItem('authToken');

// Cek ada token?
if (token) console.log('Token exist');
else console.log('No token');

// Decode token
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token payload:', payload);

// Cek expired?
const exp = new Date(payload.exp * 1000);
console.log('Expired at:', exp);

// Use authService
console.log('isLoggedIn?', authService.isLoggedIn());
```

---

## 3️⃣ API CALL WITH TOKEN EXAMPLE

### Fetch Packages (dengan token automatic)
```jsx
import { useEffect, useState } from 'react';
import { packageService } from '../services/packageService';

export function PackagesList() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      // Step 1: Call service
      // (REQUEST INTERCEPTOR automatically add token)
      const data = await packageService.getAll();
      
      // Step 2: Response interceptor log it
      // (Handle 401 error otomatis)
      
      // Step 3: Service return normalized data
      setPackages(data);
      
    } catch (error) {
      console.error('Error:', error.message);
      // Error dari RESPONSE INTERCEPTOR
    }
  };

  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.title}</h3>
          <p>Price: {pkg.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Behind the Scenes:
```
packageService.getAll()
         ↓
await api.get('/packages')
         ↓
REQUEST INTERCEPTOR:
  - Get token from localStorage
  - Add to header: Authorization: Bearer <token>
  - Send request
         ↓
Backend:
  - Receive GET /packages
  - Check Authorization header
  - Extract token
  - Verify token (signature & exp)
  - Query DB: SELECT * FROM packages
  - Return [packages...]
         ↓
RESPONSE INTERCEPTOR:
  - Receive 200 response
  - Log: ✅ Response 200
  - Return response
         ↓
parseResponse(response.data)
         ↓
normalizePackages(parsedData)
         ↓
Return normalized packages to component
         ↓
setPackages(data) → Re-render
```

---

## 4️⃣ PROTECTED ROUTE EXAMPLE

### Setup Route Protection
```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected route - with ProtectedRoute wrapper */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### ProtectedRoute Component
```jsx
import { authService } from '../services/authService';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Step 1: Check apakah user login
  if (authService.isLoggedIn()) {
    // Step 2: Yes → render children (Admin component)
    return children;
  } else {
    // Step 3: No → redirect ke /login
    return <Navigate to="/login" />;
  }
}
```

### How it Works:
```
User try access /admin
         ↓
React Router match /admin route
         ↓
<ProtectedRoute> component render
         ↓
Check: authService.isLoggedIn()?
         ├─ true: Render <Admin />
         └─ false: Redirect to /login with <Navigate />
```

### Testing Protected Route:
```javascript
// Browser console
// 1. Check localStorage kosong
localStorage.clear();

// 2. Go to /admin
// Result: Should redirect to /login ✓

// 3. Login dulu
// (token akan save di localStorage)

// 4. Go to /admin
// Result: Should show Admin dashboard ✓

// 5. Clear localStorage manually
localStorage.removeItem('authToken');

// 6. Refresh page /admin
// Result: Should redirect to /login ✓
```

---

## 5️⃣ CATEGORY MAPPING EXAMPLE

### Problem: Package punya categoryId, tapi UI butuh nama

### Before (Salah - Uncategorized)
```javascript
// Backend return:
[
  { id: 1, title: "Bali", categoryId: 2 }
]

// UI shows: categoryId value = 2 (number, tidak user-friendly)
// Expected: "Bali" (category name)
```

### Solution: Map di Component (Benar)
```jsx
// Admin.jsx
import { useEffect, useState } from 'react';
import { packageService, categoriesService } from '../services';

export default function Admin() {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Step 1: Fetch categories DULU
      const cats = await categoriesService.getAll();
      setCategories(cats);
      // cats = [
      //   { id: 1, name: "Yogyakarta" },
      //   { id: 2, name: "Bali" }
      // ]

      // Step 2: Fetch packages
      const pkgsRaw = await packageService.getAll();
      // pkgsRaw = [
      //   { id: 1, title: "Bali", categoryId: 2 },
      //   { id: 2, title: "Yogyakarta", categoryId: 1 }
      // ]

      // Step 3: Map categoryId → name
      const pkgsWithName = pkgsRaw.map(pkg => ({
        ...pkg,
        category: getCategoryName(pkg.categoryId, cats)
      }));
      // pkgsWithName = [
      //   { id: 1, title: "Bali", categoryId: 2, category: "Bali" },
      //   { id: 2, title: "Yogyakarta", categoryId: 1, category: "Yogyakarta" }
      // ]

      setPackages(pkgsWithName);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  // Helper function: Map categoryId → category name
  const getCategoryName = (categoryId, categoryList) => {
    // Find category dengan ID match
    const found = categoryList.find(cat =>
      Number(cat.id) === Number(categoryId)  // Convert both to number
    );
    
    // Return name atau default
    return found?.name || 'Uncategorized';
  };

  return (
    <table>
      <tbody>
        {packages.map(pkg => (
          <tr key={pkg.id}>
            <td>{pkg.title}</td>
            <td>{pkg.category}</td>  {/* Shows "Bali", not 2! */}
            <td>{pkg.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Why Not in Service?
```javascript
// ❌ Wrong: Do mapping di packageService.js
// Problem:
// - Service hanya punya packages
// - Service tidak punya categories list
// - Tidak bisa map categoryId → name
// - Result: categoryId → "Uncategorized" (salah!)

// ✅ Right: Do mapping di Admin.jsx
// Advantage:
// - Admin punya both packages dan categories
// - Admin bisa map categoryId → name
// - Result: categoryId → "Bali" (benar!)
```

---

## 6️⃣ ERROR HANDLING EXAMPLE

### Scenario 1: Login Dengan Password Salah
```javascript
// User input: email correct, password salah

try {
  const response = await authService.login({ 
    email: 'user@email.com', 
    password: 'wrong_password'
  });
  // Backend return 401 status
  
} catch (error) {
  // error.response?.status = 401
  // error.response?.data?.message = "Password salah"
  
  console.error('Login error:', error.message);
  setError(error.response?.data?.message || 'Login gagal');
  // UI show: "Password salah"
}
```

### Scenario 2: Token Expired Saat Fetch Data
```javascript
// User login kemarin, token sudah expired
// Coba access /admin

// Admin.jsx useEffect():
try {
  await authService.verifyToken();  // ← Send GET /auth/verify
} catch (error) {
  // Backend check token.exp < now
  // Backend return 401 error
  
  // RESPONSE INTERCEPTOR catch 401:
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isLoggedIn');
  window.location.href = '/login';  // ← Hard redirect
  
  // User automatically redirect to /login ✓
}
```

### Scenario 3: Backend Down (Network Error)
```javascript
// Backend tidak running
// User try fetch packages

try {
  const packages = await packageService.getAll();
  
} catch (error) {
  // Network error (backend tidak respond)
  // error.message = 'Network Error'
  // error.response = undefined
  
  // RESPONSE INTERCEPTOR set:
  // error.message = 'Tidak bisa terhubung ke backend...'
  
  console.error(error.message);
  // UI show: "Tidak bisa terhubung ke backend..."
  // User know backend down ✓
}
```

---

## 7️⃣ CREATE / UPDATE / DELETE EXAMPLE

### Create New Package
```jsx
import { packageService } from '../services/packageService';

async function handleCreatePackage(formData) {
  try {
    // formData = { name, category, price, durasi, description, image }
    
    // Call service.create()
    const newPackage = await packageService.create(formData);
    
    // REQUEST INTERCEPTOR add token automatically
    // Backend create in DB
    // Backend return created package
    
    console.log('Package created:', newPackage);
    
    // Refresh list
    fetchData();
  } catch (error) {
    alert('Gagal create: ' + error.message);
  }
}
```

### Update Existing Package
```jsx
async function handleUpdatePackage(packageId, updatedData) {
  try {
    // updatedData = { name, price, ... }
    
    const result = await packageService.update(packageId, updatedData);
    
    // REQUEST INTERCEPTOR add token automatically
    // Backend update in DB
    // Backend return updated package
    
    console.log('Package updated:', result);
    
    // Refresh list
    fetchData();
  } catch (error) {
    alert('Gagal update: ' + error.message);
  }
}
```

### Delete Package
```jsx
async function handleDeletePackage(packageId) {
  if (!window.confirm('Hapus package ini?')) return;
  
  try {
    const result = await packageService.delete(packageId);
    
    // REQUEST INTERCEPTOR add token automatically
    // Backend delete from DB
    // Backend return success response
    
    console.log('Package deleted');
    
    // Refresh list
    fetchData();
  } catch (error) {
    alert('Gagal delete: ' + error.message);
  }
}
```

---

## 8️⃣ DEBUGGING PRAKTIK

### Debug Login Flow
```javascript
// Step 1: Cek backend URL
console.log('API URL:', 'http://localhost:3000/api');

// Step 2: Try fetch categories
api.get('/categories')
  .then(res => console.log('Categories:', res.data))
  .catch(err => console.error('Error:', err.message));

// Step 3: Try login
authService.login({ email: 'test@email.com', password: 'password' })
  .then(res => {
    console.log('Login response:', res);
    localStorage.setItem('authToken', res.token);
  })
  .catch(err => console.error('Login error:', err.message));

// Step 4: Check token
console.log('Token:', localStorage.getItem('authToken'));
console.log('Expired?', authService.isTokenExpired());
```

### Debug Data Fetching
```javascript
// Check categories
const cats = await categoriesService.getAll();
console.log('Categories:', cats);

// Check packages
const pkgs = await packageService.getAll();
console.log('Packages:', pkgs);
console.log('First package:', pkgs[0]);
console.log('CategoryId:', pkgs[0].categoryId);

// Check mapping
const categoryName = cats.find(c => c.id === pkgs[0].categoryId)?.name;
console.log('Mapped name:', categoryName);
```

### Check Network Requests
```
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (login, fetch data)
4. Check requests:
   - Request header: Authorization: Bearer ...
   - Response status: 200 (success) or 401 (error)
   - Response body: data structure
```

---

## 9️⃣ COMMON MISTAKES & FIXES

### Mistake 1: Forget to add Bearer in header
```javascript
// ❌ Wrong
config.headers.Authorization = token;
// Result: Header = "eyJhbGc..." (without "Bearer")

// ✅ Right
config.headers.Authorization = `Bearer ${token}`;
// Result: Header = "Bearer eyJhbGc..."
```

### Mistake 2: Not convert categoryId to number
```javascript
// ❌ Wrong
categories.find(c => c.id === categoryId);
// Problem: "2" (string) !== 2 (number)
// Result: not found → "Uncategorized"

// ✅ Right
categories.find(c => Number(c.id) === Number(categoryId));
// Convert both to number first
// Result: found → correct name
```

### Mistake 3: Logout tapi not redirect
```javascript
// ❌ Wrong
authService.logout();
// User still on /admin (stale data!)

// ✅ Right
authService.logout();
navigate('/login');  // Redirect after logout
```

### Mistake 4: Save wrong key to localStorage
```javascript
// ❌ Wrong
localStorage.setItem('token', response.token);
// api.js look for 'authToken', not 'token'

// ✅ Right
localStorage.setItem('authToken', response.token);
// api.js akan find it
```

### Mistake 5: Not handle Promise.all error
```javascript
// ❌ Wrong
const [tests, gal] = Promise.all([fetch1(), fetch2()]);
// Jika salah satu error, semua fail

// ✅ Right (dengan error handling)
try {
  const [tests, gal] = await Promise.all([
    testimonialsService.getAll(),
    galleryService.getAll()
  ]);
} catch (error) {
  console.error('Error:', error);
  // Handle error gracefully
}
```

---

## 🔟 TESTING CHECKLIST

### Manual Testing Steps

```
1. Fresh Start
   [ ] Clear localStorage
   [ ] Clear browser cache
   [ ] Refresh page

2. Login Page
   [ ] Can see login form
   [ ] Input email + password
   [ ] Click login button

3. Backend Connection
   [ ] Backend running?
   [ ] Backend URL correct?
   [ ] Check Network tab: POST /auth/login

4. Token Saved
   [ ] After login, check localStorage
   [ ] localStorage.getItem('authToken') should return token
   [ ] localStorage.getItem('isLoggedIn') = 'true'

5. Redirect to /admin
   [ ] After successful login, should redirect to /admin
   [ ] URL should be http://localhost:3173/admin

6. Protected Route
   [ ] Admin component should load
   [ ] useEffect should trigger
   [ ] Should show admin dashboard

7. Data Fetching
   [ ] Check console for logs:
       - 📥 Fetching packages from API
       - ✅ Categories loaded
       - ✅ Packages raw
   [ ] Check Network tab: GET /categories, GET /packages
   [ ] All requests should have: Authorization: Bearer ...

8. Data Display
   [ ] PackagesTab should show packages in table
   [ ] Category column should show NAME (not ID)
   [ ] All prices and durations should show correctly

9. Category Mapping
   [ ] Open console and check logs
   [ ] 🔍 getCategoryName logs should show mapping process
   [ ] Result should be category name, not ID

10. CRUD Operations
    [ ] Edit: Click edit button, should show form
    [ ] Create: Fill form, submit should work
    [ ] Delete: Click delete, should confirm then delete
    [ ] Check Network tab: PUT/POST/DELETE requests work

11. Error Scenarios
    [ ] Try clear localStorage manually
    [ ] Go to /admin
    [ ] Should redirect to /login ✓
    
    [ ] Try stop backend
    [ ] Try fetch data
    [ ] Should show error message ✓

12. Session Expiry
    [ ] Wait for token to expire (or manually set old exp)
    [ ] Try fetch data
    [ ] Should auto-logout & redirect to /login ✓
```

---

Sekarang Anda punya contoh konkret untuk setiap skenario! 💪

Gunakan contoh-contoh ini sebagai reference untuk memahami code & practice! 📚

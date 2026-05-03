# 📘 PENJELASAN DETAIL - DATA FLOW AUTHENTICATION & DATA FETCHING

## 🎯 Tujuan Dokumen
Menjelaskan step-by-step bagaimana sistem authentication dan data fetching bekerja di frontend.

---

## 📊 BAGIAN 1: LOGIN FLOW - Bagaimana User Login

### Flow Diagram
```
User Input (Email + Password)
         ↓
Login.jsx Kirim POST ke /auth/login
         ↓
api.js (REQUEST INTERCEPTOR) - Tambah Content-Type Header
         ↓
Backend Process → Generate JWT Token
         ↓
Backend Return Response: { token: "xyz...", email: "user@email.com" }
         ↓
api.js (RESPONSE INTERCEPTOR) - Log success
         ↓
Login.jsx Simpan Token ke localStorage
         ↓
localStorage.setItem('authToken', token)
localStorage.setItem('userEmail', email)
localStorage.setItem('isLoggedIn', 'true')
         ↓
Redirect ke /admin
         ↓
Admin Component Load
```

### Code Path
1. **Login.jsx** - User input email & password
   - Form submit
   - Panggil `authService.login(credentials)`

2. **authService.js - login()** method
   ```javascript
   // 1. POST ke backend dengan email & password
   const response = await api.post('/auth/login', credentials);
   // 2. Return response yang berisi token
   return response.data;
   ```

3. **api.js - REQUEST INTERCEPTOR**
   ```javascript
   // Dijalankan SEBELUM request dikirim
   // - Cek localStorage untuk token (tapi belum ada, first login)
   // - Tambah headers Content-Type: application/json
   // - Log request
   ```

4. **Backend** (Node.js/Express)
   ```
   POST /api/auth/login
   - Validate email & password
   - Generate JWT token
   - Return token + user data
   ```

5. **api.js - RESPONSE INTERCEPTOR**
   ```javascript
   // Dijalankan SETELAH response diterima
   // - Response status 200 (success)
   // - Log response
   // - Return response ke component
   ```

6. **Login.jsx** - Simpan token
   ```javascript
   localStorage.setItem('authToken', response.data.token);
   localStorage.setItem('userEmail', response.data.email);
   localStorage.setItem('isLoggedIn', 'true');
   // Redirect ke /admin
   navigate('/admin');
   ```

---

## 🔐 BAGIAN 2: TOKEN MANAGEMENT - Apa itu JWT & Bagaimana Menyimpannya

### JWT (JSON Web Token) Explained

#### JWT Format
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

#### JWT dibagi 3 bagian dengan pemisah titik (.)
1. **Header** (ENCODED)
   - Type: JWT
   - Algorithm: HS256 (signing algorithm)

2. **Payload** (ENCODED)
   - Berisi user data
   - `exp`: waktu token expired (dalam seconds dari epoch)
   - `email`: user email
   - `id`: user ID
   - Field lain yang diinginkan backend

3. **Signature** (ENCODED)
   - Secret signature dari backend
   - Untuk verify token tidak di-tamper

#### Contoh JWT Payload (setelah di-decode)
```javascript
{
  "email": "user@email.com",
  "id": 123,
  "exp": 1715000000,  // Expiry time (seconds from epoch)
  "iat": 1714913600   // Issued at time
}
```

### localStorage Explain
```javascript
// Menyimpan data di browser local storage
// Format: Key-Value pairs
// Persist di browser sampai di-clear manual atau expire

localStorage.setItem('authToken', 'eyJhbGc...');
localStorage.setItem('userEmail', 'user@email.com');
localStorage.setItem('isLoggedIn', 'true');

// Retrieve
const token = localStorage.getItem('authToken');

// Delete
localStorage.removeItem('authToken');
```

---

## 🛡️ BAGIAN 3: PROTECTED ROUTES - Bagaimana /admin Route Dilindungi

### Flow
```
Browser Request /admin
         ↓
React Router Check Route
         ↓
/admin route punya element: <ProtectedRoute><Admin /></ProtectedRoute>
         ↓
ProtectedRoute Component Check: authService.isLoggedIn()?
         ↓
isLoggedIn() Method:
  1. Cek localStorage.getItem('authToken')
  2. Check apakah token expired?
  3. Return true/false
         ↓
Jika true:  Render Admin Component
Jika false: Redirect ke /login (Navigate)
```

### ProtectedRoute.jsx Code
```javascript
// Check token sebelum allow access ke /admin
if (authService.isLoggedIn()) {
  return children;  // Render <Admin />
} else {
  return <Navigate to="/login" />;  // Redirect ke login
}
```

### isLoggedIn() Method Breakdown
```javascript
export const authService = {
  isLoggedIn: () => {
    // 1. Cek token ada di localStorage
    const token = localStorage.getItem('authToken');
    if (!token) return false;  // Tidak ada token = false
    
    // 2. Cek token sudah expired?
    if (authService.isTokenExpired()) {
      authService.logout();  // Logout otomatis
      return false;
    }
    
    // 3. Token ada dan valid = true
    return true;
  }
}
```

### isTokenExpired() Method Breakdown
```javascript
isTokenExpired: () => {
  const token = localStorage.getItem('authToken');
  if (!token) return true;

  try {
    // JWT Format: header.payload.signature
    // Split dengan '.' dan ambil bagian tengah (payload)
    const encodedPayload = token.split('.')[1];  // eyJ...J9
    
    // atob() = decode base64 string
    const decodedPayload = atob(encodedPayload);  // String JSON
    
    // Parse JSON string to object
    const payload = JSON.parse(decodedPayload);
    // Hasil: { email: "user@email.com", exp: 1715000000, ... }
    
    // Ambil waktu sekarang dalam seconds
    const currentTime = Date.now() / 1000;
    // Date.now() return milliseconds, dibagi 1000 jadi seconds
    
    // Compare: jika exp < current time = expired
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Token decode error:', error);
    return true;  // Error decode = anggap expired
  }
}
```

---

## 📥 BAGIAN 4: TOKEN ADDING TO REQUESTS - Bagaimana Token Dikirim ke Backend

### Flow Setiap Request
```
Component Kirim Request (GET/POST/PUT/DELETE)
         ↓
api.js REQUEST INTERCEPTOR Intercept
         ↓
REQUEST INTERCEPTOR:
  1. Ambil token dari localStorage.getItem('authToken')
  2. Jika token ada:
     - Tambah ke config.headers.Authorization
     - Format: `Bearer <token>`
  3. Return config yang sudah updated
         ↓
Axios Send Request dengan Authorization Header
         ↓
Backend Terima Request:
  - Header: Authorization: Bearer eyJhbGc...
  - Backend extract token dari header
  - Backend verify signature
  - Backend validate token valid/expired
         ↓
Backend Response (Success atau Error)
         ↓
RESPONSE INTERCEPTOR Intercept
         ↓
Jika 401 Error (Token Expired/Invalid):
  - Logout otomatis
  - Redirect ke /login
         ↓
Return Response ke Component
```

### REQUEST INTERCEPTOR Code
```javascript
api.interceptors.request.use(
  (config) => {
    // 1. Ambil token dari localStorage
    const token = localStorage.getItem('authToken');
    
    // 2. Jika token ada, tambah ke header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Hasil header:
      // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    }
    
    // 3. Log request untuk debugging
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    
    // 4. Return config yang sudah di-update
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);
```

### Header Authorization Explained
```
Format: Authorization: Bearer <token>

Contoh:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI...

Backend akan:
1. Cek header ada 'Authorization'
2. Extract token setelah kata 'Bearer '
3. Verify signature
4. Validate exp time
5. Extract user data dari payload
```

---

## 🔄 BAGIAN 5: RESPONSE INTERCEPTOR - Error Handling 401

### Flow Error Handling
```
Backend Return 401 Error (Token Expired)
         ↓
api.js RESPONSE INTERCEPTOR Catch
         ↓
Check: error.response?.status === 401?
         ↓
YES → Execute:
  1. localStorage.removeItem('authToken')
  2. localStorage.removeItem('userEmail')
  3. localStorage.removeItem('isLoggedIn')
  4. window.location.href = '/login'
  (Hard redirect - reload page ke login)
         ↓
NO → Check error type lain
  - Network Error
  - CORS Error
  - Timeout Error
         ↓
Return Promise.reject(error)
(Error akan di-catch oleh component)
```

### RESPONSE INTERCEPTOR Code
```javascript
api.interceptors.response.use(
  (response) => {
    // Success handler - status 2xx
    console.log('✅ Response:', response.status);
    return response;
  },
  (error) => {
    // Error handler
    
    // Handle 401 - Token Expired
    if (error.response?.status === 401) {
      // Logout otomatis
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isLoggedIn');
      
      // Redirect ke login
      window.location.href = '/login';
    }
    
    // Handle Network Error (Backend tidak running/CORS)
    if (error.message === 'Network Error' && !error.response) {
      error.message = `Tidak bisa terhubung ke backend...`;
    }
    
    // Handle Timeout
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - Backend tidak merespon';
    }
    
    return Promise.reject(error);
  }
);
```

---

## 📊 BAGIAN 6: DATA FETCHING - Admin Dashboard Data Flow

### Complete Data Flow Diagram
```
User Login & Go to /admin
         ↓
Admin.jsx Mount
         ↓
useEffect() Trigger:
  1. authService.verifyToken() - verify token with backend
  2. Jika valid → fetchData()
  3. Jika invalid → logout & redirect to login
         ↓
fetchData() Function:
  STEP 1: categoriesService.getAll()
    - GET /api/categories
    - REQUEST INTERCEPTOR add Bearer token
    - Backend verify token & return categories
    - RESPONSE INTERCEPTOR log response
    - Return normalized categories
         ↓
  STEP 2: packageService.getAll()
    - GET /api/packages
    - REQUEST INTERCEPTOR add Bearer token
    - Backend verify token & return packages (with categoryId)
    - RESPONSE INTERCEPTOR log response
    - Normalize packages (standardisasi field names)
    - Return normalized packages
         ↓
  STEP 3: Map categoryId → Category Name
    - Untuk setiap package:
      - getCategoryName(categoryId, categoryList)
      - Find category di categoryList dengan ID match
      - Add field 'category' dengan nama
    - Result: packages dengan category NAME (bukan ID)
         ↓
  STEP 4: Promise.all() untuk Testimonials & Gallery
    - testimonialsService.getAll()
    - galleryService.getAll()
    - Run concurrent (bersamaan)
         ↓
  STEP 5: setPackageList() - Update State
    - React trigger re-render dengan data baru
         ↓
PackagesTab Component Render:
  - map() packageList
  - Untuk setiap package:
    - Show pkg.title
    - Show pkg.category (sudah nama, bukan ID!)
    - Show pkg.price
    - Show pkg.durasi
    - Action: Edit/Delete buttons
         ↓
Admin Dashboard Display Packages dengan Category Name
```

### Key Points untuk Data Mapping

#### Before Mapping (Raw dari Backend)
```javascript
packages = [
  {
    id: 1,
    title: "Paket Bali",
    categoryId: 2,      // ← Ini angka, bukan nama!
    price: 1000000,
    durasi: "3 Hari"
  },
  {
    id: 2,
    title: "Paket Yogyakarta",
    categoryId: 1,      // ← Ini angka, bukan nama!
    price: 800000,
    durasi: "2 Hari"
  }
]

categories = [
  { id: 1, name: "Yogyakarta" },
  { id: 2, name: "Bali" }
]
```

#### After Mapping (Processing di Admin.jsx)
```javascript
// Function getCategoryName()
// For package 1:
categoryId = 2
categoryName = getCategoryName(2, categories)
// Find: categories.find(c => c.id === 2)
// Result: { id: 2, name: "Bali" }
// Return: "Bali"

// Map operation:
pkgsWithCategory = packages.map((pkg) => {
  return {
    ...pkg,
    category: getCategoryName(pkg.categoryId, categories)
  }
})

// Result:
pkgsWithCategory = [
  {
    id: 1,
    title: "Paket Bali",
    categoryId: 2,
    category: "Bali",       // ← Sudah nama!
    price: 1000000,
    durasi: "3 Hari"
  },
  {
    id: 2,
    title: "Paket Yogyakarta",
    categoryId: 1,
    category: "Yogyakarta", // ← Sudah nama!
    price: 800000,
    durasi: "2 Hari"
  }
]
```

#### Why Map di Admin.jsx bukan di Service?
```
❌ WRONG: Normalize di packageService.js
  - Service tidak tahu nama category
  - Service hanya punya categoryId
  - Result: categoryId → "Uncategorized" (salah!)

✅ RIGHT: Normalize di Admin.jsx
  - Admin punya categoryList
  - Admin bisa map categoryId → name
  - Result: categoryId → "Bali" (benar!)

Filosofi:
- Service layer: Simple data fetch & parse
- Component layer: Business logic & data transformation
```

---

## 🎯 BAGIAN 7: COMPLETE REQUEST-RESPONSE CYCLE

### Scenario: Admin fetch packages setelah login

#### 1. Component Layer (Admin.jsx)
```javascript
const fetchData = async () => {
  const pkgsRaw = await packageService.getAll();
  // packageService.getAll() akan return promise
}
```

#### 2. Service Layer (packageService.js)
```javascript
getAll: async () => {
  const response = await api.get('/packages');
  // api.get() akan trigger REQUEST INTERCEPTOR dulu
}
```

#### 3. REQUEST INTERCEPTOR (api.js)
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Request ready with Authorization header
```

#### 4. Backend Receives Request
```
GET /api/packages
Header: Authorization: Bearer eyJhbGc...

Backend:
1. Extract token dari header
2. Verify signature
3. Decode payload → get user email/id
4. Check exp time
5. Query database → SELECT * FROM packages
6. Return packages array
7. Send Response: 200 OK + [packages...]
```

#### 5. RESPONSE INTERCEPTOR (api.js)
```javascript
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status);
    return response;
  }
);
// Response returned apa adanya
```

#### 6. Service Parse Response (packageService.js)
```javascript
const parsedData = parseResponse(response.data);
// parsedData = array of packages

const normalized = normalizePackages(parsedData);
// Standardisasi field names
// Result: packages dengan field yang consistent

return normalized;
// Return ke component
```

#### 7. Component Processing (Admin.jsx)
```javascript
const pkgsWithCategory = pkgsRaw.map((pkg) => {
  const categoryName = getCategoryName(pkg.categoryId, cats);
  return { ...pkg, category: categoryName };
});

setPackageList(pkgsWithCategory);
// State update → trigger re-render
```

#### 8. UI Display (PackagesTab.jsx)
```javascript
packageList.map((pkg) => (
  <tr>
    <td>{pkg.title}</td>
    <td>{pkg.category}</td>  // ← Shows "Bali" not categoryId
    <td>{pkg.price}</td>
  </tr>
))
```

---

## 🚨 TROUBLESHOOTING GUIDE

### Problem 1: Categories showing "Uncategorized"
**Root Cause**: categoryId tidak match dengan category ID di database
**Solution**: 
- Check: `typeof categoryId` dan `typeof cat.id` sama?
- Add: `Number()` conversion: `Number(categoryId) === Number(cat.id)`
- Debug: Console.log untuk compare values

### Problem 2: 401 Error, Auto-logout
**Root Cause**: Token expired atau invalid
**Check**:
- Browser console check: `localStorage.getItem('authToken')`
- Check: Token expiry time: `authService.getTokenExpiryTime()`
- Check: Backend verify endpoint bekerja: `authService.verifyToken()`
- Login again

### Problem 3: Network Error / CORS
**Root Cause**: Backend tidak running atau CORS tidak configured
**Check**:
- Backend running? Check: `http://localhost:3000/api` di browser
- CORS configured? Check: Backend res.header('Access-Control-Allow-Origin', '*')
- Firewall block? Check: Network tab di DevTools

### Problem 4: Data not showing di table
**Root Cause**: Data fetch gagal atau state tidak update
**Check**:
- Console check error messages
- Check: `packageList` state di React DevTools
- Check: API response di Network tab
- Fallback data being used?

---

## 📝 CHECKLIST - Untuk Verifikasi Sistem Bekerja

### Frontend Checklist
- [ ] Token menyimpan di localStorage setelah login
- [ ] Protected route block akses tanpa token
- [ ] 401 error auto-logout ke /login
- [ ] Categories fetch dari API (bukan hardcoded)
- [ ] Packages fetch dengan categoryId
- [ ] getCategoryName() map categoryId → name
- [ ] PackagesTab show category NAME (bukan ID)
- [ ] Search/filter bekerja dengan category name
- [ ] Form edit packages bekerja
- [ ] Sidebar show user email & session timer

### Backend Checklist
- [ ] POST /auth/login return JWT token
- [ ] GET /auth/verify verify token dengan backend
- [ ] GET /api/categories return categories array
- [ ] GET /api/packages return packages array dengan categoryId
- [ ] Bearer token verification di middleware
- [ ] 401 error jika token invalid/expired
- [ ] CORS allow requests dari frontend

---

## 📚 FILE STRUCTURE REFERENCE

```
src/
├── services/
│   ├── api.js                  ← Axios config + Interceptors
│   ├── authService.js          ← Token management
│   ├── packageService.js       ← Package CRUD
│   ├── categoriesService.js    ← Category CRUD
│   └── ...
├── pages/
│   ├── Login.jsx               ← User login form
│   ├── Admin.jsx               ← Admin dashboard (main component)
│   └── ...
├── components/
│   ├── ProtectedRoute.jsx      ← Check token before /admin
│   ├── AdminSidebar.jsx        ← Show user info & timer
│   └── admin/
│       └── PackagesTab.jsx     ← Display packages table
└── data/
    └── packages.js             ← Local fallback data
```

---

Sekarang Anda sudah memahami seluruh flow! 🎉


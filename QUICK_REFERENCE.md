# 🚀 QUICK REFERENCE - Authentication & API Calls

## LOGIN FLOW (Quick)
```
1. User masuk email + password → Login.jsx
2. POST /auth/login → api.js interceptor add headers
3. Backend return token + user data
4. Save ke localStorage:
   - localStorage.setItem('authToken', token)
   - localStorage.setItem('userEmail', email)
   - localStorage.setItem('isLoggedIn', 'true')
5. Redirect to /admin
```

---

## TOKEN MANAGEMENT (Quick)

### Check Token Valid
```javascript
// Di mana saja di component:
authService.isLoggedIn()  // Return true/false

// Bagaimana cara ceknya:
// 1. Check localStorage ada token
// 2. Check token tidak expired
// 3. Return true jika valid
```

### Get Token Expiry
```javascript
const expiryTime = authService.getTokenExpiryTime();
// Return: 1715000000 * 1000 (milliseconds)

// Di sidebar untuk show timer:
const timeRemaining = authService.getSessionTimeRemaining();
// Return: { hours: 1, minutes: 30, totalMs: 5400000 }
```

### JWT Token Anatomy
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTUwMDAwMDB9.ABC123...
       ↑ HEADER                                    ↑ PAYLOAD                  ↑ SIGNATURE

How to decode in browser console:
const token = localStorage.getItem('authToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
// Result: { email: "user@email.com", id: 123, exp: 1715000000 }
```

---

## REQUEST-RESPONSE CYCLE (Quick)

### REQUEST INTERCEPTOR (Automatic)
```javascript
// Setiap kali component kirim GET/POST/PUT/DELETE:
1. REQUEST INTERCEPTOR automatically:
   - Ambil token dari localStorage
   - Add to header: Authorization: Bearer <token>
   - Log request
2. Kirim request ke backend WITH token di header
```

### RESPONSE INTERCEPTOR (Automatic)
```javascript
// Setiap response dari backend:
1. Check status 200 (success) → return response
2. Check status 401 (token expired) → 
   - logout otomatis
   - redirect to /login
3. Check Network Error (backend down/CORS) →
   - show error message
```

---

## API CALLS PATTERN

### Fetch Packages
```javascript
// Component (Admin.jsx):
const pkgsRaw = await packageService.getAll();

// Service (packageService.js):
export const packageService = {
  getAll: async () => {
    const response = await api.get('/packages');
    const normalized = normalizePackages(response.data);
    return normalized;
  }
}

// api.js automatically:
// - Add token to Authorization header
// - Handle 401 error
// - Log request/response
```

### Create Package
```javascript
await packageService.create({
  name: "Paket Bali",
  categoryId: 2,
  price: 1000000,
  durasi: "3 Hari",
  description: "...",
  image: "...",
  highlight_utama: "..."
});
// api.js automatically add token
// Backend create package in database
```

### Update Package
```javascript
await packageService.update(id, {
  name: "Updated Name",
  price: 1200000
});
```

### Delete Package
```javascript
await packageService.delete(id);
```

---

## CATEGORY MAPPING (Important!)

### Problem
```
Backend return: { id: 1, name: "Bali", categoryId: 2 }
                                       ↑ This is just ID number!

UI need: "Bali" (category NAME)
        not 2 (category ID)
```

### Solution
```javascript
// In Admin.jsx:
const getCategoryName = (categoryId, categoryList) => {
  // Find category dengan ID match
  const found = categoryList.find(cat => 
    Number(cat.id) === Number(categoryId)
  );
  // Return nama atau 'Uncategorized'
  return found?.name || 'Uncategorized';
};

// In fetchData():
const pkgsWithCategory = pkgsRaw.map((pkg) => ({
  ...pkg,
  category: getCategoryName(pkg.categoryId, cats)
}));
```

### Why NOT in Service?
```
❌ packageService tidak punya akses ke categories
❌ Tidak bisa convert categoryId → name
✅ Admin.jsx punya both packages dan categories
✅ Admin.jsx do the mapping
```

---

## ERROR HANDLING

### 401 Unauthorized
```
Terjadi saat:
- Token expired
- Token invalid
- User logout

Response Interceptor akan:
1. Remove token dari localStorage
2. Auto logout
3. Redirect to /login

Cara test:
1. Login
2. Wait token expire (biasanya 24 jam)
3. Try fetch data
4. Auto redirect to /login ✓
```

### Network Error (Backend Down)
```
Terjadi saat:
- Backend tidak running
- CORS not configured
- Firewall block

Response Interceptor akan:
- Set error.message yang informatif
- Component catch error & show message

Cara fix:
1. Check backend running: http://localhost:3000/api
2. Check CORS configured di backend
3. Check network tab di DevTools
```

### Timeout
```
Terjadi saat:
- Backend lambat respond > 10 detik

Response Interceptor akan:
- Set error code: ECONNABORTED
- Component catch error

Cara fix:
1. Increase timeout di api.js (baseURL config)
2. Or optimize backend query
```

---

## DEBUGGING TIPS

### Check Token Status
```javascript
// Di browser console:
localStorage.getItem('authToken')           // Show token string
authService.isLoggedIn()                    // true/false
authService.isTokenExpired()                // true/false
authService.getTokenExpiryTime()            // milliseconds

// Decode token payload:
const token = localStorage.getItem('authToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);  // Show exp, email, id, etc
```

### Check Request Headers
```javascript
// Open DevTools Network tab
// Click on API request
// Go to Request Headers
// Should show: Authorization: Bearer eyJhbGc...
```

### Check API Response
```javascript
// Open DevTools Network tab
// Click on API request
// Go to Response tab
// See backend return data

// Also check Console for logs:
// 📤 Request: GET /packages
// ✅ Response: 200 [packages...]
```

### Check State di React DevTools
```javascript
// Install React DevTools extension
// Go to Components tab
// Find Admin component
// Check packageList state
// Check categoryList state
```

---

## FLOW CHART - User Login to Admin Dashboard

```
┌─────────────────┐
│  User at /login │
└────────┬────────┘
         │ Input email + password
         ▼
    ┌─────────────────────────┐
    │ Login.jsx Form Submit   │
    └────────┬────────────────┘
             │ authService.login(credentials)
             ▼
    ┌─────────────────────────┐
    │ POST /auth/login        │
    │ (api.js add Bearer)     │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ Backend Verify & Return │
    │ Token + User Data       │
    └────────┬────────────────┘
             │ Response Interceptor log
             ▼
    ┌─────────────────────────┐
    │ Login.jsx Get Response  │
    │ Save Token to Storage   │
    │ navigate('/admin')      │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ /admin Route Load       │
    │ ProtectedRoute Check    │
    └────────┬────────────────┘
             │ authService.isLoggedIn() = true
             ▼
    ┌─────────────────────────┐
    │ Admin.jsx Mount         │
    │ useEffect() trigger     │
    └────────┬────────────────┘
             │ authService.verifyToken()
             ▼
    ┌─────────────────────────┐
    │ GET /auth/verify        │
    │ Backend verify token    │
    └────────┬────────────────┘
             │ Token valid → status 200
             ▼
    ┌─────────────────────────┐
    │ fetchData() Execute     │
    │ 1. GET /categories      │
    │ 2. GET /packages        │
    │ 3. Map categoryId→name  │
    │ 4. Promise.all() others │
    └────────┬────────────────┘
             │ All requests add Bearer token
             ▼
    ┌─────────────────────────┐
    │ Backend Return Data     │
    │ Response Interceptor log│
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ Admin.jsx Get Data      │
    │ setPackageList(...)     │
    │ setState trigger render │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ Admin Dashboard Render  │
    │ Show packages, categories
    │ Ready for CRUD ops      │
    └─────────────────────────┘
```

---

## FILE CHANGES SUMMARY

### Files With Detailed Comments
1. **src/services/api.js** ✓
   - REQUEST INTERCEPTOR with comments
   - RESPONSE INTERCEPTOR with comments
   - Error handling explained

2. **src/services/authService.js** ✓
   - login() method explained
   - Token decoding explained
   - Session time calculation explained

3. **src/services/packageService.js** ✓
   - parseResponse() explained
   - normalizePackages() explained
   - CRUD methods explained

4. **src/pages/Admin.jsx** ✓
   - getCategoryName() with detailed flow
   - fetchData() with 5-step breakdown
   - Category mapping explanation

### Documentation Files
1. **PENJELASAN_DETAILED_FLOW.md** ✓
   - Complete flow explanation
   - JWT anatomy
   - Token management detailed
   - Request-response cycle
   - Troubleshooting guide

2. **QUICK_REFERENCE.md** (this file) ✓
   - Quick lookup for concepts
   - Code snippets
   - Debugging tips
   - Flow chart

---

## Next Steps untuk Belajar

1. **Pahami JWT Token**
   - Buka localStorage dan decode token
   - See exp, email, id fields
   - Understand token expiry

2. **Trace Request-Response**
   - Open DevTools Network tab
   - Click login
   - See POST /auth/login
   - Check headers & response
   - See token in localStorage

3. **Test Protected Route**
   - Clear localStorage
   - Go to /admin
   - Should redirect to /login

4. **Check Category Mapping**
   - Admin.jsx console
   - See getCategoryName() logs
   - Verify categoryId → name

5. **Experiment with Code**
   - Add console.log() di berbagai places
   - Trace data flow
   - Understand each step

---

Semoga membantu! 🎉

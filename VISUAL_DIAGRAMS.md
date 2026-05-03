# 📊 VISUAL DIAGRAMS - System Architecture

## 1️⃣ LOGIN SEQUENCE DIAGRAM

```
┌──────────────┐                                    ┌──────────────┐
│   Login.jsx  │                                    │   Backend    │
└──────┬───────┘                                    └──────┬───────┘
       │                                                    │
       │─── User Input (email + password) ──────────────────→
       │                                                    │
       │                  ┌─ Validate Credentials          │
       │                  │- Check email in DB             │
       │                  │- Verify password hash          │
       │                  │- Generate JWT token            │
       │                  └──────────────────               │
       │                                                    │
       │←─ Response: {token, email} ────────────────────────│
       │                                                    │
       ├─ Save token to localStorage
       ├─ setItem('authToken', token)
       ├─ setItem('userEmail', email)
       └─ navigate('/admin')
```

---

## 2️⃣ PROTECTED ROUTE CHECK DIAGRAM

```
Browser: GET /admin
         │
         ▼
React Router: Match /admin route
         │
         ▼
<ProtectedRoute>  Check authService.isLoggedIn()?
         │
    ┌────┴─────┐
    │           │
   YES         NO
    │           │
    │           └─→ Show <Navigate to="/login" />
    │
    └──→ Render <Admin /> Component
         │
         ▼
         Admin Component Mount
         │
         ▼
         useEffect() Run
         │
         ├─ authService.verifyToken() with backend
         │  ├─→ GET /auth/verify with Bearer token
         │  ├─→ Backend verify token signature
         │  ├─→ Backend check token exp time
         │  └─→ Return 200 (valid) or 401 (expired)
         │
         ├─ Jika valid: fetchData()
         │
         └─ Jika invalid: logout() & navigate('/login')
```

---

## 3️⃣ REQUEST INTERCEPTOR FLOW

```
Component Call: api.get('/packages')
         │
         ▼
REQUEST INTERCEPTOR Execute
         │
         ├─ Get token: localStorage.getItem('authToken')
         │  Result: "eyJhbGc..."
         │
         ├─ Add to header:
         │  Authorization: Bearer eyJhbGc...
         │
         ├─ Log request:
         │  console.log('📤 Request: GET /packages')
         │
         └─ Return config (updated)
         │
         ▼
AXIOS Send Request with Headers:
         │
         GET /api/packages HTTP/1.1
         Host: localhost:3000
         Authorization: Bearer eyJhbGc...
         Content-Type: application/json
         │
         ▼
Backend Receive Request
         │
         ├─ Extract token from header
         ├─ Decode JWT (get user email, id, exp)
         ├─ Check signature is valid
         ├─ Check exp time not passed
         ├─ If valid: Query DB for packages
         ├─ If invalid: Return 401 error
         │
         └─ Send Response
```

---

## 4️⃣ RESPONSE INTERCEPTOR FLOW

```
Backend Send Response
         │
         ▼
RESPONSE INTERCEPTOR Receive
         │
         ┌─ Check response.status
         │
    ┌────┴─────────────┬──────────────┬────────────┐
    │                  │              │            │
   200              401              5xx         Network Error
  (Success)      (Unauthorized)     (Server)    (Backend Down)
    │                  │              │            │
    │                  ├─ 401 Handler │            │
    │                  │  ├─ Remove   │            │
    │                  │  │ authToken │            │
    │                  │  ├─ Remove   │            │
    │                  │  │ userEmail │            │
    │                  │  └─ Redirect │            │
    │                  │    to /login │            │
    │                  │              │            │
    └─→ Log response  └──────────────┴────────────┴──→ Network Error Handler
        ✅ Response: 200                              │
        │                                            ├─ Set error message
        │                                            ├─ Log Network Error
        └─→ Return response to Component             └─ Reject promise
           (success path)                               (component catches)
           │
           ▼
        Component Get Data
        (then block)
```

---

## 5️⃣ DATA FETCHING FLOW IN ADMIN

```
Admin.jsx useEffect()
         │
         ▼
fetchData() Call
         │
    ┌────┴─────────────────────────────┐
    │ STEP 1: Fetch Categories          │
    │ ├─ GET /api/categories            │
    │ ├─ REQUEST: Add Bearer token      │
    │ ├─ RESPONSE: Return categories    │
    │ └─ Result: [                      │
    │     { id: 1, name: "Yogyakarta" },
    │     { id: 2, name: "Bali" }       │
    │   ]                               │
    └────────┬────────────────────────────┘
             │ cats = categoryList
             │
    ┌────────┴────────────────────────────┐
    │ STEP 2: Fetch Packages              │
    │ ├─ GET /api/packages                │
    │ ├─ REQUEST: Add Bearer token        │
    │ ├─ RESPONSE: Return packages        │
    │ ├─ Parse response (handle formats)  │
    │ ├─ Normalize packages               │
    │ └─ Result: [                        │
    │     { id: 1, title: "Bali",         │
    │       categoryId: 2,  <-- KEY FIELD │
    │       price: 1000000 },             │
    │     { id: 2, title: "Yogyakarta",   │
    │       categoryId: 1,  <-- KEY FIELD │
    │       price: 800000 }               │
    │   ]                                 │
    └────────┬────────────────────────────┘
             │ pkgsRaw = packages
             │
    ┌────────┴────────────────────────────┐
    │ STEP 3: Map categoryId → Name       │
    │                                    │
    │ For each package:                  │
    │ ├─ getCategoryName(categoryId)     │
    │ │  ├─ Find category in cats with   │
    │ │  │  matching id                  │
    │ │  ├─ If found: use name           │
    │ │  └─ Else: use "Uncategorized"    │
    │ │                                  │
    │ ├─ Add category field to package   │
    │ └─ Result: [                       │
    │     { id: 1, title: "Bali",        │
    │       category: "Bali"  <-- NAME! │
    │       price: 1000000 },            │
    │     { id: 2, title: "Yogyakarta",  │
    │       category: "Yogyakarta" <-- │
    │       price: 800000 }              │
    │   ]                                │
    └────────┬────────────────────────────┘
             │ pkgsWithCategory
             │
    ┌────────┴────────────────────────────┐
    │ STEP 4: Fetch Testimonials & Gallery│
    │ ├─ Promise.all([                    │
    │ │   testimonialsService.getAll(),   │
    │ │   galleryService.getAll()         │
    │ │ ])                                │
    │ └─ Result: [testimonials, gallery]  │
    └────────┬────────────────────────────┘
             │
    ┌────────┴────────────────────────────┐
    │ STEP 5: Update State                │
    │ ├─ setPackageList(pkgsWithCategory) │
    │ ├─ setCategoryList(cats)            │
    │ ├─ setTestimonialList(testimonials) │
    │ └─ setGalleryList(gallery)          │
    │                                    │
    │ ⚡ STATE UPDATE → RE-RENDER         │
    └────────┬────────────────────────────┘
             │
             ▼
    Component Re-render with New Data
    └─ PackagesTab gets packageList
       └─ Display category NAME (not ID!)
```

---

## 6️⃣ JWT TOKEN DECODE PROCESS

```
Token String:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│
├─ Split by '.' gives 3 parts:
│
├─ PART 1 (HEADER - encoded):
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
│  ↓ atob() decode
│  {"alg":"HS256","typ":"JWT"}
│
├─ PART 2 (PAYLOAD - encoded):
│  eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
│  ↓ atob() decode
│  {
│    "sub":"1234567890",
│    "name":"John Doe",
│    "iat":1516239022,
│    "exp":1516326422    <-- EXPIRY TIME
│  }
│  ↓ Parse as JSON
│  Payload object = {
│    email: "user@email.com",
│    id: 123,
│    exp: 1715000000,
│    iat: 1714913600
│  }
│
├─ PART 3 (SIGNATURE - NOT decoded):
│  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│  (Only backend can verify with secret key)
│
└─ Check if expired:
   Current time in seconds: Date.now() / 1000
   If current time > payload.exp → EXPIRED
   Else → VALID
```

---

## 7️⃣ ERROR HANDLING SCENARIOS

### Scenario A: Token Expired

```
Component: api.get('/packages')
         │
         ▼
REQUEST INTERCEPTOR:
- Get token from localStorage
- Token is: eyJhbGc... (valid format)
- Add to header: Authorization: Bearer eyJhbGc...
- Send request
         │
         ▼
Backend:
- Receive request with token
- Decode token
- Check: exp = 1714913600, now = 1715000000
- Token EXPIRED → Return 401 error
         │
         ▼
RESPONSE INTERCEPTOR:
- Receive 401 error
- Check: error.response?.status === 401
- YES → Handle 401:
  ├─ localStorage.removeItem('authToken')
  ├─ localStorage.removeItem('userEmail')
  ├─ localStorage.removeItem('isLoggedIn')
  └─ window.location.href = '/login' (hard redirect)
         │
         ▼
Browser: Redirect to /login
- Clear all auth data ✓
- /login page shows empty form
- User login again
```

### Scenario B: Network Error (Backend Down)

```
Component: api.get('/packages')
         │
         ▼
REQUEST INTERCEPTOR:
- Get token ✓
- Add to header ✓
- Try to send...
         │
         ▼
Network:
- Try to connect to http://localhost:3000/api
- Connection REFUSED (backend not running)
- error.message = "Network Error"
- error.response = undefined
         │
         ▼
RESPONSE INTERCEPTOR:
- Check: error.message === 'Network Error' && !error.response
- YES → Network Error Handler:
  ├─ console.error('⚠️ NETWORK ERROR')
  └─ error.message = "Tidak bisa terhubung ke backend..."
         │
         ▼
Component:
- Catch error in try-catch
- Show error message to user
- Try again after backend start
```

### Scenario C: CORS Error

```
Component: api.get('/packages') at http://localhost:3173
         │
         ▼
REQUEST INTERCEPTOR:
- Send request to http://localhost:3000/api/packages
         │
         ▼
Backend:
- Receive request
- Check CORS headers (Access-Control-Allow-Origin)
- Frontend origin: http://localhost:3173
- Allowed origins: http://localhost:5000 (MISMATCH!)
- Reject request
         │
         ▼
Browser:
- Block response (CORS policy)
- error.code = 'CORS_ERROR' or error.message contains 'CORS'
         │
         ▼
RESPONSE INTERCEPTOR:
- Check: error.code === 'CORS_ERROR' || error.message.includes('CORS')
- YES → CORS Error Handler:
  └─ error.message = "CORS Error: Backend tidak allow..."
         │
         ▼
Component:
- Catch error
- Show: "Backend perlu configure CORS"
- Fix: Backend add: res.header('Access-Control-Allow-Origin', '*')
```

---

## 8️⃣ COMPONENT STATE FLOW

```
Admin.jsx State:

┌─────────────────────────────────────┐
│ currentTab: "dashboard"             │
│ packageList: []    <-- Main data    │
│ categoryList: []   <-- For mapping  │
│ testimonialList: []                 │
│ galleryList: []                     │
│ showForm: false                     │
│ editingId: null                     │
│ searchQuery: ""                     │
│ formData: { title, category, ... }  │
└─────────────────────────────────────┘
                │
                ▼
    useEffect() run on mount
                │
                ▼
    fetchData() async function
                │
    ┌───────────┴────────────────────┐
    │                                │
    ▼                                ▼
GET /categories                 GET /packages
    │                                │
    ├─ Response: [...]      ├─ Response: [...categoryId...]
    └─ setCategoryList() ◄──┴─────────────────────┐
                                            │
                                    Map categoryId → name
                                            │
                                    setPackageList() ◄──┐
                                            │           │
                                    Re-render ◄────────┘
                                            │
                                    PackagesTab receive
                                    packageList & show
                                    - title
                                    - category (NAME!)
                                    - price
                                    - buttons
```

---

## 9️⃣ DATA TRANSFORMATION CHAIN

```
Raw Backend Response:
{
  "data": [
    {
      "id": 1,
      "name": "Bali Trip",
      "categoryId": 2,        ← Just ID
      "price": 1000000,
      "durasi": "3 Hari"
    }
  ]
}

         ↓ parseResponse() in packageService.js

Parsed:
[
  {
    "id": 1,
    "name": "Bali Trip",
    "categoryId": 2,
    "price": 1000000,
    "durasi": "3 Hari"
  }
]

         ↓ normalizePackages() in packageService.js

Normalized:
[
  {
    "id": 1,
    "title": "Bali Trip",        ← name → title
    "categoryId": 2,             ← PRESERVED!
    "price": 1000000,
    "durasi": "3 Hari",
    "price": 1000000,
    "description": "",
    "image": "",
    "highlights": []
  }
]

         ↓ Map in Admin.jsx

With Category Name:
[
  {
    "id": 1,
    "title": "Bali Trip",
    "categoryId": 2,
    "category": "Bali",          ← categoryId mapped to name!
    "price": 1000000,
    "durasi": "3 Hari",
    "description": "",
    "image": "",
    "highlights": []
  }
]

         ↓ PackagesTab Component

UI Display:
┌──────────────────────────────┐
│ Title    │ Category │ Price  │
├──────────────────────────────┤
│ Bali     │ Bali     │ 1000K  │  ← Shows name!
│ Trip     │          │        │
└──────────────────────────────┘
```

---

## 🔟 DEBUGGING CHECKLIST WITH FLOW

```
❌ Problem: Categories show "Uncategorized"

Flow Check:
1. ├─ GET /api/categories ✓ (check Network tab)
   └─ Response: [{ id: 1, name: "Bali" }, ...]
   
2. ├─ GET /api/packages ✓ (check Network tab)
   └─ Response: [{ id: 1, categoryId: 1, ... }, ...]
   
3. ├─ getCategoryName(1, categories) function
   ├─ Find: categories.find(c => Number(c.id) === 1)
   ├─ Expected: { id: 1, name: "Bali" }
   └─ Debug: console.log('Found:', found);

4. ├─ Check ID types:
   ├─ typeof categories[0].id = ?   (should be 'number')
   ├─ typeof package[0].categoryId = ?  (might be 'string')
   └─ Fix: Number() convert both sides

5. ├─ setPackageList(pkgsWithCategory) call
   └─ Check: packageList state updated? (React DevTools)

6. ├─ PackagesTab receive packageList
   └─ Check: pkg.category value (name or ID?)

✅ All pass → Problem solved!
```

---

## 📋 STATE VS PROPS FLOW

```
Admin.jsx (Parent)
├─ State: packageList
├─ State: categoryList
│
├─ Pass props to PackagesTab:
│  <PackagesTab 
│    packages={packageList}
│    categories={categoryList}
│    onEdit={handleEdit}
│    onDelete={handleDelete}
│  />
│
▼
PackagesTab.jsx (Child)
├─ Receive props: packages, categories
├─ map() packages
└─ Render table:
   ├─ pkg.title
   ├─ pkg.category  (comes from parent mapping)
   ├─ pkg.price
   └─ Edit/Delete buttons (call parent handlers)
```

---

Semoga diagram ini membantu visualisasi flow! 🎨

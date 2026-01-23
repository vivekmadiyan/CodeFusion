import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      }
    }
  },
  preview: {
    port: 3000,
  }
})
```

5. Click **"Commit changes"**

---

## **Step 2: Check Render Service Type**

Render dashboard mein check karo:

1. Your frontend service kholo
2. **Settings** tab
3. **"Environment"** field mein kya selected hai?

**Should be:** `Static Site` 

**If it says `Web Service`** - ye galat hai! Static site hona chahiye.

---

## **Step 3: If Service Type is Wrong - Create New Service**

Agar "Web Service" dikha raha hai frontend ke liye:

### **Create new Static Site:**

1. Render dashboard → **"New +"** button
2. **"Static Site"** select karo (not Web Service)
3. GitHub repo connect karo: `vivekmadiyan/CodeFusion`
4. Settings:
   - **Name:** `codefusion-frontend`
   - **Branch:** `main`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. **Environment Variables** add karo:
```
   VITE_RAPID_API_URL=https://judge0-ce.p.rapidapi.com/submissions
   VITE_RAPID_API_HOST=judge0-ce.p.rapidapi.com
   VITE_RAPID_API_KEY=a779558ccbmsh82b3af92f4893b7p1d1e75jsnd4b0ae3acd3f
```
6. **"Create Static Site"** pe click karo

---

## **Step 4: Check Current Service Settings**

Mujhe ye batao:

1. **Render dashboard screenshot** frontend service ki settings ka
2. **Service type kya hai?** (Static Site ya Web Service?)
3. **Build command kya hai?**
4. **Publish directory kya hai?**

---

## **Quick Test - Check if _redirects file deployed properly:**

Browser mein ye URL try karo:
```
https://codefusion-26.onrender.com/_redirects

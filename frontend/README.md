# DDK Job Portal Frontend

1. Keep your existing Spring Boot backend running on http://localhost:8080.
2. Open a terminal in this folder.
3. Run: npm install
4. Run: npm run dev
5. Open the Vite URL, normally http://localhost:5173.

The Vite proxy sends /api requests to the existing Spring Boot backend.
JWT returned by /api/auth/login is stored locally and sent as a Bearer token.

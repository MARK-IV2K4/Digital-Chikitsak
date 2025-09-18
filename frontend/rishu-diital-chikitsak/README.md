## Telemedicine App - Setup

### Backend (Flask)
- Create `.env` in `backend/` with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=telemedicine
JWT_SECRET=change_me
LMSTUDIO_URL=http://127.0.0.1:1234/v1/chat/completions
DEFAULT_MODEL=qwen2.5
```
- Install and run:
```
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend (Vite + React)
```
cd telemedicine-frontend
npm install
npm run dev
```
Optionally create `.env` in `telemedicine-frontend/`:
```
VITE_API_BASE=http://127.0.0.1:5000/api
```

### API Endpoints
- POST `/api/register` { phone, name, pin|password, role }
- POST `/api/login` { phone, pin|password } → { token, user }
- GET `/api/patients` (Bearer token)
- POST `/api/patients` (Bearer token) { name, age, gender, blood_group, medical_history, current_medications }
- GET `/api/consultations` (Bearer token)
- POST `/api/consultations` (Bearer token) { patient_id, doctor_id, symptoms }
- POST `/api/chat` (Bearer token) { consultation_id, patient_id, message }

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# rishu-diital-chikitsak" 

import { Routes, Route } from 'react-router-dom'
import Logo from './components/Logo.jsx'
import LoginPage from './pages/LoginPage.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function App() {
    return (
        <div className="app">
            <Logo />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </div>
    )
}

export default App

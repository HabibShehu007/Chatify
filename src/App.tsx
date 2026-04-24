import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext"; // ✅ 1. Import UserProvider
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./Pages/Onboarding";
// Auth
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
// Dashboard (Chat Page)
import Dashboard from "./Pages/Dashboard";
import Friends from "./Pages/Friends";
import Profile from "./Pages/Profile";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        {" "}
        {/* ✅ 2. Wrap your routes here */}
        <Router>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            {/* Auth Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

// src/App.tsx
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { SocialProvider } from "./context/SocialContext"; // ✅ 1. Import SocialProvider
import { ChatProvider } from "./context/ChatContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./Pages/Onboarding";
// Auth
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
// Dashboard (Chat Page)
import Dashboard from "./Pages/Dashboard";
import Friends from "./Pages/Friends";
import Profile from "./Pages/Profile";
import Notifications from "./Pages/Notifications";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        {/* ✅ 2. Wrap SocialProvider inside UserProvider */}
        <SocialProvider>
          <ChatProvider>
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
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
            </Router>
          </ChatProvider>
        </SocialProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./Pages/Onboarding";
// Auth
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
// Dashbaord (Chat Page)
import Dashboard from "./Pages/Dashboard";
import Friends from "./Pages/Friends";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/friends" element={<Friends />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

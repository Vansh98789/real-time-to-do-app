import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<LoginForm />} />
    </Routes>
  </BrowserRouter>
);

export default App;

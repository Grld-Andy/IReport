import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import NotFound from "./pages/NotFound"
import AuthLayout from "./components/Layout/AuthLayout"
import "./App.css"
import Dashboard from "./pages/ProtectedPages/Dashboard"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="dashboard" element={<Dashboard/>}/>
      </Route>
      <Route path="/" element={<AuthLayout/>}>
        <Route path="auth/register" element={<Register/>}/>
        <Route path="auth/login" element={<Login/>}/>
      </Route>

      <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}

export default App
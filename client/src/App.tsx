import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import NotFound from "./pages/NotFound"
import AuthLayout from "./components/Layout/AuthLayout"
import Dashboard from "./pages/ProtectedPages/Dashboard"
import LiveMap from "./pages/ProtectedPages/LiveMap"
import "./App.css"
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="map" element={<LiveMap/>}/>
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
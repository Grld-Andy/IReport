import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/Layout/AuthLayout";
import Dashboard from "./pages/ProtectedPages/Dashboard";
import LiveMap from "./pages/ProtectedPages/LiveMap";
import "./App.css";
import "leaflet/dist/leaflet.css";
import IncidentsPage from "./pages/ProtectedPages/IncidentsPage";
import KanbanBoardPage from "./pages/ProtectedPages/KanbanBoardPage";
import ReportsPage from "./pages/ProtectedPages/ReportsPage";
import UsersPage from "./pages/ProtectedPages/UsersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="incidents">
          <Route index element={<IncidentsPage />} />
          <Route path=":page" element={<IncidentsPage />} />
        </Route>
        <Route path="map" element={<LiveMap />} />
        <Route path="kanban" element={<KanbanBoardPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path=":page" element={<UsersPage />} />
        </Route>
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="auth/register" element={<Register />} />
        <Route path="auth/login" element={<Login />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

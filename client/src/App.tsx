import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Auth/Login";
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
import ActivateAccount from "./pages/Auth/ActivateAccount";
import Activities from "./pages/ProtectedPages/Activities";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import LandingPage from "./pages/LandingPage";
import Page from "./pages/Page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Page/>}/>
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="incidents">
          <Route index element={<IncidentsPage />} />
          <Route path=":page" element={<IncidentsPage />} />
        </Route>
        <Route path="map" element={<LiveMap />} />
        <Route path="activities" element={<Activities />} />
        <Route path="kanban" element={<KanbanBoardPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path=":page" element={<UsersPage />} />
        </Route>
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/activate" element={<ActivateAccount/>}/>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

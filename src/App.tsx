import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import { DashboardPage } from "./pages/DashboardPage";
import { useEffect } from "react";
import { fetchMetadata } from "./store/configSlice";
import { useAppDispatch } from "./store/hooks";
import { UsersManagementPage } from "./pages/UsersManagementPage";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMetadata());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar></Navbar>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage></DashboardPage>
              </PrivateRoute>
            }
          />

          <Route
            path="/TicketsPage"
            element={
              <PrivateRoute>
                <div>Tickets Page</div>
              </PrivateRoute>
            }
          />

          <Route
            path="/TicketDetailsPage"
            element={
              <PrivateRoute>
                <div>Ticket Details Page</div>
              </PrivateRoute>
            }
          />

          <Route
            path="/newTicketPage"
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <div>New Ticket Page</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <UsersManagementPage />
              </PrivateRoute>
            }
          />
          <Route path="/*" element={<div>404 Not Found</div>} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
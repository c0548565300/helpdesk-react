import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import { DashboardPage } from "./pages/DashboardPage";
import { useEffect } from "react";
import { fetchMetadata } from "./store/configSlice";
import { useAppDispatch } from "./store/hooks";
import { UsersManagementPage } from "./pages/UsersManagementPage";
import { NewTicketPage } from "./pages/NewTicketPage";
import { AuthPage } from "./pages/AuthPage";
import { TicketDetailsPage } from "./pages/TicketDetailsPage";
import TicketsPage from "./pages/TicketsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

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

          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <PrivateRoute>
                <TicketsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/tickets/:id"
            element={
              <PrivateRoute>
                <TicketDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/tickets/new"
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <NewTicketPage />
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
         <Route path="*" element={<NotFoundPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
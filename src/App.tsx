import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import { DashboardPage } from "./pages/DashboardPage";
import { useEffect } from "react";
import { fetchMetadata } from "./store/configSlice";
import { useAppDispatch } from "./store/hooks";
import { UsersManagementPage } from "./pages/UsersManagementPage";
import { NewTicketPage } from "./pages/NewTicketPage";
import Tickets from "./pages/TicketsPage";
import { AuthPage } from "./pages/AuthPage";
import { TicketDetailsPage } from "./pages/TicketDetailsPage";

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
                <DashboardPage/>
              </PrivateRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <PrivateRoute>
                <Tickets />
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
                <NewTicketPage/>
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
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/tickets">Tickets</NavLink>

      {user.role === "customer" && (
        <NavLink to="/tickets/new">New Ticket</NavLink>
      )}

      <span>
        {user.name} ({user.role})
      </span>

      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;

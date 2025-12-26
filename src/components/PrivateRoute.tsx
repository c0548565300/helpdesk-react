import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router-dom";


interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
    const { user } = useAppSelector(state => state.auth);
    if (user === null) {
        return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/404" />;
    }

    return children;
}

export default PrivateRoute;
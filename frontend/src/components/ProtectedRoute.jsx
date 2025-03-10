import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Cookies from "universal-cookie";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    // const [cookies] = cookies(['zone_id']);
    const cookies = new Cookies();
    const { zone_id } = useParams();

    // Check if zone_id from URL matches the cookie value
    if (zone_id !== cookies.get("zone_id")) {
        return <Navigate to="*" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;

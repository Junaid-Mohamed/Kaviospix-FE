
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("access_token"); 
  return token ? children : <Navigate to="/login" />;
};

//  validate props
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ProtectedRoute;

import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  let user = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      user = JSON.parse(rawUser);
    }
  } catch (error) {
    user = null;
  }

  // If user is not authenticated or has no valid ID, block route and redirect to /login
  if (!user || !user._id) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectMsg: "Please log in first to access your dashboard and lessons.",
          from: location.pathname
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;

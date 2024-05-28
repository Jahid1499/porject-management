import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

import useAuthCheck from "./hooks/useAuthCheck";
import Login from "./pages/Login";
import Project from "./pages/Project";
import Register from "./pages/Register";
import Teams from "./pages/Teams";

function App() {
  const authChecked = useAuthCheck();

  return !authChecked ? (
    <div>Checking authentication....</div>
  ) : (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <PrivateRoute>
              <Teams />
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Project />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "./layouts/Admin";
import PrivateRoute from "./layouts/PrivateRoute";
import { AuthProvider } from "./layouts/useAuth";
import Login from "views/pages/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={<PrivateRoute element={AdminLayout} />}
        />
        <Route path="/auth/*" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

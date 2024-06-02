import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.slice(0, 6).map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    const filteredRoutes = routes.slice(0, 6);
    for (let i = 0; i < filteredRoutes.length; i++) {
      if (
        props?.location?.pathname.indexOf(
          filteredRoutes[i].layout + filteredRoutes[i].path
        ) !== -1
      ) {
        return filteredRoutes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes.slice(0, 6)}
        logo={{
          innerLink: "/admin/dashboard",
          imgSrc: require("../assets/img/brand/logo.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Routes>
      </div>
    </>
  );
};

export default Admin;

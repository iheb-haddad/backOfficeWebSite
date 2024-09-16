import React, { useEffect } from "react";
import { useState } from "react";
import {
  Registration,
  Home,
  Dashboard,
  GestionMapping,
  ProfilePage,
  Configurations,
  GestionSources,
  GestionDocuments,
  Layout,
  PersistLogin,
  PersistHome,
  GestionProjects,
  GestionComptes,
  GestionUsers,
  AddAdminForm,
} from "./components/index";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import useAuth from "./hooks/useAuth";
import useStore from "../src/globalState/UseStore";

function App() {
  const { auth } = useAuth();
  const { projects, fetchProjects, subProjects, fetchSubProjects } = useStore();
  useEffect(() => {
    const user = auth?.user?._id || "";
    fetchProjects(user);
    fetchSubProjects(user);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route element={<PersistHome />}>
              <Route path="/login" element={<Registration />} />
            </Route>
            <Route element={<PersistLogin />}>
              <Route path="/" element={<Home />}>
                <Route index element={<Dashboard />} />
                <Route path="GestionMapping" element={<GestionMapping />} />
                <Route path="Profile" element={<ProfilePage />} />
                <Route path="Configurations" element={<Configurations />} />
                <Route path="GestionSources" element={<GestionSources />} />
                <Route path="GestionDocuments" element={<GestionDocuments />} />
                <Route
                  path="GestionProjects"
                  element={
                    (auth?.user?.role === "admin" || projects.length > 0) && (
                      <GestionProjects />
                    )
                  }
                />
                <Route path="GestionComptes" element={<GestionComptes />}>
                  <Route
                    index
                    element={
                      (auth?.user?.role === "admin" || projects.length > 0) && (
                        <GestionUsers />
                      )
                    }
                  />
                  <Route
                    path="/GestionComptes/parametresCompte"
                    element={<ProfilePage />}
                  />
                  <Route
                    path="/GestionComptes/ajouterUser"
                    element={
                      (auth?.user?.role === "admin" || projects.length > 0) && (
                        <AddAdminForm />
                      )
                    }
                  />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

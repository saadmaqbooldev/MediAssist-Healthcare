import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import NewPatient from "./pages/NewPatient";
import PatientHistory from "./pages/PatientHistory";
import PatientDetail from "./pages/PatientDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import NewConsultation from "./pages/NewConsultation";
import Consultations from "./pages/Consultations";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Patients */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />

        {/* New Patient */}
        <Route
          path="/patients/new"
          element={
            <ProtectedRoute>
              <NewPatient />
            </ProtectedRoute>
          }
        />

        {/* Patient History */}
        <Route
          path="/patient-history"
          element={
            <ProtectedRoute>
              <PatientHistory />
            </ProtectedRoute>
          }
        />

        {/* Patient Detail */}
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute>
              <PatientDetail />
            </ProtectedRoute>
          }
        />
        <Route
  path="/consultations"
  element={
    <ProtectedRoute>
      <Consultations />
    </ProtectedRoute>
  }
/>

        {/* New Consultation */}
        <Route
          path="/consultations/new"
          element={
            <ProtectedRoute>
              <NewConsultation />
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800">
          MediAssist Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to your MediAssist dashboard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500 text-lg">
              Total Patients
            </h2>

            <p className="text-4xl font-bold text-blue-600 mt-3">
              0
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500 text-lg">
              Consultations
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-3">
              0
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500 text-lg">
              Doctors
            </h2>

            <p className="text-4xl font-bold text-purple-600 mt-3">
              6
            </p>
          </div>

        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="flex gap-4 mt-5">

            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700">
              Add Patient
            </button>

            <button className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700">
              New Consultation
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
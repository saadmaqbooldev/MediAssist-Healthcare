import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PatientCard from "../components/PatientCard";

function PatientHistory() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const patientsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/patients/");

      setPatients(response.data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  // Search patients by name
  const filteredPatients = patients.filter((patient) =>
    patient.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination
  const totalPages = Math.ceil(
    filteredPatients.length / patientsPerPage
  );

  const startIndex =
    (currentPage - 1) * patientsPerPage;

  const currentPatients = filteredPatients.slice(
    startIndex,
    startIndex + patientsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-8">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Patient History
            </h1>

            <p className="text-gray-600 mt-2">
              Search and manage your patients
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow p-5 mb-8">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Patient
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-500">
                Loading patients...
              </p>
            </div>
          ) : filteredPatients.length === 0 ? (

            <div className="bg-white rounded-xl shadow p-10 text-center">

              <p className="text-gray-500 text-lg">
                {search
                  ? "No patients found matching your search."
                  : "No patients found."}
              </p>

              {!search && (
                <button
                  onClick={() => navigate("/patients/new")}
                  className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >
                  Add Patient
                </button>
              )}

            </div>

          ) : (

            <>
              {/* Patient Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {currentPatients.map((patient) => (

                  <div
                    key={patient.id}
                    className="bg-white rounded-xl shadow p-6"
                  >

                    <PatientCard patient={patient} />

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 pt-5 border-t">

                      <button
                        onClick={() =>
                          navigate(
                            `/patients/${patient.id}`
                          )
                        }
                        className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
                      >
                        View Detail
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/consultations/new?patient=${patient.id}`
                          )
                        }
                        className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700"
                      >
                        New Consultation
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">

                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage(
                        (prev) => prev - 1
                      )
                    }
                    className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (prev) => prev + 1
                      )
                    }
                    className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>

                </div>
              )}

            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default PatientHistory;
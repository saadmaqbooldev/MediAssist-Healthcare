import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Consultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError("");

      // Abhi backend mein patient-wise consultation endpoint hai.
      // Isliye pehle patients fetch karenge.
      const patientsResponse = await api.get("/patients/");

      const patients = patientsResponse.data;

      const consultationResults = await Promise.all(
        patients.map(async (patient) => {
          try {
            const response = await api.get(
              `/consultations/patient/${patient.id}`
            );

            return response.data.map((consultation) => ({
              ...consultation,
              patient_name: patient.name,
            }));
          } catch (err) {
            console.error(
              `Failed to fetch consultations for patient ${patient.id}`,
              err
            );

            return [];
          }
        })
      );

      setConsultations(consultationResults.flat());
    } catch (err) {
      console.error("Failed to fetch consultations:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load consultations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Consultations
              </h1>

              <p className="text-gray-600 mt-2">
                View patient consultation history
              </p>
            </div>

            <button
              onClick={() => navigate("/consultations/new")}
              className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
            >
              + New Consultation
            </button>
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
                Loading consultations...
              </p>
            </div>
          ) : consultations.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <p className="text-gray-500 text-lg">
                No consultations found.
              </p>

              <button
                onClick={() => navigate("/consultations/new")}
                className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
              >
                Create First Consultation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="bg-white rounded-xl shadow p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {consultation.patient_name}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Consultation #{consultation.id}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        consultation.severity === "Severe"
                          ? "bg-red-100 text-red-700"
                          : consultation.severity === "Moderate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {consultation.severity}
                    </span>
                  </div>

                  {/* Symptoms */}
                  <div className="mt-5">
                    <p className="text-sm text-gray-500 mb-2">
                      Symptoms
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(consultation.symptoms || []).map(
                        (symptom) => (
                          <span
                            key={symptom}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >
                            {symptom}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="mt-5">
                    <p className="text-sm text-gray-500">
                      Duration
                    </p>

                    <p className="font-semibold text-gray-800">
                      {consultation.duration_days}{" "}
                      {consultation.duration_days === 1
                        ? "day"
                        : "days"}
                    </p>
                  </div>

                  {/* Notes */}
                  {consultation.notes && (
                    <div className="mt-5 pt-5 border-t">
                      <p className="text-sm text-gray-500">
                        Notes
                      </p>

                      <p className="text-gray-700 mt-1">
                        {consultation.notes}
                      </p>
                    </div>
                  )}

                  {/* Patient Detail */}
                  <button
                    onClick={() =>
                      navigate(
                        `/patients/${consultation.patient_id}`
                      )
                    }
                    className="w-full mt-5 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
                  >
                    View Patient
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Consultations;
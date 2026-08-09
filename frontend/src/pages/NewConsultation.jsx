import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function NewConsultation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const patientIdFromUrl = searchParams.get("patient");

  const [patients, setPatients] = useState([]);
  const [symptomsList, setSymptomsList] = useState([]);

  const [formData, setFormData] = useState({
    patient_id: patientIdFromUrl || "",
    symptoms: [],
    severity: "",
    duration_days: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patientsResponse, symptomsResponse] = await Promise.all([
        api.get("/patients/"),
        api.get("/consultations/symptoms"),
      ]);

      setPatients(patientsResponse.data);
      setSymptomsList(symptomsResponse.data.symptoms || []);
    } catch (err) {
      console.error("Failed to load consultation data:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load consultation data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSymptomChange = (symptom) => {
    setFormData((prev) => {
      const alreadySelected = prev.symptoms.includes(symptom);

      return {
        ...prev,
        symptoms: alreadySelected
          ? prev.symptoms.filter((item) => item !== symptom)
          : [...prev.symptoms, symptom],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.patient_id) {
      setError("Please select a patient.");
      return;
    }

    if (formData.symptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    if (!formData.severity) {
      setError("Please select severity.");
      return;
    }

    if (!formData.duration_days) {
      setError("Please enter duration.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/consultations/", {
        patient_id: Number(formData.patient_id),
        symptoms: formData.symptoms,
        severity: formData.severity,
        duration_days: Number(formData.duration_days),
        notes: formData.notes,
      });

      setSuccess("Consultation saved successfully.");

      setTimeout(() => {
        if (formData.patient_id) {
          navigate(`/patients/${formData.patient_id}`);
        } else {
          navigate("/patient-history");
        }
      }, 800);
    } catch (err) {
      console.error("Failed to save consultation:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to save consultation."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <main className="p-8">
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-500">
                Loading consultation form...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              New Consultation
            </h1>

            <p className="text-gray-600 mt-2">
              Enter patient symptoms and consultation details
            </p>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-6 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow p-6">
            <form onSubmit={handleSubmit}>
              {/* Patient */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>

                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Patient
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name} — ID {patient.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Symptoms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Symptoms
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {symptomsList.map((symptom) => (
                    <label
                      key={symptom}
                      className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${
                        formData.symptoms.includes(symptom)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.symptoms.includes(symptom)}
                        onChange={() =>
                          handleSymptomChange(symptom)
                        }
                        className="w-4 h-4 text-blue-600"
                      />

                      <span className="text-gray-700">
                        {symptom}
                      </span>
                    </label>
                  ))}
                </div>

                {formData.symptoms.length > 0 && (
                  <p className="text-sm text-blue-600 mt-3">
                    Selected: {formData.symptoms.join(", ")}
                  </p>
                )}
              </div>

              {/* Severity + Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>

                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select Severity
                    </option>

                    <option value="Mild">
                      Mild
                    </option>

                    <option value="Moderate">
                      Moderate
                    </option>

                    <option value="Severe">
                      Severe
                    </option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days)
                  </label>

                  <input
                    type="number"
                    name="duration_days"
                    value={formData.duration_days}
                    onChange={handleChange}
                    min="1"
                    required
                    placeholder="e.g. 3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Enter additional consultation notes..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300"
                >
                  {saving
                    ? "Saving..."
                    : "Save Consultation"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewConsultation;
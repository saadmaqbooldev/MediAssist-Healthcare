import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    allergies: "",
    existing_medicines: "",
    medical_history: "",
  });

  useEffect(() => {
    fetchPatient();
    fetchConsultations();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/patients/${id}`);

      setPatient(response.data);

      setFormData({
        name: response.data.name || "",
        age: response.data.age || "",
        gender: response.data.gender || "",
        phone: response.data.phone || "",
        allergies: response.data.allergies || "",
        existing_medicines:
          response.data.existing_medicines || "",
        medical_history:
          response.data.medical_history || "",
      });
    } catch (err) {
      console.error("Failed to fetch patient:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load patient."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async () => {
    try {
      const response = await api.get(
        `/patients/${id}/consultations`
      );

      setConsultations(response.data);
    } catch (err) {
      console.error(
        "Failed to fetch consultations:",
        err
      );

      // Agar consultations endpoint abhi backend mein nahi hai
      setConsultations([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put(`/patients/${id}`, {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        allergies: formData.allergies,
        existing_medicines:
          formData.existing_medicines,
        medical_history:
          formData.medical_history,
      });

      setPatient(response.data);
      setEditing(false);
      setSuccess("Patient updated successfully.");
    } catch (err) {
      console.error("Failed to update patient:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to update patient."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/patients/${id}`);

      navigate("/patient-history");
    } catch (err) {
      console.error("Failed to delete patient:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to delete patient."
      );
    } finally {
      setDeleting(false);
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
                Loading patient...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <main className="p-8">
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-red-500">
                {error || "Patient not found."}
              </p>

              <button
                onClick={() =>
                  navigate("/patient-history")
                }
                className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
              >
                Back to Patients
              </button>
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
          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Patient Details
              </h1>

              <p className="text-gray-600 mt-2">
                View and manage patient information
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  navigate(
                    `/consultations/new?patient=${patient.id}`
                  )
                }
                className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
              >
                New Consultation
              </button>

              <button
                onClick={() => setEditing(!editing)}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
              >
                {editing ? "Cancel Edit" : "Edit Patient"}
              </button>

            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="mb-6 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Patient Information */}
          {!editing ? (
            <div className="bg-white rounded-xl shadow p-6">

              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {patient.name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Patient ID: {patient.id}
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                  Patient
                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                <div>
                  <p className="text-sm text-gray-500">
                    Age
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {patient.age}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Gender
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {patient.gender}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {patient.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Allergies
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {patient.allergies || "None"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Existing Medicines
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {patient.existing_medicines || "None"}
                  </p>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t">

                <p className="text-sm text-gray-500">
                  Medical History
                </p>

                <p className="text-gray-700 mt-2">
                  {patient.medical_history ||
                    "No medical history available."}
                </p>

              </div>

            </div>
          ) : (

            /* Edit Form */
            <div className="bg-white rounded-xl shadow p-6">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Edit Patient
              </h2>

              <form onSubmit={handleUpdate}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>

                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    >
                      <option value="">
                        Select Gender
                      </option>
                      <option value="Male">
                        Male
                      </option>
                      <option value="Female">
                        Female
                      </option>
                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>

                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Existing Medicines
                    </label>

                    <input
                      type="text"
                      name="existing_medicines"
                      value={formData.existing_medicines}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>

                </div>

                <div className="mt-5">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>

                  <textarea
                    name="medical_history"
                    value={formData.medical_history}
                    onChange={handleChange}
                    rows="5"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />

                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-300"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </form>
            </div>
          )}

          {/* Consultations */}
          <div className="mt-8 bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Past Consultations
                </h2>

                <p className="text-gray-500 mt-1">
                  Patient consultation history
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/consultations/new?patient=${patient.id}`
                  )
                }
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                New Consultation
              </button>

            </div>

            {consultations.length === 0 ? (

              <div className="mt-6 bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  No consultations found.
                </p>
              </div>

            ) : (

              <div className="mt-6 space-y-4">

                {consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="border rounded-lg p-5 hover:bg-gray-50"
                  >
                    <div className="flex justify-between">

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Consultation #{consultation.id}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          {consultation.date ||
                            consultation.created_at}
                        </p>
                      </div>

                      <span className="text-blue-600">
                        View
                      </span>

                    </div>

                    {consultation.diagnosis && (
                      <p className="mt-3 text-gray-700">
                        <strong>Diagnosis:</strong>{" "}
                        {consultation.diagnosis}
                      </p>
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Delete */}
          <div className="mt-8 bg-white rounded-xl shadow p-6 border border-red-100">

            <h2 className="text-lg font-bold text-red-600">
              Danger Zone
            </h2>

            <p className="text-gray-500 mt-2">
              Deleting this patient cannot be undone.
            </p>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="mt-4 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 disabled:bg-red-300"
            >
              {deleting
                ? "Deleting..."
                : "Delete Patient"}
            </button>

          </div>

        </main>
      </div>
    </div>
  );
}

export default PatientDetail;
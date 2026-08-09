import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PatientCard from "../components/PatientCard";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
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
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/patients");

      setPatients(response.data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setError("Unable to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await api.post("/patients", {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        allergies: formData.allergies,
        existing_medicines: formData.existing_medicines,
        medical_history: formData.medical_history,
      });

      setPatients((prevPatients) => [
        ...prevPatients,
        response.data,
      ]);

      setFormData({
        name: "",
        age: "",
        gender: "",
        phone: "",
        allergies: "",
        existing_medicines: "",
        medical_history: "",
      });

      setShowForm(false);
      setSuccess("Patient added successfully.");
    } catch (err) {
      console.error("Failed to add patient:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to add patient."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Patients
              </h1>

              <p className="text-gray-600 mt-2">
                Manage your patients
              </p>
            </div>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setError("");
                setSuccess("");
              }}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              {showForm ? "Cancel" : "Add Patient"}
            </button>
          </div>

          {/* Success */}
          {success && (
            <div className="mt-6 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Add Patient Form */}
          {showForm && (
            <div className="mt-6 bg-white rounded-xl shadow p-6">
              
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Add New Patient
              </h2>

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter patient name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>

                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Enter age"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Allergies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>

                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="e.g. Penicillin, Peanuts"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Existing Medicines */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Existing Medicines
                    </label>

                    <input
                      type="text"
                      name="existing_medicines"
                      value={formData.existing_medicines}
                      onChange={handleChange}
                      placeholder="e.g. Panadol, Aspirin"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Medical History */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical History
                    </label>

                    <textarea
                      name="medical_history"
                      value={formData.medical_history}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Enter patient's medical history"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                </div>

                {/* Save */}
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300"
                >
                  {saving ? "Saving..." : "Save Patient"}
                </button>

              </form>
            </div>
          )}

          {/* Patients */}
          <div className="mt-8">

            {loading ? (
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">
                  Loading patients...
                </p>
              </div>
            ) : patients.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-10 text-center">
                <p className="text-gray-500 text-lg">
                  No patients found.
                </p>

                <p className="text-gray-400 mt-2">
                  Click "Add Patient" to create your first patient.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {patients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                  />
                ))}

              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}

export default Patients;
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-blue-700 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">
        MediAssist
      </h1>

      <nav className="space-y-3">

        <Link
          to="/dashboard"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600"
        >
          Dashboard
        </Link>

        <Link
          to="/patients"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600"
        >
          Patients
        </Link>

        <Link
          to="/patients/new"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600"
        >
          + Add New Patient
        </Link>

        {/* Patient History */}
        <Link
          to="/patient-history"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600"
        >
          Patient History
        </Link>

        <Link
          to="/consultations"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600"
        >
          Consultations
        </Link>

      </nav>
    </aside>
  );
}

export default Sidebar;
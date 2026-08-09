import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
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
                Today's Consultations
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
              Recent Activity
            </h2>

            <p className="text-gray-500 mt-3">
              No recent activity yet.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
function PatientCard({ patient }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {patient.name}
          </h2>

          <p className="text-gray-500 mt-1">
            Patient ID: {patient.id}
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          Patient
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div>
          <p className="text-sm text-gray-500">
            Age
          </p>

          <p className="font-semibold text-gray-800">
            {patient.age}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Gender
          </p>

          <p className="font-semibold text-gray-800">
            {patient.gender}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Phone
          </p>

          <p className="font-semibold text-gray-800">
            {patient.phone}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Allergies
          </p>

          <p className="font-semibold text-gray-800">
            {patient.allergies || "None"}
          </p>
        </div>

      </div>

      {patient.medical_history && (
        <div className="mt-5 pt-5 border-t">
          <p className="text-sm text-gray-500">
            Medical History
          </p>

          <p className="text-gray-700 mt-1">
            {patient.medical_history}
          </p>
        </div>
      )}

    </div>
  );
}

export default PatientCard;
import { useEffect, useState } from 'react';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch doctor data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Doctors List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              data-testid="doctor-card"
              className="border p-4 rounded shadow-sm"
            >
              <h2 data-testid="doctor-name" className="font-bold text-lg">
                {doc.name}
              </h2>
              <p data-testid="doctor-specialty">
                {doc.specialities.map((s) => s.name).join(', ')}
              </p>
              <p data-testid="doctor-experience">{doc.experience}</p>
              <p data-testid="doctor-fee">{doc.fees}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;

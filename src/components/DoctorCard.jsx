// src/components/DoctorCard.jsx
import React from 'react';

const DoctorCard = ({ doc }) => {
  // Extract degree from the introduction, e.g. “, BDS,” → “BDS”
  const degreeMatch = doc.doctor_introduction.match(/, *([^,]+),/);
  const degree = degreeMatch ? degreeMatch[1].trim() : '';

  // Format location as "locality, city"
  const location = `${doc.clinic.address.locality}, ${doc.clinic.address.city}`;

  return (
    <div
      data-testid="doctor-card"
      className="border p-4 rounded shadow-sm flex space-x-4"
    >
      {/* Photo */}
      <img
        data-testid="doctor-photo"
        src={doc.photo}
        alt={doc.name}
        className="w-24 h-24 rounded-full object-cover"
      />

      <div className="flex-1">
        {/* Name */}
        <h2 data-testid="doctor-name" className="font-bold text-lg">
          {doc.name}
        </h2>

        {/* Degree */}
        {degree && (
          <p data-testid="doctor-degree" className="text-sm text-gray-600">
            {degree}
          </p>
        )}

        {/* Specialties */}
        <p data-testid="doctor-specialty" className="text-sm">
          {doc.specialities.map((s) => s.name).join(', ')}
        </p>

        {/* Experience */}
        <p data-testid="doctor-experience" className="text-sm">
          {doc.experience}
        </p>

        {/* Hospital Name */}
        <p data-testid="doctor-hospital" className="text-sm">
          {doc.clinic.name}
        </p>

        {/* Location */}
        <p data-testid="doctor-location" className="text-sm">
          {location}
        </p>
      </div>

      {/* Fee */}
      <div className="self-start">
        <p data-testid="doctor-fee" className="font-semibold">
          {doc.fees}
        </p>
      </div>
    </div>
  );
};

export default DoctorCard;

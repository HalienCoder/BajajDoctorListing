import React, { useState, useEffect } from 'react';

const FilterPanel = ({
  selectedConsultation,
  onConsultationChange,
  selectedSpecialties,
  onSpecialtyChange,
  selectedSort,
  onSortChange,
}) => {
  const [specialties, setSpecialties] = useState([]);
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch(
          'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json'
        );
        const data = await res.json();
        const unique = new Set(
          data.flatMap((doc) => doc.specialities.map((s) => s.name))
        );
        setSpecialties([...unique]);
      } catch (err) {
        console.error('Error fetching specialties:', err);
      }
    };
    fetchSpecialties();
  }, []);

  return (
    <div className="mb-6 border p-4 rounded bg-white shadow-sm">
      {/* Consultation Mode filter */}
      <div>
        <h3 data-testid="filter-header-moc" className="font-semibold mb-2">
          Consultation Mode
        </h3>
        <div>
          <label>
            <input
              type="radio"
              name="consultation"
              data-testid="filter-moc-all"
              checked={selectedConsultation === ''}
              onChange={() => onConsultationChange('')}
            />{' '}
            All
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="consultation"
              data-testid="filter-video-consult"
              checked={selectedConsultation === 'video_consult'}
              onChange={() => onConsultationChange('video_consult')}
            />{' '}
            Video Consult
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="consultation"
              data-testid="filter-in-clinic"
              checked={selectedConsultation === 'in_clinic'}
              onChange={() => onConsultationChange('in_clinic')}
            />{' '}
            In Clinic
          </label>
        </div>
      </div>
      <hr />
      {/* Specialties */}
      <div className="mt-4">
  <h3
    data-testid="filter-header-speciality"
    className="font-semibold mb-2"
  >
    Speciality
  </h3>
  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
    {specialties.map((spec) => (
      <label key={spec} className="flex items-center">
        <input
          type="checkbox"
          data-testid={`filter-specialty-${spec.replace(/[\s\/]/g, '-')}`}
          checked={selectedSpecialties.includes(spec)}
          onChange={() => onSpecialtyChange(spec)}
          className="mr-2"
        />
        {spec}
      </label>
    ))}
  </div>
</div>

<hr />
      {/* Sort */}
      <div className="mt-4">
        <h3 data-testid="filter-header-sort" className="font-semibold mb-2">
          Sort
        </h3>
        <div>
          <label>
            <input
              type="radio"
              name="sort"
              data-testid="sort-fees"
              checked={selectedSort === 'fees'}
              onChange={() => onSortChange('fees')}
            />{' '}
            Fees (Low → High)
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="sort"
              data-testid="sort-experience"
              checked={selectedSort === 'experience'}
              onChange={() => onSortChange('experience')}
            />{' '}
            Experience (High → Low)
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

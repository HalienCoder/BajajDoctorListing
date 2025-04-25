import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import DoctorCard from '../components/DoctorCard';
const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local filter/search state
  const [searchText, setSearchText] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // FetcH the Doctors
  useEffect(() => {
    fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch:', err);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('consultation') || '';
    const specs = searchParams.getAll('specialty');
    const sort = searchParams.get('sort') || '';

    setSearchText(s);
    setSelectedConsultation(c);
    setSelectedSpecialties(specs);
    setSelectedSort(sort); 
  }, []); // run only once

  // Sync the URL to update when change happens
  useEffect(() => {
    const params = {};
    if (searchText) params.search = searchText;
    if (selectedConsultation) params.consultation = selectedConsultation;
    if (selectedSpecialties.length) params.specialty = selectedSpecialties;
    if (selectedSort) params.sort = selectedSort;

    setSearchParams(params, {replace: true });
  }, [
    searchText,
    selectedConsultation,
    selectedSpecialties,
    selectedSort,
    setSearchParams,
  ]) ;

  //Autocomplete top 3 suggestions
  const suggestions = useMemo( () => {
    if (!searchText) return [];
    return doctors
      .filter((d) =>
        d.name.toLowerCase().includes(searchText.toLowerCase() )
      )
      .slice(0, 3);
  }, [searchText, doctors]);

  //Filtered list 
  const filteredDoctors = useMemo(() => {
    let result = doctors.filter((doc) => {
      const matchSearch =
        !searchText ||
        doc.name.toLowerCase().includes(searchText.toLowerCase());
  
      const matchConsult =
        !selectedConsultation ||
        (selectedConsultation=== 'video_consult' && doc.video_consult) ||
        (selectedConsultation === 'in_clinic' && doc.in_clinic);
  
      const matchSpecial =
        selectedSpecialties.length === 0 ||
        doc.specialities.some((s) =>
          selectedSpecialties.includes(s.name)
        );
  
      return matchSearch && matchConsult && matchSpecial;
    });
  
    // Sortnig the filtered results
    if (selectedSort === 'fees') {
      result = [...result].sort((a, b) => { // ascending
        const fa = Number(a.fees.replace(/[₹\s,]/g, ''));
        const fb = Number(b.fees.replace(/[₹\s,]/g, ''));
        return fa - fb; 
      });
    } else if (selectedSort === 'experience') { // descending
      result = [...result].sort((a, b) => {
        const ea = Number(a.experience.match(/\d+/)[0]);
        const eb = Number(b.experience.match(/\d+/)[0]);
        return eb - ea; 
      });
    }
  
    return result;
  }, [
    doctors,
    searchText,
    selectedConsultation,
    selectedSpecialties,
    selectedSort,  
  ]);
  
  // Handlers
  const handleSelectSuggestion = (name) => {
    setSearchText(name);
  };
  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      // state already set; URL sync effect will run
    }
  };

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-xl font-semibold mb-4">Doctor Listing Bajaj Challenge</h1>
  
      {/* Container: sidebar + main */}
      <div className="flex flex-col md:flex-row">
  
        {/* Sidebar: FilterPanel */}
        <div className="md:w-64 w-full mb-6 md:mb-0">
          <FilterPanel
            selectedConsultation={selectedConsultation}
            onConsultationChange={setSelectedConsultation}
            selectedSpecialties={selectedSpecialties}
            onSpecialtyChange={(spec) =>
              setSelectedSpecialties((prev) =>
                prev.includes(spec)
                  ? prev.filter((s) => s !== spec)
                  : [...prev, spec]
              )
            }
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
        </div>
  
        {/* Main content */}
        <div className="flex-1 md:pl-6">
  
          {/* Autocomplete */}
          <div className="relative mb-6">
            <input
              type="text"
              data-testid="autocomplete-input"
              className="w-full border p-2 rounded"
              placeholder="Search doctor by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearchEnter}
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border w-full mt-1 z-10">
                {suggestions.map((doc) => (
                  <li
                    key={doc.id}
                    data-testid="suggestion-item"
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectSuggestion(doc.name)}
                  >
                    {doc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
  
          {/* Doctor Cards */}
          {loading ? (
            <p>Loading...</p>
            ) : filteredDoctors.length === 0 ? (
            <p
                data-testid="no-doctors-found"
                className="text-center text-gray-500 mt-4"
            >
                No doctors found
            </p>
            ) : (
            <div className="grid gap-4">
                {filteredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doc={doc} />
                ))}
            </div>
            )}
        </div>
      </div>
    </div>
  );

};

export default DoctorsPage;

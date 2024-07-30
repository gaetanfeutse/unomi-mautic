import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../ProfileList.css';

Modal.setAppElement('#root'); // Set the app element for accessibility

function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 5;
  const [showAnonymous, setShowAnonymous] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [expandedProfile, setExpandedProfile] = useState(null);

  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Function to fetch profiles from the Unomi instance
  const fetchProfiles = useCallback(async () => {
    try {
      const response = await fetch('https://cdp.qilinsa.com:9443/cxs/profiles/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('karaf:karaf')
        },
        body: JSON.stringify({
          offset: 0,
          limit: 1000
        })
      });
      const data = await response.json();
      setProfiles(data.list);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }, []);

  // Fetch profiles when the component mounts
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Handle changes in the search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle pagination page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Toggle the display of anonymous profiles
  const handleShowAnonymousChange = () => {
    setShowAnonymous(!showAnonymous);
  };

  // Check if a profile is anonymous
  const isAnonymous = (profile) => {
    const firstName = profile.properties?.firstName || '';
    const lastName = profile.properties?.lastName || '';
    const email = profile.properties?.email || '';
    return !firstName && !lastName && !email;
  };

  // Filter profiles based on search term and anonymity
  const filteredProfiles = profiles.filter(profile => {
    if (!showAnonymous && isAnonymous(profile)) {
      return false;
    }
    const firstName = profile.properties?.firstName || '';
    const lastName = profile.properties?.lastName || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const email = profile.properties?.email || '';
    const segments = profile.segments?.join(' ') || '';
    const id = profile.itemId || '';

    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      segments.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const pageNumbers = [];
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  // Create pagination with progressive numeration
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push('...');
    }
  }

  // Open the confirmation modal
  const openModal = (profile) => {
    setProfileToDelete(profile);
    setModalIsOpen(true);
  };

  // Close the confirmation modal
  const closeModal = () => {
    setProfileToDelete(null);
    setModalIsOpen(false);
  };

  // Delete a profile by its ID
  const confirmDeleteProfile = async () => {
    try {
      if (profileToDelete) {
        await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${profileToDelete.itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          }
        });
        setProfiles(profiles.filter(profile => profile.itemId !== profileToDelete.itemId));

        // Delete profile from Mautic
        await fetch(`https://qilinsa.com/api/contacts/${profileToDelete.itemId}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + btoa('YOUR_MAUTIC_USERNAME:YOUR_MAUTIC_PASSWORD')
          }
        });
        closeModal();
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  // Navigate to the profile detail page
  const handleProfileClick = (id) => {
    navigate(`/profile/${id}`);
  };

  // Handle "See More" functionality
  const handleSeeMore = (profileId) => {
    if (expandedProfile === profileId) {
      setExpandedProfile(null);
    } else {
      setExpandedProfile(profileId);
    }
  };

  // Render profile fields only if they have values
  const renderProfileField = (label, value) => {
    return value ? <p>{label}: {value}</p> : null;
  };

  return (
    <div className="profile-list">
      <h2>Profile List</h2>
      <input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div>
        <input
          type="checkbox"
          checked={showAnonymous}
          onChange={handleShowAnonymousChange}
        />
        <label>Show Anonymous Profiles</label>
      </div>
      <ul>
        {currentProfiles.map(profile => (
          <li key={profile.itemId} className="profile-item">
            <h3>{profile.properties?.firstName} {profile.properties?.lastName} {profile.properties?.surename}</h3>
            <p>ID: {profile.itemId}</p>
            {renderProfileField("Email", profile.properties?.email)}
            {renderProfileField("LastName", profile.properties?.lastName)}
            {renderProfileField("FirstName", profile.properties?.firstName)}
            {renderProfileField("SureName", profile.properties?.surename)}
            <p>Number of Visits: {profile.properties?.nbOfVisits}</p>
            <p>First Visit: {profile.properties?.firstVisit ? new Date(profile.properties.firstVisit).toLocaleString() : 'N/A'}</p>
            <p>Last Visit: {profile.properties?.lastVisit ? new Date(profile.properties.lastVisit).toLocaleString() : 'N/A'}</p>
            <p>Last Updated: {profile.systemProperties?.lastUpdated ? new Date(profile.systemProperties.lastUpdated).toLocaleString() : 'N/A'}</p>
            <p>Segments: {profile.segments?.join(', ')}</p>
            {expandedProfile === profile.itemId && (
              <>
                {renderProfileField("Number of kids", profile.properties?.kids)}
                {renderProfileField("Number of test", profile.properties?.test)}
                {renderProfileField("Job Title", profile.properties?.jobTitle)}
                {renderProfileField("Gender", profile.properties?.gender)}
                {renderProfileField("Nationality", profile.properties?.nationality)}
                {renderProfileField("Phone Number", profile.properties?.phoneNumber)}
                {renderProfileField("Age", profile.properties?.age)}
                {renderProfileField("Birth Date", profile.properties?.birthDate)}
                {renderProfileField("Marital Status", profile.properties?.maritalStatus)}
                {renderProfileField("Address", profile.properties?.address)}
                {renderProfileField("City", profile.properties?.city)}
                {renderProfileField("Facebook ID", profile.properties?.facebookId)}
                {renderProfileField("ZIP Code", profile.properties?.zipCode)}
                {renderProfileField("Country Name", profile.properties?.countryName)}
                {renderProfileField("LinkedIn ID", profile.properties?.linkedInId)}
                {renderProfileField("Google ID", profile.properties?.googleId)}
                {renderProfileField("Twitter ID", profile.properties?.twitterId)}
                {renderProfileField("Company", profile.properties?.company)}
                {renderProfileField("Income", profile.properties?.income)}
                {renderProfileField("Level of education", profile.properties?.levelOfEducation)}
                {renderProfileField("Form of Comunication", profile.properties?.formOfComunication)}
                {renderProfileField("Language of Communication", profile.properties?.language)}
                {renderProfileField("Your Profession", profile.properties?.profession)}
                {renderProfileField("Case Number", profile.properties?.caseNumber)}
                {renderProfileField("Date of Report", profile.properties?.dateOfReport)}
                {renderProfileField("Your Location of Incident", profile.properties?.locationOfIncident)}
                {renderProfileField("Agency", profile.properties?.agency)}
                {renderProfileField("Type of Incident", profile.properties?.typeOfIncident)}
                {renderProfileField("Description of Incident", profile.properties?.descriptionOfIncident)}
                {renderProfileField("Type Of Incident", profile.properties?.typeOfIncident)}
                {renderProfileField("General Observations", profile.properties?.generalObservations)}
                {renderProfileField("Impact on Victim", profile.properties?.ImpactOnVictim)}
                {renderProfileField("Evidence ID Number", profile.properties?.evidenceIdNumber)}
              </>
            )}
            <button className="bts" onClick={() => handleSeeMore(profile.itemId)}>
              {expandedProfile === profile.itemId ? 'See Less' : 'See More'}
            </button>
            <div className="button-group">
              <button onClick={(e) => { e.stopPropagation(); handleProfileClick(profile.itemId); }} className="view-details">View Details</button>
              <button onClick={(e) => { e.stopPropagation(); openModal(profile); }} className="delete">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {pageNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() => number !== '...' && handlePageChange(number)}
            className={currentPage === number ? 'active' : ''}
            disabled={number === '...'}
          >
            {number}
          </button>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this profile?</p>
        <button onClick={confirmDeleteProfile}>Yes</button>
        <button onClick={closeModal}>No</button>
      </Modal>
    </div>
  );
}

export default ProfileList;


















// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Modal from 'react-modal';
// import '../ProfileList.css';

// Modal.setAppElement('#root'); // Set the app element for accessibility

// function ProfileList() {
//   const [profiles, setProfiles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const profilesPerPage = 5;
//   const [showAnonymous, setShowAnonymous] = useState(true);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [profileToDelete, setProfileToDelete] = useState(null);

//   const navigate = useNavigate(); // Use useNavigate instead of useHistory

//   // Function to fetch profiles from the Unomi instance
//   const fetchProfiles = useCallback(async () => {
//     try {
//       const response = await fetch('https://cdp.qilinsa.com:9443/cxs/profiles/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Basic ' + btoa('karaf:karaf')
//         },
//         body: JSON.stringify({
//           offset: 0,
//           limit: 1000
//         })
//       });
//       const data = await response.json();
//       setProfiles(data.list);
//     } catch (error) {
//       console.error('Error fetching profiles:', error);
//     }
//   }, []);

//   // Fetch profiles when the component mounts
//   useEffect(() => {
//     fetchProfiles();
//   }, [fetchProfiles]);

//   // Handle changes in the search input
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Handle pagination page changes
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Toggle the display of anonymous profiles
//   const handleShowAnonymousChange = () => {
//     setShowAnonymous(!showAnonymous);
//   };

//   // Check if a profile is anonymous
//   const isAnonymous = (profile) => {
//     const firstName = profile.properties?.firstName || '';
//     const lastName = profile.properties?.lastName || '';
//     const email = profile.properties?.email || '';
//     return !firstName && !lastName && !email;
//   };

//   // Filter profiles based on search term and anonymity
//   const filteredProfiles = profiles.filter(profile => {
//     if (!showAnonymous && isAnonymous(profile)) {
//       return false;
//     }
//     const firstName = profile.properties?.firstName || '';
//     const lastName = profile.properties?.lastName || '';
//     const fullName = `${firstName} ${lastName}`.toLowerCase();
//     const email = profile.properties?.email || '';
//     const segments = profile.segments?.join(' ') || '';
//     const id = profile.itemId || '';

//     return (
//       firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       fullName.includes(searchTerm.toLowerCase()) ||
//       email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       segments.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       id.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   // Pagination logic
//   const indexOfLastProfile = currentPage * profilesPerPage;
//   const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
//   const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
//   const pageNumbers = [];
//   const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

//   // Create pagination with progressive numeration
//   for (let i = 1; i <= totalPages; i++) {
//     if (
//       i === 1 ||
//       i === totalPages ||
//       (i >= currentPage - 1 && i <= currentPage + 1)
//     ) {
//       pageNumbers.push(i);
//     } else if (i === currentPage - 2 || i === currentPage + 2) {
//       pageNumbers.push('...');
//     }
//   }

//   // Open the confirmation modal
//   const openModal = (profile) => {
//     setProfileToDelete(profile);
//     setModalIsOpen(true);
//   };

//   // Close the confirmation modal
//   const closeModal = () => {
//     setProfileToDelete(null);
//     setModalIsOpen(false);
//   };

//   // Delete a profile by its ID
//   const confirmDeleteProfile = async () => {
//     try {
//       if (profileToDelete) {
//         await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${profileToDelete.itemId}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': 'Basic ' + btoa('karaf:karaf')
//           }
//         });
//         setProfiles(profiles.filter(profile => profile.itemId !== profileToDelete.itemId));

//         // Delete profile from Mautic
//         await fetch(`https://qilinsa.com/api/contacts/${profileToDelete.itemId}/delete`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': 'Basic ' + btoa('YOUR_MAUTIC_USERNAME:YOUR_MAUTIC_PASSWORD')
//           }
//         });
//         closeModal();
//       }
//     } catch (error) {
//       console.error('Error deleting profile:', error);
//     }
//   };

//   // Navigate to the profile detail page
//   const handleProfileClick = (id) => {
//     navigate(`/profile/${id}`);
//   };

//   return (
//     <div className="profile-list">
//       <h2>Profile List</h2>
//       <input
//         type="text"
//         placeholder="Search profiles..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//       />
//       <div>
//         <input
//           type="checkbox"
//           checked={showAnonymous}
//           onChange={handleShowAnonymousChange}
//         />
//         <label>Show Anonymous Profiles</label>
//       </div>
//       <ul>
//         {currentProfiles.map(profile => (
//           <li key={profile.itemId} className="profile-item">
//             <h3>{profile.properties?.firstName} {profile.properties?.lastName}</h3>
//             <p>ID: {profile.itemId}</p>
//             <p>Email: {profile.properties?.email}</p>
//             <p>Page View: {profile.properties?.pageViewCount ? profile.properties.pageViewCount : 'N/A'}</p>
//             <p>Number of Visits: {profile.properties?.nbOfVisits}</p>
//             <p>First Visit: {profile.properties?.firstVisit ? new Date(profile.properties.firstVisit).toLocaleString() : 'N/A'}</p>
//             <p>Last Visit: {profile.properties?.lastVisit ? new Date(profile.properties.lastVisit).toLocaleString() : 'N/A'}</p>
//             <p>Last Updated: {profile.systemProperties?.lastUpdated ? new Date(profile.systemProperties.lastUpdated).toLocaleString() : 'N/A'}</p>
//             <p>Segments: {profile.segments?.join(', ')}</p>
//             <div className="button-group">
//             <button onClick={(e) => {e.stopPropagation(); handleProfileClick(profile.itemId);}} className="view-details">View Details</button>
//             <button onClick={(e) => {e.stopPropagation(); openModal(profile);}} className="delete">Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//       <div className="pagination">
//         {pageNumbers.map((number, index) => (
//           <button
//             key={index}
//             onClick={() => number !== '...' && handlePageChange(number)}
//             className={currentPage === number ? 'active' : ''}
//             disabled={number === '...'}
//           >
//             {number}
//           </button>
//         ))}
//       </div>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Confirm Delete"
//         className="modal"
//         overlayClassName="overlay"
//       >
//         <h2>Confirm Delete</h2>
//         <p>Are you sure you want to delete this profile?</p>
//         <button onClick={confirmDeleteProfile}>Yes</button>
//         <button onClick={closeModal}>No</button>
//       </Modal>
//     </div>
//   );
// }

// export default ProfileList;







// import React, { useState, useEffect, useCallback } from 'react';
// import Modal from 'react-modal';
// import '../ProfileList.css';

// Modal.setAppElement('#root'); // Set the app element for accessibility

// function ProfileList() {
//   const [profiles, setProfiles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const profilesPerPage = 5;
//   const [showAnonymous, setShowAnonymous] = useState(true);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [profileToDelete, setProfileToDelete] = useState(null);

//   // Function to fetch profiles from the Unomi instance
//   const fetchProfiles = useCallback(async () => {
//     try {
//       const response = await fetch('https://cdp.qilinsa.com:9443/cxs/profiles/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Basic ' + btoa('karaf:karaf')
//         },
//         body: JSON.stringify({
//           offset: 0,
//           limit: 1000
//         })
//       });
//       const data = await response.json();
//       setProfiles(data.list);
//     } catch (error) {
//       console.error('Error fetching profiles:', error);
//     }
//   }, []);

//   // Fetch profiles when the component mounts
//   useEffect(() => {
//     fetchProfiles();
//   }, [fetchProfiles]);

//   // Handle changes in the search input
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Handle pagination page changes
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Toggle the display of anonymous profiles
//   const handleShowAnonymousChange = () => {
//     setShowAnonymous(!showAnonymous);
//   };

//   // Check if a profile is anonymous
//   const isAnonymous = (profile) => {
//     const firstName = profile.properties?.firstName || '';
//     const lastName = profile.properties?.lastName || '';
//     const email = profile.properties?.email || '';
//     return !firstName && !lastName && !email;
//   };

//   // Filter profiles based on search term and anonymity
//   const filteredProfiles = profiles.filter(profile => {
//     if (!showAnonymous && isAnonymous(profile)) {
//       return false;
//     }
//     const firstName = profile.properties?.firstName || '';
//     const lastName = profile.properties?.lastName || '';
//     const fullName = `${firstName} ${lastName}`.toLowerCase();
//     const email = profile.properties?.email || '';
//     const segments = profile.segments?.join(' ') || '';
//     const id = profile.itemId || '';

//     return (
//       firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       fullName.includes(searchTerm.toLowerCase()) ||
//       email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       segments.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       id.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   // Pagination logic
//   const indexOfLastProfile = currentPage * profilesPerPage;
//   const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
//   const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
//   const pageNumbers = [];
//   const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

//   // Create pagination with progressive numeration
//   for (let i = 1; i <= totalPages; i++) {
//     if (
//       i === 1 ||
//       i === totalPages ||
//       (i >= currentPage - 1 && i <= currentPage + 1)
//     ) {
//       pageNumbers.push(i);
//     } else if (i === currentPage - 2 || i === currentPage + 2) {
//       pageNumbers.push('...');
//     }
//   }

//   // Open the confirmation modal
//   const openModal = (profile) => {
//     setProfileToDelete(profile);
//     setModalIsOpen(true);
//   };

//   // Close the confirmation modal
//   const closeModal = () => {
//     setProfileToDelete(null);
//     setModalIsOpen(false);
//   };

//   // Delete a profile by its ID
//   const confirmDeleteProfile = async () => {
//     try {
//       if (profileToDelete) {
//         await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${profileToDelete.itemId}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': 'Basic ' + btoa('karaf:karaf')
//           }
//         });
//         setProfiles(profiles.filter(profile => profile.itemId !== profileToDelete.itemId));

//         // Delete profile from Mautic
//         await fetch(`https://qilinsa.com/api/contacts/${profileToDelete.itemId}/delete`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': 'Basic ' + btoa('YOUR_MAUTIC_USERNAME:YOUR_MAUTIC_PASSWORD')
//           }
//         });
//         closeModal();
//       }
//     } catch (error) {
//       console.error('Error deleting profile:', error);
//     }
//   };

//   return (
//     <div className="profile-list">
//       <h2>Profile List</h2>
//       <input
//         type="text"
//         placeholder="Search profiles..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//       />
//       <div>
//         <input
//           type="checkbox"
//           checked={showAnonymous}
//           onChange={handleShowAnonymousChange}
//         />
//         <label>Show Anonymous Profiles</label>
//       </div>
//       <ul>
//         {currentProfiles.map(profile => (
//           <li key={profile.itemId} className="profile-item">
//             <h3>{profile.properties?.firstName} {profile.properties?.lastName}</h3>
//             <p>ID: {profile.itemId}</p>
//             <p>Email: {profile.properties?.email}</p>
//             <p>Number of Visits: {profile.properties?.nbOfVisits}</p>
//             <p>First Visit: {profile.properties?.firstVisit ? new Date(profile.properties.firstVisit).toLocaleString() : 'N/A'}</p>
//             <p>Last Visit: {profile.properties?.lastVisit ? new Date(profile.properties.lastVisit).toLocaleString() : 'N/A'}</p>
//             <p>Last Updated: {profile.systemProperties?.lastUpdated ? new Date(profile.systemProperties.lastUpdated).toLocaleString() : 'N/A'}</p>
//             <p>Segments: {profile.segments?.join(', ')}</p>
//             <button onClick={() => openModal(profile)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//       <div className="pagination">
//         {pageNumbers.map((number, index) => (
//           <button
//             key={index}
//             onClick={() => number !== '...' && handlePageChange(number)}
//             className={currentPage === number ? 'active' : ''}
//             disabled={number === '...'}
//           >
//             {number}
//           </button>
//         ))}
//       </div>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Confirm Delete"
//         className="modal"
//         overlayClassName="overlay"
//       >
//         <h2>Confirm Delete</h2>
//         <p>Are you sure you want to delete this profile?</p>
//         <button onClick={confirmDeleteProfile}>Yes</button>
//         <button onClick={closeModal}>No</button>
//       </Modal>
//     </div>
//   );
// }

// export default ProfileList;


// import React, { useState, useEffect } from 'react';
// import '../ProfileList.css';

// function ProfileList() {
//   const [profiles, setProfiles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const profilesPerPage = 10;
//   const [showAnonymous, setShowAnonymous] = useState(true);

//   // Fetch profiles when the component mounts
//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   // Function to fetch profiles from the Unomi instance
//   const fetchProfiles = async () => {
//     try {
//       const response = await fetch('https://cdp.qilinsa.com:9443/cxs/profiles/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Basic ' + btoa('karaf:karaf')
//         },
//         body: JSON.stringify({
//           offset: 0,
//           limit: 1000
//         })
//       });
//       const data = await response.json();
//       setProfiles(data.list);
//     } catch (error) {
//       console.error('Error fetching profiles:', error);
//     }
//   };

//   // Handle changes in the search input
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Handle pagination page changes
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Toggle the display of anonymous profiles
//   const handleShowAnonymousChange = () => {
//     setShowAnonymous(!showAnonymous);
//   };

//   // Check if a profile is anonymous
//   const isAnonymous = (profile) => {
//     const firstName = profile.properties?.firstName || '';
//     const lastName = profile.properties?.lastName || '';
//     const email = profile.properties?.email || '';
//     return !firstName && !lastName && !email;
//   };

//   // Filter profiles based on search term and anonymity
//   const filteredProfiles = profiles.filter(profile => {
//     if (!showAnonymous && isAnonymous(profile)) {
//       return false;
//     }
//     const firstName = profile.properties?.firstName || '';
//     const lastName = profile.properties?.lastName || '';
//     const email = profile.properties?.email || '';
//     return (
//       firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   // Pagination logic
//   const indexOfLastProfile = currentPage * profilesPerPage;
//   const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
//   const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
//   const pageNumbers = [];

//   for (let i = 1; i <= Math.ceil(filteredProfiles.length / profilesPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   // Delete a profile by its ID
//   const deleteProfile = async (profileId) => {
//     try {
//       await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${profileId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': 'Basic ' + btoa('karaf:karaf')
//         }
//       });
//       setProfiles(profiles.filter(profile => profile.itemId !== profileId));
//     } catch (error) {
//       console.error('Error deleting profile:', error);
//     }
//   };

//   return (
//     <div className="profile-list">
//       <h2>Profile List</h2>
//       <input
//         type="text"
//         placeholder="Search profiles..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//       />
//       <div>
//         <input
//           type="checkbox"
//           checked={showAnonymous}
//           onChange={handleShowAnonymousChange}
//         />
//         <label>Show Anonymous Profiles</label>
//       </div>
//       <ul>
//         {currentProfiles.map(profile => (
//           <li key={profile.itemId} className="profile-item">
//             <h3>{profile.properties?.firstName} {profile.properties?.lastName}</h3>
//             <p>ID: {profile.itemId}</p>
//             <p>Email: {profile.properties?.email}</p>
//             <p>Number of Visits: {profile.properties?.nbOfVisits}</p>
//             <p>First Visit: {profile.properties?.firstVisit ? new Date(profile.properties.firstVisit).toLocaleString() : 'N/A'}</p>
//             <p>Last Visit: {profile.properties?.lastVisit ? new Date(profile.properties.lastVisit).toLocaleString() : 'N/A'}</p>
//             <p>Last Updated: {profile.systemProperties?.lastUpdated ? new Date(profile.systemProperties.lastUpdated).toLocaleString() : 'N/A'}</p>
//             <p>Segments: {profile.segments?.join(', ')}</p>
//             <button onClick={() => deleteProfile(profile.itemId)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//       <div className="pagination">
//         {pageNumbers.map(number => (
//           <button
//             key={number}
//             onClick={() => handlePageChange(number)}
//             className={currentPage === number ? 'active' : ''}
//           >
//             {number}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ProfileList;

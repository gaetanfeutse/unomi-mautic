import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../ProfileList.css';

Modal.setAppElement('#root'); // Set the app element for accessibility

function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');
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
      
      // Sort profiles by the "Last Updated" timestamp in descending order
      const sortedProfiles = data.list.sort((a, b) => {
        const lastUpdatedA = new Date(a.systemProperties?.lastUpdated || 0);
        const lastUpdatedB = new Date(b.systemProperties?.lastUpdated || 0);
        return lastUpdatedB - lastUpdatedA;
      });

      setProfiles(sortedProfiles);
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
    // Reset to first page when search term changes
    setCurrentPage(1);
  };

  // Handle changes in the field selection dropdown
  const handleFieldChange = (e) => {
    setSelectedField(e.target.value);
    // Reset to first page when field selection changes
    setCurrentPage(1);
  };

  const updateProfileProperties = async (sessionId, totalDuration) => {
    // Nouvelle structure JSON avec un tableau d'événements
    const eventPayload = {
      "sessionId": sessionId, // Remplace par l'ID de session
        "events": [
            {
                "eventType": "sale",
                "scope": "unomi-tracker-bat",
                "source": {
                    "itemType": "site",
                    "scope": "unomi-tracker-bat",
                    "itemId": "mysite"
                },
                "target": {
                    "itemType": "form",
                    "scope": "unomi-tracker-bat",
                    "itemId": "contactForm"
                },
                "properties": {
                    "totalTimeSpent": totalDuration
                }
            }
        ]
    };

    console.log("JSON envoyé à Unomi :", JSON.stringify(eventPayload, null, 2));

    try {
        const response = await fetch("https://cdp.qilinsa.com:9443/cxs/eventcollector", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa("karaf:karaf") // Remplace si tes identifiants sont différents
            },
            body: JSON.stringify(eventPayload)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du profil');
        }

        const data = await response.json();
        console.log("Mise à jour réussie :", data);
    } catch (error) {
        console.error("Erreur :", error);
    }
};

  const fetchOldestSessionIdAndTotalDuration = async (profileId) => {
    try {
        const response = await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${profileId}/sessions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('karaf:karaf')
            }
        });
        
        const data = await response.json();
        console.log("Réponse de l'API pour les sessions du profil", profileId, ":", data);
  
        // Vérifie si 'data.list' contient des sessions
        if (!data.list || data.list.length === 0) {
            console.warn(`Aucune session trouvée pour le profil ${profileId}, le profil sera ignoré.`);
            return null; // Ignorer ce profil
        }
        
        // Trie les sessions par date
        const sortedSessions = data.list.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        
        // Récupère l'ID de la session la plus ancienne
        const oldestSessionId = sortedSessions[0].itemId;
  
        // Calcule la somme des durées
        const totalDuration = data.list.reduce((sum, session) => sum + (session.duration || 0), 0);
        const totalDurationInMinutes = parseFloat((totalDuration / 60000).toFixed(2));

        console.log("Sessions triées :", sortedSessions);
  
        console.log(`ID de la session la plus ancienne pour le profil ${profileId}: ${oldestSessionId}`);
        console.log(`Somme des durées des sessions pour le profil ${profileId}: ${totalDurationInMinutes}`);
  
        // Retourne les deux résultats
        return { oldestSessionId, totalDurationInMinutes };
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour le profil ${profileId}, le profil sera ignoré.`, error);
        
    }
  };

  const handleProfileUpdate = useCallback(async () => {
    if (profiles.length > 0) {
        for (const profile of profiles) {
            // Appelle la fonction et gère les erreurs
            const result = await fetchOldestSessionIdAndTotalDuration(profile.itemId);
            
            // Vérifie si le résultat est valide
            if (!result) {
                console.warn(`Impossible de traiter le profil ${profile.itemId}, données manquantes ou erreur.`);
                continue; // Passe au prochain profil
            }
            
            const { oldestSessionId, totalDurationInMinutes } = result;

            // Vérifie si les valeurs retournées sont correctes
            if (!oldestSessionId || totalDurationInMinutes == null) {
                console.warn(`Les données retournées pour le profil ${profile.itemId} sont incomplètes.`);
                continue; // Passe au prochain profil
            }

            console.log(`Profile ID: ${profile.itemId}, Session ID: ${oldestSessionId}, Total Duration: ${totalDurationInMinutes}`);

            // Met à jour les propriétés du profil
            updateProfileProperties(oldestSessionId, totalDurationInMinutes);
        }
    } else {
        console.warn("La liste des profils est vide, aucune mise à jour n'a été effectuée.");
    }
}, [profiles]);

  useEffect(() => {
    if (profiles.length > 0) {
      handleProfileUpdate();
    }
  }, [profiles, handleProfileUpdate]);
  

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

  // Helper function to format date for comparison
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString().toLowerCase();
    } catch (e) {
      return dateString.toString().toLowerCase();
    }
  };
  
  // Helper function to safely convert any value to string for comparison
  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    return value.toString().toLowerCase();
  };
  
  // Helper function to check if a field exists and has a value
  const hasField = (profile, fieldName) => {
    switch (fieldName) {
      case 'firstName':
        return !!profile.properties?.firstName;
      case 'lastName':
        return !!profile.properties?.lastName;
      case 'surename':
        return !!profile.properties?.surename;
      case 'email':
        return !!profile.properties?.email;
      case 'scopeEmail':
        return !!profile.properties?.scopeEmail;
      case 'segments':
        return !!(profile.segments && profile.segments.length > 0);
      case 'id':
        return !!profile.itemId;
      case 'nbOfVisits':
        return profile.properties?.nbOfVisits !== undefined;
      case 'firstVisit':
        return !!profile.properties?.firstVisit;
      case 'lastVisit':
        return !!profile.properties?.lastVisit;
      case 'lastUpdated':
        return !!profile.systemProperties?.lastUpdated;
      case 'kids':
        return profile.properties?.kids !== undefined;
      case 'jobTitle':
        return !!profile.properties?.jobTitle;
      case 'gender':
        return !!profile.properties?.gender;
      case 'nationality':
        return !!profile.properties?.nationality;
      case 'phoneNumber':
        return !!profile.properties?.phoneNumber;
      case 'age':
        return profile.properties?.age !== undefined;
      case 'birthDate':
        return !!profile.properties?.birthDate;
      case 'location':
        return !!profile.properties?.location;
      case 'maritalStatus':
        return !!profile.properties?.maritalStatus;
      case 'address':
        return !!profile.properties?.address;
      case 'city':
        return !!profile.properties?.city;
      case 'zipCode':
        return !!profile.properties?.zipCode;
      case 'levelOfEducation':
        return !!profile.properties?.levelOfEducation;
      case 'language':
        return !!profile.properties?.language;
      case 'profession':
        return !!profile.properties?.profession;
      case 'company':
        return !!profile.properties?.company;
      case 'averageSalesAmount':
        return profile.properties?.averageSalesAmount !== undefined;
      case 'totalNumberOfOrders':
        return profile.properties?.totalNumberOfOrders !== undefined;
      case 'totalSalesAmount':
        return profile.properties?.totalSalesAmount !== undefined;
      case 'all':
        return true;
      default:
        return true;
    }
  };

  // Filter profiles based on search term, selected field, and anonymity
  const filteredProfiles = profiles.filter(profile => {
    // First filter out anonymous profiles if not showing them
    if (!showAnonymous && isAnonymous(profile)) {
      return false;
    }
    
    // If field is not 'all', filter profiles that don't have the selected field
    if (selectedField !== 'all' && !hasField(profile, selectedField)) {
      return false;
    }
    
    // If search term is empty, include all profiles that passed the field check
    if (!searchTerm.trim()) {
      return true;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Apply field-specific filtering based on selected field
    switch (selectedField) {
      // Basic profile information
      case 'firstName':
        return safeString(profile.properties?.firstName).includes(searchTermLower);
      
      case 'lastName':
        return safeString(profile.properties?.lastName).includes(searchTermLower);
        
      case 'surename':
        return safeString(profile.properties?.surename).includes(searchTermLower);
      
      case 'email':
        return safeString(profile.properties?.email).includes(searchTermLower);
        
      case 'scopeEmail':
        return safeString(profile.properties?.scopeEmail).includes(searchTermLower);
      
      // Segments and IDs  
      case 'segments':
        return (profile.segments?.join(' ') || '').toLowerCase().includes(searchTermLower);
      
      case 'id':
        return (profile.itemId || '').toLowerCase().includes(searchTermLower);
      
      // Visit related information  
      case 'nbOfVisits':
        return safeString(profile.properties?.nbOfVisits).includes(searchTermLower);
        
      case 'firstVisit':
        return formatDate(profile.properties?.firstVisit).includes(searchTermLower);
        
      case 'lastVisit':
        return formatDate(profile.properties?.lastVisit).includes(searchTermLower);
        
      case 'lastUpdated':
        return formatDate(profile.systemProperties?.lastUpdated).includes(searchTermLower);
      
      // Personal information
      case 'kids':
        return safeString(profile.properties?.kids).includes(searchTermLower);
        
      case 'jobTitle':
        return safeString(profile.properties?.jobTitle).includes(searchTermLower);
        
      case 'gender':
        return safeString(profile.properties?.gender).includes(searchTermLower);
        
      case 'nationality':
        return safeString(profile.properties?.nationality).includes(searchTermLower);
        
      case 'phoneNumber':
        return safeString(profile.properties?.phoneNumber).includes(searchTermLower);
        
      case 'age':
        return safeString(profile.properties?.age).includes(searchTermLower);
        
      case 'birthDate':
        return formatDate(profile.properties?.birthDate).includes(searchTermLower);
        
      case 'location':
        return safeString(profile.properties?.location).includes(searchTermLower);
        
      case 'maritalStatus':
        return safeString(profile.properties?.maritalStatus).includes(searchTermLower);
      
      // Location information  
      case 'address':
        return safeString(profile.properties?.address).includes(searchTermLower);
        
      case 'city':
        return safeString(profile.properties?.city).includes(searchTermLower);
        
      case 'zipCode':
        return safeString(profile.properties?.zipCode).includes(searchTermLower);
      
      // Education and professional information
      case 'levelOfEducation':
        return safeString(profile.properties?.levelOfEducation).includes(searchTermLower);
        
      case 'language':
        return safeString(profile.properties?.language).includes(searchTermLower);
        
      case 'profession':
        return safeString(profile.properties?.profession).includes(searchTermLower);
        
      case 'company':
        return safeString(profile.properties?.company).includes(searchTermLower);
      
      // Sales information  
      case 'averageSalesAmount':
        return safeString(profile.properties?.averageSalesAmount).includes(searchTermLower);
        
      case 'totalNumberOfOrders':
        return safeString(profile.properties?.totalNumberOfOrders).includes(searchTermLower);
        
      case 'totalSalesAmount':
        return safeString(profile.properties?.totalSalesAmount).includes(searchTermLower);
        
      case 'all':
      default:
        // Search across all common fields (original behavior)
        const firstName = safeString(profile.properties?.firstName);
        const lastName = safeString(profile.properties?.lastName);
        const fullName = `${firstName} ${lastName}`;
        const email = safeString(profile.properties?.email);
        const segments = (profile.segments?.join(' ') || '').toLowerCase();
        const id = (profile.itemId || '').toLowerCase();

        return (
          firstName.includes(searchTermLower) ||
          lastName.includes(searchTermLower) ||
          fullName.includes(searchTermLower) ||
          email.includes(searchTermLower) ||
          segments.includes(searchTermLower) ||
          id.includes(searchTermLower)
        );
    }
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
        await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${profileToDelete.itemId}?withData=true`, {
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
      <div className="search-container">
        <select 
          value={selectedField} 
          onChange={handleFieldChange}
          className="field-selector"
        >
          <option value="all">All Fields</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="surename">Surename</option>
          <option value="email">Email</option>
          <option value="scopeEmail">Scope Email</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="nbOfVisits">Number of Visits</option>
          <option value="firstVisit">First Visit</option>
          <option value="lastVisit">Last Visit</option>
          <option value="lastUpdated">Last Updated</option>
          <option value="kids">Kids</option>
          <option value="jobTitle">Job Title</option>
          <option value="gender">Gender</option>
          <option value="nationality">Nationality</option>
          <option value="age">Age</option>
          <option value="birthDate">Birth Date</option>
          <option value="location">Location</option>
          <option value="maritalStatus">Marital Status</option>
          <option value="address">Address</option>
          <option value="city">City</option>
          <option value="zipCode">ZIP Code</option>
          <option value="levelOfEducation">Level of Education</option>
          <option value="language">Language</option>
          <option value="profession">Profession</option>
          <option value="averageSalesAmount">Average Sales Amount</option>
          <option value="totalNumberOfOrders">Total Number of Orders</option>
          <option value="totalSalesAmount">Total Sales Amount</option>
          <option value="company">Company</option>
          <option value="segments">Segments</option>
          <option value="id">ID</option>
        </select>
        <input
          type="text"
          placeholder={selectedField === 'all' ? "Search across all fields..." : `Search by ${selectedField}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
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
            {renderProfileField("Scope", profile.properties?.scopeEmail)}
            {renderProfileField("LastName", profile.properties?.lastName)}
            {renderProfileField("FirstName", profile.properties?.firstName)}
            {renderProfileField("SureName", profile.properties?.surename)}
            {renderProfileField("DeleteBy", profile.properties?.deleteBy)}
            <p>Number of Visits: {profile.properties?.nbOfVisits}</p>
            <p>First Visit: {profile.properties?.firstVisit ? new Date(profile.properties.firstVisit).toLocaleString() : 'N/A'}</p>
            <p>Last Visit: {profile.properties?.lastVisit ? new Date(profile.properties.lastVisit).toLocaleString() : 'N/A'}</p>
            <p>Last Updated: {profile.systemProperties?.lastUpdated ? new Date(profile.systemProperties.lastUpdated).toLocaleString() : 'N/A'}</p>
            <p>Segments: {profile.segments?.join(', ')}</p>
            {expandedProfile === profile.itemId && (
              <>
                {renderProfileField("Number of kids", profile.properties?.kids)}
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
                {renderProfileField("Satisfaction level", profile.properties?.levelOfSatisfaction)}
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
                {renderProfileField("Profile Delete By", profile.properties?.deleteBy)}
                {renderProfileField("Email Send Time", profile.properties?.sendEmailTime ? new Date(profile.properties.sendEmailTime).toLocaleString('fr-FR', { timeZone: 'UTC' }) : '')}
                {renderProfileField("Email Open Time", profile.properties?.openEmailTime ? new Date(profile.properties.openEmailTime).toLocaleString('fr-FR', { timeZone: 'UTC' }) : '')}
                {renderProfileField("Email Subject", profile.properties?.emailSubject)}
                {renderProfileField("Form Name", profile.properties?.formName)}
                {renderProfileField("Order Status", profile.properties?.orderStatus)}
                {renderProfileField("Cart Total", profile.properties?.cartTotal)}
                {renderProfileField("Form Date Submitted", profile.properties?.formDateSubmited ? new Date(profile.properties.formDateSubmited).toLocaleString() : '')}
                {renderProfileField("Average Sales Amount", profile.properties?.averageSalesAmount)}
                {renderProfileField("Total Number OfOrders", profile.properties?.totalNumberOfOrders)}
                {renderProfileField("Total Sales Amount", profile.properties?.totalSalesAmount)}
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
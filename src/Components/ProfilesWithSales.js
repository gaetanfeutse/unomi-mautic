import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../ProfilesWithSales.css'; // Assurez-vous de créer ce fichier CSS pour les styles

const ProfilesWithSales = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [sortedProfiles, setSortedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minAvgAmount, setMinAvgAmount] = useState('');
  const [maxAvgAmount, setMaxAvgAmount] = useState('');
  const [exactAvgAmount, setExactAvgAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc'); // Initial default sort order: 'desc'
  const [sortField, setSortField] = useState('lastVisit'); // Default sort field
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [profileCountMessage, setProfileCountMessage] = useState('');

  const fetchSalesEvents = useCallback(async () => {
    try {
      const salesResponse = await fetch('https://cdp.qilinsa.com:9443/cxs/events/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('karaf:karaf')
        },
        body: JSON.stringify({
          sortby: 'timeStamp:desc',
          offset: 0,
          limit: 1000,
          condition: {
            type: 'eventPropertyCondition',
            parameterValues: {
              propertyName: 'eventType',
              comparisonOperator: 'equals',
              propertyValue: 'sale'
            }
          }
        })
      });

      const salesData = await salesResponse.json();
      const salesEvents = salesData.list || [];

      if (salesEvents.length === 0) {
        setError('No sales events found.');
        setProfiles([]);
        setFilteredProfiles([]);
        setProfileCountMessage(''); // Clear message if no sales events
        return;
      }

      const profileIds = [...new Set(salesEvents.map(event => event.profileId))];
      if (profileIds.length === 0) {
        setError('No profile IDs found from sales events.');
        setProfiles([]);
        setFilteredProfiles([]);
        setProfileCountMessage(''); // Clear message if no profile IDs
        return;
      }

      // Retrieve profiles from Unomi
      await fetchProfiles(profileIds, salesEvents);
    } catch (error) {
      setError('Error fetching sales events: ' + error.message);
      setProfiles([]);
      setFilteredProfiles([]);
      setSortedProfiles([]);
      setProfileCountMessage(''); // Clear message on error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfiles = async (profileIds, salesEvents) => {
  
    try {
      const validProfiles = [];

      for (const id of profileIds) {
        try {
          const profileResponse = await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + btoa('karaf:karaf')
            }
          });

          if (profileResponse.ok) {
            const profile = await profileResponse.json();
            
            const profileSalesEvents = salesEvents.filter(event => event.profileId === id);
            
            const totalSalesAmount = profileSalesEvents.reduce((total, event) => {
              const orderTotalStr = event.properties?.orderTotal;
              
              if (orderTotalStr) {
                const cleanedOrderTotal = orderTotalStr.replace(/,/g, '');
                const orderTotal = parseFloat(cleanedOrderTotal) || 0;
                return total + orderTotal;
              } else {
                return total;
              }
            }, 0);

            const totalNumberOfOrders = profileSalesEvents.length;
            const averageSalesAmount = totalNumberOfOrders > 0 ? (totalSalesAmount / totalNumberOfOrders) : 0;

            validProfiles.push({
              ...profile,
              totalSalesAmount,
              totalNumberOfOrders,
              averageSalesAmount
            });
          }
        } catch (profileError) {
          console.error(`Error fetching profile ${id}: ${profileError.message}`);
        }
      }

      // Trier les profils par lastVisit du plus récent au plus ancien par défaut
      const sortedProfiles = validProfiles.sort((a, b) => {
        const dateA = new Date(a.properties?.lastVisit || 0);
        const dateB = new Date(b.properties?.lastVisit || 0);
        return dateB - dateA;
      });

      setProfiles(sortedProfiles);
      setFilteredProfiles(sortedProfiles); // Initialize filteredProfiles
      setSortedProfiles(sortedProfiles); // Initialize sortedProfiles
      setProfileCountMessage(sortedProfiles.length > 0 ? `Found ${sortedProfiles.length} profiles.` : 'No profiles found.');
    } catch (error) {
      setError('Error processing profiles: ' + error.message);
      setProfiles([]);
      setFilteredProfiles([]);
      setSortedProfiles([]);
      setProfileCountMessage(''); // Clear message on error
    }
  };

  const updateProfileProperties = async (totalSalesAmount, averageSalesAmount, totalNumberOfOrders, sessionId) => {
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
                    "totalSalesAmount": totalSalesAmount,
                    "averageSalesAmount": averageSalesAmount,
                    "totalNumberOfOrders": totalNumberOfOrders
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

const fetchOldestSessionId = async (profileId) => {
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
          console.warn(`Aucune session trouvée pour le profil ${profileId}`);
          return null;
      }
      
      // Trie les sessions par date et récupère l'ID de la session la plus ancienne
      const sortedSessions = data.list.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
      const oldestSessionId = sortedSessions[0].itemId;
      console.log(`ID de la session la plus ancienne pour le profil ${profileId}: ${oldestSessionId}`);
      
      return oldestSessionId;
  } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID de la session la plus ancienne :', error);
      return null;
  }
};


const handleProfileUpdate = useCallback(async () => {
  if (sortedProfiles.length > 0) {
    for (const profile of sortedProfiles) {
      const sessionId = await fetchOldestSessionId(profile.itemId);  // Utilisation ici
      console.log(`Profile ID: ${profile.itemId}, Session ID: ${sessionId}`);
      updateProfileProperties(profile.totalSalesAmount, profile.averageSalesAmount, profile.totalNumberOfOrders, sessionId);
    }
  }
}, [sortedProfiles]);

  
  const formatCurrency = (amount) => {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleFilter = () => {
    const min = parseFloat(minAvgAmount.replace(/,/g, '')) || 0;
    const max = parseFloat(maxAvgAmount.replace(/,/g, '')) || Infinity;
    const exact = parseFloat(exactAvgAmount.replace(/,/g, ''));

    const filtered = profiles.filter(profile => {
        const lastVisitDate = new Date(profile.properties?.lastVisit);
        const isWithinDateRange = (!startDate || lastVisitDate >= new Date(startDate)) &&
                                  (!endDate || lastVisitDate <= new Date(endDate));
                         

        const isWithinAmountRange = exactAvgAmount 
            ? profile.averageSalesAmount.toFixed(2) === exact.toFixed(2)
            : profile.averageSalesAmount >= min && profile.averageSalesAmount <= max;

        return isWithinDateRange && isWithinAmountRange;
    });

    setFilteredProfiles(filtered);
    setCurrentPage(1); // Reset to first page on filter
    setProfileCountMessage(filtered.length > 0 ? `Found ${filtered.length} profiles.` : 'No profiles found.');
};

  const handleClearFilter = () => {
    setMinAvgAmount('');
    setMaxAvgAmount('');
    setExactAvgAmount('');
    setStartDate('');
    setEndDate('');
    setFilteredProfiles(profiles);
    setCurrentPage(1); // Reset to first page
};

  const handleSort = useCallback(() => {
    const sortedList = [...(filteredProfiles.length ? filteredProfiles : profiles)].sort((a, b) => {
      if (sortField === 'averageSalesAmount') {
        return sortOrder === 'asc'
          ? a.averageSalesAmount - b.averageSalesAmount
          : b.averageSalesAmount - a.averageSalesAmount;
      } else if (sortField === 'lastVisit') {
        const dateA = new Date(a.properties?.lastVisit || 0);
        const dateB = new Date(b.properties?.lastVisit || 0);
        return sortOrder === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }
      return 0;
    });
    setSortedProfiles(sortedList);
  }, [filteredProfiles, profiles, sortOrder, sortField]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchSalesEvents();
  }, [fetchSalesEvents]); 

  useEffect(() => {
    if (sortedProfiles.length > 0) {
      handleProfileUpdate();
    }
  }, [sortedProfiles, handleProfileUpdate]);

  useEffect(() => {
    handleSort();
    setProfileCountMessage(filteredProfiles.length > 0 ? `Found ${filteredProfiles.length} profiles.` : 'No profiles found.');
  }, [sortOrder, sortField, handleSort, filteredProfiles.length]); // Ajout de sortField et handleSort dans les dépendances

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = sortedProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const totalPages = Math.ceil(sortedProfiles.length / profilesPerPage);
  //const numberOfFilteredProfiles = filteredProfiles.length;

  return (
    <div className="profiles-with-sales">
      <h2 className="title">Profiles with Sales Events</h2>
      <div className="filters">
        <label className="filter-label">
          Min Average Sales Amount:
          <input 
            type="number" 
            className="filter-input" 
            value={minAvgAmount} 
            onChange={(e) => setMinAvgAmount(e.target.value)} 
            placeholder="Enter min amount"
            disabled={exactAvgAmount} // Désactiver si exactAvgAmount est utilisé
          />
        </label>
        <label className="filter-label">
          Max Average Sales Amount:
          <input 
            type="number" 
            className="filter-input" 
            value={maxAvgAmount} 
            onChange={(e) => setMaxAvgAmount(e.target.value)} 
            placeholder="Enter max amount"
            disabled={exactAvgAmount} // Désactiver si exactAvgAmount est utilisé
          />
        </label>
        <label className="filter-label">
          Exact Average Sales Amount:
          <input 
            type="number" 
            className="filter-input" 
            value={exactAvgAmount} 
            onChange={(e) => setExactAvgAmount(e.target.value)} 
            placeholder="Enter exact amount"
            disabled={minAvgAmount || maxAvgAmount} // Désactiver si min ou max est utilisé
          />
        </label>
        <label className="filter-label">
        Start Date:
        <input 
            type="date" 
            className="filter-input" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
        />
    </label>
    <label className="filter-label">
        End Date:
        <input 
            type="date" 
            className="filter-input" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
        />
    </label>
        <button className="filter-button" onClick={handleFilter}>Filter</button>
        <button className="filter-button" onClick={handleClearFilter}>Clear Filters</button>
      </div>
      <div className="sorting">
        <label className="sort-label">
          Sort by:
          <select className="sort-select" onChange={(e) => setSortField(e.target.value)} value={sortField}>
            <option value="lastVisit">Last Visit</option>
            <option value="averageSalesAmount">Average Sales Amount</option>
          </select>
        </label>
        <label className="sort-label">
          Order:
          <select className="sort-select" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>
      
      {profileCountMessage && (
        <div className={`count-message ${profileCountMessage.includes('Found') ? 'success' : 'error'}`}>
          {profileCountMessage}
        </div>
      )}

      <table className="profiles-table">
        <thead>
          <tr>
            <th>Profile ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Sales Amount</th>
            <th>Total Number of Orders</th>
            <th>Average Sales Amount</th>
            <th>Last Visit</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentProfiles.map(profile => (
            <tr key={profile.profileId}>
              <td>{profile.itemId}</td>
              <td>{profile.properties?.firstName || 'N/A'} {profile.properties?.lastName || 'N/A'}</td>
              <td>{profile.properties?.email || 'N/A'}</td>
              <td>{formatCurrency(profile.totalSalesAmount)}</td>
              <td>{profile.totalNumberOfOrders}</td>
              <td>{profile.averageSalesAmount.toFixed(2)}</td>
              <td>{formatDate(profile.properties?.lastVisit)}</td>
              <td><Link to={`/profile/${profile.itemId}`}>
                  <button>View Detail</button>
                </Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button 
          key={i} 
          className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`} 
          onClick={() => handlePageChange(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
    </div>
  );
};

export default ProfilesWithSales;

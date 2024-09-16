import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../SegmentDetail.css';

function SegmentDetail() {
  const { segmentId } = useParams();
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10;
  const [totalProfiles, setTotalProfiles] = useState(0);

  const fetchProfiles = useCallback(async () => {
    try {
      const response = await fetch('https://cdp.qilinsa.com:9443/cxs/profiles/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Basic ' + btoa('karaf:karaf')
        },
        body: JSON.stringify({
          offset: (currentPage - 1) * profilesPerPage,
          limit: profilesPerPage,
          condition: {
            type: 'profilePropertyCondition',
            parameterValues: {
              propertyName: 'segments',
              comparisonOperator: 'equals',
              propertyValue: segmentId
            }
          }
        })
      });
      const data = await response.json();
      setProfiles(data.list || []);
      setTotalProfiles(data.totalSize || 0);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }, [segmentId, currentPage, profilesPerPage]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalProfiles / profilesPerPage);
  const pageNumbers = [];
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

  return (
    <div className="segment-detail">
      <h2>Profiles in Segment: {segmentId}</h2>
      {profiles.length > 0 ? (
        <table className="profile-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Number of Visits</th>
              <th>Page View Count</th>
              <th>First Visit</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <tr key={profile.itemId}>
                <td>{profile.itemId || 'N/A'}</td>
                <td>{`${profile.properties.firstName || 'N/A'} ${profile.properties.lastName || 'N/A'}`}</td>
                <td>{profile.properties.email || 'N/A'}</td>
                <td>{profile.properties.nbOfVisits || 'N/A'}</td>
                <td>{profile.properties.pageViewCount || 'N/A'}</td>
                <td>{profile.properties.firstVisit || 'N/A'}</td>
                <td>{profile.properties.lastVisit || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-profiles">No profiles found in this segment.</p>
      )}
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
    </div>
  );
}

export default SegmentDetail;

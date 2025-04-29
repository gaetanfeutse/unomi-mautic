import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import '../SegmentList.css';

Modal.setAppElement('#root'); // Set the app element for accessibility

function SegmentList() {
  const [segments, setSegments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const segmentsPerPage = 10;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState(null);

  // Fetch segments when the component mounts
  useEffect(() => {
    fetchSegments();
  }, []);

  // Function to fetch segments from the Unomi instance with pagination to ensure all segments are retrieved
  const fetchSegments = async () => {
    try {
      // Initialize empty array to hold all segments
      let allSegments = [];
      let offset = 0;
      const limit = 100; // Larger page size to reduce number of requests
      let hasMore = true;
      
      // Keep fetching until we have all segments
      while (hasMore) {
        // Use pagination parameters to fetch segments in batches
        const response = await fetch(`https://cdp.qilinsa.com:9443/cxs/segments?offset=${offset}&limit=${limit}&sort=name`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add fetched segments to our collection
        allSegments = [...allSegments, ...data];
        
        // If we got fewer segments than the limit, we've reached the end
        if (data.length < limit) {
          hasMore = false;
        } else {
          // Otherwise, increase offset for the next batch
          offset += limit;
        }
      }
      
      console.log(`Retrieved ${allSegments.length} total segments from Unomi`);
      setSegments(allSegments);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  // Handle changes in the search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle pagination page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Delete a segment by its ID
  const deleteSegment = async (segmentId) => {
    try {
      await fetch(`https://cdp.qilinsa.com:9443/cxs/segments/${segmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('karaf:karaf')
        }
      });
      setSegments(segments.filter(segment => segment.id !== segmentId));
      closeModal(); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting segment:', error);
    }
  };

  // Filter segments based on search term
  const filteredSegments = segments.filter(segment => {
    const name = segment.name || '';
    const description = segment.description || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastSegment = currentPage * segmentsPerPage;
  const indexOfFirstSegment = indexOfLastSegment - segmentsPerPage;
  const currentSegments = filteredSegments.slice(indexOfFirstSegment, indexOfLastSegment);
  const totalPages = Math.ceil(filteredSegments.length / segmentsPerPage);
  const pageNumbers = [];

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

  // Modal functions
  const openModal = (segment) => {
    setSegmentToDelete(segment);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSegmentToDelete(null);
    setModalIsOpen(false);
  };

  return (
    <div className="segment-list">
      <h2>Segment List</h2>
      <input
        type="text"
        placeholder="Search segments..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {currentSegments.map(segment => (
          <li key={segment.id || Math.random()} className="segment-item">
            <h3>{segment.name || 'Unnamed Segment'}</h3>
            <p>ID: {segment.id || 'N/A'}</p>
            <p>Description: {segment.description || 'No description available'}</p>
            <p>Scope: {segment.scope || 'N/A'}</p>
            <p>Enabled: {segment.enabled !== undefined ? (segment.enabled ? 'Yes' : 'No') : 'N/A'}</p>
            <div className="button-group">
              <Link to={`/segment/${segment.id}`}>
                <button className="view-details">View Details</button>
              </Link>
              <button className="delete" onClick={() => openModal(segment)}>Delete</button>
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
        <p>Are you sure you want to delete this segment?</p>
        <button onClick={() => deleteSegment(segmentToDelete?.id)}>Yes</button>
        <button onClick={closeModal}>No</button>
      </Modal>
    </div>
  );
}

export default SegmentList;

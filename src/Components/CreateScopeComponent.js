import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CreateScopeComponent.css';

Modal.setAppElement('#root'); // Ajustez cela selon l'ID de l'élément principal de votre application

const CreateScopeComponent = () => {
  const [scopeData, setScopeData] = useState({
    itemId: '',
    itemType: 'scope'
  });
  const [scopes, setScopes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scopeToDelete, setScopeToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const scopesPerPage = 10;

  useEffect(() => {
    fetchScopes();
  }, []);

  const fetchScopes = async () => {
    setIsLoading(true);
    try {
      const url = 'https://cdp.qilinsa.com:9443/cxs/scopes';
      const response = await fetch(url, {
        headers: {
          Authorization: 'Basic ' + btoa('karaf:karaf')
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch scopes');
      }
      const data = await response.json();
      setScopes(data);
    } catch (error) {
      console.error('Error fetching scopes:', error);
      setErrorMessage('Failed to fetch scopes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScopeData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = 'https://cdp.qilinsa.com:9443/cxs/scopes';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('karaf:karaf')
      },
      body: JSON.stringify(scopeData)
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to create scope');
      }
      setSuccessMessage('Scope created successfully!');
      setScopeData({ itemId: '', itemType: 'scope' }); // Reset form data
      
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Délai d'une seconde avant l'actualisation de la page

    } catch (error) {
      console.error('Error creating scope:', error);
      setErrorMessage('Failed to create scope');
    }
  };

  const handleOpenModal = (scopeId) => {
    setScopeToDelete(scopeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setScopeToDelete(null);
  };

  const handleDeleteScope = async () => {
    const scopeId = scopeToDelete;
    if (!scopeId) return;

    const url = `https://cdp.qilinsa.com:9443/cxs/scopes/${scopeId}`;
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Basic ' + btoa('karaf:karaf')
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to delete scope ${scopeId}`);
      }
      setSuccessMessage(`Scope ${scopeId} deleted successfully!`);

      setTimeout(() => {
        window.location.reload();
      }, 1000); // Délai d'une seconde avant l'actualisation de la page

    } catch (error) {
      console.error(`Error deleting scope ${scopeId}:`, error);
      setErrorMessage(`Failed to delete scope ${scopeId}`);
    } finally {
      handleCloseModal();
    }
  };

  const filteredScopes = scopes.filter(scope =>
    scope.itemId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastScope = currentPage * scopesPerPage;
  const indexOfFirstScope = indexOfLastScope - scopesPerPage;
  const currentScopes = filteredScopes.slice(indexOfFirstScope, indexOfLastScope);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredScopes.length / scopesPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className='create-scope'>
        <h2>Create New Scope</h2>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
            <div className='create-scope-input'>
            <label>
            Scope ID:
            <input type="text" name="itemId" value={scopeData.itemId} onChange={handleChange} required />
            </label>
            </div>
            <br />
            <button type="submit">Create Scope</button>
        </form>
      </div>
      <br/><br/>
      <div className='scope-list'>
        <h2>Existing Scopes</h2>
        <input
          type="text"
          placeholder="Search by Scope ID"
          value={searchTerm}
          onChange={handleSearchChange}
          className='search-bar'
        />
        {isLoading ? (
            <p>Loading scopes...</p>
        ) : (
            <ul>
            {currentScopes.map(scope => (
                <li key={scope.itemId} className='rule-item'>
                <p>ID: {scope.itemId}</p> 
                <button onClick={() => handleOpenModal(scope.itemId)}>Delete</button>
                </li>
            ))}
            </ul>
        )}
      </div>
      
      <div className='pagination'>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: Math.ceil(filteredScopes.length / scopesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredScopes.length / scopesPerPage)}>
          Next
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Confirm Delete"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete scope with ID '{scopeToDelete}'?</p>
        <button onClick={handleDeleteScope}>Yes</button>
        <button onClick={handleCloseModal}>No</button>
      </Modal>
    </div>
  );
};

export default CreateScopeComponent;

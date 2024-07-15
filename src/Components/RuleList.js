import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../RuleList.css';

Modal.setAppElement('#root'); // Set the app element for accessibility

function RuleList() {
  const [rules, setRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rulesPerPage = 10;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('https://cdp.qilinsa.com:9443/cxs/rules', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('karaf:karaf')
        }
      });
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredRules = rules.filter(rule => {
    return (
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastRule = currentPage * rulesPerPage;
  const indexOfFirstRule = indexOfLastRule - rulesPerPage;
  const currentRules = filteredRules.slice(indexOfFirstRule, indexOfLastRule);
  const totalPages = Math.ceil(filteredRules.length / rulesPerPage);
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

  const openModal = (rule) => {
    setRuleToDelete(rule);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setRuleToDelete(null);
    setModalIsOpen(false);
  };

  const confirmDeleteRule = async () => {
    try {
      if (ruleToDelete) {
        await fetch(`https://cdp.qilinsa.com:9443/cxs/rules/${ruleToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          }
        });
        setRules(rules.filter(rule => rule.id !== ruleToDelete.id));
        closeModal();
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  return (
    <div className="rule-list">
      <h2>Rules List test</h2>
      <input
        type="text"
        placeholder="Search rules..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {currentRules.map(rule => (
          <li key={rule.id} className="rule-item">
            <h3>{rule.name}</h3>
            <p>ID: {rule.id}</p>
            <p>Scope: {rule.scope}</p>
            <p>Description: {rule.description}</p>
            <button onClick={() => openModal(rule)}>Delete</button>
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
        <p>Are you sure you want to delete this rule?</p>
        <button onClick={confirmDeleteRule}>Yes</button>
        <button onClick={closeModal}>No</button>
      </Modal>
    </div>
  );
}

export default RuleList;

import React, { useState, useEffect } from 'react';
import '../CreateSegment.css';

const CreateSegment = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState([
    { propertyName: '', propertyValue: '', comparisonOperator: 'equals' }
  ]);
  const [booleanOperator, setBooleanOperator] = useState('and');
  const [scopes, setScopes] = useState([]);
  const [selectedScope, setSelectedScope] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const commonPropertyNames = [
    { value: 'nbOfVisits', label: 'Number of visits' },
    { value: 'lastVisit', label: 'Last visit date' },
    { value: 'customerType', label: 'Customer type' },
    { value: 'email', label: 'Email address' },
    { value: 'age', label: 'Age' },
    { value: 'pageViewCount', label: 'Page view count' },
    { value: 'firstName', label: 'First name' },
    { value: 'lastName', label: 'Last name' },
    { value: 'profileId', label: 'Profile ID' },
    { value: 'leadAssignedTo', label: 'Lead assigned to' },
    { value: 'previousVisit', label: 'Previous visit date' },
    { value: 'scope', label: 'Scope' },
    { value: 'isAnonymousProfile', label: 'Anonymous profile' },
    { value: 'duration', label: 'Duration' },
    { value: 'nbOfOrders', label: 'Number of orders' },
    { value: 'gender', label: 'Gender' },
    { value: 'firstVisit', label: 'First Visit' },
    // Add more commonly used property names as needed
  ];

  useEffect(() => {
    const fetchScopes = async () => {
      try {
        const response = await fetch('https://cdp.qilinsa.com:9443/cxs/scopes', {
          headers: {
            'Authorization': 'Basic ' + btoa('karaf:karaf'),
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched scopes:', data);
        setScopes(data);
      } catch (error) {
        console.error('Error fetching scopes:', error);
        setError('Error fetching scopes');
      }
    };

    fetchScopes();
  }, []);

  const handleAddCondition = () => {
    setConditions([...conditions, { propertyName: '', propertyValue: '', comparisonOperator: 'equals' }]);
  };

  const handleRemoveCondition = (index) => {
    if (index === 0) return; // Prevent removing the first condition
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = conditions.map((condition, i) => 
      i === index ? { ...condition, [field]: value } : condition
    );
    setConditions(newConditions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const segmentData = {
      metadata: {
        id: name.toLowerCase().replace(/ /g, '-'),
        name,
        description,
        scope: selectedScope,
      },
      condition: {
        type: conditions.length > 1 ? 'booleanCondition' : 'profilePropertyCondition',
        parameterValues: conditions.length > 1 ? {
          operator: booleanOperator,
          subConditions: conditions.map((condition) => ({
            type: 'profilePropertyCondition',
            parameterValues: {
              propertyName: condition.propertyName,
              comparisonOperator: condition.comparisonOperator,
              propertyValue: condition.propertyValue,
              propertyValueInteger: isNaN(condition.propertyValue) ? undefined : parseInt(condition.propertyValue),
              propertyValueDateExpr: condition.propertyValue.includes('now') ? condition.propertyValue : undefined
            },
          })),
        } : {
          propertyName: conditions[0].propertyName,
          comparisonOperator: conditions[0].comparisonOperator,
          propertyValue: conditions[0].propertyValue,
          propertyValueInteger: isNaN(conditions[0].propertyValue) ? undefined : parseInt(conditions[0].propertyValue),
          propertyValueDateExpr: conditions[0].propertyValue.includes('now') ? conditions[0].propertyValue : undefined
        }
      }
    };

    try {
      const response = await fetch('https://cdp.qilinsa.com:9443/cxs/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('karaf:karaf'),
        },
        body: JSON.stringify(segmentData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
      }

      const responseData = await response.text();
      const data = responseData ? JSON.parse(responseData) : {};
      console.log('Segment created successfully:', data);
      setSuccess('Segment created successfully!');
      setError(null);
      setName('');
      setDescription('');
      setConditions([{ propertyName: '', propertyValue: '', comparisonOperator: 'equals' }]);
      setSelectedScope('');
    } catch (error) {
      console.error('Error creating segment:', error);
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div className="create-segment">
      <h2>Create Segment</h2>
      <form onSubmit={handleSubmit}>
        <div className="create-segment-input">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="create-segment-input">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="create-segment-input">
          <label>Scope:</label>
          <select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            required
          >
            <option value="" disabled>Select a scope</option>
            {scopes.map((scope) => {
              if (scope.metadata) {
                return (
                  <option key={scope.metadata.id} value={scope.metadata.id}>
                    {scope.metadata.name}
                  </option>
                );
              }
              return null;
            })}
          </select>
        </div>
        {conditions.length > 1 && (
          <div className="create-segment-input">
            <label>Boolean Operator:</label>
            <select
              value={booleanOperator}
              onChange={(e) => setBooleanOperator(e.target.value)}
              required
            >
              <option value="and">AND</option>
              <option value="or">OR</option>
            </select>
          </div>
        )}
        {conditions.map((condition, index) => (
          <div className="condition-group" key={index}>
            <h4>Condition {index + 1}</h4>
            <div className="create-segment-input">
              <label>Property Name:</label>
              <select
                value={condition.propertyName}
                onChange={(e) => handleConditionChange(index, 'propertyName', e.target.value)}
                required
              >
                <option value="" disabled>Select a property</option>
                {commonPropertyNames.map((property) => (
                  <option key={property.value} value={property.value}>
                    {property.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-segment-input">
              <label>Comparison Operator:</label>
              <select
                value={condition.comparisonOperator}
                onChange={(e) => handleConditionChange(index, 'comparisonOperator', e.target.value)}
                required
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="startsWith">Starts With</option>
                <option value="endsWith">Ends With</option>
                <option value="greaterThan">Greater Than</option>
                <option value="lessThan">Less Than</option>
                <option value="exists">Exists</option>
              </select>
            </div>
            <div className="create-segment-input">
              <label>Property Value:</label>
              <input
                type="text"
                value={condition.propertyValue}
                onChange={(e) => handleConditionChange(index, 'propertyValue', e.target.value)}
                required={condition.comparisonOperator !== 'exists'}
              />
            </div>
            {index !== 0 && (
              <button type="button" onClick={() => handleRemoveCondition(index)}>
                Remove Condition
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddCondition}>
          Add Condition
        </button>
        <button type="submit">Create Segment</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default CreateSegment;

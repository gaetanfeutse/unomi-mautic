import React, { useState } from 'react';
import '../CreateSegment.css';

function CreateSegment() {
  const [segmentName, setSegmentName] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState([
    {
      type: 'profilePropertyCondition',
      parameterValues: {
        propertyName: '',
        comparisonOperator: '',
        propertyValue: ''
      }
    }
  ]);

  const handleSegmentNameChange = (e) => setSegmentName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleConditionChange = (index, field, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].parameterValues[field] = value;
    setConditions(updatedConditions);
  };

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      {
        type: 'profilePropertyCondition',
        parameterValues: {
          propertyName: '',
          comparisonOperator: '',
          propertyValue: ''
        }
      }
    ]);
  };

  const handleRemoveCondition = (index) => {
    const updatedConditions = conditions.filter((_, idx) => idx !== index);
    setConditions(updatedConditions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const segmentData = {
      name: segmentName,
      description: description,
      condition: {
        type: 'booleanCondition',
        parameterValues: {
          operator: 'or',
          subConditions: conditions
        }
      }
    };
    console.log('Segment Data:', segmentData);
    // Perform the API call to submit the segmentData
  };

  return (
    <div className="create-segment">
      <h2>Create Segment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Segment Name:</label>
          <input type="text" id="name" name="name" value={segmentName} onChange={handleSegmentNameChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={description} onChange={handleDescriptionChange} required></textarea>
        </div>
        <div>
          <h3>Conditions</h3>
          {conditions.map((condition, index) => (
            <div key={index} className="condition-group">
              <h4>Condition {index + 1}</h4>
              <div>
                <label htmlFor={`propertyName-${index}`}>Property Name:</label>
                <input
                  type="text"
                  id={`propertyName-${index}`}
                  name="propertyName"
                  value={condition.parameterValues.propertyName}
                  onChange={(e) => handleConditionChange(index, 'propertyName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor={`comparisonOperator-${index}`}>Comparison Operator:</label>
                <select
                  id={`comparisonOperator-${index}`}
                  name="comparisonOperator"
                  value={condition.parameterValues.comparisonOperator}
                  onChange={(e) => handleConditionChange(index, 'comparisonOperator', e.target.value)}
                  required
                >
                  <option value="">Select an operator</option>
                  <option value="exists">Exists</option>
                  <option value="greaterThan">Greater Than</option>
                  <option value="lessThan">Less Than</option>
                  <option value="equals">Equals</option>
                  {/* Add more operators as needed */}
                </select>
              </div>
              <div>
                <label htmlFor={`propertyValue-${index}`}>Property Value:</label>
                <input
                  type="text"
                  id={`propertyValue-${index}`}
                  name="propertyValue"
                  value={condition.parameterValues.propertyValue}
                  onChange={(e) => handleConditionChange(index, 'propertyValue', e.target.value)}
                  required
                />
              </div>
              <button type="button" onClick={() => handleRemoveCondition(index)}>Remove Condition</button>
            </div>
          ))}
          <button type="button" onClick={handleAddCondition}>Add Condition</button>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateSegment;

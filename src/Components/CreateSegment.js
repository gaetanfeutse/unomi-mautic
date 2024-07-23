import React, { useState, useEffect } from 'react';
import '../CreateSegment.css'; // Assurez-vous d'avoir un fichier CSS pour le styling

function SegmentCreator() {
  const initialSegmentState = {
    metadata: {
      id: '',
      name: '',
      scope: '',
      description: '',
      readOnly: false,
    },
    condition: {
      type: 'booleanCondition',
      parameterValues: {
        operator: 'and',
        subConditions: [],
      },
    },
  };

  const initialConditionState = {
    type: 'profilePropertyCondition',
    parameterValues: {
      propertyName: '',
      comparisonOperator: '',
      propertyValue: '',
      propertyValueInteger: '',
      propertyValueDateExpr: '',
    },
  };

  const [segment, setSegment] = useState(initialSegmentState);
  const [condition, setCondition] = useState(initialConditionState);
  const [message, setMessage] = useState(null);
  const [scopes, setScopes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://cdp.qilinsa.com:9443/cxs/scopes', {
      headers: {
        Authorization: 'Basic ' + btoa('karaf:karaf'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Full response data:', data);
        const scopes = data.scopes || data; // Trying both options to find scopes
        console.log('Scopes fetched:', scopes);
        setScopes(scopes);
      })
      .catch((error) => {
        console.error('Error fetching scopes:', error);
        setMessage('Failed to fetch scopes. Please check console for details.');
      });
  }, []);

  const handleChangeSegment = (e) => {
    const { name, value, type, checked } = e.target;
    setSegment((prevSegment) => ({
      ...prevSegment,
      metadata: {
        ...prevSegment.metadata,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleChangeCondition = (e) => {
    const { name, value } = e.target;
    setCondition((prevCondition) => ({
      ...prevCondition,
      parameterValues: {
        ...prevCondition.parameterValues,
        [name]: name === 'propertyValueInteger' ? (value === '' ? '' : parseInt(value, 10)) : value,
      },
    }));
  };

  const handleAddCondition = () => {
    // Validation des champs requis
    if (!condition.parameterValues.propertyName || !condition.parameterValues.comparisonOperator) {
      setMessage('Please fill in Property Name and Comparison Operator.');
      return;
    }

    // Création d'une copie de la condition
    const newCondition = { ...condition };

    // Suppression des champs vides ou non applicables
    if (newCondition.parameterValues.comparisonOperator === 'exists' || newCondition.parameterValues.comparisonOperator === 'notExists') {
      delete newCondition.parameterValues.propertyValue;
      delete newCondition.parameterValues.propertyValueInteger;
      delete newCondition.parameterValues.propertyValueDateExpr;
    } else {
      if (!newCondition.parameterValues.propertyValue) {
        delete newCondition.parameterValues.propertyValue;
      }
      if (newCondition.parameterValues.propertyValueInteger === '') {
        delete newCondition.parameterValues.propertyValueInteger;
      }
      if (!newCondition.parameterValues.propertyValueDateExpr) {
        delete newCondition.parameterValues.propertyValueDateExpr;
      }
    }

    // Ajout de la condition valide à la liste des sous-conditions
    setSegment((prevSegment) => ({
      ...prevSegment,
      condition: {
        ...prevSegment.condition,
        parameterValues: {
          ...prevSegment.condition.parameterValues,
          subConditions: [...prevSegment.condition.parameterValues.subConditions, newCondition],
        },
      },
    }));

    // Réinitialisation de l'état de la condition
    setCondition(initialConditionState);
    setMessage(null);
  };

  const handleRemoveCondition = (index) => {
    setSegment((prevSegment) => {
      const newSubConditions = prevSegment.condition.parameterValues.subConditions.filter((_, i) => i !== index);
      return {
        ...prevSegment,
        condition: {
          ...prevSegment.condition,
          parameterValues: {
            ...prevSegment.condition.parameterValues,
            subConditions: newSubConditions,
          },
        },
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!segment.metadata.id || !segment.metadata.name || !segment.metadata.scope) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const newCondition = { ...condition };
    if (newCondition.parameterValues.comparisonOperator === 'exists' || newCondition.parameterValues.comparisonOperator === 'notExists') {
      delete newCondition.parameterValues.propertyValue;
      delete newCondition.parameterValues.propertyValueInteger;
      delete newCondition.parameterValues.propertyValueDateExpr;
    } else {
      if (!newCondition.parameterValues.propertyValue) {
        delete newCondition.parameterValues.propertyValue;
      }
      if (newCondition.parameterValues.propertyValueInteger === '') {
        delete newCondition.parameterValues.propertyValueInteger;
      }
      if (!newCondition.parameterValues.propertyValueDateExpr) {
        delete newCondition.parameterValues.propertyValueDateExpr;
      }
    }

    const subConditions = [
      ...segment.condition.parameterValues.subConditions,
      newCondition,
    ].filter((cond) => cond.parameterValues.propertyName && cond.parameterValues.comparisonOperator);

    const segmentData = {
      ...segment,
      condition: {
        ...segment.condition,
        parameterValues: {
          ...segment.condition.parameterValues,
          subConditions,
        },
      },
    };

    setMessage(null);

    fetch('https://cdp.qilinsa.com:9443/cxs/segments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('karaf:karaf'),
      },
      body: JSON.stringify(segmentData),
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return {};
        }
      })
      .then((data) => {
        if (Object.keys(data).length === 0) {
          console.log('Segment created successfully (empty response).');
        } else {
          console.log('Segment created:', data);
        }
        setMessage('Segment created successfully!');
        setSegment(initialSegmentState);
        setCondition(initialConditionState);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error:', error);
        setMessage('Failed to create segment. Please check console for details.');
      });
  };

  return (
    <div className="segment-creator">
      <h1>Create Segment</h1>
      <form onSubmit={handleSubmit}>
        <h2>Segment Metadata</h2>
        <div className="form-group">
          <label htmlFor="id">ID *</label>
          <input type="text" id="id" name="id" placeholder="ID" value={segment.metadata.id} onChange={handleChangeSegment} required />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input type="text" id="name" name="name" placeholder="Name" value={segment.metadata.name} onChange={handleChangeSegment} required />
        </div>
        <div className="form-group">
          <label htmlFor="scope">Scope</label>
          <select id="scope" name="scope" value={segment.metadata.scope} onChange={handleChangeSegment} required>
            <option value="">Select Scope</option>
            {scopes.map((scope) => (
              <option key={scope.itemId} value={scope.itemId}>{scope.itemId}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input type="text" id="description" name="description" placeholder="Description" value={segment.metadata.description} onChange={handleChangeSegment} />
        </div>
        <div className="form-group">
          <label>
            Read Only
            <input type="checkbox" name="readOnly" checked={segment.metadata.readOnly} onChange={handleChangeSegment} />
          </label>
        </div>
        <h2>Add Condition</h2>
        <div className="form-group">
          <label htmlFor="propertyName">Property Name *</label>
          <select type="text" id="propertyName" name="propertyName" value={condition.parameterValues.propertyName} onChange={handleChangeCondition} required>
            <option value="">select Property Name</option>
            <option value="properties.firstName">First Name</option>
            <option value="properties.lastName">Last Name</option>
            <option value="properties.surename">Sure Name</option>
            <option value="properties.gender">gender</option>
            <option value="properties.birthDate">Birth Date</option>
            <option value="properties.age">Age</option>
            <option value="properties.country">Country</option>
            <option value="properties.city">City</option>
            <option value="properties.maritalStatus">Marital Status</option>
            <option value="properties.levelOfEducation">Level Of Education</option>
            <option value="properties.jobTitle">Job Title</option>
            <option value="properties.nationality">Nationality</option>
            <option value="properties.adress">Adress</option>
            <option value="properties.phoneNumber">Phone Number</option>
            <option value="properties.firstVisit">First Visit</option>
            <option value="properties.lastVisit">Last Visit</option>
            <option value="properties.nbOfvisits">Number Of Visits</option>
            <option value="properties.email">Email</option>
            <option value="properties.pageViewCount">Page View Count</option>
            <option value="properties.previousVisit">Previous Visit</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comparisonOperator">Comparison Operator *</label>
          <select id="comparisonOperator" name="comparisonOperator" value={condition.parameterValues.comparisonOperator} onChange={handleChangeCondition} required>
            <option value="">Select Operator</option>
            <option value="equals">Equals</option>
            <option value="notEquals">Not Equals</option>
            <option value="exists">Exists</option>
            <option value="notExists">Not Exists</option>
            <option value="greaterThan">Greater Than</option>
            <option value="lessThan">Less Than</option>
          </select>
        </div>
        {condition.parameterValues.comparisonOperator !== 'exists' && condition.parameterValues.comparisonOperator !== 'notExists' && (
          <>
            <div className="form-group">
              <label htmlFor="propertyValue">Property Value</label>
              <input type="text" id="propertyValue" name="propertyValue" placeholder="Property Value" value={condition.parameterValues.propertyValue || ''} onChange={handleChangeCondition} />
            </div>
            <div className="form-group">
              <label htmlFor="propertyValueInteger">Property Value Integer</label>
              <input type="number" id="propertyValueInteger" name="propertyValueInteger" placeholder="Property Value Integer" value={condition.parameterValues.propertyValueInteger || ''} onChange={handleChangeCondition} />
            </div>
            <div className="form-group">
              <label htmlFor="propertyValueDateExpr">Property Value Date Expression</label>
              <input type="text" id="propertyValueDateExpr" name="propertyValueDateExpr" placeholder="Property Value Date Expression" value={condition.parameterValues.propertyValueDateExpr || ''} onChange={handleChangeCondition} />
            </div>
          </>
        )}
        <button type="button" onClick={handleAddCondition}>Add Condition</button>
        <h2>Segment Conditions</h2>
        <ul>
          {segment.condition.parameterValues.subConditions.map((subCondition, index) => (
            <li key={index}>
              {subCondition.parameterValues.propertyName} {subCondition.parameterValues.comparisonOperator} {subCondition.parameterValues.propertyValue || subCondition.parameterValues.propertyValueInteger || subCondition.parameterValues.propertyValueDateExpr || ''}
              <button type="button" onClick={() => handleRemoveCondition(index)}>Remove</button>
            </li>
          ))}
        </ul>
        {segment.condition.parameterValues.subConditions.length > 0 && (
          <>
            <h2>Operator</h2>
            <div className="form-group">
              <select
                name="operator"
                value={segment.condition.parameterValues.operator}
                onChange={(e) =>
                  setSegment((prevSegment) => ({
                    ...prevSegment,
                    condition: {
                      ...prevSegment.condition,
                      parameterValues: {
                        ...prevSegment.condition.parameterValues,
                        operator: e.target.value,
                      },
                    },
                  }))
                }
              >
                <option value="and">AND</option>
                <option value="or">OR</option>
              </select>
            </div>
          </>
        )}
        <button type="submit" disabled={loading}>Create Segment</button>
      </form>
      {loading && <p>Loading...</p>}
      {message && <p style={{ color: message.startsWith('Failed') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}

export default SegmentCreator;

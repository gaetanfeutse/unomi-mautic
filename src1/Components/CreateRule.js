// import React, { useState } from 'react';
// import '../CreateRule.css';

// function CreateRule() {
//   const [ruleName, setRuleName] = useState('');
//   const [description, setDescription] = useState('');
//   const [conditions, setConditions] = useState([
//     {
//       type: 'formEventCondition',
//       parameterValues: {
//         formId: '',
//         pagePath: ''
//       }
//     }
//   ]);
//   const [actions, setActions] = useState([
//     {
//       type: 'setPropertyAction',
//       parameterValues: {
//         setPropertyName: '',
//         setPropertyValue: '',
//         setPropertyStrategy: 'alwaysSet'
//       }
//     }
//   ]);

//   const handleRuleNameChange = (e) => setRuleName(e.target.value);
//   const handleDescriptionChange = (e) => setDescription(e.target.value);

//   const handleConditionChange = (index, field, value) => {
//     const updatedConditions = [...conditions];
//     if (field === 'type') {
//       updatedConditions[index] = {
//         type: value,
//         parameterValues: value === 'formEventCondition' ? { formId: '', pagePath: '' } : { eventTypeId: '' }
//       };
//     } else {
//       updatedConditions[index].parameterValues[field] = value;
//     }
//     setConditions(updatedConditions);
//   };

//   const handleAddCondition = () => {
//     setConditions([
//       ...conditions,
//       {
//         type: 'formEventCondition',
//         parameterValues: {
//           formId: '',
//           pagePath: ''
//         }
//       }
//     ]);
//   };

//   const handleRemoveCondition = (index) => {
//     const updatedConditions = conditions.filter((_, idx) => idx !== index);
//     setConditions(updatedConditions);
//   };

//   const handleActionChange = (index, field, value) => {
//     const updatedActions = [...actions];
//     updatedActions[index].parameterValues[field] = value;
//     setActions(updatedActions);
//   };

//   const handleAddAction = () => {
//     setActions([
//       ...actions,
//       {
//         type: 'setPropertyAction',
//         parameterValues: {
//           setPropertyName: '',
//           setPropertyValue: '',
//           setPropertyStrategy: 'alwaysSet'
//         }
//       }
//     ]);
//   };

//   const handleRemoveAction = (index) => {
//     const updatedActions = actions.filter((_, idx) => idx !== index);
//     setActions(updatedActions);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const ruleData = {
//       itemId: `${ruleName.toLowerCase().replace(/ /g, '-')}-local`,
//       itemType: 'rule',
//       linkedItems: null,
//       raiseEventOnlyOnceForProfile: false,
//       raiseEventOnlyOnceForSession: false,
//       raiseEventOnlyOnce: false,
//       priority: -1,
//       metadata: {
//         id: ruleName.toLowerCase().replace(/ /g, '-'),
//         name: ruleName,
//         scope: 'unomi-tracker-test',
//         description: description,
//         systemTags: ['formMappingRule'],
//         enabled: true,
//         missingPlugins: false,
//         hidden: false,
//         readOnly: false
//       },
//       condition: {
//         type: 'booleanCondition',
//         parameterValues: {
//           operator: 'or',
//           subConditions: conditions
//         }
//       },
//       actions: actions
//     };
//     console.log('Rule Data:', ruleData);
//     // Perform the API call to submit the ruleData
//   };

//   return (
//     <div className="create-rule">
//       <h2>Create Rule</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Rule Name:</label>
//           <input type="text" id="name" name="name" value={ruleName} onChange={handleRuleNameChange} required />
//         </div>
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea id="description" name="description" value={description} onChange={handleDescriptionChange} required></textarea>
//         </div>
//         <div>
//           <h3>Conditions</h3>
//           {conditions.map((condition, index) => (
//             <div key={index} className="condition-group">
//               <h4>Condition {index + 1}</h4>
//               <div>
//                 <label htmlFor={`conditionType-${index}`}>Condition Type:</label>
//                 <select
//                   id={`conditionType-${index}`}
//                   name="conditionType"
//                   value={condition.type}
//                   onChange={(e) => handleConditionChange(index, 'type', e.target.value)}
//                   required
//                 >
//                   <option value="formEventCondition">Form Event Condition</option>
//                   <option value="eventTypeCondition">Event Type Condition</option>
//                 </select>
//               </div>
//               {condition.type === 'formEventCondition' && (
//                 <>
//                   <div>
//                     <label htmlFor={`formId-${index}`}>Form ID:</label>
//                     <input
//                       type="text"
//                       id={`formId-${index}`}
//                       name="formId"
//                       value={condition.parameterValues.formId}
//                       onChange={(e) => handleConditionChange(index, 'formId', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor={`pagePath-${index}`}>Page Path:</label>
//                     <input
//                       type="text"
//                       id={`pagePath-${index}`}
//                       name="pagePath"
//                       value={condition.parameterValues.pagePath}
//                       onChange={(e) => handleConditionChange(index, 'pagePath', e.target.value)}
//                       required
//                     />
//                   </div>
//                 </>
//               )}
//               {condition.type === 'eventTypeCondition' && (
//                 <div>
//                   <label htmlFor={`eventTypeId-${index}`}>Event Type ID:</label>
//                   <input
//                     type="text"
//                     id={`eventTypeId-${index}`}
//                     name="eventTypeId"
//                     value={condition.parameterValues.eventTypeId}
//                     onChange={(e) => handleConditionChange(index, 'eventTypeId', e.target.value)}
//                     required
//                   />
//                 </div>
//               )}
//               <button type="button" onClick={() => handleRemoveCondition(index)}>Remove Condition</button>
//             </div>
//           ))}
//           <button type="button" onClick={handleAddCondition}>Add Condition</button>
//         </div>
//         <div>
//           <h3>Actions</h3>
//           {actions.map((action, index) => (
//             <div key={index} className="action-group">
//               <h4>Action {index + 1}</h4>
//               <div>
//                 <label htmlFor={`setPropertyName-${index}`}>Set Property Name:</label>
//                 <input
//                   type="text"
//                   id={`setPropertyName-${index}`}
//                   name="setPropertyName"
//                   value={action.parameterValues.setPropertyName}
//                   onChange={(e) => handleActionChange(index, 'setPropertyName', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor={`setPropertyValue-${index}`}>Set Property Value:</label>
//                 <input
//                   type="text"
//                   id={`setPropertyValue-${index}`}
//                   name="setPropertyValue"
//                   value={action.parameterValues.setPropertyValue}
//                   onChange={(e) => handleActionChange(index, 'setPropertyValue', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor={`setPropertyStrategy-${index}`}>Set Property Strategy:</label>
//                 <select
//                   id={`setPropertyStrategy-${index}`}
//                   name="setPropertyStrategy"
//                   value={action.parameterValues.setPropertyStrategy}
//                   onChange={(e) => handleActionChange(index, 'setPropertyStrategy', e.target.value)}
//                   required
//                 >
//                   <option value="alwaysSet">Always Set</option>
//                   <option value="onlyIfNotSet">Only If Not Set</option>
//                 </select>
//               </div>
//               <button type="button" onClick={() => handleRemoveAction(index)}>Remove Action</button>
//             </div>
//           ))}
//           <button type="button" onClick={handleAddAction}>Add Action</button>
//         </div>
//         <button type="submit">Create</button>
//       </form>
//     </div>
//   );
// }

// export default CreateRule;







// import React, { useState } from 'react';
// import '../CreateRule.css';

// function CreateRule() {
//   const [ruleName, setRuleName] = useState('');
//   const [description, setDescription] = useState('');
//   const [conditions, setConditions] = useState([
//     {
//       type: 'formEventCondition',
//       parameterValues: {
//         formId: '',
//         pagePath: ''
//       }
//     }
//   ]);
//   const [actions, setActions] = useState([
//     {
//       type: 'setPropertyAction',
//       parameterValues: {
//         setPropertyName: '',
//         setPropertyValue: '',
//         setPropertyStrategy: 'alwaysSet'
//       }
//     }
//   ]);

//   const handleRuleNameChange = (e) => setRuleName(e.target.value);
//   const handleDescriptionChange = (e) => setDescription(e.target.value);

//   const handleConditionChange = (index, field, value) => {
//     const updatedConditions = [...conditions];
//     if (field === 'type') {
//       updatedConditions[index] = {
//         type: value,
//         parameterValues: value === 'formEventCondition' ? { formId: '', pagePath: '' } : { eventTypeId: '' }
//       };
//     } else {
//       updatedConditions[index].parameterValues[field] = value;
//     }
//     setConditions(updatedConditions);
//   };

//   const handleAddCondition = () => {
//     setConditions([
//       ...conditions,
//       {
//         type: 'formEventCondition',
//         parameterValues: {
//           formId: '',
//           pagePath: ''
//         }
//       }
//     ]);
//   };

//   const handleRemoveCondition = (index) => {
//     const updatedConditions = conditions.filter((_, idx) => idx !== index);
//     setConditions(updatedConditions);
//   };

//   const handleActionChange = (index, field, value) => {
//     const updatedActions = [...actions];
//     updatedActions[index].parameterValues[field] = value;
//     setActions(updatedActions);
//   };

//   const handleAddAction = () => {
//     setActions([
//       ...actions,
//       {
//         type: 'setPropertyAction',
//         parameterValues: {
//           setPropertyName: '',
//           setPropertyValue: '',
//           setPropertyStrategy: 'alwaysSet'
//         }
//       }
//     ]);
//   };

//   const handleRemoveAction = (index) => {
//     const updatedActions = actions.filter((_, idx) => idx !== index);
//     setActions(updatedActions);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const ruleData = {
//       itemId: `${ruleName.toLowerCase().replace(/ /g, '-')}-local`,
//       itemType: 'rule',
//       linkedItems: null,
//       raiseEventOnlyOnceForProfile: false,
//       raiseEventOnlyOnceForSession: false,
//       raiseEventOnlyOnce: false,
//       priority: -1,
//       metadata: {
//         id: ruleName.toLowerCase().replace(/ /g, '-'),
//         name: ruleName,
//         scope: 'unomi-tracker-test',
//         description: description,
//         systemTags: ['formMappingRule'],
//         enabled: true,
//         missingPlugins: false,
//         hidden: false,
//         readOnly: false
//       },
//       condition: {
//         type: 'booleanCondition',
//         parameterValues: {
//           operator: 'or',
//           subConditions: conditions
//         }
//       },
//       actions: actions
//     };
//     console.log('Rule Data:', ruleData);

//     try {
//       const response = await fetch('https://cdp.qilinsa.com:9443/cxs/rules', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Basic ' + btoa('karaf:karaf')
//         },
//         body: JSON.stringify(ruleData)
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       console.log('Rule created successfully:', result);
//     } catch (error) {
//       console.error('Error creating rule:', error);
//     }
//   };

//   return (
//     <div className="create-rule">
//       <h2>Create Rule</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Rule Name:</label>
//           <input type="text" id="name" name="name" value={ruleName} onChange={handleRuleNameChange} required />
//         </div>
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea id="description" name="description" value={description} onChange={handleDescriptionChange} required></textarea>
//         </div>
//         <div>
//           <h3>Conditions</h3>
//           {conditions.map((condition, index) => (
//             <div key={index} className="condition-group">
//               <h4>Condition {index + 1}</h4>
//               <div>
//                 <label htmlFor={`conditionType-${index}`}>Condition Type:</label>
//                 <select
//                   id={`conditionType-${index}`}
//                   name="conditionType"
//                   value={condition.type}
//                   onChange={(e) => handleConditionChange(index, 'type', e.target.value)}
//                   required
//                 >
//                   <option value="formEventCondition">Form Event Condition</option>
//                   <option value="eventTypeCondition">Event Type Condition</option>
//                 </select>
//               </div>
//               {condition.type === 'formEventCondition' && (
//                 <>
//                   <div>
//                     <label htmlFor={`formId-${index}`}>Form ID:</label>
//                     <input
//                       type="text"
//                       id={`formId-${index}`}
//                       name="formId"
//                       value={condition.parameterValues.formId}
//                       onChange={(e) => handleConditionChange(index, 'formId', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor={`pagePath-${index}`}>Page Path:</label>
//                     <input
//                       type="text"
//                       id={`pagePath-${index}`}
//                       name="pagePath"
//                       value={condition.parameterValues.pagePath}
//                       onChange={(e) => handleConditionChange(index, 'pagePath', e.target.value)}
//                       required
//                     />
//                   </div>
//                 </>
//               )}
//               {condition.type === 'eventTypeCondition' && (
//                 <div>
//                   <label htmlFor={`eventTypeId-${index}`}>Event Type ID:</label>
//                   <input
//                     type="text"
//                     id={`eventTypeId-${index}`}
//                     name="eventTypeId"
//                     value={condition.parameterValues.eventTypeId}
//                     onChange={(e) => handleConditionChange(index, 'eventTypeId', e.target.value)}
//                     required
//                   />
//                 </div>
//               )}
//               <button type="button" onClick={() => handleRemoveCondition(index)}>Remove Condition</button>
//             </div>
//           ))}
//           <button type="button" onClick={handleAddCondition}>Add Condition</button>
//         </div>
//         <div>
//           <h3>Actions</h3>
//           {actions.map((action, index) => (
//             <div key={index} className="action-group">
//               <h4>Action {index + 1}</h4>
//               <div>
//                 <label htmlFor={`setPropertyName-${index}`}>Set Property Name:</label>
//                 <input
//                   type="text"
//                   id={`setPropertyName-${index}`}
//                   name="setPropertyName"
//                   value={action.parameterValues.setPropertyName}
//                   onChange={(e) => handleActionChange(index, 'setPropertyName', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor={`setPropertyValue-${index}`}>Set Property Value:</label>
//                 <input
//                   type="text"
//                   id={`setPropertyValue-${index}`}
//                   name="setPropertyValue"
//                   value={action.parameterValues.setPropertyValue}
//                   onChange={(e) => handleActionChange(index, 'setPropertyValue', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor={`setPropertyStrategy-${index}`}>Set Property Strategy:</label>
//                 <select
//                   id={`setPropertyStrategy-${index}`}
//                   name="setPropertyStrategy"
//                   value={action.parameterValues.setPropertyStrategy}
//                   onChange={(e) => handleActionChange(index, 'setPropertyStrategy', e.target.value)}
//                   required
//                 >
//                   <option value="alwaysSet">Always Set</option>
//                   <option value="onlyIfNotSet">Only If Not Set</option>
//                 </select>
//               </div>
//               <button type="button" onClick={() => handleRemoveAction(index)}>Remove Action</button>
//             </div>
//           ))}
//           <button type="button" onClick={handleAddAction}>Add Action</button>
//         </div>
//         <button type="submit">Create</button>
//       </form>
//     </div>
//   );
// }

// export default CreateRule;



  


// Code without selection field in action section 



// import React, { useState, useEffect } from 'react';
// import '../CreateRule.css';

// function CreateRule() {
//   const [ruleName, setRuleName] = useState('');
//   const [ruleId, setRuleId] = useState('');
//   const [scope, setScope] = useState('');
//   const [scopes, setScopes] = useState([]); // State to store scopes
//   const [description, setDescription] = useState('');
//   const [conditions, setConditions] = useState([
//     {
//       type: 'formEventCondition',
//       parameterValues: {
//         formId: '',
//         pagePath: ''
//       }
//     }
//   ]);
//   const [actions, setActions] = useState([
//     {
//       type: 'setPropertyAction',
//       parameterValues: {
//         setPropertyName: '',
//         setPropertyValue: '',
//         setPropertyStrategy: 'alwaysSet'
//       }
//     }
//   ]);
//   const [actionType, setActionType] = useState('setPropertyAction'); // Default action type

//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     // Fetch scopes from the endpoint
//     const fetchScopes = async () => {
//       try {
//         const response = await fetch('https://cdp.qilinsa.com:9443/cxs/scopes', {
//           headers: {
//             'Authorization': 'Basic ' + btoa('karaf:karaf')
//           }
//         });
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setScopes(data);
//       } catch (error) {
//         console.error('Error fetching scopes:', error);
//       }
//     };

//     fetchScopes();
//   }, []);

//   const handleRuleNameChange = (e) => setRuleName(e.target.value);
//   const handleRuleIdChange = (e) => setRuleId(e.target.value);
//   const handleScopeChange = (e) => setScope(e.target.value);
//   const handleDescriptionChange = (e) => setDescription(e.target.value);

//   const handleConditionChange = (index, field, value) => {
//     const updatedConditions = [...conditions];
//     if (field === 'type') {
//       updatedConditions[index] = {
//         type: value,
//         parameterValues: value === 'formEventCondition' ? { formId: '', pagePath: '' } : { eventTypeId: '' }
//       };
//     } else {
//       updatedConditions[index].parameterValues[field] = value;
//     }
//     setConditions(updatedConditions);
//   };

//   const handleAddCondition = () => {
//     setConditions([
//       ...conditions,
//       {
//         type: 'formEventCondition',
//         parameterValues: {
//           formId: '',
//           pagePath: ''
//         }
//       }
//     ]);
//   };

//   const handleRemoveCondition = (index) => {
//     const updatedConditions = conditions.filter((_, idx) => idx !== index);
//     setConditions(updatedConditions);
//   };

//   const handleActionTypeChange = (index, value) => {
//     const updatedActions = [...actions];
//     updatedActions[index] = {
//       type: value,
//       parameterValues: value === 'mergeProfilesOnPropertyAction' ? 
//         { mergeProfilePropertyValue: '', mergeProfilePropertyName: '' } :
//         { setPropertyName: '', setPropertyValue: '', setPropertyStrategy: 'alwaysSet' }
//     };
//     setActions(updatedActions);
//     setActionType(value); // Update actionType state with the selected action type
//   };

//   const handleActionChange = (index, field, value) => {
//     const updatedActions = [...actions];
//     updatedActions[index].parameterValues[field] = value;
//     setActions(updatedActions);
//   };

//   const handleAddAction = () => {
//     setActions([
//       ...actions,
//       {
//         type: actionType, // Use actionType state here
//         parameterValues: actionType === 'mergeProfilesOnPropertyAction' ? 
//           { mergeProfilePropertyValue: '', mergeProfilePropertyName: '' } :
//           { setPropertyName: '', setPropertyValue: '', setPropertyStrategy: 'alwaysSet' }
//       }
//     ]);
//   };

//   const handleRemoveAction = (index) => {
//     const updatedActions = actions.filter((_, idx) => idx !== index);
//     setActions(updatedActions);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const ruleData = {
//       itemId: `${ruleId.toLowerCase().replace(/ /g, '-')}-local`,
//       itemType: 'rule',
//       linkedItems: null,
//       raiseEventOnlyOnceForProfile: false,
//       raiseEventOnlyOnceForSession: false,
//       raiseEventOnlyOnce: false,
//       priority: -1,
//       metadata: {
//         id: ruleId.toLowerCase().replace(/ /g, '-'),
//         name: ruleName,
//         scope: scope,
//         description: description,
//         systemTags: ['formMappingRule'],
//         enabled: true,
//         missingPlugins: false,
//         hidden: false,
//         readOnly: false
//       },
//       condition: {
//         type: 'formEventCondition',
//         parameterValues: conditions[0].parameterValues
//       },
//       actions: actions
//     };
//     console.log('Rule Data:', ruleData);

//     try {
//       const response = await fetch('https://cdp.qilinsa.com:9443/cxs/rules', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Basic ' + btoa('karaf:karaf')
//         },
//         body: JSON.stringify(ruleData)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Network response was not ok: ${errorText}`);
//       }

//       let result;
//       const text = await response.text();
//       if (text) {
//         result = JSON.parse(text);
//       } else {
//         result = {};
//       }

//       console.log('Rule created successfully:', result);

//       // Clear all fields
//       setRuleName('');
//       setRuleId('');
//       setScope('');
//       setDescription('');
//       setConditions([
//         {
//           type: 'formEventCondition',
//           parameterValues: {
//             formId: '',
//             pagePath: ''
//           }
//         }
//       ]);
//       setActions([
//         {
//           type: actionType, // Use actionType state here
//           parameterValues: actionType === 'mergeProfilesOnPropertyAction' ? 
//             { mergeProfilePropertyValue: '', mergeProfilePropertyName: '' } :
//             { setPropertyName: '', setPropertyValue: '', setPropertyStrategy: 'alwaysSet' }
//         }
//       ]);
//       setMessage('Rule created successfully');
//     } catch (error) {
//       console.error('Error creating rule:', error);
//       setMessage(`Error creating rule: ${error.message}`);
//     }
//   };

//   return (
//     <div className="create-rule">
//       <h2>Create Rule</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Rule Name:</label>
//           <input type="text" id="name" name="name" value={ruleName} onChange={handleRuleNameChange} required />
//         </div>
//         <div>
//           <label htmlFor="id">Rule ID:</label>
//           <input type="text" id="id" name="id" value={ruleId} onChange={handleRuleIdChange} required />
//         </div>
//         <div>
//           <label htmlFor="scope">Scope:</label>
//           <select id="scope" name="scope" value={scope} onChange={handleScopeChange} required>
//             <option value="">Select Scope</option>
//             {scopes.map((scopeItem) => (
//               scopeItem.metadata && scopeItem.metadata.name && (
//                 <option key={scopeItem.itemId} value={scopeItem.metadata.name}>
//                   {scopeItem.metadata.name}
//                 </option>
//               )
//             ))}
//             <option value="systemscope">systemscope</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea id="description" name="description" value={description} onChange={handleDescriptionChange} required></textarea>
//         </div>
//         <div>
//           <h3>Conditions</h3>
//           {conditions.map((condition, index) => (
//             <div key={index} className="condition-group">
//               <h4>Condition {index + 1}</h4>
//               <div>
//                 <label htmlFor={`conditionType-${index}`}>Condition Type:</label>
//                 <select
//                   id={`conditionType-${index}`}
//                   name="conditionType"
//                   value={condition.type}
//                   onChange={(e) => handleConditionChange(index, 'type', e.target.value)}
//                   required
//                 >
//                   <option value="formEventCondition">Form Event Condition</option>
//                   <option value="eventTypeCondition">Event Type Condition</option>
//                 </select>
//               </div>
//               {condition.type === 'formEventCondition' && (
//                 <>
//                   <div>
//                     <label htmlFor={`formId-${index}`}>Form ID:</label>
//                     <input
//                       type="text"
//                       id={`formId-${index}`}
//                       name="formId"
//                       value={condition.parameterValues.formId}
//                       onChange={(e) => handleConditionChange(index, 'formId', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor={`pagePath-${index}`}>Page Path:</label>
//                     <input
//                       type="text"
//                       id={`pagePath-${index}`}
//                       name="pagePath"
//                       value={condition.parameterValues.pagePath}
//                       onChange={(e) => handleConditionChange(index, 'pagePath', e.target.value)}
//                       required
//                     />
//                   </div>
//                 </>
//               )}
//               {condition.type === 'eventTypeCondition' && (
//                 <div>
//                   <label htmlFor={`eventTypeId-${index}`}>Event Type ID:</label>
//                   <input
//                     type="text"
//                     id={`eventTypeId-${index}`}
//                     name="eventTypeId"
//                     value={condition.parameterValues.eventTypeId}
//                     onChange={(e) => handleConditionChange(index, 'eventTypeId', e.target.value)}
//                     required
//                   />
//                 </div>
//               )}
//               <button type="button" onClick={() => handleRemoveCondition(index)}>Remove Condition</button>
//             </div>
//           ))}
//           <button type="button" onClick={handleAddCondition}>Add Condition</button>
//         </div>
//         <div>
//           <h3>Actions</h3>
//           {actions.map((action, index) => (
//             <div key={index} className="action-group">
//               <h4>Action {index + 1}</h4>
//               <div>
//                 <label htmlFor={`actionType-${index}`}>Action Type:</label>
//                 <select
//                   id={`actionType-${index}`}
//                   name="actionType"
//                   value={action.type}
//                   onChange={(e) => handleActionTypeChange(index, e.target.value)}
//                   required
//                 >
//                   <option value="setPropertyAction">Set Property Action</option>
//                   <option value="mergeProfilesOnPropertyAction">Merge Profiles on Property Action</option>
//                 </select>
//               </div>
//               {action.type === 'setPropertyAction' && (
//                 <>
//                   <div>
//                     <label htmlFor={`setPropertyName-${index}`}>Property Name:</label>
//                     <input
//                       type="text"
//                       id={`setPropertyName-${index}`}
//                       name="setPropertyName"
//                       value={action.parameterValues.setPropertyName}
//                       onChange={(e) => handleActionChange(index, 'setPropertyName', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor={`setPropertyValue-${index}`}>Property Value:</label>
//                     <input
//                       type="text"
//                       id={`setPropertyValue-${index}`}
//                       name="setPropertyValue"
//                       value={action.parameterValues.setPropertyValue}
//                       onChange={(e) => handleActionChange(index, 'setPropertyValue', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor={`setPropertyStrategy-${index}`}>Property Strategy:</label>
//                     <input
//                       type="text"
//                       id={`setPropertyStrategy-${index}`}
//                       name="setPropertyStrategy"
//                       value={action.parameterValues.setPropertyStrategy}
//                       onChange={(e) => handleActionChange(index, 'setPropertyStrategy', e.target.value)}
//                       required
//                     />
//                   </div>
//                 </>
//               )}
//               {action.type === 'mergeProfilesOnPropertyAction' && (
//                 <>
//                   <div>
//                     <label htmlFor={`mergeProfilePropertyName-${index}`}>Profile Property Name:</label>
//                     <input
//                       type="text"
//                       id={`mergeProfilePropertyName-${index}`}
//                       name="mergeProfilePropertyName"
//                       value={action.parameterValues.mergeProfilePropertyName}
//                       onChange={(e) => handleActionChange(index, 'mergeProfilePropertyName', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor={`mergeProfilePropertyValue-${index}`}>Profile Property Value:</label>
//                     <input
//                       type="text"
//                       id={`mergeProfilePropertyValue-${index}`}
//                       name="mergeProfilePropertyValue"
//                       value={action.parameterValues.mergeProfilePropertyValue}
//                       onChange={(e) => handleActionChange(index, 'mergeProfilePropertyValue', e.target.value)}
//                       required
//                     />
//                   </div>
//                 </>
//               )}
//               <button type="button" onClick={() => handleRemoveAction(index)}>Remove Action</button>
//             </div>
//           ))}
//           <button type="button" onClick={handleAddAction}>Add Action</button>
//         </div>
//         <div className='confirmation-message'>{message && <p>{message}</p>}</div>
//         <div>
//           <button type="submit">Create Rule</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default CreateRule;





import React, { useState, useEffect } from 'react';
import '../CreateRule.css';

function CreateRule() {
  const [ruleName, setRuleName] = useState('');
  const [ruleId, setRuleId] = useState('');
  const [scope, setScope] = useState('');
  const [scopes, setScopes] = useState([]); // State to store scopes
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState([
    {
      type: 'formEventCondition',
      parameterValues: {
        formId: '',
        pagePath: ''
      }
    }
  ]);
  const [actions, setActions] = useState([
    {
      type: 'setPropertyAction',
      parameterValues: {
        setPropertyName: '',
        setPropertyValue: '',
        setPropertyStrategy: 'alwaysSet'
      }
    }
  ]);
  const [actionType, setActionType] = useState('setPropertyAction'); // Default action type

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch scopes from the endpoint
    const fetchScopes = async () => {
      try {
        const response = await fetch('https://cdp.qilinsa.com:9443/cxs/scopes', {
          headers: {
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setScopes(data);
      } catch (error) {
        console.error('Error fetching scopes:', error);
      }
    };

    fetchScopes();
  }, []);

  const handleRuleNameChange = (e) => setRuleName(e.target.value);
  const handleRuleIdChange = (e) => setRuleId(e.target.value);
  const handleScopeChange = (e) => setScope(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleConditionChange = (index, field, value) => {
    const updatedConditions = [...conditions];
    if (field === 'type') {
      updatedConditions[index] = {
        type: value,
        parameterValues: value === 'formEventCondition' ? { formId: '', pagePath: '' } : { eventTypeId: '' }
      };
    } else {
      updatedConditions[index].parameterValues[field] = value;
    }
    setConditions(updatedConditions);
  };

  // const handleAddCondition = () => {
  //   setConditions([
  //     ...conditions,
  //     {
  //       type: 'formEventCondition',
  //       parameterValues: {
  //         formId: '',
  //         pagePath: ''
  //       }
  //     }
  //   ]);
  // };

  // const handleRemoveCondition = (index) => {
  //   const updatedConditions = conditions.filter((_, idx) => idx !== index);
  //   setConditions(updatedConditions);
  // };

  const handleActionTypeChange = (index, value) => {
    const updatedActions = [...actions];
    updatedActions[index] = {
      type: value,
      parameterValues: value === 'mergeProfilesOnPropertyAction' ? 
        { mergeProfilePropertyValue: '', mergeProfilePropertyName: '' } :
        { setPropertyName: '', setPropertyValue: '', setPropertyStrategy: 'alwaysSet' }
    };
    setActions(updatedActions);
    setActionType(value); // Update actionType state with the selected action type
  };

  const handleActionChange = (index, field, value) => {
    const updatedActions = [...actions];
    updatedActions[index].parameterValues[field] = value;
    setActions(updatedActions);
  };

  const handleAddAction = () => {
    setActions([
      ...actions,
      {
        type: actionType, // Use actionType state here
        parameterValues: actionType === 'mergeProfilesOnPropertyAction' ? 
          { mergeProfilePropertyValue: '', mergeProfilePropertyName: '' } :
          { setPropertyName: '', setPropertyValue: '', setPropertyStrategy: 'alwaysSet' }
      }
    ]);
  };

  const handleRemoveAction = (index) => {
    const updatedActions = actions.filter((_, idx) => idx !== index);
    setActions(updatedActions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ruleData = {
      itemId: `${ruleId.toLowerCase().replace(/ /g, '-')}-local`,
      itemType: 'rule',
      linkedItems: null,
      raiseEventOnlyOnceForProfile: false,
      raiseEventOnlyOnceForSession: false,
      raiseEventOnlyOnce: false,
      priority: -1,
      metadata: {
        id: ruleId.toLowerCase().replace(/ /g, '-'),
        name: ruleName,
        scope: scope,
        description: description,
        systemTags: ['formMappingRule'],
        enabled: true,
        missingPlugins: false,
        hidden: false,
        readOnly: false
      },
      condition: {
        type: 'formEventCondition',
        parameterValues: conditions[0].parameterValues
      },
      actions: actions
    };
    console.log('Rule Data:', ruleData);

    try {
      const response = await fetch('https://cdp.qilinsa.com:9443/cxs/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('karaf:karaf')
        },
        body: JSON.stringify(ruleData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      let result;
      const text = await response.text();
      if (text) {
        result = JSON.parse(text);
      } else {
        result = {};
      }

      console.log('Rule created successfully:', result);

      // Clear all fields
      setRuleName('');
      setRuleId('');
      setScope('');
      setDescription('');
      setConditions([
        {
          type: 'formEventCondition',
          parameterValues: {
            formId: '',
            pagePath: ''
          }
        }
      ]);
      setActions([
        {
          type: actionType, // Use actionType state here
          parameterValues: actionType === 'mergeProfilesOnPropertyAction' ? 
            { mergeProfilePropertyValue: '', mergeProfilePropertyName: '' } :
            { setPropertyName: '', setPropertyValue: '', setPropertyStrategy: 'alwaysSet' }
        }
      ]);
      setMessage('Rule created successfully');
    } catch (error) {
      console.error('Error creating rule:', error);
      setMessage(`Error creating rule: ${error.message}`);
    }
  };

  return (
    <div className="create-rule">
      <h2>Create Rule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Rule Name:</label>
          <input type="text" id="name" name="name" value={ruleName} onChange={handleRuleNameChange} required />
        </div>
        <div>
          <label htmlFor="id">Rule ID:</label>
          <input type="text" id="id" name="id" value={ruleId} onChange={handleRuleIdChange} required />
        </div>
        <div>
          <label htmlFor="scope">Scope:</label>
          <select id="scope" name="scope" value={scope} onChange={handleScopeChange} required>
            <option value="">Select Scope</option>
            {scopes.map((scopeItem) => (
              scopeItem.metadata && scopeItem.metadata.name && (
                <option key={scopeItem.itemId} value={scopeItem.metadata.name}>
                  {scopeItem.metadata.name}
                </option>
              )
            ))}
            <option value="systemscope">systemscope</option>
          </select>
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
                <label htmlFor={`conditionType-${index}`}>Condition Type:</label>
                <select
                  id={`conditionType-${index}`}
                  name="conditionType"
                  value={condition.type}
                  onChange={(e) => handleConditionChange(index, 'type', e.target.value)}
                  required
                >
                  <option value="formEventCondition">Form Event Condition</option>
                  <option value="eventTypeCondition">Event Type Condition</option>
                </select>
              </div>
              {condition.type === 'formEventCondition' && (
                <>
                  <div>
                    <label htmlFor={`formId-${index}`}>Form ID:</label>
                    <input
                      type="text"
                      id={`formId-${index}`}
                      name="formId"
                      value={condition.parameterValues.formId}
                      onChange={(e) => handleConditionChange(index, 'formId', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`pagePath-${index}`}>Page Path:</label>
                    <input
                      type="text"
                      id={`pagePath-${index}`}
                      name="pagePath"
                      value={condition.parameterValues.pagePath}
                      onChange={(e) => handleConditionChange(index, 'pagePath', e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              {condition.type === 'eventTypeCondition' && (
                <div>
                  <label htmlFor={`eventTypeId-${index}`}>Event Type ID:</label>
                  <input
                    type="text"
                    id={`eventTypeId-${index}`}
                    name="eventTypeId"
                    value={condition.parameterValues.eventTypeId}
                    onChange={(e) => handleConditionChange(index, 'eventTypeId', e.target.value)}
                    required
                  />
                </div>
              )}
              {/* <button type="button" onClick={() => handleRemoveCondition(index)}>Remove Condition</button> */}
            </div>
          ))}
          {/* <button type="button" onClick={handleAddCondition}>Add Condition</button> */}
        </div>
        <div>
          <h3>Actions</h3>
          {actions.map((action, index) => (
            <div key={index} className="action-group">
              <h4>Action {index + 1}</h4>
              <div>
                <label htmlFor={`actionType-${index}`}>Action Type:</label>
                <select
                  id={`actionType-${index}`}
                  name="actionType"
                  value={action.type}
                  onChange={(e) => handleActionTypeChange(index, e.target.value)}
                  required
                >
                  <option value="setPropertyAction">Set Property Action</option>
                  <option value="mergeProfilesOnPropertyAction">Merge Profiles on Property Action</option>
                </select>
              </div>
              {action.type === 'setPropertyAction' && (
                <>
                  <div>
                    <label htmlFor={`setPropertyName-${index}`}>Property Name:</label>
                    <select
                      id={`setPropertyName-${index}`}
                      name="setPropertyName"
                      value={action.parameterValues.setPropertyName}
                      onChange={(e) => handleActionChange(index, 'setPropertyName', e.target.value)}
                      required
                    >
                      <option value="">Select Property Name</option>
                      <option value="properties(firstName)">properties(firstName)</option>
                      <option value="properties(lastName)">properties(lastName)</option>
                      <option value="properties(email)">properties(email)</option>
                      <option value="properties(email)">properties(email)</option>
                      <option value="properties(jobTitle)">properties(jobTitle)</option>
                      <option value="properties(nationality)">properties(nationality)</option>
                      <option value="properties(phoneNumber)">properties(phoneNumber)</option>
                      <option value="properties(age)">properties(age)</option>
                      <option value="properties(birthDate)">properties(birthDate)</option>
                      <option value="properties(maritalStatus)">properties(maritalStatus)</option>
                      <option value="properties(address)">properties(address)</option>
                      <option value="properties(city)">properties(city)</option>
                      <option value="properties(facebookId)">properties(facebookId)</option>
                      <option value="properties(zipCode)">properties(zipCode)</option>
                      <option value="properties(countryName)">properties(countryName)</option>
                      <option value="properties(linkedInId)">properties(linkedInId)</option>
                      <option value="properties(googleId)">properties(googleId)</option>
                      <option value="properties(twitterId)">properties(twitterId)</option>
                      <option value="properties(kids)">properties(kids)</option>
                      <option value="properties(company)">properties(company)</option>
                      <option value="properties(income)">properties(income)</option>
                      <option value="properties(lastVisit)">properties(lastVisit)</option>
                      <option value="properties(previousVisit)">properties(previousVisit)</option>
                      <option value="properties(nbOfVisits)">properties(nbOfVisits)</option>
                      <option value="properties(nbOfOrders)">properties(nbOfOrders)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`setPropertyValue-${index}`}>Property Value:</label>
                    <select
                      id={`setPropertyValue-${index}`}
                      name="setPropertyValue"
                      value={action.parameterValues.setPropertyValue}
                      onChange={(e) => handleActionChange(index, 'setPropertyValue', e.target.value)}
                      required
                    >
                      <option value="">Select Property Value</option>
                      <option value="eventProperty::flattenedProperties.fields.lastName">eventProperty::flattenedProperties.fields.lastName</option>
                      <option value="eventProperty::flattenedProperties.fields.firstName">eventProperty::flattenedProperties.fields.firstName</option>
                      <option value="eventProperty::flattenedProperties.fields.email">eventProperty::flattenedProperties.fields.email</option>
                      <option value="eventProperty::flattenedProperties.fields.jobTitle">eventProperty::flattenedProperties.fields.jobTitle</option>
                      <option value="eventProperty::flattenedProperties.fields.nationality">eventProperty::flattenedProperties.fields.nationality</option>
                      <option value="eventProperty::flattenedProperties.fields.phoneNumber">eventProperty::flattenedProperties.fields.phoneNumber</option>
                      <option value="eventProperty::flattenedProperties.fields.age">eventProperty::flattenedProperties.fields.age</option>
                      <option value="eventProperty::flattenedProperties.fields.birthDate">eventProperty::flattenedProperties.fields.birthDate</option>
                      <option value="eventProperty::flattenedProperties.fields.maritalStatus">eventProperty::flattenedProperties.fields.maritalStatus</option>
                      <option value="eventProperty::flattenedProperties.fields.address">eventProperty::flattenedProperties.fields.email</option>
                      <option value="eventProperty::flattenedProperties.fields.city">eventProperty::flattenedProperties.fields.city</option>
                      <option value="eventProperty::flattenedProperties.fields.facebookId">eventProperty::flattenedProperties.fields.facebookId</option>
                      <option value="eventProperty::flattenedProperties.fields.zipCode">eventProperty::flattenedProperties.fields.zipCode</option>
                      <option value="eventProperty::flattenedProperties.fields.countryName">eventProperty::flattenedProperties.fields.countryName</option>
                      <option value="eventProperty::flattenedProperties.fields.linkedInId">eventProperty::flattenedProperties.fields.linkedInId</option>
                      <option value="eventProperty::flattenedProperties.fields.googleId">eventProperty::flattenedProperties.fields.googleId</option>
                      <option value="eventProperty::flattenedProperties.fields.twitterId">eventProperty::flattenedProperties.fields.twitterId</option>
                      <option value="eventProperty::flattenedProperties.fields.kids">eventProperty::flattenedProperties.fields.kids</option>
                      <option value="eventProperty::flattenedProperties.fields.company">eventProperty::flattenedProperties.fields.company</option>
                      <option value="eventProperty::flattenedProperties.fields.income">eventProperty::flattenedProperties.fields.income</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`setPropertyStrategy-${index}`}>Property Strategy:</label>
                    <input
                      type="text"
                      id={`setPropertyStrategy-${index}`}
                      name="setPropertyStrategy"
                      value={action.parameterValues.setPropertyStrategy}
                      onChange={(e) => handleActionChange(index, 'setPropertyStrategy', e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              {action.type === 'mergeProfilesOnPropertyAction' && (
                <>
                  <div>
                    <label htmlFor={`mergeProfilePropertyName-${index}`}>Profile Property Name:</label>
                    <select
                      id={`mergeProfilePropertyName-${index}`}
                      name="mergeProfilePropertyName"
                      value={action.parameterValues.mergeProfilePropertyName}
                      onChange={(e) => handleActionChange(index, 'mergeProfilePropertyName', e.target.value)}
                      required
                    >
                      <option value="">Select Profile Property Name</option>
                      <option value="properties(firstName)">properties(firstName)</option>
                      <option value="properties(lastName)">properties(lastName)</option>
                      <option value="properties(email)">properties(email)</option>
                      <option value="properties(email)">properties(email)</option>
                      <option value="properties(jobTitle)">properties(jobTitle)</option>
                      <option value="properties(nationality)">properties(nationality)</option>
                      <option value="properties(phoneNumber)">properties(phoneNumber)</option>
                      <option value="properties(age)">properties(age)</option>
                      <option value="properties(birthDate)">properties(birthDate)</option>
                      <option value="properties(maritalStatus)">properties(maritalStatus)</option>
                      <option value="properties(address)">properties(address)</option>
                      <option value="properties(city)">properties(city)</option>
                      <option value="properties(facebookId)">properties(facebookId)</option>
                      <option value="properties(zipCode)">properties(zipCode)</option>
                      <option value="properties(countryName)">properties(countryName)</option>
                      <option value="properties(linkedInId)">properties(linkedInId)</option>
                      <option value="properties(googleId)">properties(googleId)</option>
                      <option value="properties(twitterId)">properties(twitterId)</option>
                      <option value="properties(kids)">properties(kids)</option>
                      <option value="properties(company)">properties(company)</option>
                      <option value="properties(income)">properties(income)</option>
                      <option value="properties(lastVisit)">properties(lastVisit)</option>
                      <option value="mergeIdentifier">mergeIdentifier</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`mergeProfilePropertyValue-${index}`}>Profile Property Value:</label>
                    <select
                      id={`mergeProfilePropertyValue-${index}`}
                      name="mergeProfilePropertyValue"
                      value={action.parameterValues.mergeProfilePropertyValue}
                      onChange={(e) => handleActionChange(index, 'mergeProfilePropertyValue', e.target.value)}
                    >
                      <option value="">Select Profile Property Value</option>
                      <option value="eventProperty::flattenedProperties.fields.lastName">eventProperty::flattenedProperties.fields.lastName</option>
                      <option value="eventProperty::flattenedProperties.fields.firstName">eventProperty::flattenedProperties.fields.firstName</option>
                      <option value="eventProperty::flattenedProperties.fields.email">eventProperty::flattenedProperties.fields.email</option>
                      <option value="eventProperty::flattenedProperties.fields.jobTitle">eventProperty::flattenedProperties.fields.jobTitle</option>
                      <option value="eventProperty::flattenedProperties.fields.nationality">eventProperty::flattenedProperties.fields.nationality</option>
                      <option value="eventProperty::flattenedProperties.fields.phoneNumber">eventProperty::flattenedProperties.fields.phoneNumber</option>
                      <option value="eventProperty::flattenedProperties.fields.age">eventProperty::flattenedProperties.fields.age</option>
                      <option value="eventProperty::flattenedProperties.fields.birthDate">eventProperty::flattenedProperties.fields.birthDate</option>
                      <option value="eventProperty::flattenedProperties.fields.maritalStatus">eventProperty::flattenedProperties.fields.maritalStatus</option>
                      <option value="eventProperty::flattenedProperties.fields.address">eventProperty::flattenedProperties.fields.email</option>
                      <option value="eventProperty::flattenedProperties.fields.city">eventProperty::flattenedProperties.fields.city</option>
                      <option value="eventProperty::flattenedProperties.fields.facebookId">eventProperty::flattenedProperties.fields.facebookId</option>
                      <option value="eventProperty::flattenedProperties.fields.zipCode">eventProperty::flattenedProperties.fields.zipCode</option>
                      <option value="eventProperty::flattenedProperties.fields.countryName">eventProperty::flattenedProperties.fields.countryName</option>
                      <option value="eventProperty::flattenedProperties.fields.linkedInId">eventProperty::flattenedProperties.fields.linkedInId</option>
                      <option value="eventProperty::flattenedProperties.fields.googleId">eventProperty::flattenedProperties.fields.googleId</option>
                      <option value="eventProperty::flattenedProperties.fields.twitterId">eventProperty::flattenedProperties.fields.twitterId</option>
                      <option value="eventProperty::flattenedProperties.fields.kids">eventProperty::flattenedProperties.fields.kids</option>
                      <option value="eventProperty::flattenedProperties.fields.company">eventProperty::flattenedProperties.fields.company</option>
                      <option value="eventProperty::flattenedProperties.fields.income">eventProperty::flattenedProperties.fields.income</option>
                      <option value="eventProperty::target.properties(email)">eventProperty::target.properties(email)</option>
                      
                    </select>
                  </div>
                </>
              )}
              <button type="button" onClick={() => handleRemoveAction(index)}>Remove Action</button>
            </div>
          ))}
          <button type="button" onClick={handleAddAction}>Add Action</button>
        </div>
        <div className='confirmation-message'>{message && <p>{message}</p>}</div>
        <div>
          <button type="submit">Create Rule</button>
        </div>
      </form>
    </div>
  );
}

export default CreateRule;

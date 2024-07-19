// import '../ProfileDetail.css';
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function ProfileDetail() {
//   const { id } = useParams();
//   const [profileDetails, setProfileDetails] = useState([]);

//   useEffect(() => {
//     const fetchProfileDetails = async () => {
//       try {
//         const response = await fetch('https://cdp.qilinsa.com:9443/cxs/events/search', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Basic ' + btoa('karaf:karaf')
//           },
//           body: JSON.stringify({
//             offset: 0,
//             condition: {
//               type: 'profilePropertyCondition',
//               parameterValues: {
//                 propertyName: 'profileId',
//                 comparisonOperator: 'equals',
//                 propertyValue: id
//               }
//             }
//           })
//         });
//         const data = await response.json();
//         setProfileDetails(data.list);
//       } catch (error) {
//         console.error('Error fetching profile details:', error);
//       }
//     };

//     fetchProfileDetails();
//   }, [id]);

//   return (
//     <div className="profile-detail">
//       <h2>Profile Details</h2>
//       {profileDetails.length === 0 ? (
//         <p>No profile details found.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Event Type</th>
//               <th>Time</th>
//               <th>Session ID</th>
//               <th>Destination URL</th>
//               <th>Page ID</th>
//               <th>Page Path</th>
//               <th>Page Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {profileDetails.map((detail) => (
//               <tr key={detail.timeStamp}>
//                 <td>{detail.eventType}</td>
//                 <td>{new Date(detail.timeStamp).toLocaleString()}</td>
//                 <td>{detail.sessionId}</td>
//                 <td>{detail.target?.properties?.pageInfo?.destinationURL || 'N/A'}</td>
//                 <td>{detail.target?.properties?.pageInfo?.pageID || 'N/A'}</td>
//                 <td>{detail.target?.properties?.pageInfo?.pagePath || 'N/A'}</td>
//                 <td>{detail.target?.properties?.pageInfo?.pageName || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default ProfileDetail;




// import '../ProfileDetail.css';
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function ProfileDetail() {
//   const { id } = useParams();
//   const [profileDetails, setProfileDetails] = useState([]);
//   const [sessionDetails, setSessionDetails] = useState([]);

//   useEffect(() => {
//     const fetchProfileDetails = async () => {
//       try {
//         const response = await fetch('https://cdp.qilinsa.com:9443/cxs/events/search', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Basic ' + btoa('karaf:karaf')
//           },
//           body: JSON.stringify({
//             offset: 0,
//             condition: {
//               type: 'profilePropertyCondition',
//               parameterValues: {
//                 propertyName: 'profileId',
//                 comparisonOperator: 'equals',
//                 propertyValue: id
//               }
//             }
//           })
//         });
//         const data = await response.json();
//         setProfileDetails(data.list || []);
//       } catch (error) {
//         console.error('Error fetching profile details:', error);
//       }
//     };

//     const fetchSessionDetails = async () => {
//       try {
//         const response = await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${id}/sessions`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Basic ' + btoa('karaf:karaf')
//           }
//         });
//         const data = await response.json();
//         setSessionDetails(data.list || []);
//       } catch (error) {
//         console.error('Error fetching session details:', error);
//       }
//     };

//     fetchProfileDetails();
//     fetchSessionDetails();
//   }, [id]);

//   return (
//     <div className="profile-detail">
//       <h2>Profile Details</h2>
//       {profileDetails.length === 0 ? (
//         <p>No profile details found.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Profile ID</th>
//               <th>Event Type</th>
//               <th>Time</th>
//               <th>Session ID</th>
//               <th>Destination URL</th>
//               <th>Page ID</th>
//               <th>Page Path</th>
//               <th>Page Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {profileDetails.map((detail) => (
//               <tr key={detail.timeStamp}>
//                 <td>{detail.profileId}</td>
//                 <td>{detail.eventType}</td>
//                 <td>{new Date(detail.timeStamp).toLocaleString()}</td>
//                 <td>{detail.sessionId}</td>
//                 <td>{detail.target?.properties?.pageInfo?.destinationURL || 'N/A'}</td>
//                 <td>{detail.target?.properties?.pageInfo?.pageID || 'N/A'}</td>
//                 <td>{detail.target?.properties?.pageInfo?.pagePath || 'N/A'}</td>
//                 <td>{detail.target?.properties?.pageInfo?.pageName || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <h2>Session Details</h2>
//       {sessionDetails.length === 0 ? (
//         <p>No session details found.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Session ID</th>
//               <th>Operating System</th>
//               <th>Device Category</th>
//               <th>User Agent</th>
//               <th>Country</th>
//               <th>Duration (minutes)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sessionDetails.map((session) => (
//               <tr key={session.itemId}>
//                 <td>{session.itemId}</td>
//                 <td>{session.properties.operatingSystemFamily || 'N/A'}</td>
//                 <td>{session.properties.deviceCategory || 'N/A'}</td>
//                 <td>{session.properties.userAgentName || 'N/A'}</td>
//                 <td>{session.properties.countryAndCity || 'N/A'}</td>
//                 <td>{(session.duration / 60000).toFixed(2)}</td> {/* Convert milliseconds to minutes */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default ProfileDetail;




import '../ProfileDetail.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProfileDetail() {
  const { id } = useParams();
  const [profileDetails, setProfileDetails] = useState([]);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [userProfile, setUserProfile] = useState([]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch('https://cdp.qilinsa.com:9443/cxs/events/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          },
          body: JSON.stringify({
            offset: 0,
            condition: {
              type: 'profilePropertyCondition',
              parameterValues: {
                propertyName: 'profileId',
                comparisonOperator: 'equals',
                propertyValue: id
              }
            }
          })
        });
        const data = await response.json();
        setProfileDetails(data.list || []);
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };

    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${id}/sessions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          }
        });
        const data = await response.json();
        setSessionDetails(data.list || []);
      } catch (error) {
        console.error('Error fetching session details:', error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          }
        });
        const data = await response.json();
        setUserProfile(data.properties || {});
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfileDetails();
    fetchSessionDetails();
    fetchUserProfile();
  }, [id]);

  return (
    <div className="profile-detail">
      <h2>Profile Details</h2>
      {profileDetails.length === 0 ? (
        <p>No profile details found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Profile ID</th>
              <th>Event Type</th>
              <th>Time</th>
              <th>Session ID</th>
              <th>Destination URL</th>
              <th>Page ID</th>
              <th>Page Path</th>
              <th>Page Name</th>
            </tr>
          </thead>
          <tbody>
            {profileDetails.map((detail) => (
              <tr key={detail.timeStamp}>
                <td>{detail.profileId}</td>
                <td>{detail.eventType}</td>
                <td>{new Date(detail.timeStamp).toLocaleString()}</td>
                <td>{detail.sessionId}</td>
                <td>{detail.target?.properties?.pageInfo?.destinationURL || 'N/A'}</td>
                <td>{detail.target?.properties?.pageInfo?.pageID || 'N/A'}</td>
                <td>{detail.target?.properties?.pageInfo?.pagePath || 'N/A'}</td>
                <td>{detail.target?.properties?.pageInfo?.pageName || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Session Details</h2>
      {sessionDetails.length === 0 ? (
        <p>No session details found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Operating System</th>
              <th>Device Category</th>
              <th>User Agent</th>
              <th>Country</th>
              <th>Duration (minutes)</th>
            </tr>
          </thead>
          <tbody>
            {sessionDetails.map((session) => (
              <tr key={session.itemId}>
                <td>{session.itemId}</td>
                <td>{session.properties.operatingSystemFamily || 'N/A'}</td>
                <td>{session.properties.deviceCategory || 'N/A'}</td>
                <td>{session.properties.userAgentName || 'N/A'}</td>
                <td>{session.properties.countryAndCity || 'N/A'}</td>
                <td>{(session.duration / 60000).toFixed(2)}</td> {/* Convert milliseconds to minutes */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>User Comments</h2>
      {Object.keys(userProfile).length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Comment Post ID</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{userProfile.comment_post_ID || 'N/A'}</td>
              <td>{userProfile.author || 'N/A'}</td>
              <td>{userProfile.rating || 'N/A'}</td>
              <td>{userProfile.comment || 'N/A'}</td>
              <td>{userProfile.email || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProfileDetail;


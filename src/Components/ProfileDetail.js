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
  const [comments, setComments] = useState([]);
  const [sales, setSales] = useState([]);
  const [profilePage, setProfilePage] = useState(1);
  const [sessionPage, setSessionPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const [profileTotalPages, setProfileTotalPages] = useState(0);
  const [sessionTotalPages, setSessionTotalPages] = useState(0);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [salesTotalPages, setSalesTotalPages] = useState(0);
  const [activeSection, setActiveSection] = useState('profile');

  const ITEMS_PER_PAGE = 10;

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
            limit: 1000,
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
        const sortedData = (data.list || []).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setProfileDetails(sortedData);
        setProfileTotalPages(Math.ceil(sortedData.length / ITEMS_PER_PAGE));
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
        const sortedSessions = (data.list || []).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setSessionDetails(sortedSessions);
        setSessionTotalPages(Math.ceil(sortedSessions.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching session details:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch('https://cdp.qilinsa.com:9443/cxs/events/search', {
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
              type: 'booleanCondition',
              parameterValues: {
                operator: 'and',
                subConditions: [
                  {
                    type: 'profilePropertyCondition',
                    parameterValues: {
                      propertyName: 'profileId',
                      comparisonOperator: 'equals',
                      propertyValue: id
                    }
                  },
                  {
                    type: 'eventPropertyCondition',
                    parameterValues: {
                      propertyName: 'eventType',
                      comparisonOperator: 'equals',
                      propertyValue: 'comment'
                    }
                  }
                ]
              }
            }
          })
        });
        const data = await response.json();
        const sortedComments = (data.list || []).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setComments(sortedComments);
        setCommentsTotalPages(Math.ceil(sortedComments.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchSales = async () => {
      try {
        const response = await fetch('https://cdp.qilinsa.com:9443/cxs/events/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          },
          body: JSON.stringify({
            sortby: 'timeStamp:desc',
            offset: 0,
            limit: 20,
            condition: {
              type: 'booleanCondition',
              parameterValues: {
                operator: 'and',
                subConditions: [
                  {
                    type: 'profilePropertyCondition',
                    parameterValues: {
                      propertyName: 'profileId',
                      comparisonOperator: 'equals',
                      propertyValue: id
                    }
                  },
                  {
                    type: 'eventPropertyCondition',
                    parameterValues: {
                      propertyName: 'eventType',
                      comparisonOperator: 'equals',
                      propertyValue: 'sale'
                    }
                  }
                ]
              }
            }
          })
        });
        const data = await response.json();
        const sortedSales = (data.list || []).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setSales(sortedSales);
        setSalesTotalPages(Math.ceil(sortedSales.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchProfileDetails();
    fetchSessionDetails();
    fetchComments();
    fetchSales();
  }, [id]);

  const getPagedData = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const renderProfileDetails = () => (
    <div>
      <h2>Profile Details</h2>
      {profileDetails.length === 0 ? (
        <p>No profile details found.</p>
      ) : (
        <div>
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
              {getPagedData(profileDetails, profilePage).map((detail) => (
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
          <Pagination
            currentPage={profilePage}
            totalPages={profileTotalPages}
            onPageChange={setProfilePage}
          />
        </div>
      )}
    </div>
  );

  const renderSessionDetails = () => (
    <div>
      <h2>Session Details</h2>
      {sessionDetails.length === 0 ? (
        <p>No session details found.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Operating System</th>
                <th>Time</th>
                <th>Device Category</th>
                <th>User Agent</th>
                <th>Country</th>
                <th>Duration (minutes)</th>
              </tr>
            </thead>
            <tbody>
              {getPagedData(sessionDetails, sessionPage).map((session) => (
                <tr key={session.itemId}>
                  <td>{session.itemId}</td>
                  <td>{session.properties.operatingSystemFamily || 'N/A'}</td>
                  <td>{new Date(session.timeStamp).toLocaleString()}</td>
                  <td>{session.properties.deviceCategory || 'N/A'}</td>
                  <td>{session.properties.userAgentName || 'N/A'}</td>
                  <td>{session.properties.countryAndCity || 'N/A'}</td>
                  <td>{(session.duration / 60000).toFixed(2)}</td> {/* Convert milliseconds to minutes */}
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={sessionPage}
            totalPages={sessionTotalPages}
            onPageChange={setSessionPage}
          />
        </div>
      )}
    </div>
  );

  const renderComments = () => (
    <div>
      <h2>User Comments</h2>
      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Comment ID</th>
                <th>Event Type</th>
                <th>Time</th>
                <th>Comment</th>
                <th>email</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {getPagedData(comments, commentsPage).map((comment) => (
                <tr key={comment.itemId}>
                  <td>{comment.properties.comment_post_ID}</td>
                  <td>{comment.eventType}</td>
                  <td>{new Date(comment.timeStamp).toLocaleString()}</td>
                  <td>{comment.properties.comment || 'N/A'}</td>
                  <td>{comment.properties.email || 'N/A'}</td>
                  <td>{comment.properties.author || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={commentsPage}
            totalPages={commentsTotalPages}
            onPageChange={setCommentsPage}
          />
        </div>
      )}
    </div>
  );

  const renderSales = () => (
    <div>
      <h2>Sales</h2>
      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Order Number</th>
                <th>Event Type</th>
                <th>Time</th>
                <th>Order Date</th>
                <th>Payment Method</th>
                <th>Billing First Name</th>
                <th>Billing Last Name</th>
                <th>Billing Email</th>
                <th>Billing Address</th>
                <th>Billing City</th>
                <th>Products</th>
                <th>Quantities</th>
                <th>Subtotals</th>
                <th>Order Total</th>
              </tr>
            </thead>
            <tbody>
              {getPagedData(sales, salesPage).map((sale) => (
                <tr key={sale.itemId}>
                  <td>{sale.itemId}</td>
                  <td>{sale.properties.orderNumber || 'N/A'}</td>
                  <td>{sale.eventType}</td>
                  <td>{new Date(sale.timeStamp).toLocaleString()}</td>
                  <td>{sale.properties.orderDate || 'N/A'}</td>
                  <td>{sale.properties.paymentMethod || 'N/A'}</td>
                  <td>{sale.properties.billing_first_name || 'N/A'}</td>
                  <td>{sale.properties.billing_last_name || 'N/A'}</td>
                  <td>{sale.properties.billing_email || 'N/A'}</td>
                  <td>{sale.properties.billing_address_1 || 'N/A'}</td>
                  <td>{sale.properties.billing_city || 'N/A'}</td>
                  <td colSpan="3">
                    {sale.properties.productNames && sale.properties.productNames.length > 0 ? (
                      <table className="nested-table">
                        <tbody>
                          {sale.properties.productNames.map((product, index) => (
                            <tr key={index}>
                              <td>{product}</td>
                              <td>{sale.properties.productQuantities[index] || 'N/A'}</td>
                              <td>{sale.properties.productSubtotals[index] ? `${sale.properties.productSubtotals[index]} CFA` : 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      'N/A'
                    )}
                  </td>
                <td> <center>{sale.properties.orderTotal || 'N/A'}</center></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={salesPage}
            totalPages={salesTotalPages}
            onPageChange={setSalesPage}
          />
        </div>
      )}
    </div>
  );
  

  return (
    <div className="profile-detail">
      <nav className="navbar">
        <button onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>Profile Details</button>
        <button onClick={() => setActiveSection('session')} className={activeSection === 'session' ? 'active' : ''}>Session Details</button>
        <button onClick={() => setActiveSection('comments')} className={activeSection === 'comments' ? 'active' : ''}>User Comments</button>
        <button onClick={() => setActiveSection('sales')} className={activeSection === 'sales' ? 'active' : ''}>Sales</button>
      </nav>
      {activeSection === 'profile' && renderProfileDetails()}
      {activeSection === 'session' && renderSessionDetails()}
      {activeSection === 'comments' && renderComments()}
      {activeSection === 'sales' && renderSales()}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handleClick = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="pagination">
      <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}

export default ProfileDetail;







// const renderSales = () => (
//   <div>
//     <h2>Sales</h2>
//     {sales.length === 0 ? (
//       <p>No sales found.</p>
//     ) : (
//       <div>
//         <table>
//           <thead>
//             <tr>
//               <th>Sale ID</th>
//               <th>Event Type</th>
//               <th>Time</th>
//               <th>Order Number</th>
//               <th>Order Date</th>
//               <th>Order Total</th>
//               <th>Payment Method</th>
//               <th>Billing First Name</th>
//               <th>Billing Last Name</th>
//               <th>Billing Email</th>
//               <th>Products</th>
//               <th>Quantities</th>
//               <th>Subtotals</th>
//             </tr>
//           </thead>
//           <tbody>
//             {getPagedData(sales, salesPage).map((sale) => (
//               <tr key={sale.itemId}>
//                 <td>{sale.itemId}</td>
//                 <td>{sale.eventType}</td>
//                 <td>{new Date(sale.timeStamp).toLocaleString()}</td>
//                 <td>{sale.properties.orderNumber || 'N/A'}</td>
//                 <td>{sale.properties.orderDate || 'N/A'}</td>
//                 <td>{sale.properties.orderTotal || 'N/A'}</td>
//                 <td>{sale.properties.paymentMethod || 'N/A'}</td>
//                 <td>{sale.properties.billing_first_name || 'N/A'}</td>
//                 <td>{sale.properties.billing_last_name || 'N/A'}</td>
//                 <td>{sale.properties.billing_email || 'N/A'}</td>
//                 <td>
//                   {sale.properties.productNames && sale.properties.productNames.length > 0
//                     ? sale.properties.productNames.join(', ')
//                     : 'N/A'}
//                 </td>
//                 <td>
//                   {sale.properties.productQuantities && sale.properties.productQuantities.length > 0
//                     ? sale.properties.productQuantities.join(', ')
//                     : 'N/A'}
//                 </td>
//                 <td>
//                   {sale.properties.productSubtotals && sale.properties.productSubtotals.length > 0
//                     ? sale.properties.productSubtotals.map(subtotal => `${subtotal} CFA`).join(', ')
//                     : 'N/A'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <Pagination
//           currentPage={salesPage}
//           totalPages={salesTotalPages}
//           onPageChange={setSalesPage}
//         />
//       </div>
//     )}
//   </div>
// );

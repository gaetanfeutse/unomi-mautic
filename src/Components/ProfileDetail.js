import '../ProfileDetail.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function ProfileDetail() {
  const { id } = useParams();
  const [profileDetails, setProfileDetails] = useState([]);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [comments, setComments] = useState([]);
  const [sales, setSales] = useState([]);
  const [emailInfos, setEmailInfos] = useState([]);
  const [formInfos, setFormInfos] = useState([]);
  const [profilePage, setProfilePage] = useState(1);
  const [sessionPage, setSessionPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const [emailInfosPage, setEmailInfosPage] = useState(1);
  const [formInfosPage, setFormInfosPage] = useState(1);
  const [profileTotalPages, setProfileTotalPages] = useState(0);
  const [sessionTotalPages, setSessionTotalPages] = useState(0);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [salesTotalPages, setSalesTotalPages] = useState(0);
  const [emailInfosTotalPages, setEmailInfosTotalPages] = useState(0);
  const [formInfosTotalPages, setFormInfosTotalPages] = useState(0);
  const [activeSection, setActiveSection] = useState('profile');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDatee, setStartDatee] = useState('');
  const [endDatee, setEndDatee] = useState('');
  const [frequency, setFrequency] = useState(null);
  const ITEMS_PER_PAGE = 10;

  const calculateTotalSales = () => {
    return sales.reduce((total, sale) => {
      const orderTotal = sale.properties.orderTotal ? parseFloat(sale.properties.orderTotal.replace(/,/g, '')) : 0;
      return total + orderTotal;
    }, 0);
  };

  const calculateTotalProducts = (quantities) => {
    return quantities.reduce((total, quantity) => total + Number(quantity), 0);
  };

  const calculateTotalOrders = (sales) => {
    return sales.length;
  };  

//function to filter sales on a particular periode
const filterSalesByDateRange = () => {
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.timeStamp);
    const start = startDatee ? new Date(startDatee) : null;
    const end = endDatee ? new Date(endDatee) : null;

    // Normalize the dates to ignore the time component
    const saleDateOnly = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());
    const startOnly = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
    const endOnly = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null;

    if (startOnly && endOnly) {
      return saleDateOnly >= startOnly && saleDateOnly <= endOnly;
    } else if (startOnly) {
      return saleDateOnly >= startOnly;
    } else if (endOnly) {
      return saleDateOnly <= endOnly;
    } else {
      return true; // If no date is selected, return all sales
    }
  });

  if (filteredSales.length === 0) {
    alert('No sales found for the selected date range.');
  } else {
    setSales(filteredSales);
    setSalesTotalPages(Math.ceil(filteredSales.length / ITEMS_PER_PAGE));
  }
};

  


  // Calculating the frequence of purchase

  const calculateSaleFrequency = () => {
    // Step 1: Filter sales within the user-selected date range
    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.timeStamp);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });

    if (filteredSales.length > 0) {
        // Step 2: Sort filteredSales by date
        filteredSales.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

        // Step 3: Get the unique days where sales occurred
        const uniqueSaleDays = Array.from(new Set(filteredSales.map(sale =>
            new Date(sale.timeStamp).toDateString()
        )));

        if (uniqueSaleDays.length > 1) {
            // Step 4: Calculate the number of days between the first and last unique sale day
            const firstSaleDate = new Date(uniqueSaleDays[0]);
            const lastSaleDate = new Date(uniqueSaleDays[uniqueSaleDays.length - 1]);
            const totalDays = (lastSaleDate - firstSaleDate) / (1000 * 60 * 60 * 24)+ 1;

            console.log(totalDays);
            console.log(uniqueSaleDays.length);
            // Step 5: Calculate the frequency
            const frequencyValue = totalDays / (uniqueSaleDays.length - 1);
             
            console.log(frequencyValue);
            // Custom rounding logic
            const roundedFrequency = (frequencyValue % 1) >= 0.4
                ? Math.ceil(frequencyValue)
                : Math.floor(frequencyValue);

            setFrequency(roundedFrequency);
        } else {
            setFrequency('N/A');
        }
    } else {
        setFrequency('N/A');
    }
};

  
  const calculateTotalProductsAll = (sales) => {
    return sales.reduce((total, sale) => {
      // Assurez-vous que les propriétés des produits existent
      const quantities = sale.properties.productQuantities || [];
      return total + quantities.reduce((sum, quantity) => sum + Number(quantity), 0);
    }, 0);
  };

  const calculateAverageSpending = () => {
    const totalSales = calculateTotalSales();
    const totalOrders = calculateTotalOrders(sales);
    return totalOrders === 0 ? 0 : totalSales / totalOrders;
  };
  
  
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

    const fetchEmailInfos = async () => {
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
                      propertyValue: 'emailInfos'
                    }
                  }
                ]
              }
            }
          })
        });
        const data = await response.json();
        const sortedEmailInfos = (data.list || []).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setEmailInfos(sortedEmailInfos);
        setEmailInfosTotalPages(Math.ceil(sortedEmailInfos.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching emailInfos:', error);
      }
    };

    const fetchFormInfos = async () => {
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
                      propertyValue: 'formInfos'
                    }
                  }
                ]
              }
            }
          })
        });
        const data = await response.json();
        const sortedformInfos = (data.list || []).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setFormInfos(sortedformInfos);
        setFormInfosTotalPages(Math.ceil(sortedformInfos.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching formInfos:', error);
      }
    };

    fetchProfileDetails();
    fetchSessionDetails();
    fetchComments();
    fetchSales();
    fetchEmailInfos();
    fetchFormInfos();
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
                <th>Rating</th>
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
                  <td>{comment.properties.rating}</td>
                  <td>{new Date(comment.timeStamp).toLocaleString()}</td>
                  <td>{comment.properties.comment || 'N/A'}</td>
                  <td>{comment.properties.email1 || 'N/A'}</td>
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
          {/* Afficher le nombre total de commandes ici */}
          <p><strong>Total Number of Orders:</strong> {calculateTotalOrders(sales)}</p>
           {/* Afficher la somme totale des produits ici */}
          <p><strong>Total Number of Products:</strong> {calculateTotalProductsAll(sales)}</p>
          {/* Afficher la somme totale ici */}
          <p><strong>Total Sales Amount:</strong> {calculateTotalSales().toLocaleString('fr-FR')} CFA</p>
         {/* Afficher la valeur moyenne des dépenses ici */}
         <p><strong>Average Spending per Order:</strong> {calculateAverageSpending().toLocaleString('fr-FR')} CFA</p>
         <div className="date-interval">
            <h3>Calculate purchase Frequency</h3>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <button onClick={calculateSaleFrequency}>Calculate Frequency</button>
            {frequency !== null && (
              <p>Purchase Every {frequency} days</p>
            )}
          </div>

          <div className="date-interval">
          <h3>Filter the sale</h3>
  <label>
    Start Date:
    <DatePicker
      selected={startDatee ? new Date(startDatee) : null}
      onChange={(date) => setStartDatee(date)}
      dateFormat="yyyy-MM-dd"
      isClearable
      className="date-input"
    />
  </label>
  <label>
    End Date:
    <DatePicker
      selected={endDatee ? new Date(endDatee) : null}
      onChange={(date) => setEndDatee(date)}
      dateFormat="yyyy-MM-dd"
      isClearable
      className="date-input"
    />
  </label>
  <button onClick={filterSalesByDateRange}>Filter</button>
</div>


          <table>
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Order Number</th>
                <th>Phone</th>
                <th>Time</th>
                <th>Order Date</th>
                <th>Payment Method</th>
                <th>TVA</th>
                <th>Discount</th>
                <th>Billing First Name</th>
                <th>Billing Last Name</th>
                <th>Billing Email</th>
                <th>Billing Address</th>
                <th>Billing City</th>
                <th>Expédition</th>
                <th>shipping city</th>
                <th>Products</th>
                <th>Quantities</th>
                <th>Subtotals</th>
                <th>Order Total</th>
                <th>Total Products</th>
              </tr>
            </thead>
            <tbody>
              {getPagedData(sales, salesPage).map((sale) => (
                <tr key={sale.itemId}>
                  <td>{sale.itemId}</td>
                  <td>{sale.properties.orderNumber || 'N/A'}</td>
                  <td>{sale.properties.phone || 'N/A'}</td>
                  <td>{new Date(sale.timeStamp).toLocaleString()}</td>
                  <td>{sale.properties.orderDate || 'N/A'}</td>
                  <td>{sale.properties.paymentMethod || 'N/A'}</td>
                  <td>{sale.properties.tva || 'N/A'}</td>
                  <td>{`-${sale.properties.remise}` || 'N/A'}</td>
                  <td>{sale.properties.billing_first_name || 'N/A'}</td>
                  <td>{sale.properties.billing_last_name || 'N/A'}</td>
                  <td>{sale.properties.billing_email || 'N/A'}</td>
                  <td>{sale.properties.billing_address_1 || 'N/A'}</td>
                  <td>{sale.properties.billing_city || 'N/A'}</td>
                  <td>{sale.properties.expedition|| 'N/A'}</td>
                  <td>{sale.properties.shipping_city|| 'N/A'}</td>
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
                <td>{calculateTotalProducts(sale.properties.productQuantities || [])}</td>
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

  const renderEmailInfos = () => (
    <div>
      <h2>User Email Action</h2>
      {emailInfos.length === 0 ? (
        <p>No Email Action found.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Email Send Time</th>
                <th>Email Open Time</th>
                <th>Email Subject</th>
              </tr>
            </thead>
            <tbody>
              {getPagedData(emailInfos, emailInfosPage).map((emailInfos) => (
                <tr key={emailInfos.itemId}>
                  <td>{emailInfos.properties.sendEmailTime ? new Date(emailInfos.properties.sendEmailTime).toLocaleString('fr-FR', { timeZone: 'UTC' }) : 'N/A'}</td>
                  <td>{emailInfos.properties.openEmailTime ? new Date(emailInfos.properties.openEmailTime).toLocaleString('fr-FR', { timeZone: 'UTC' }) : 'N/A'}</td>
                  <td>{emailInfos.properties.emailSubject || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={emailInfosPage}
            totalPages={emailInfosTotalPages}
            onPageChange={setEmailInfosPage}
          />
        </div>
      )}
    </div>
  );

  const renderFormInfos = () => (
    <div>
      <h2>User Email Action</h2>
      {formInfos.length === 0 ? (
        <p>No Form Action found.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Form Name</th>
                <th>Form Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {getPagedData(formInfos, formInfosPage).map((formInfos) => (
                <tr key={formInfos.itemId}>
                  <td>{formInfos.properties.formName || 'N/A'}</td>
                  <td>{formInfos.properties.formDateSubmited ? new Date(formInfos.properties.formDateSubmited).toLocaleString('fr-FR', { timeZone: 'UTC' }) : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={formInfosPage}
            totalPages={formInfosTotalPages}
            onPageChange={setFormInfosPage}
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
        <button onClick={() => setActiveSection('emailInfos')} className={activeSection === 'emailInfos' ? 'active' : ''}>User Email Action</button>
        <button onClick={() => setActiveSection('formInfos')} className={activeSection === 'formInfos' ? 'active' : ''}>User Form Action</button>
      </nav>
      {activeSection === 'profile' && renderProfileDetails()}
      {activeSection === 'session' && renderSessionDetails()}
      {activeSection === 'comments' && renderComments()}
      {activeSection === 'sales' && renderSales()}
      {activeSection === 'emailInfos' && renderEmailInfos()}
      {activeSection === 'formInfos' && renderFormInfos()}
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
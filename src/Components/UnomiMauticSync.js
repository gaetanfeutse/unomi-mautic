import React, { useEffect, useState } from 'react';

// React component to sync profiles with Mautic
const UnomiMauticSync = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Function to fetch profiles from the Unomi instance
    const fetchProfiles = async () => {
      try {
        console.log('Fetching profiles from Unomi...');
        const response = await fetch('https://cdp.qilinsa.com:9443/cxs/profiles/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('karaf:karaf')
          },
          body: JSON.stringify({
            offset: 0,
            limit: 1000
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profiles: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched profiles:', data.list);
        return data.list;
      } catch (error) {
        console.error('Error fetching profiles:', error);
        return [];
      }
    };

    // Function to send profile data to Mautic
    const sendProfileToMautic = async (profile) => {
      const profileData = {
        firstname: profile.properties.firstName || 'N/A',
        lastname: profile.properties.lastName || 'N/A',
        email: profile.properties.email || 'N/A'
        // orderNumber: profile.properties.orderNumber,
        // orderDate: profile.properties.orderDate,
        // orderTotal: profile.properties.orderTotal,
        // paymentMethod: profile.properties.paymentMethod,
        // productNames: profile.properties.productNames.join(', '),
        // couponCode: profile.properties.couponCode,
        // woocommerceCartNonce: profile.properties.woocommerceCartNonce,
        // total: profile.properties.total,
        // billing_state: profile.properties.billing_state,
        // billing_address_1: profile.properties.billing_address_1,
        // billing_country: profile.properties.billing_country,
        // billing_city: profile.properties.billing_city,
        // billing_company: profile.properties.billing_company,
        // phone: profile.properties.phone,
        // tva: profile.properties.tva,
        // expedition: profile.properties.expedition,
        // remise: profile.properties.remise
      };

      try {
        console.log(`Sending profile ${profile.itemId} to Mautic...`, profileData);
        const response = await fetch('https://marketing.qilinsa.com/api/contacts/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('gaetan.feutse:Qilinsa237@4321?')
          },
          body: JSON.stringify(profileData)
        });

        if (response.ok) {
          console.log(`Profile ${profile.itemId} sent to Mautic successfully.`);
        } else {
          console.error(`Failed to send profile ${profile.itemId} to Mautic: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error sending profile ${profile.itemId} to Mautic:`, error);
      }
    };

    // Function to synchronize profiles
    const syncProfiles = async () => {
      console.log('Starting profile synchronization...');
      const fetchedProfiles = await fetchProfiles();
      const filteredProfiles = fetchedProfiles.filter(
<<<<<<< HEAD
        (profile) => profile.properties.orderDate && profile.properties.email
=======
        (profile) => profile.properties.orderDate && profile.properties.billing_email
>>>>>>> main
      );

      if (filteredProfiles.length === 0) {
        console.log('No profiles found with the specified criteria.');
      } else {
        console.log('Filtered profiles:', filteredProfiles);
        setProfiles(filteredProfiles);

        for (const profile of filteredProfiles) {
          await sendProfileToMautic(profile);
        }
      }
    };

    syncProfiles();
  }, []); // Empty dependency array ensures this runs only once when the component mounts.

  return (
    <div>
      <h1>Unomi to Mautic Sync</h1>
      <p>Synced {profiles.length} profiles with Mautic.</p>
    </div>
  );
};

export default UnomiMauticSync;



// import React, { useEffect, useCallback } from 'react';

// const UnomiToMauticSync = () => {
//   // Function to fetch profiles from the Unomi instance
//   const fetchProfiles = useCallback(async () => {
//     try {
//       const response = await fetch('https://cdp.qilinsa.com:9443/cxs/profiles/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Basic ' + btoa('karaf:karaf'),
//         },
//         body: JSON.stringify({
//           offset: 0,
//           limit: 1000,
//         }),
//       });

//       const data = await response.json();

//       // Filter profiles with the scope name "example" and an email address
//       const filteredProfiles = data.list.filter(profile => 
//         profile.scope === 'unomi-tracker-bat' && profile.properties.billing_email
//       );

//       // Send filtered profiles to Mautic
//       filteredProfiles.forEach(profile => sendProfileToMautic(profile));

//     } catch (error) {
//       console.error('Error fetching profiles:', error);
//     }
//   }, []);

//   // Function to send a profile to Mautic
//   const sendProfileToMautic = async (profile) => {
//     const mauticData = {
//       firstname: profile.properties.billing_first_name,
//       lastname: profile.properties.billing_last_name,
//       email: profile.properties.billing_email,
//       ipAddress: '', // Add logic to retrieve IP address if needed
//       overwriteWithBlank: true,
//       // Add additional data mapping as needed
//       orderNumber: profile.properties.orderNumber,
//       orderDate: profile.properties.orderDate,
//       orderTotal: profile.properties.orderTotal,
//       paymentMethod: profile.properties.paymentMethod,
//       productNames: profile.properties.productNames.join(', '),
//       couponCode: profile.properties.couponCode,
//       woocommerceCartNonce: profile.properties.woocommerceCartNonce,
//       total: profile.properties.total,
//       billing_last_name: profile.properties.billing_last_name,
//       billing_first_name: profile.properties.billing_first_name,
//       billing_state: profile.properties.billing_state,
//       billing_address_1: profile.properties.billing_address_1,
//       billing_email: profile.properties.billing_email,
//       billing_country: profile.properties.billing_country,
//       billing_city: profile.properties.billing_city,
//       billing_company: profile.properties.billing_company,
//       phone: profile.properties.phone,
//       tva: profile.properties.tva,
//       expedition: profile.properties.expedition,
//       remise: profile.properties.remise,
//     };

//     try {
//       const response = await fetch('https://marketing.qilinsa.com/api/contacts/new', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Basic ' + btoa('gaetan.feutse:Qilinsa237@4321?'),
//         },
//         body: JSON.stringify(mauticData),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to send profile to Mautic: ${response.statusText}`);
//       }

//       console.log('Profile successfully sent to Mautic:', profile);

//     } catch (error) {
//       console.error('Error sending profile to Mautic:', error);
//     }
//   };

//   // Fetch profiles on component mount
//   useEffect(() => {
//     fetchProfiles();
//   }, [fetchProfiles]);

//   return (
//     <div>
//       <h2>Unomi to Mautic Synchronization</h2>
//       <p>Profiles with scope "example" are being synchronized with Mautic.</p>
//     </div>
//   );
// };

// export default UnomiToMauticSync;













// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// function MauticConnector() {
//   const { id } = useParams();
//   const [profileDetails, setProfileDetails] = useState({});
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalSalesAmount, setTotalSalesAmount] = useState(0);
//   const [averageSpending, setAverageSpending] = useState(0);

//   useEffect(() => {
//     fetchProfileDetails();
//   }, [id]);

//   const fetchProfileDetails = async () => {
//     try {
//       const response = await fetch(`https://cdp.qilinsa.com:9443/cxs/profiles/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Basic ' + btoa('karaf:karaf'),
//         },
//       });

//       const profileData = await response.json();

//       // Check if the profile scope name is "unomi-tracker-bat"
//       if (profileData.scope === 'unomi-tracker-bat') {
//         setProfileDetails(profileData);

//         // Calculate totals based on sales data in the profile
//         const salesData = profileData.properties.sales || [];
//         const totalOrders = salesData.length;
//         const totalProducts = salesData.reduce((acc, sale) => acc + sale.quantity, 0);
//         const totalSalesAmount = salesData.reduce((acc, sale) => acc + parseFloat(sale.orderTotal.replace(/,/g, '')), 0);
//         const averageSpending = totalOrders > 0 ? totalSalesAmount / totalOrders : 0;

//         setTotalOrders(totalOrders);
//         setTotalProducts(totalProducts);
//         setTotalSalesAmount(totalSalesAmount);
//         setAverageSpending(averageSpending);

//         // Send data to Mautic
//         sendProfileToMautic({
//           profileId: id,
//           totalOrders,
//           totalProducts,
//           totalSalesAmount,
//           averageSpending,
//           firstName: profileData.firstName,
//           lastName: profileData.lastName,
//           email: profileData.email,
//           sessionData: profileData.sessions, // Include session data if needed
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching profile details:', error);
//     }
//   };

//   const sendProfileToMautic = async (profileData) => {
//     const mauticData = {
//       firstname: profileData.firstName,
//       lastname: profileData.lastName,
//       email: profileData.email,
//       totalOrders: profileData.totalOrders,
//       totalProducts: profileData.totalProducts,
//       totalSalesAmount: profileData.totalSalesAmount,
//       averageSpending: profileData.averageSpending,
//       ipAddress: '127.0.0.1', // Placeholder, replace with actual IP if needed
//       overwriteWithBlank: true,
//     };

//     try {
//       const response = await fetch('https://marketing.qilinsa.com//api/contacts/new', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Basic ' + btoa('gaetan.feutse:Qilinsa237@4321?'),
//         },
//         body: JSON.stringify(mauticData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send profile to Mautic');
//       }

//       const responseData = await response.json();
//       console.log('Mautic contact created/updated:', responseData);
//     } catch (error) {
//       console.error('Error sending profile to Mautic:', error);
//     }
//   };

//   return <div>Mautic Connector running...</div>;
// }

// export default MauticConnector;










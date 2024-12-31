// import React, { useState } from 'react';
// import Header from 'components/Headers/Header';
// import { Button } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';  
// import { toast } from 'sonner';

// const Settings = () => {
//   const [activeAccordion, setActiveAccordion] = useState(1);
//   const [phoneId, setPhoneId] = useState('');
//   const [accountId, setAccountId] = useState('');
//   const [callbackUrl, setCallbackUrl] = useState('');
//   const [accessToken, setAccessToken] = useState('');
//   const navigate = useNavigate();

//   const companyId = location.state?.companyId;


//   useEffect(() => {
//     if (!companyId) {
//       toast.error('Company ID is missing. Please select a company first.');
//       navigate('/admin/dashboard');
//     }
//   }, [companyId, navigate]);

//   const toggleAccordion = (index) => {
//     if (activeAccordion === index) {
//       setActiveAccordion(null);
//     } else {
//       setActiveAccordion(index);
//     }
//   };

// const handleSaveConfiguration = () => {
//   if (phoneId && accountId) {
//     sessionStorage.setItem("phoneId", phoneId);
//     sessionStorage.setItem("accountId", accountId);

//     toast.success("Configuration saved successfully!");
//     navigate("/admin/chats"); 
//   } else {
//     toast.error("Please complete your configuration.");
//   }
// };




// const handleSubmit = async () => {
//   if (phoneId && accountId && callbackUrl && accessToken) {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Authorization token missing. Please log in again.');
//         return;
//       }

//       if (!companyId) {
//         toast.error('Company ID missing. Please try again.');
//         return;
//       }

//       const response = await axios.post(
//         'https://codozap-e04e12b02929.herokuapp.com/api/v1/configuration/save-configuration',
//         {
//           companyId,
//           phoneNumberId: phoneId,
//           whatsappBusinessAccountId: accountId,
//           callbackUrl: callbackUrl,
//           accessToken: accessToken,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (response.data.success) {
//         navigate('/admin/chats', { 
//           state: { 
//             whatsAppView: true,
//             companyId: companyId,
//             config: response.data.data
//           } 
//         });
//         toast.success("Configuration saved successfully!");
//       } else {
//         toast.error('Configuration failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error saving configuration:', error);
//       toast.error('Configuration failed. Please try again.');
//     }
//   } else {
//     toast.error('Please fill in all fields.');
//   }
// };

//   return (
//     <div>
//       <Header />
//       <div className="settings-header">
//         <h2>Settings</h2>
//         <h4>Show all company configurations</h4>
//       </div>

//       {/* Accordion Section */}
//       <div className="accordion-container">
//         {/* Accordion Item #1: Get your Account ID and Phone number ID */}
//         <div className="accordion-item">
//           <div className="accordion-header" onClick={() => toggleAccordion(1)}>
//             <h5 className={`accordion-button ${activeAccordion === 1 ? 'active' : ''}`}>
//               Get your Account ID and Phone number ID
//             </h5>
//             <span className={`arrow-icon ${activeAccordion === 1 ? 'rotate' : ''}`}>&#9660;</span>
//           </div>
//           {activeAccordion === 1 && (
//             <div className="accordion-body">
//               <div className="input-container">
//                 <div className="form-group">
//                   <label htmlFor="phoneId" className="input-label">Phone number ID</label>
//                   <input
//                     type="text"
//                     id="phoneId"
//                     className="input-field"
//                     value={phoneId}
//                     onChange={(e) => setPhoneId(e.target.value)}
//                     placeholder=""
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="accountId" className="input-label">WhatsApp Business Account ID</label>
//                   <input
//                     type="text"
//                     id="accountId"
//                     className="input-field"
//                     value={accountId}
//                     onChange={(e) => setAccountId(e.target.value)}
//                     placeholder=""
//                   />
//                 </div>
//                 {/* <Button className="submit-button" onClick={handleSaveConfiguration}>
//                   Submit
//                 </Button> */}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Accordion Item #2: Call Back URL */}
//         <div className="accordion-item">
//           <div className="accordion-header" onClick={() => toggleAccordion(2)}>
//             <h5 className={`accordion-button ${activeAccordion === 2 ? 'active' : ''}`}>
//               Call Back URL
//             </h5>
//             <span className={`arrow-icon ${activeAccordion === 2 ? 'rotate' : ''}`}>&#9660;</span>
//           </div>
//           {activeAccordion === 2 && (
//             <div className="form-content">
//               <input
//                 type="text"
//                 className="access-field"
//                 placeholder="Enter your Callback URL"
//                 value={callbackUrl}
//                 onChange={(e) => setCallbackUrl(e.target.value)}
//               />
//               {/* <Button className="save-button" onClick={handleSubmit}>
//                 Submit
//               </Button> */}
//             </div>
//           )}
//         </div>

//         {/* Accordion Item #3: Get your permanent access token */}
//         <div className="accordion-item">
//           <div className="accordion-header" onClick={() => toggleAccordion(3)}>
//             <h5 className={`accordion-button ${activeAccordion === 3 ? 'active' : ''}`}>
//               Get your permanent access token
//             </h5>
//             <span className={`arrow-icon ${activeAccordion === 3 ? 'rotate' : ''}`}>&#9660;</span>
//           </div>
//           {activeAccordion === 3 && (
//             <div className="form-content ">
//               <div className="center-text">Enter Your Access Token Here.</div>
//               <input
//                 type="text"
//                 className="access-field"
//                 placeholder=""
//                 value={accessToken}
//                 onChange={(e) => setAccessToken(e.target.value)}
//               />
//               <Button className="save-button mb-3" onClick={handleSubmit}>
//                 Save Configuration
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Inline CSS */}
//       <style jsx>{`
//         .settings-header {
//           text-align: left;
//           margin: 20px;
//         }

//         .settings-header h2 {
//           margin-bottom: 10px;
//         }

//         .settings-header h4 {
//           margin-bottom: 30px;
//         }

//         .accordion-container {
//           width: 80%;
//           max-width: 100%;
//           margin: 0 auto;
//           padding: 20px;
//         }

//         .accordion-item {
//           margin-bottom: 10px;
//           border: 1px solid #ddd;
//           border-radius: 4px;
//         }

//         .accordion-header {
//           background-color: #f7f7f7;
//           padding: 10px;
//           cursor: pointer;
//           border-radius: 4px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .accordion-button {
//           font-size: 18px;
//           font-weight: bold;
//           color: #333;
//           flex-grow: 1;
//         }

//         .accordion-button.active {
//           color: #007bff;
//         }

//         .arrow-icon {
//           margin-left: 10px;
//           transition: transform 0.3s ease-in-out;
//         }

//         .arrow-icon.rotate {
//           transform: rotate(180deg);
//         }

//         .accordion-body {
//           padding: 15px;
//           background-color: #fff;
//           border-top: 1px solid #ddd;
//           max-height: 0;
//           opacity: 0;
//           overflow: hidden;
//           transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
//         }

//         .accordion-body:not(:empty) {
//           max-height: 300px;
//           opacity: 1;
//         }

//         .accordion-body:empty {
//           max-height: 0;
//           opacity: 0;
//         }

//         .form-content {
//           margin-top: 20px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           width: 100%;
//         }

//         .center-text {
//           text-align: center;
//           font-size: 16px;
//           margin-bottom: 10px;
//         }

//         .input-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           width: 100%;
//         }

//         .form-group {
//           width: 100%;
//           margin-bottom: 10px;
//         }

//         .input-label {
//           display: block;
//           font-size: 14px;
//           margin-bottom: 5px;
//         }

//         .input-field,
//         .access-field {
//           width: 100%;
//           padding: 10px;
//           font-size: 16px;
//           border-radius: 4px;
//           border: 1px solid #ddd;
//         }

//         .submit-button,
//         .save-button {
//           margin-top: 15px;
//           padding: 10px 20px;
//           font-size: 16px;
//           background-color: #007bff;
//           border: none;
//           border-radius: 4px;
//           color: white;
//           cursor: pointer;
//         }

//         .submit-button:hover,
//         .save-button:hover {
//           background-color: #0056b3;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Settings;






import React, { useState, useEffect } from 'react';
import Header from 'components/Headers/Header';
import { Button } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';  
import { toast } from 'sonner';

const Settings = () => {
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [phoneId, setPhoneId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract companyId from location state
  const companyId = location.state?.companyId;

  // Check if companyId exists on component mount
  useEffect(() => {
    if (!companyId) {
      toast.error('Company ID is missing. Please select a company first.');
      navigate('/admin/dashboard');
    }
  }, [companyId, navigate]);

  const toggleAccordion = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  const handleSubmit = async () => {
    if (!companyId) {
      toast.error('Company ID is missing. Please try again.');
      navigate('/admin/dashboard');
      return;
    }

    if (phoneId && accountId && callbackUrl && accessToken) {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          toast.error('Authorization token is missing. Please log in again.');
          navigate('/auth/login');
          return;
        }

        const response = await axios.post(
          'http://192.168.0.109:25483/api/v1/configuration/save-configuration',
          {
            companyId,
            phoneNumberId: phoneId,
            whatsappBusinessAccountId: accountId,
            callbackUrl: callbackUrl,
            accessToken: accessToken,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          navigate('/admin/chats', { 
            state: { 
              whatsAppView: true,
              companyId: companyId,
              config: response.data.data
            } 
          });
          toast.success("Configuration saved successfully!");
        } else {
          toast.error(response.data.message || 'Configuration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error saving configuration:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/auth/login');
        } else {
          toast.error(error.response?.data?.message || 'Configuration failed. Please try again.');
        }
      }
    } else {
      toast.error('Please fill in all fields.');
    }
  };

  return (
    <div>
      <Header />
      <div className="settings-header">
        <h2>WhatsApp Configuration</h2>
        <h4>Configure your WhatsApp Business Account</h4>
      </div>

      {/* Accordion Section */}
      <div className="accordion-container">
        {/* Accordion Item #1: Get your Account ID and Phone number ID */}
        <div className="accordion-item">
          <div className="accordion-header" onClick={() => toggleAccordion(1)}>
            <h5 className={`accordion-button ${activeAccordion === 1 ? 'active' : ''}`}>
              Get your Account ID and Phone number ID
            </h5>
            <span className={`arrow-icon ${activeAccordion === 1 ? 'rotate' : ''}`}>&#9660;</span>
          </div>
          {activeAccordion === 1 && (
            <div className="accordion-body">
              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="phoneId" className="input-label">Phone number ID</label>
                  <input
                    type="text"
                    id="phoneId"
                    className="input-field"
                    value={phoneId}
                    onChange={(e) => setPhoneId(e.target.value)}
                    placeholder="Enter your WhatsApp Phone Number ID"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="accountId" className="input-label">WhatsApp Business Account ID</label>
                  <input
                    type="text"
                    id="accountId"
                    className="input-field"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="Enter your WhatsApp Business Account ID"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item #2: Call Back URL */}
        <div className="accordion-item">
          <div className="accordion-header" onClick={() => toggleAccordion(2)}>
            <h5 className={`accordion-button ${activeAccordion === 2 ? 'active' : ''}`}>
              Call Back URL
            </h5>
            <span className={`arrow-icon ${activeAccordion === 2 ? 'rotate' : ''}`}>&#9660;</span>
          </div>
          {activeAccordion === 2 && (
            <div className="accordion-body">
              <div className="form-group">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your Callback URL"
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item #3: Get your permanent access token */}
        <div className="accordion-item">
          <div className="accordion-header" onClick={() => toggleAccordion(3)}>
            <h5 className={`accordion-button ${activeAccordion === 3 ? 'active' : ''}`}>
              Get your permanent access token
            </h5>
            <span className={`arrow-icon ${activeAccordion === 3 ? 'rotate' : ''}`}>&#9660;</span>
          </div>
          {activeAccordion === 3 && (
            <div className="accordion-body">
              <div className="form-group">
                <div className="center-text">Enter Your Access Token Here</div>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your Access Token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <Button 
                  className="save-button mt-3" 
                  color="primary"
                  onClick={handleSubmit}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .settings-header {
          text-align: left;
          margin: 20px;
          padding: 20px;
          background: linear-gradient(to right, #f8f9fa, #e9ecef);
          border-radius: 10px;
        }

        .settings-header h2 {
          margin-bottom: 10px;
          color: #2c3e50;
        }

        .settings-header h4 {
          margin-bottom: 0;
          color: #6c757d;
          font-weight: normal;
        }

        .accordion-container {
          width: 80%;
          max-width: 800px;
          margin: 30px auto;
          padding: 20px;
        }

        .accordion-item {
          margin-bottom: 15px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          overflow: hidden;
        }

        .accordion-header {
          background-color: #f8f9fa;
          padding: 15px 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.3s;
        }

        .accordion-header:hover {
          background-color: #e9ecef;
        }

        .accordion-button {
          margin: 0;
          color: #2c3e50;
          font-weight: 500;
        }

        .accordion-button.active {
          color: #007bff;
        }

        .arrow-icon {
          transition: transform 0.3s;
        }

        .arrow-icon.rotate {
          transform: rotate(180deg);
        }

        .accordion-body {
          padding: 20px;
          background-color: #fff;
        }

        .input-container {
          width: 100%;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          margin-bottom: 8px;
          color: #495057;
          font-weight: 500;
        }

        .input-field {
          width: 100%;
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .input-field:focus {
          outline: none;
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
        }

        .center-text {
          text-align: center;
          margin-bottom: 15px;
          color: #495057;
        }

        .save-button {
          width: 100%;
          padding: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default Settings;

















// import React, { useState, useEffect } from 'react';
// import Header from 'components/Headers/Header';
// import { Button } from 'reactstrap';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';  
// import { toast } from 'sonner';

// const Settings = () => {
//   const [activeAccordion, setActiveAccordion] = useState(1);
//   const [phoneId, setPhoneId] = useState('');
//   const [accountId, setAccountId] = useState('');
//   const [callbackUrl, setCallbackUrl] = useState('');
//   const [accessToken, setAccessToken] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
//   const companyId = location.state?.companyId;

//   useEffect(() => {
//     if (!companyId) {
//       toast.error('Company ID is missing. Please select a company first.');
//       navigate('/admin/dashboard');
//     }
//   }, [companyId, navigate]);

//   const toggleAccordion = (index) => {
//     setActiveAccordion(activeAccordion === index ? null : index);
//   };

//   const handleSubmit = async () => {
//     if (!companyId) {
//       toast.error('Company ID is missing. Please try again.');
//       navigate('/admin/dashboard');
//       return;
//     }

//     if (phoneId && accountId && callbackUrl && accessToken) {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           toast.error('Authorization token is missing. Please log in again.');
//           navigate('/auth/login');
//           return;
//         }

//         const response = await axios.post(
//           'http://192.168.0.109:25483/api/v1/configuration/save-configuration',
//           {
//             companyId,
//             phoneNumberId: phoneId,
//             whatsappBusinessAccountId: accountId,
//             callbackUrl: callbackUrl,
//             accessToken: accessToken,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` }
//           }
//         );

//         if (response.data.success) {
//           navigate('/admin/chats', { 
//             state: { 
//               whatsAppView: true,
//               companyId: companyId,
//               config: {
//                 phoneNumberId: phoneId,
//                 whatsappBusinessAccountId: accountId,
//                 callbackUrl: callbackUrl,
//                 accessToken: accessToken
//               }
//             } 
//           });
//           toast.success("Configuration saved successfully!");
//         } else {
//           toast.error(response.data.message || 'Configuration failed. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error saving configuration:', error);
//         if (error.response?.status === 401) {
//           toast.error('Session expired. Please login again.');
//           navigate('/auth/login');
//         } else {
//           toast.error(error.response?.data?.message || 'Configuration failed. Please try again.');
//         }
//       }
//     } else {
//       toast.error('Please fill in all fields.');
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="settings-header">
//         <h2>WhatsApp Configuration</h2>
//         <h4>Configure your WhatsApp Business Account</h4>
//       </div>

//       {/* Accordion Section */}
//       <div className="accordion-container">
//         {/* Accordion Item #1: Get your Account ID and Phone number ID */}
//         <div className="accordion-item">
//           <div className="accordion-header" onClick={() => toggleAccordion(1)}>
//             <h5 className={`accordion-button ${activeAccordion === 1 ? 'active' : ''}`}>
//               Get your Account ID and Phone number ID
//             </h5>
//             <span className={`arrow-icon ${activeAccordion === 1 ? 'rotate' : ''}`}>&#9660;</span>
//           </div>
//           {activeAccordion === 1 && (
//             <div className="accordion-body">
//               <div className="input-container">
//                 <div className="form-group">
//                   <label htmlFor="phoneId" className="input-label">Phone number ID</label>
//                   <input
//                     type="text"
//                     id="phoneId"
//                     className="input-field"
//                     value={phoneId}
//                     onChange={(e) => setPhoneId(e.target.value)}
//                     placeholder="Enter your WhatsApp Phone Number ID"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="accountId" className="input-label">WhatsApp Business Account ID</label>
//                   <input
//                     type="text"
//                     id="accountId"
//                     className="input-field"
//                     value={accountId}
//                     onChange={(e) => setAccountId(e.target.value)}
//                     placeholder="Enter your WhatsApp Business Account ID"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Accordion Item #2: Call Back URL */}
//         <div className="accordion-item">
//           <div className="accordion-header" onClick={() => toggleAccordion(2)}>
//             <h5 className={`accordion-button ${activeAccordion === 2 ? 'active' : ''}`}>
//               Call Back URL
//             </h5>
//             <span className={`arrow-icon ${activeAccordion === 2 ? 'rotate' : ''}`}>&#9660;</span>
//           </div>
//           {activeAccordion === 2 && (
//             <div className="accordion-body">
//               <div className="form-group">
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="Enter your Callback URL"
//                   value={callbackUrl}
//                   onChange={(e) => setCallbackUrl(e.target.value)}
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Accordion Item #3: Get your permanent access token */}
//         <div className="accordion-item">
//           <div className="accordion-header" onClick={() => toggleAccordion(3)}>
//             <h5 className={`accordion-button ${activeAccordion === 3 ? 'active' : ''}`}>
//               Get your permanent access token
//             </h5>
//             <span className={`arrow-icon ${activeAccordion === 3 ? 'rotate' : ''}`}>&#9660;</span>
//           </div>
//           {activeAccordion === 3 && (
//             <div className="accordion-body">
//               <div className="form-group">
//                 <div className="center-text">Enter Your Access Token Here</div>
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="Enter your Access Token"
//                   value={accessToken}
//                   onChange={(e) => setAccessToken(e.target.value)}
//                 />
//                 <Button 
//                   className="save-button mt-3" 
//                   color="primary"
//                   onClick={handleSubmit}
//                 >
//                   Save Configuration
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         .settings-header {
//           text-align: left;
//           margin: 20px;
//           padding: 20px;
//           background: linear-gradient(to right, #f8f9fa, #e9ecef);
//           border-radius: 10px;
//         }

//         .settings-header h2 {
//           margin-bottom: 10px;
//           color: #2c3e50;
//         }

//         .settings-header h4 {
//           margin-bottom: 0;
//           color: #6c757d;
//           font-weight: normal;
//         }

//         .accordion-container {
//           width: 80%;
//           max-width: 800px;
//           margin: 30px auto;
//           padding: 20px;
//         }

//         .accordion-item {
//           margin-bottom: 15px;
//           border: 1px solid #dee2e6;
//           border-radius: 8px;
//           overflow: hidden;
//         }

//         .accordion-header {
//           background-color: #f8f9fa;
//           padding: 15px 20px;
//           cursor: pointer;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           transition: background-color 0.3s;
//         }

//         .accordion-header:hover {
//           background-color: #e9ecef;
//         }

//         .accordion-button {
//           margin: 0;
//           color: #2c3e50;
//           font-weight: 500;
//         }

//         .accordion-button.active {
//           color: #007bff;
//         }

//         .arrow-icon {
//           transition: transform 0.3s;
//         }

//         .arrow-icon.rotate {
//           transform: rotate(180deg);
//         }

//         .accordion-body {
//           padding: 20px;
//           background-color: #fff;
//         }

//         .input-container {
//           width: 100%;
//         }

//         .form-group {
//           margin-bottom: 20px;
//         }

//         .input-label {
//           display: block;
//           margin-bottom: 8px;
//           color: #495057;
//           font-weight: 500;
//         }

//         .input-field {
//           width: 100%;
//           padding: 12px;
//           border: 1px solid #ced4da;
//           border-radius: 6px;
//           font-size: 14px;
//           transition: border-color 0.3s;
//         }

//         .input-field:focus {
//           outline: none;
//           border-color: #80bdff;
//           box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
//         }

//         .center-text {
//           text-align: center;
//           margin-bottom: 15px;
//           color: #495057;
//         }

//         .save-button {
//           width: 100%;
//           padding: 12px;
//           font-weight: 500;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Settings;


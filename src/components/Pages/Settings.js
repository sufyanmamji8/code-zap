// import React, { useState, useEffect } from 'react';
// import { Button } from 'reactstrap';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';  
// import { toast } from 'sonner';
// import { CONFIGURATION_ENDPOINTS } from 'Api/Constant';

// const Settings = () => {
//   const [activeAccordion, setActiveAccordion] = useState(1);
//   const [phoneId, setPhoneId] = useState('');
//   const [accountId, setAccountId] = useState('');
//   const [callbackUrl, setCallbackUrl] = useState('');
//   const [accessToken, setAccessToken] = useState('');
//   const [hasExistingConfig, setHasExistingConfig] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Extract companyId from location state
//   const companyId = location.state?.companyId;

//   // Fetch existing configuration on component mount
//   useEffect(() => {
//     const fetchConfiguration = async () => {
//       if (!companyId) {
//         toast.error('Company ID is missing. Please select a company first.');
//         navigate('/admin/dashboard');
//         return;
//       }

//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           toast.error('Authorization token is missing. Please log in again.');
//           navigate('/auth/login');
//           return;
//         }

//         const response = await axios.post(
//           CONFIGURATION_ENDPOINTS.CHECK,
//           { companyId },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );

//         if (response.data.success && response.data.data) {
//           const config = response.data.data;
//           setPhoneId(config.phoneNumberId || '');
//           setAccountId(config.whatsappBusinessAccountId || '');
//           setCallbackUrl(config.callbackUrl || '');
//           setAccessToken(config.accessToken || '');
//           setHasExistingConfig(true);
//         }
//       } catch (error) {
//         console.error('Error fetching configuration:', error);
//         if (error.response?.status === 401) {
//           toast.error('Session expired. Please login again.');
//           navigate('/auth/login');
//         } else {
//           toast.error('Failed to fetch configuration. Please try again.');
//         }
//       }
//     };

//     fetchConfiguration();
//   }, [companyId, navigate]);

//   const toggleAccordion = (index) => {
//     if (activeAccordion === index) {
//       setActiveAccordion(null);
//     } else {
//       setActiveAccordion(index);
//     }
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

//         const configData = {
//           companyId,
//           phoneNumberId: phoneId,
//           whatsappBusinessAccountId: accountId,
//           callbackUrl: callbackUrl,
//           accessToken: accessToken,
//         };

//         const endpoint = hasExistingConfig 
//           ? CONFIGURATION_ENDPOINTS.UPDATE
//           : CONFIGURATION_ENDPOINTS.SAVE;

//         const method = hasExistingConfig ? 'put' : 'post';

//         const response = await axios({
//           method,
//           url: endpoint,
//           data: configData,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (response.data.success) {
//           navigate('/admin/chats', { 
//             state: { 
//               whatsAppView: true,
//               companyId: companyId,
//               config: response.data.data
//             } 
//           });
//           toast.success(`Configuration ${hasExistingConfig ? 'updated' : 'saved'} successfully!`);
//         } else {
//           toast.error(response.data.message || `Configuration ${hasExistingConfig ? 'update' : 'save'} failed. Please try again.`);
//         }
//       } catch (error) {
//         console.error('Error saving configuration:', error);
//         if (error.response?.status === 401) {
//           toast.error('Session expired. Please login again.');
//           navigate('/auth/login');
//         } else {
//           toast.error(error.response?.data?.message || `Configuration ${hasExistingConfig ? 'update' : 'save'} failed. Please try again.`);
//         }
//       }
//     } else {
//       toast.error('Please fill in all fields.');
//     }
//   };

//   return (
//     <div>
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







import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';  
import { toast } from 'sonner';
import { CONFIGURATION_ENDPOINTS } from 'Api/Constant';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Settings = () => {
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [phoneId, setPhoneId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [hasExistingConfig, setHasExistingConfig] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  // Extract companyId from location state
  const companyId = location.state?.companyId;

  // Fetch existing configuration on component mount
  useEffect(() => {
    const fetchConfiguration = async () => {
      if (!companyId) {
        toast.error('Company ID is missing. Please select a company first.');
        navigate('/admin/dashboard');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authorization token is missing. Please log in again.');
          navigate('/auth/login');
          setLoading(false);
          return;
        }

        const response = await axios.post(
          CONFIGURATION_ENDPOINTS.CHECK,
          { companyId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success && response.data.data) {
          const config = response.data.data;
          setPhoneId(config.phoneNumberId || '');
          setAccountId(config.whatsappBusinessAccountId || '');
          setCallbackUrl(config.callbackUrl || '');
          setAccessToken(config.accessToken || '');
          setHasExistingConfig(true);
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/auth/login');
        } else {
          toast.error('Failed to fetch configuration. Please try again.');
        }
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchConfiguration();
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

        const configData = {
          companyId,
          phoneNumberId: phoneId,
          whatsappBusinessAccountId: accountId,
          callbackUrl: callbackUrl,
          accessToken: accessToken,
        };

        const endpoint = hasExistingConfig 
          ? CONFIGURATION_ENDPOINTS.UPDATE
          : CONFIGURATION_ENDPOINTS.SAVE;

        const method = hasExistingConfig ? 'put' : 'post';

        const response = await axios({
          method,
          url: endpoint,
          data: configData,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          navigate('/admin/chats', { 
            state: { 
              whatsAppView: true,
              companyId: companyId,
              config: response.data.data
            } 
          });
          toast.success(`Configuration ${hasExistingConfig ? 'updated' : 'saved'} successfully!`);
        } else {
          toast.error(response.data.message || `Configuration ${hasExistingConfig ? 'update' : 'save'} failed. Please try again.`);
        }
      } catch (error) {
        console.error('Error saving configuration:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/auth/login');
        } else {
          toast.error(error.response?.data?.message || `Configuration ${hasExistingConfig ? 'update' : 'save'} failed. Please try again.`);
        }
      }
    } else {
      toast.error('Please fill in all fields.');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <DotLottieReact
          src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
          loop
          autoplay
          style={{ width: "150px", height: "150px" }}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginTop: "7rem" , 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color : "#ffffff",

       }} className="settings-header " >
        <h2 className='text-white'>WhatsApp Configuration</h2>
        <h4 className='text-white'>Configure your WhatsApp Business Account</h4>
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
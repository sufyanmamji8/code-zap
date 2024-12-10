import React, { useState } from 'react';
import Header from 'components/Headers/Header';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Axios to make API calls
import { toast } from 'sonner';

const Settings = () => {
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [phoneId, setPhoneId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  const toggleAccordion = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  // New method to save configuration in sessionStorage
  // New method to save configuration in sessionStorage
const handleSaveConfiguration = () => {
  if (phoneId && accountId) {
    // Store configuration data in sessionStorage
    sessionStorage.setItem("phoneId", phoneId);
    sessionStorage.setItem("accountId", accountId);

    toast.success("Configuration saved successfully!");
    navigate("/admin/chats"); // Redirect to chats page
  } else {
    toast.error("Please complete your configuration.");
  }
};

// Updated handleSubmit function with sessionStorage logic
const handleSubmit = async () => {
  if (phoneId && accountId && callbackUrl && accessToken) {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Authorization token is missing. Please log in again.');
        return;
      }

      const response = await axios.post(
        'http://192.168.0.106:4000/api/v1/configuration/save-configuration',
        {
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
        // Save configuration in sessionStorage after success
        sessionStorage.setItem("phoneId", phoneId);
        sessionStorage.setItem("accountId", accountId);
        sessionStorage.setItem("callbackUrl", callbackUrl);
        sessionStorage.setItem("accessToken", accessToken);

        // Redirect to the chats page if configuration is saved successfully
        navigate('/admin/chats');
      } else {
        alert('Configuration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Configuration failed. Please try again.');
    }
  } else {
    toast.error('Please fill in all fields.');
  }
};


  return (
    <div>
      <Header />
      <div className="settings-header">
        <h2>Settings</h2>
        <h4>Show all company configurations</h4>
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
                    placeholder="Enter Phone number ID"
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
                    placeholder="Enter WhatsApp Account ID"
                  />
                </div>
                <Button className="submit-button" onClick={handleSaveConfiguration}>
                  Submit
                </Button>
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
            <div className="form-content">
              <input
                type="text"
                className="access-field"
                placeholder="Enter your Callback URL"
                value={callbackUrl}
                onChange={(e) => setCallbackUrl(e.target.value)}
              />
              <Button className="save-button" onClick={handleSubmit}>
                Submit
              </Button>
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
            <div className="form-content">
              <div className="center-text">Enter Your Access Token Here.</div>
              <input
                type="text"
                className="access-field"
                placeholder=""
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
              <Button className="save-button" onClick={handleSubmit}>
                Save Access Token
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        .settings-header {
          text-align: left;
          margin: 20px;
        }

        .settings-header h2 {
          margin-bottom: 10px;
        }

        .settings-header h4 {
          margin-bottom: 30px;
        }

        .accordion-container {
          width: 80%;
          max-width: 100%;
          margin: 0 auto;
          padding: 20px;
        }

        .accordion-item {
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .accordion-header {
          background-color: #f7f7f7;
          padding: 10px;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .accordion-button {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          flex-grow: 1;
        }

        .accordion-button.active {
          color: #007bff;
        }

        .arrow-icon {
          margin-left: 10px;
          transition: transform 0.3s ease-in-out;
        }

        .arrow-icon.rotate {
          transform: rotate(180deg);
        }

        .accordion-body {
          padding: 15px;
          background-color: #fff;
          border-top: 1px solid #ddd;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
        }

        .accordion-body:not(:empty) {
          max-height: 300px;
          opacity: 1;
        }

        .accordion-body:empty {
          max-height: 0;
          opacity: 0;
        }

        .form-content {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .center-text {
          text-align: center;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .input-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .form-group {
          width: 100%;
          margin-bottom: 10px;
        }

        .input-label {
          display: block;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .input-field,
        .access-field {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .submit-button,
        .save-button {
          margin-top: 15px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007bff;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
        }

        .submit-button:hover,
        .save-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Settings;

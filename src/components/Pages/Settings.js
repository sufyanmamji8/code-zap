import React, { useState } from 'react';
import Header from 'components/Headers/Header';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [phoneId, setPhoneId] = useState('');
  const [accountId, setAccountId] = useState('');
  const navigate = useNavigate();

  const toggleAccordion = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  const handleSubmit = () => {
    if (phoneId && accountId) {
      navigate('/admin/chats');
    } else {
      alert('Please fill in both fields.');
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
              <div className="center-text"></div>
              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="phoneId" className="input-label">Phone number ID</label>
                  <input
                    type="text"
                    id="phoneId"
                    className="input-field"
                    value={phoneId}
                    onChange={(e) => setPhoneId(e.target.value)}
                    placeholder=""
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
                    placeholder=""
                  />
                </div>
                <Button className="submit-button" onClick={handleSubmit}>
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
              <input type="text" className="access-field" placeholder="Enter your Callback URL" />
              <Button className="save-button">Submit</Button>
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
              <input type="text" className="access-field" placeholder="" />
              <Button className="save-button">Save Access Token</Button>
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
          margin-bottom: 15px;
          width: 80%;
          max-width: 400px;
        }

        .input-label {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .input-field {
          padding: 10px;
          width: 100%;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .submit-button {
          margin-top: 20px;
          width: 60%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        .save-button {
          margin-bottom: 20px;
          margin-top: 20px;
          background-color: #007bff;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .access-field {
          padding: 10px;
          width: 70%;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
};

export default Settings;

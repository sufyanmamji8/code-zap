import React, { useState } from 'react';
import Header from 'components/Headers/Header';

const AgentsAdd = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: '',
  });

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add the submit logic here
    console.log(formData);
  };

  return (
    <div>
      {/* <Header /> */}
      <div className="agents-add-container">
        {/* Heading and Back Button */}
        <div className="heading-container">
          <h2>Create a New Agent</h2>
          <div className="back-button-container">
            <button className="back-button" onClick={() => window.history.back()}>
              &lt; Back
            </button>
          </div>
        </div>

        <div className="sub-heading">
          <h3>Create a New System Agent</h3>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="agent-form">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Choose Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="form-button">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        .agents-add-container {
          padding: 20px;
          overflow-x: hidden; /* Prevent horizontal scroll */
        }

        .heading-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .heading-container h2 {
          margin: 0;
          font-size: 20px;
        }

        .back-button-container button {
          padding: 5px 10px;
          font-size: 14px;
          cursor: pointer;
          background-color: #ff5722; /* Orange color */
          color: white;
          border: none;
          border-radius: 5px;
        }

        .back-button-container button:hover {
          background-color: #e64a19; /* Darker shade of orange on hover */
        }

        .sub-heading h3 {
          margin-top: 10px;
          font-size: 16px;
        }

        .agent-form {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: flex-start;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          width: calc(50% - 10px); /* 2 fields per row */
        }

        .form-field label {
          margin-bottom: 5px;
          font-size: 14px;
        }

        .form-field input,
        .form-field select {
          width: 100%;
          padding: 6px;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .form-button {
          width: 100%;
          margin-top: 15px;
          display: flex;
          justify-content: flex-start; /* Align Save button to the left */
        }

        .save-button {
          padding: 6px 20px; /* Smaller padding for smaller button */
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        }

        .save-button:hover {
          background-color: #45a049;
        }

        /* Ensure form layout is compact and does not cause horizontal scroll */
        body {
          overflow-x: hidden;
        }

        /* Responsive adjustments */
        @media (max-width: 600px) {
          .form-field {
            width: 100%; /* Stack form fields on smaller screens */
          }
          .form-button {
            justify-content: center; /* Center button on smaller screens */
          }
        }
      `}</style>
    </div>
  );
};

export default AgentsAdd;

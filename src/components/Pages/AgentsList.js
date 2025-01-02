import React, { useState } from 'react';
import Header from 'components/Headers/Header';

const AgentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle the search action
  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  return (
    <div>
      {/* <Header /> */}

      {/* Search Bar with Go Button */}
      <div className="search-bar-container">
        <input 
          type="text" 
          value={searchQuery}
          onChange={handleSearchChange} 
          placeholder="Search Agents..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Go</button>
      </div>

      {/* Heading and Subheading */}
      <div className="heading-container">
        <h2>Agents List</h2>
        <h3>Show All System Agents List</h3>
      </div>

      {/* Agents List Table */}
      <div className="table-container">
        <table className="agents-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Example data, replace with dynamic data */}
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>johndoe@example.com</td>
              <td>Active</td>
              <td>
                <button className="action-button">Edit</button>
                <button className="action-button">Delete</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jane Smith</td>
              <td>janesmith@example.com</td>
              <td>Inactive</td>
              <td>
                <button className="action-button">Edit</button>
                <button className="action-button">Delete</button>
              </td>
            </tr>
            {/* Add more rows here */}
          </tbody>
        </table>
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        .search-bar-container {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          margin-top: 20px;
          margin-bottom: 20px;
          padding-left: 10px; /* Adjusted left padding */
        }

        .search-input {
          padding: 10px;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid #ddd;
          width: 250px; /* Slightly smaller width */
        }

        .search-button {
          padding: 10px 15px;
          font-size: 14px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .search-button:hover {
          background-color: #45a049;
        }

        .heading-container {
          margin-left: 15px; /* Reduced margin from left */
        }

        .heading-container h2 {
          font-size: 24px;
          margin: 0;
        }

        .heading-container h3 {
          font-size: 18px;
          color: #555;
          margin-top: 5px;
        }

        .table-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .agents-table {
          width: 95%; /* Ensures the table takes up most of the screen */
          border-collapse: collapse;
        }

        .agents-table th, .agents-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .agents-table th {
          background-color: #f2f2f2;
        }

        .agents-table td {
          background-color: #fff;
        }

        .action-button {
          padding: 6px 12px;
          margin-right: 5px;
          font-size: 14px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .action-button:hover {
          background-color: #0b7dda;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .search-bar-container {
            flex-direction: column;
            gap: 15px;
          }

          .search-input {
            width: 100%;
          }

          .table-container {
            flex-direction: column;
            align-items: center;
          }

          .agents-table {
            width: 100%;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentsList;

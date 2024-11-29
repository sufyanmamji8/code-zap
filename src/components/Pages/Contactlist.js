import React, { useState } from 'react';
import Header from 'components/Headers/Header';
import { Button } from 'reactstrap';

const Contactlist = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <Header />
      
      {/* Search Bar Section */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search contacts"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button className="search-button">Go</Button>
      </div>
      
      {/* Contacts List Section */}
      <div className="contacts-list-section">
        <h2>Contacts List</h2>
        <h4>Show all contacts list</h4>
      </div>
      
      {/* Table Section */}
      <div className="table-container">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Groups</th>
              <th>Phone</th>
              <th>Action</th>
              <th>Start Chat</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows - these can be dynamic */}
            <tr>
              <td>John Doe</td>
              <td>ABC Corp</td>
              <td>Sales</td>
              <td>+1234567890</td>
              <td><Button className="action-button">Edit</Button></td>
              <td><Button className="chat-button">Start Chat</Button></td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>XYZ Ltd</td>
              <td>Marketing</td>
              <td>+9876543210</td>
              <td><Button className="action-button">Edit</Button></td>
              <td><Button className="chat-button">Start Chat</Button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        .search-bar-container {
          display: flex;
          margin: 20px;
          justify-content: flex-start;
          align-items: center;
        }

        .search-bar {
          padding: 8px;
          width: 40%; /* Made the search bar smaller */
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .search-button {
          padding: 8px 15px;
          background-color: #007bff;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          margin-left: 5px; /* Reduced the gap between search bar and button */
        }

        .contacts-list-section {
          margin: 20px;
        }

        .contacts-list-section h2 {
          margin-bottom: 10px;
        }

        .contacts-list-section h4 {
          margin-bottom: 20px;
        }

        .table-container {
          margin: 20px;
          overflow-x: auto; /* Ensures table can be scrolled horizontally */
        }

        .contacts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .contacts-table th, .contacts-table td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .contacts-table th {
          background-color: #f7f7f7;
        }

        .action-button, .chat-button {
          padding: 8px 15px;
          background-color: #007bff;
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }

        .chat-button:hover, .action-button:hover {
          background-color: #0056b3;
        }

        .chat-button {
          background-color: #28a745;
        }

        .chat-button:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
};

export default Contactlist;

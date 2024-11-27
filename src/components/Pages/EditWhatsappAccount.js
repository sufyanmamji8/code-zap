import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import Header from "components/Headers/Header";
import { toast } from "sonner";

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${COMPANY_API_ENDPOINT}/getCompanyById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setCompany(response.data);
        } else {
          setError("Failed to load company data.");
        }
      } catch (err) {
        setError("Error fetching company data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${COMPANY_API_ENDPOINT}/updateCompany/${id}`, company, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success('Company updated successfully!')
        navigate("/admin/dashboard");
      } else {
        alert("Failed to update company. Please try again.");
      }
    } catch (error) {
      console.error("Error updating company:", error);
     toast.error('An error occurred while updating the company.')
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#0d6efd" }}>
          Edit Company
        </h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <form className="mx-auto" style={{ maxWidth: "600px" }}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Name</label>
              <input
                type="text"
                name="name"
                value={company.name || ""}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter company name"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                name="description"
                value={company.description || ""}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter company description"
              ></textarea>
            </div>
            <div className="form-group mb-4">
              <label className="form-label fw-bold">Status</label>
              <select
                name="status"
                value={company.status || ""}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="text-center">
              <button
                type="button"
                className="btn btn-primary px-5 py-2"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditCompany;

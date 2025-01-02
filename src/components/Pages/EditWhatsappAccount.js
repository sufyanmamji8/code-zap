




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "Api/Constant";
import Header from "components/Headers/Header";
import { toast } from "sonner";

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    name: "",
    description: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const response = await axios.get(`${COMPANY_API_ENDPOINT}/getAllCompanies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          // Find the specific company from the array using the id
          const foundCompany = response.data.data.find(comp => comp._id === id);
          if (foundCompany) {
            setCompany({
              name: foundCompany.name || "",
              description: foundCompany.description || "",
              status: foundCompany.status || "",
            });
          } else {
            setError("Company not found");
            navigate("/admin/dashboard");
          }
        } else {
          setError("Failed to load company data.");
        }
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Error fetching company data. " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Please log in again.');
        navigate("/login");
        return;
      }

      // Validate required fields
      if (!company.name || !company.status) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await axios.put(`${COMPANY_API_ENDPOINT}/updateCompany/${id}`, company, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success('Company updated successfully!');
        navigate("/admin/dashboard");
      } else {
        toast.error("Failed to update company. Please try again.");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(error.response?.data?.message || 'An error occurred while updating the company.');
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className="container mt-4">
        <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#0d6efd" }}>
          Edit WhatsApp Account
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
          <form className="mx-auto" style={{ maxWidth: "600px" }} onSubmit={handleUpdate}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Name<span className="text-danger">*</span></label>
              <input
                type="text"
                name="name"
                value={company.name}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                name="description"
                value={company.description}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter company description"
                rows="4"
              />
            </div>
            <div className="form-group mb-4">
              <label className="form-label fw-bold">Status<span className="text-danger">*</span></label>
              <select
                name="status"
                value={company.status}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary px-5 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditCompany;
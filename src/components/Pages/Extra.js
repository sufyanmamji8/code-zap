import React, { useState, useEffect } from "react";
import { Edit, Trash2, X, Image, FileVideo, File } from "lucide-react";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonGroup,
  Badge,
  Alert,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
} from "reactstrap";
import axios from "axios";
import {
  GROUP_ENDPOINTS,
  TEMPLATE_ENDPOINTS,
  CAMPAIGN_ENDPOINTS,
} from "Api/Constant";

const WhatsAppCampaigns = () => {
  const [campaignData, setCampaignData] = useState({
    campaignName: "",
    template: "",
    sendType: "now",
    scheduledTime: "",
    selectedGroups: [],
    priority: "normal",
    templateParams: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    template: false,
    groups: false,
  });

  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(null);
  const [extractedParams, setExtractedParams] = useState([]);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    fetchGroups();
    fetchTemplates();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (campaignData.template) {
      fetchTemplateDetails(campaignData.template);
    } else {
      setSelectedTemplateDetails(null);
      setExtractedParams([]);
    }
  }, [campaignData.template]);

  const extractParameters = (templateText, components) => {
    if (!templateText) return [];
    
    const params = [];
    const usedIndexes = new Set();
  
    // Extract text parameters using regex
    const paramRegex = /\{\{(\d+)\}\}/g;
    let match;
    
    while ((match = paramRegex.exec(templateText)) !== null) {
      const paramIndex = match[1];
      
      if (!usedIndexes.has(paramIndex)) {
        usedIndexes.add(paramIndex);
        
        params.push({
          index: paramIndex,
          key: `param${paramIndex}`,
          name: `Parameter ${paramIndex}`,
          type: "text",
        });
      }
    }
    
    // Add media parameters from components if they exist
    if (components && Array.isArray(components)) {
      components.forEach(component => {
        if (component.type === "HEADER" && component.format) {
          const mediaType = component.format.toLowerCase();
          if (["image", "video", "document"].includes(mediaType)) {
            // Find the next available parameter index
            const nextIndex = params.length > 0 
              ? Math.max(...params.map(p => parseInt(p.index))) + 1 
              : 1;
            
            params.push({
              index: nextIndex.toString(),
              key: `media${nextIndex}`,
              name: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Parameter`,
              type: mediaType,
            });
          }
        }
      });
    }
  
    // Sort parameters by index
    params.sort((a, b) => parseInt(a.index) - parseInt(b.index));
    return params;
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("selectedCompanyId");

      if (!token || !companyId) {
        setCampaignsLoading(false);
        return;
      }

      setCampaignsLoading(true);
      const response = await axios.post(
        CAMPAIGN_ENDPOINTS.GET_ALL,
        { companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Process campaigns to match your frontend display requirements
        const processedCampaigns = (response.data.data || []).map(
          (campaign) => {
            return {
              ...campaign,
              status: campaign.status || "draft",
              pendingCount:
                campaign.pendingCount ||
                campaign.totalRecipients -
                  (campaign.successCount + campaign.failCount),
              successCount: campaign.successCount || 0,
              failCount: campaign.failCount || 0,
            };
          }
        );

        setCampaigns(processedCampaigns);
      }
    } catch (error) {
      console.error(
        "Error fetching campaigns:",
        error.response?.data || error.message
      );
    } finally {
      setCampaignsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
  
    if (!companyId || !token) {
      setTemplatesLoading(false);
      return;
    }
  
    try {
      setTemplatesLoading(true);
      const response = await axios.post(
        TEMPLATE_ENDPOINTS.FETCH,
        { companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success && response.data.templates) {
        setTemplates(response.data.templates);
      } else {
        console.error("Failed to fetch templates");
        // Add toast notification here if you're using it in this component
        // toast.error("Failed to fetch templates");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      if (error.response?.status === 401) {
        // Add navigation to login if needed
        // navigate("/auth/login");
      } else {
        // toast.error("Error loading templates");
      }
    } finally {
      setTemplatesLoading(false);
    }
  };

  const fetchTemplateDetails = async (templateId) => {
    try {
      const selectedTemplate = templates.find((t) => t.id === templateId);
  
      if (selectedTemplate) {
        console.log("Selected template:", selectedTemplate); // Debug log
        
        // Get the template text from the appropriate place in the template object
        let templateText = "";
        
        if (selectedTemplate.components && selectedTemplate.components.length > 0) {
          // Find body component
          const bodyComponent = selectedTemplate.components.find(c => 
            c.type === "BODY" || c.type === "body"
          );
          
          if (bodyComponent) {
            templateText = bodyComponent.text || "";
          }
        } else if (selectedTemplate.text) {
          templateText = selectedTemplate.text;
        } else if (selectedTemplate.content) {
          // Check other possible property names
          templateText = selectedTemplate.content;
        }
        
        console.log("Template text for parameter extraction:", templateText); // Debug log
        
        // Extract parameters - pass the components as well
        const params = extractParameters(templateText, selectedTemplate.components);
        console.log("Extracted parameters:", params); // Debug log
        
        setExtractedParams(params);
        
        // Initialize parameter values
        const initialParams = {};
        params.forEach(param => {
          initialParams[param.key] = "";
        });
        
        setCampaignData(prev => ({
          ...prev,
          templateParams: initialParams
        }));
        
        setSelectedTemplateDetails({
          ...selectedTemplate,
          text: templateText
        });
      }
    } catch (error) {
      console.error("Error processing template details:", error);
    }
  };

  const validateForm = () => {
    // Required fields
    if (
      !campaignData.campaignName ||
      !campaignData.template ||
      campaignData.selectedGroups.length === 0
    ) {
      return false;
    }
  
    // If scheduled, must have a valid date
    if (campaignData.sendType === "later" && !campaignData.scheduledTime) {
      return false;
    }
  
    // Check that all template parameters are filled
    for (const param of extractedParams) {
      if (campaignData.templateParams[param.key] === undefined || 
          campaignData.templateParams[param.key] === null || 
          campaignData.templateParams[param.key] === "") {
        console.log(`Missing template parameter: ${param.key}`);
        return false;
      }
    }
  
    return true;
  };

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(GROUP_ENDPOINTS.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter((template) =>
    template?.name?.toLowerCase().includes(templateSearchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({
      ...prev,
      templateParams: {
        ...prev.templateParams,
        [name]: value,
      },
    }));
  };

  const toggleDropdown = (type) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleTemplateSelect = (templateId) => {
    setCampaignData((prev) => ({
      ...prev,
      template: templateId,
      templateParams: {},
    }));
    toggleDropdown("template");
  };

  const handleGroupSelect = (groupId) => {
    setCampaignData((prev) => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter((id) => id !== groupId)
        : [...prev.selectedGroups, groupId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("selectedCompanyId");

      if (!token || !companyId) {
        console.error("Missing authentication token or company ID");
        return;
      }

      // Format template components to match backend expectations
      const selectedTemplate = templates.find(
        (t) => t.id === campaignData.template
      );

      if (!selectedTemplate) {
        console.error("Selected template not found");
        setIsSubmitting(false);
        return;
      }

      // Format parameters as expected by the backend
      // Inside handleSubmit function
// Format parameters as expected by the backend
const components = [];

// Add header component if it exists
if (
  selectedTemplate.components &&
  selectedTemplate.components.some((c) => c.type === "HEADER")
) {
  const headerComponent = {
    type: "header",
    parameters: [],
  };

  // Handle header media parameters
  const mediaParams = extractedParams.filter(p => p.type !== "text");
  if (mediaParams.length > 0) {
    // You'll need to upload the file and get a media ID
    // This is an example of how you might structure this
    headerComponent.parameters.push({
      type: mediaParams[0].type,
      // For the actual implementation, you'd need to upload the file first
      // and get the media ID from WhatsApp's API
      [mediaParams[0].type]: campaignData.templateParams[mediaParams[0].key]
    });
  }

  components.push(headerComponent);
}

// Add body component with text parameters
const bodyComponent = {
  type: "body",
  parameters: [],
};

// Add text parameters to body component
const textParams = extractedParams.filter(p => p.type === "text");
textParams.forEach((param) => {
  bodyComponent.parameters.push({
    type: "text",
    text: campaignData.templateParams[param.key] || "",
  });
});

components.push(bodyComponent);

// Create payload that matches backend expectations
const payload = {
  name: campaignData.campaignName,
  templateName: selectedTemplate.name,
  templateLanguage: selectedTemplate.language || "en",
  components: components,
  groups: campaignData.selectedGroups,
  scheduleTime:
    campaignData.sendType === "later" ? campaignData.scheduledTime : null,
  companyId: companyId,
};

console.log("Final API payload:", payload);

      let response;

      if (editingCampaignId) {
        // Update existing campaign
        response = await axios.put(
          `${CAMPAIGN_ENDPOINTS.UPDATE}/${editingCampaignId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new campaign
        response = await axios.post(CAMPAIGN_ENDPOINTS.CREATE, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchCampaigns();
        setActiveTab("list");

        // Reset form and editing state
        setCampaignData({
          campaignName: "",
          template: "",
          sendType: "now",
          scheduledTime: "",
          selectedGroups: [],
          priority: "normal",
          templateParams: {},
        });
        setEditingCampaignId(null);
      } else {
        console.error("Campaign operation failed:", response.data.message);
        // Show error message to user
      }
    } catch (error) {
      console.error(
        "Error with campaign operation:",
        error.response?.data || error.message
      );
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add these handler functions to your component
  const handleEditCampaign = (campaignId) => {
    // Get the campaign data
    const campaignToEdit = campaigns.find((c) => c._id === campaignId);

    if (campaignToEdit) {
      // Populate the form with the campaign data
      setCampaignData({
        campaignName: campaignToEdit.name,
        template: campaignToEdit.templateId || "", // You might need to adjust this based on your data structure
        sendType: campaignToEdit.scheduledFor ? "later" : "now",
        scheduledTime: campaignToEdit.scheduledFor
          ? new Date(campaignToEdit.scheduledFor).toISOString().slice(0, 16)
          : "",
        selectedGroups: campaignToEdit.groups?.map((g) => g._id || g) || [],
        priority: campaignToEdit.priority || "normal",
        templateParams:
          campaignToEdit.components?.reduce((params, component) => {
            if (component.type === "body" && component.parameters) {
              component.parameters.forEach((param, index) => {
                params[`param${index + 1}`] = param.text || "";
              });
            }
            return params;
          }, {}) || {},
      });

      // Switch to edit mode
      setActiveTab("new");
      // Store the campaign ID being edited
      setEditingCampaignId(campaignId);
    }
  };

  const handleDeleteCampaign = (campaignId) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign(campaignId);
    }
  };

  const handleCancelCampaign = (campaignId) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to cancel this campaign?")) {
      cancelCampaign(campaignId);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${CAMPAIGN_ENDPOINTS.DELETE}/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Remove from local state
        setCampaigns((prevCampaigns) =>
          prevCampaigns.filter((c) => c._id !== campaignId)
        );
        alert("Campaign deleted successfully");
      } else {
        alert("Failed to delete campaign: " + response.data.message);
      }
    } catch (error) {
      console.error(
        "Error deleting campaign:",
        error.response?.data || error.message
      );
      alert("Error deleting campaign. Please try again.");
    }
  };

  const cancelCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        CAMPAIGN_ENDPOINTS.CANCEL,
        { campaignId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Update campaign status in local state
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((c) =>
            c._id === campaignId ? { ...c, status: "cancelled" } : c
          )
        );
        alert("Campaign cancelled successfully");
      } else {
        alert("Failed to cancel campaign: " + response.data.message);
      }
    } catch (error) {
      console.error(
        "Error cancelling campaign:",
        error.response?.data || error.message
      );
      alert("Error cancelling campaign. Please try again.");
    }
  };


  const handleMediaParamChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setCampaignData((prev) => ({
        ...prev,
        templateParams: {
          ...prev.templateParams,
          [name]: files[0],
        },
      }));
    }
  };


  const getCompletionPercentage = () => {
    let filled = 0;
    let total = 5;

    if (extractedParams.length) {
      total += extractedParams.length;
      extractedParams.forEach((param) => {
        if (campaignData.templateParams[param.key]) filled++;
      });
    }

    if (campaignData.campaignName) filled++;
    if (campaignData.template) filled++;
    if (campaignData.selectedGroups.length > 0) filled++;
    if (campaignData.sendType === "now" || campaignData.scheduledTime) filled++;
    if (campaignData.priority) filled++;

    return (filled / total) * 100;
  };

  const formatCategory = (category) => {
    if (!category) return "";
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const getPreviewText = (text) => {
    if (!text) return "";

    return text.replace(/\{\{(\d+)\}\}/g, (match, paramIndex) => {
      const paramKey = `param${paramIndex}`;
      const paramValue = campaignData.templateParams[paramKey];
      return paramValue ? paramValue : match;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "sent":
        return "success";
      case "in_progress":
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "scheduled":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="py-4">
      <Container>
        {/* Tabs for Create and List */}
        <div className="mb-4">
          <ButtonGroup className="w-100">
            <Button
              color={activeTab === "new" ? "primary" : "light"}
              onClick={() => setActiveTab("new")}
              className="w-50"
            >
              Create New Campaign
            </Button>
            <Button
              color={activeTab === "list" ? "primary" : "light"}
              onClick={() => setActiveTab("list")}
              className="w-50"
            >
              View All Campaigns
            </Button>
          </ButtonGroup>
        </div>

        {activeTab === "new" ? (
          <Card className="shadow-sm">
            <CardBody>
              {showSuccess && (
                <Alert color="success" className="mb-4">
                  Campaign created successfully!
                </Alert>
              )}

              <div className="mb-4">
                <h4>Campaign Progress</h4>
                <Progress value={getCompletionPercentage()} className="mt-2" />
              </div>

              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Column 1 */}
                  <Col md={6}>
                    {/* Campaign Name */}
                    <FormGroup className="mb-4">
                      <Label className="fw-bold">
                        Campaign Name
                        <Badge color="primary" pill className="ms-2">
                          Required
                        </Badge>
                      </Label>
                      <Input
                        type="text"
                        name="campaignName"
                        value={campaignData.campaignName}
                        onChange={handleInputChange}
                        placeholder="Enter campaign name"
                        required
                      />
                    </FormGroup>

                    {/* Template Selection - Updated with API data */}
                    <FormGroup className="mb-4 position-relative">
                      <Label className="fw-bold">
                        Message Template
                        <Badge color="primary" pill className="ms-2">
                          Required
                        </Badge>
                      </Label>
                      <Dropdown
                        isOpen={dropdownOpen.template}
                        toggle={() => toggleDropdown("template")}
                        className="w-100"
                      >
                        <DropdownToggle
                          caret
                          color="light"
                          className="w-100 text-start"
                        >
                          {campaignData.template
                            ? templates.find(
                                (t) => t.id === campaignData.template
                              )?.name
                            : "Select a template..."}
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          {/* Added search input for templates */}
                          <div className="px-3 py-2 border-bottom">
                            <Input
                              type="text"
                              placeholder="Search templates..."
                              value={templateSearchTerm}
                              onChange={(e) =>
                                setTemplateSearchTerm(e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {templatesLoading ? (
                              <DropdownItem disabled>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Loading templates...
                              </DropdownItem>
                            ) : filteredTemplates.length > 0 ? (
                              filteredTemplates.map((template) => (
                                <DropdownItem
                                  key={template.id}
                                  onClick={() =>
                                    handleTemplateSelect(template.id)
                                  }
                                >
                                  <div>
                                    <span className="fw-bold">
                                      {template.name}
                                    </span>
                                    <div className="d-flex mt-1">
                                      <Badge
                                        color="primary"
                                        pill
                                        className="me-2"
                                        style={{ textTransform: "none" }}
                                      >
                                        {formatCategory(template.category)}
                                      </Badge>
                                      <Badge color="info" pill>
                                        {template.language}
                                      </Badge>
                                    </div>
                                  </div>
                                </DropdownItem>
                              ))
                            ) : (
                              <DropdownItem disabled>
                                No templates found
                              </DropdownItem>
                            )}
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                  </Col>

                  {/* Column 2 */}
                  <Col md={6}>
                    {/* Send Type */}
                    <FormGroup className="mb-4">
                      <Label className="fw-bold">
                        Sending Schedule
                        <Badge color="primary" pill className="ms-2">
                          Required
                        </Badge>
                      </Label>
                      <ButtonGroup className="w-100">
                        <Button
                          color={
                            campaignData.sendType === "now"
                              ? "primary"
                              : "light"
                          }
                          onClick={() =>
                            setCampaignData((prev) => ({
                              ...prev,
                              sendType: "now",
                            }))
                          }
                        >
                          Send Now
                        </Button>
                        <Button
                          color={
                            campaignData.sendType === "later"
                              ? "primary"
                              : "light"
                          }
                          onClick={() =>
                            setCampaignData((prev) => ({
                              ...prev,
                              sendType: "later",
                            }))
                          }
                        >
                          Schedule
                        </Button>
                      </ButtonGroup>
                      {campaignData.sendType === "later" && (
                        <Input
                          type="datetime-local"
                          name="scheduledTime"
                          value={campaignData.scheduledTime}
                          onChange={handleInputChange}
                          className="mt-2"
                          required
                        />
                      )}
                    </FormGroup>

                    {/* Group Selection */}
                    <FormGroup className="mb-4 position-relative">
                      <Label className="fw-bold">
                        Target Groups
                        <Badge color="primary" pill className="ms-2">
                          Required
                        </Badge>
                      </Label>
                      <Dropdown
                        isOpen={dropdownOpen.groups}
                        toggle={() => toggleDropdown("groups")}
                        className="w-100"
                      >
                        <DropdownToggle
                          caret
                          color="light"
                          className="w-100 text-start"
                        >
                          {campaignData.selectedGroups.length
                            ? `${campaignData.selectedGroups.length} groups selected`
                            : "Select target groups..."}
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          {/* Search input for groups */}
                          <div className="px-3 py-2 border-bottom">
                            <Input
                              type="text"
                              placeholder="Search groups..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {filteredGroups.length > 0 ? (
                              filteredGroups.map((group) => (
                                <DropdownItem
                                  key={group._id}
                                  onClick={() => handleGroupSelect(group._id)}
                                  className="d-flex align-items-center"
                                >
                                  <input
                                    type="checkbox"
                                    checked={campaignData.selectedGroups.includes(
                                      group._id
                                    )}
                                    onChange={() => {}}
                                    className="me-2"
                                  />
                                  <div className="d-flex justify-content-between w-100">
                                    <span>{group.name}</span>
                                    <Badge color="info" pill>
                                      {group.allowedPhoneNumbers?.length || 0}{" "}
                                      members
                                    </Badge>
                                  </div>
                                </DropdownItem>
                              ))
                            ) : (
                              <DropdownItem disabled>
                                No groups found
                              </DropdownItem>
                            )}
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Selected Template Preview with Parameters - NEW SECTION */}
                {campaignData.template && selectedTemplateDetails && (
                  <Row className="mb-3">
                    <Col>
                      <Card className="border">
                        <CardBody>
                          <h5 className="mb-3">
                            Template:{" "}
                            {selectedTemplateDetails.name ||
                              "Selected Template"}
                          </h5>

                          {/* Display template badges if available */}
                          <div className="d-flex mb-3">
                            {selectedTemplateDetails.category && (
                              <Badge
                                color="primary"
                                pill
                                className="me-2"
                                style={{ textTransform: "none" }}
                              >
                                {formatCategory(
                                  selectedTemplateDetails.category
                                )}
                              </Badge>
                            )}
                            {selectedTemplateDetails.language && (
                              <Badge color="info" pill>
                                {selectedTemplateDetails.language}
                              </Badge>
                            )}
                          </div>

                          {/* Display template preview with live parameter replacement */}
                          <div className="mb-4">
                            <Label className="fw-bold">Template Preview</Label>
                            <div className="border rounded p-3 bg-light mb-3">
                              <div className="text-muted mb-2">(Header)</div>
                              <div className="mb-2">
                                {getPreviewText(selectedTemplateDetails.text)}
                              </div>
                              <div className="text-muted small">
                                This message is from an unverified business.
                              </div>
                            </div>
                          </div>

                          {/* Template Parameters Section */}
                          {extractedParams.length > 0 ? (
  <Row className="mt-2">
    {extractedParams.map((param) => (
      <Col md={6} key={param.key} className="mb-3">
        <FormGroup>
          <Label className="fw-bold text-secondary">
            {param.name} ({`{${param.index}}`})
            {param.type !== "text" && (
              <Badge color="info" className="ms-2">
                {param.type === "image" && <Image size={12} className="me-1" />}
                {param.type === "video" && <FileVideo size={12} className="me-1" />}
                {param.type === "document" && <File size={12} className="me-1" />}
                {param.type}
              </Badge>
            )}
          </Label>
          {param.type === "text" ? (
            <Input
              type="text"
              name={param.key}
              value={campaignData.templateParams[param.key] || ""}
              onChange={handleParamChange}
              placeholder={`Enter ${param.name}`}
              required
            />
          ) : param.type === "image" ? (
            <Input
              type="file"
              name={param.key}
              onChange={handleMediaParamChange}
              accept="image/*"
              required
            />
          ) : param.type === "video" ? (
            <Input
              type="file"
              name={param.key}
              onChange={handleMediaParamChange}
              accept="video/*"
              required
            />
          ) : param.type === "document" ? (
            <Input
              type="file"
              name={param.key}
              onChange={handleMediaParamChange}
              accept=".pdf,.doc,.docx,.txt"
              required
            />
          ) : (
            <Input
              type="text"
              name={param.key}
              value={campaignData.templateParams[param.key] || ""}
              onChange={handleParamChange}
              placeholder={`Enter ${param.name}`}
              required
            />
          )}
        </FormGroup>
      </Col>
    ))}
  </Row>
) : (
  <p className="text-muted">
    This template has no editable parameters.
  </p>
)}
                          
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                )}

                {/* Selected Groups Preview */}
                {campaignData.selectedGroups.length > 0 && (
                  <Row className="mb-3">
                    <Col>
                      <Label className="fw-bold">Selected Groups</Label>
                      <div className="border rounded p-3">
                        <div className="d-flex flex-wrap gap-2">
                          {campaignData.selectedGroups.map((groupId) => {
                            const group = groups.find((g) => g._id === groupId);
                            return group ? (
                              <Badge
                                key={groupId}
                                color="primary"
                                className="p-2 d-flex align-items-center"
                              >
                                {group.name}
                                <span
                                  className="ms-2 cursor-pointer"
                                  onClick={() => handleGroupSelect(groupId)}
                                  style={{ cursor: "pointer" }}
                                >
                                  ×
                                </span>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}

                {/* Submit Button - Full Width */}
                <Row>
                  <Col>
                    <Button
                      color="primary"
                      type="submit"
                      className="w-100 mt-3"
                      disabled={isSubmitting || !validateForm()}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Creating Campaign...
                        </>
                      ) : (
                        "Launch Campaign"
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        ) : (
          // Campaign List View
          <Card className="shadow-sm">
            <CardBody>
              <h4 className="mb-4">All WhatsApp Campaigns</h4>

              {campaignsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading campaigns...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <Alert color="info">
                  No campaigns found. Create your first campaign to get started.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Campaign Name</th>
                        <th>Template</th>
                        <th>Groups</th>
                        <th>Status</th>
                        <th>Scheduled</th>
                        <th>Recipients</th>
                        <th>Success/Fail</th>
                        <th>Created</th>
                        <th>Actions</th> {/* New Actions column */}
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr key={campaign._id}>
                          <td>
                            <span className="fw-bold">{campaign.name}</span>
                          </td>
                          <td>
                            {campaign.templateName}
                            <div>
                              <Badge color="secondary" pill className="mt-1">
                                {campaign.templateLanguage}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            {campaign.groups &&
                              campaign.groups.map((group) => (
                                <Badge
                                  key={group._id}
                                  color="primary"
                                  pill
                                  className="me-1"
                                >
                                  {group.name}
                                </Badge>
                              ))}
                          </td>
                          <td>
                            <Badge
                              color={getStatusBadgeColor(campaign.status)}
                              pill
                            >
                              {campaign.status}
                            </Badge>
                          </td>
                          <td>
                            {campaign.scheduledFor
                              ? formatDate(campaign.scheduledFor)
                              : "Immediate"}
                          </td>
                          <td>{campaign.totalRecipients || 0}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="text-success me-2">
                                {campaign.successCount || 0}
                              </span>
                              <span>/</span>
                              <span className="text-danger ms-2">
                                {campaign.failCount || 0}
                              </span>
                            </div>
                            {campaign.totalRecipients > 0 && (
                              <Progress
                                multi
                                className="mt-1"
                                style={{ height: "6px" }}
                              >
                                <Progress
                                  bar
                                  color="success"
                                  value={
                                    (campaign.successCount /
                                      campaign.totalRecipients) *
                                    100
                                  }
                                />
                                <Progress
                                  bar
                                  color="danger"
                                  value={
                                    (campaign.failCount /
                                      campaign.totalRecipients) *
                                    100
                                  }
                                />
                                <Progress
                                  bar
                                  color="warning"
                                  value={
                                    (campaign.pendingCount /
                                      campaign.totalRecipients) *
                                    100
                                  }
                                />
                              </Progress>
                            )}
                          </td>
                          <td>{formatDate(campaign.createdAt)}</td>
                          {/* New Actions column */}
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleEditCampaign(campaign._id)}
                                disabled={
                                  campaign.status === "completed" ||
                                  campaign.status === "sent"
                                }
                                className="p-1"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleDeleteCampaign(campaign._id)
                                }
                                className="p-1"
                              >
                                <Trash2 size={16} />
                              </Button>
                              <Button
                                color="warning"
                                size="sm"
                                onClick={() =>
                                  handleCancelCampaign(campaign._id)
                                }
                                disabled={
                                  campaign.status === "completed" ||
                                  campaign.status === "sent" ||
                                  campaign.status === "failed"
                                }
                                className="p-1"
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              <Button
                color="primary"
                className="mt-3"
                onClick={() => setActiveTab("new")}
              >
                Create New Campaign
              </Button>
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default WhatsAppCampaigns;
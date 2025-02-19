import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Fade,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import { toast } from "sonner";
import { countryList } from "./countryList";
import "../../assets/css/SendTemplate.css"; 
import { TEMPLATE_ENDPOINTS } from "Api/Constant";
import { API_KEY_ENDPOINTS } from "Api/Constant";
import { MESSAGE_API_ENDPOINT } from "Api/Constant";

const SendTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKey, setApiKey] = useState(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [copyDropdownOpen, setCopyDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countryList.find((country) => country.code === "92") || countryList[0]
  );
  const [formData, setFormData] = useState({
    to: "",
    templateName: location.state?.templateName || "",
    templateLanguage: "en_US",
    components: [],
    companyId: location.state?.companyId || "",
  });
  const [isSending, setIsSending] = useState(false);
  const token = localStorage.getItem("token");
  const [headerParams, setHeaderParams] = useState({
    mediaUrl: "",
    latitude: "",
    longitude: "",
    locationName: "",
    locationAddress: "",
  });

  const filteredCountries = countryList.filter(
    (country) =>
      country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
  );

  const extractTemplateParameters = (template) => {
    if (!template) return [];

    const bodyComponent = template.components.find((c) => c.type === "BODY");
    if (!bodyComponent || !bodyComponent.text) return [];

    const paramRegex = /\{\{([^}]+)\}\}/g;
    const params = [];
    let match;

    const fullText = bodyComponent.text;

    while ((match = paramRegex.exec(fullText)) !== null) {
      const paramNumber = match[1];

      let startPos = Math.max(0, match.index - 50);
      let contextText = fullText.substring(startPos, match.index).trim();

      let contextWords = contextText.split(/[.,!?]\s*/).pop() || "";
      if (contextWords.includes(":")) {
        contextWords = contextWords.split(":").pop().trim();
      } else if (contextWords.includes("-")) {
        contextWords = contextWords.split("-").pop().trim();
      }

      contextWords = contextWords.replace(/^\W+|\W+$/g, "").trim();

      params.push({
        index: paramNumber,
        original: match[0],
        context: contextWords || `Variable ${paramNumber}`,
        value: "",
      });
    }

    return params.sort((a, b) => a.index - b.index);
  };

  const handleHeaderParamChange = (key, value) => {
    setHeaderParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        textArea.remove();
        return true;
      } catch (err) {
        textArea.remove();
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const handleScheduleSend = async () => {
    if (!scheduleDateTime) {
      toast.error("Please select a date and time");
      return;
    }

    setIsScheduling(true);

    try {
      const scheduledTime = new Date(scheduleDateTime).getTime();

      const payload = {
        to: formData.to,
        templateName: formData.templateName,
        templateLanguage: formData.templateLanguage,
        companyId: formData.companyId,
        components: formData.components.map((component) => {
          if (component.type === "header") {
            const headerFormat = template.components
              .find((c) => c.type === "HEADER")
              ?.format.toLowerCase();
            return {
              type: "header",
              parameters: [
                {
                  type: headerFormat,
                  [headerFormat]: {
                    link: headerParams.mediaUrl,
                  },
                },
              ],
            };
          }
          return component;
        }),
        scheduledTime: scheduledTime,
      };

      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/scheduleTemplate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Message scheduled successfully!");
        setScheduleModalOpen(false);
        navigate("/admin/chats", {
          state: {
            companyId: formData.companyId,
            refresh: true,
            timestamp: new Date().getTime(),
          },
          replace: true,
        });
      } else {
        toast.error(response.data.message || "Failed to schedule message");
      }
    } catch (error) {
      console.error("Error scheduling message:", error);
      toast.error(error.response?.data?.message || "Error scheduling message");
    } finally {
      setIsScheduling(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  const fetchTemplateDetails = async () => {
    if (!formData.companyId || !token) return;

    try {
      const response = await axios.post(
        TEMPLATE_ENDPOINTS.FETCH,
        {
          companyId: formData.companyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const selectedTemplate = response.data.templates.find(
          (t) => t.name === location.state?.templateName
        );

        if (selectedTemplate) {
          setTemplate(selectedTemplate);

          const initialComponents = [];

          const headerComponent = selectedTemplate.components.find(
            (c) => c.type === "HEADER"
          );
          if (headerComponent) {
            initialComponents.push({
              type: "header",
              parameters: [],
            });
          }

          const bodyComponent = selectedTemplate.components.find(
            (c) => c.type === "BODY"
          );
          if (bodyComponent) {
            const params = extractTemplateParameters(selectedTemplate);
            initialComponents.push({
              type: "body",
              parameters: params.map(() => ({
                type: "text",
                text: "",
              })),
            });
          }

          setFormData((prev) => ({
            ...prev,
            components: initialComponents,
          }));
        }
      } else {
        toast.error("Failed to load template details");
      }
    } catch (error) {
      console.error("Error fetching template details:", error);
      if (error.response?.status === 401) {
        navigate("/auth/login");
      } else {
        toast.error("Failed to load template details");
      }
    }
  };

  const fetchApiKey = async () => {
    if (!formData.companyId || !token) return;

    try {
      const response = await axios.post(
        API_KEY_ENDPOINTS.GET,
        { companyId: formData.companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setApiKey(response.data.data);
      } else {
        setApiKey(null);
      }
    } catch (error) {
      setApiKey(null);
      if (error.response?.status === 401) {
        navigate("/auth/login");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!formData.companyId || !token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(
          TEMPLATE_ENDPOINTS.FETCH,
          {
            companyId: formData.companyId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          const selectedTemplate = response.data.templates.find(
            (t) => t.name === location.state?.templateName
          );

          if (selectedTemplate) {
            setTemplate(selectedTemplate);

            const initialComponents = [];

            const headerComponent = selectedTemplate.components.find(
              (c) => c.type === "HEADER"
            );
            if (headerComponent) {
              initialComponents.push({
                type: "header",
                parameters: [
                  {
                    type: headerComponent.format.toLowerCase(),
                    [headerComponent.format.toLowerCase()]: {
                      link: "",
                    },
                  },
                ],
              });
            }

            const bodyComponent = selectedTemplate.components.find(
              (c) => c.type === "BODY"
            );
            if (bodyComponent) {
              const params = extractTemplateParameters(selectedTemplate);
              initialComponents.push({
                type: "body",
                parameters: params.map(() => ({
                  type: "text",
                  text: "",
                })),
              });
            }

            setFormData((prev) => ({
              ...prev,
              templateName: selectedTemplate.name,
              templateLanguage: selectedTemplate.language,
              components: initialComponents,
            }));
          }
        }
        await fetchApiKey();
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load template details");
        if (error.response?.status === 401) {
          navigate("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.state, token, formData.companyId]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);

    const phoneWithoutCode = formData.to.replace(/^\+?\d+/, "");
    setFormData((prev) => ({
      ...prev,
      to: `+${country.code}${phoneWithoutCode}`,
    }));
  };

  const handlePhoneChange = (value) => {
    const cleanedValue = value.replace(/[^\d+]/g, "");

    let formattedValue = cleanedValue;
    if (!cleanedValue.startsWith("+")) {
      formattedValue = `+${selectedCountry.code}${cleanedValue.replace(
        /^\+?\d+/,
        ""
      )}`;
    }

    setFormData((prev) => ({
      ...prev,
      to: formattedValue,
    }));
  };

  const handleParameterChange = (index, value) => {
    setFormData((prev) => {
      const updatedComponents = [...prev.components];
      const bodyComponent = updatedComponents.find((c) => c.type === "body");
      if (bodyComponent && bodyComponent.parameters[index]) {
        bodyComponent.parameters[index].text = value;
      }
      return {
        ...prev,
        components: updatedComponents,
      };
    });
  };

  const getPreviewText = () => {
    if (!template) return "";

    const bodyComponent = template.components.find((c) => c.type === "BODY");
    if (!bodyComponent) return "";

    let previewText = bodyComponent.text;
    const parameters =
      formData.components.find((c) => c.type === "body")?.parameters || [];

    parameters.forEach((param, index) => {
      const value = param.text || `{{${index + 1}}}`;
      previewText = previewText.replace(
        new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"),
        value
      );
    });

    return previewText;
  };

  const getCurlCommand = () => {
    if (!template) return "";

    const bodyComponent = formData.components.find((c) => c.type === "body");
    const headerComponent = formData.components.find(
      (c) => c.type === "header"
    );
    const bodyParams = extractTemplateParameters(template);

    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formData.to || "Enter phone number",
      type: "template",
      template: {
        name: formData.templateName,
        language: {
          code: formData.templateLanguage,
        },
        components: [],
      },
    };

    if (headerComponent) {
      const headerFormat = template.components.find(
        (c) => c.type === "HEADER"
      )?.format;
      const headerParam = {
        type: "header",
        parameters: [],
      };

      if (headerFormat === "IMAGE" && headerParams.mediaUrl) {
        headerParam.parameters.push({
          type: "image",
          image: { link: headerParams.mediaUrl },
        });
      } else if (headerFormat === "VIDEO" && headerParams.mediaUrl) {
        headerParam.parameters.push({
          type: "video",
          video: { link: headerParams.mediaUrl },
        });
      } else if (headerFormat === "DOCUMENT" && headerParams.mediaUrl) {
        headerParam.parameters.push({
          type: "document",
          document: { link: headerParams.mediaUrl },
        });
      } else if (headerFormat === "LOCATION") {
        headerParam.parameters.push({
          type: "location",
          location: {
            latitude: parseFloat(headerParams.latitude) || 0,
            longitude: parseFloat(headerParams.longitude) || 0,
            name: headerParams.locationName || "",
            address: headerParams.locationAddress || "",
          },
        });
      }

      if (headerParam.parameters.length > 0) {
        data.template.components.push(headerParam);
      }
    }

    if (bodyComponent && bodyParams.length > 0) {
      const bodyParam = {
        type: "body",
        parameters: bodyComponent.parameters.map((param, index) => ({
          type: "text",
          text: param.text || `[Parameter ${index + 1}]`,
        })),
      };
      data.template.components.push(bodyParam);
    }

    const formattedJson = JSON.stringify(data, null, 2);

    const authHeader = apiKey
      ? `--header 'Authorization: Bearer api-key'`
      : "--header 'Authorization: Bearer generate an api key first'";

    return `curl --location 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages/sendTemplate' \\
  ${authHeader} \\
  --header 'Content-Type: application/json' \\
  --data '${formattedJson}'`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyId || !token) {
      toast.error("Missing required information");
      return;
    }

    setIsSending(true);

    try {
      const payload = {
        to: formData.to,
        templateName: formData.templateName,
        templateLanguage: formData.templateLanguage,
        companyId: formData.companyId,
        components: formData.components.map((component) => {
          if (component.type === "header") {
            const headerFormat = template.components
              .find((c) => c.type === "HEADER")
              ?.format.toLowerCase();
            return {
              type: "header",
              parameters: [
                {
                  type: headerFormat,
                  [headerFormat]: {
                    link: headerParams.mediaUrl,
                  },
                },
              ],
            };
          }
          return component;
        }),
      };

      const response = await axios.post(
        `${MESSAGE_API_ENDPOINT}/sendTemplate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Template message sent successfully!");

        const existingConfig = localStorage.getItem("whatsappConfig");
        const existingCompanyId = localStorage.getItem("whatsappCompanyId");

        const navigationState = {
          companyId: formData.companyId,
          config: existingConfig ? JSON.parse(existingConfig) : null,
          refresh: true,
          timestamp: new Date().getTime(),
        };

        if (!existingConfig) {
          try {
            const configResponse = await axios.get(
              `http://192.168.0.106:25483/api/v1/whatsapp/config/${formData.companyId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (configResponse.data.success) {
              navigationState.config = configResponse.data.config;
            }
          } catch (error) {
            console.error("Error fetching WhatsApp config:", error);
          }
        }

        navigate("/admin/chats", {
          state: navigationState,
          replace: true,
        });
      } else {
        toast.error(response.data.message || "Failed to send template");
      }
    } catch (error) {
      console.error("Error sending template:", error);
      if (error.response?.status === 401) {
        navigate("/auth/login");
      } else {
        const errorMessage =
          error.response?.data?.message || "Error sending template message";
        toast.error(errorMessage, {
          duration: 5000,
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const renderHeaderParams = () => {
    if (!template) return null;
    const headerComponent = template.components.find(
      (c) => c.type === "HEADER"
    );
    if (!headerComponent) return null;

    switch (headerComponent.format) {
      case "IMAGE":
      case "VIDEO":
      case "DOCUMENT":
        return (
          <FormGroup>
            <Label>Media URL for {headerComponent.format.toLowerCase()}</Label>
            <Input
              type="url"
              placeholder={`Enter ${headerComponent.format.toLowerCase()} URL`}
              value={headerParams.mediaUrl}
              onChange={(e) =>
                handleHeaderParamChange("mediaUrl", e.target.value)
              }
              required
            />
          </FormGroup>
        );
      case "LOCATION":
        return (
          <>
            <FormGroup>
              <Label>Latitude</Label>
              <Input
                type="number"
                step="any"
                placeholder="Enter latitude"
                value={headerParams.latitude}
                onChange={(e) =>
                  handleHeaderParamChange("latitude", e.target.value)
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Longitude</Label>
              <Input
                type="number"
                step="any"
                placeholder="Enter longitude"
                value={headerParams.longitude}
                onChange={(e) =>
                  handleHeaderParamChange("longitude", e.target.value)
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Location Name</Label>
              <Input
                type="text"
                placeholder="Enter location name"
                value={headerParams.locationName}
                onChange={(e) =>
                  handleHeaderParamChange("locationName", e.target.value)
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Address</Label>
              <Input
                type="text"
                placeholder="Enter address"
                value={headerParams.locationAddress}
                onChange={(e) =>
                  handleHeaderParamChange("locationAddress", e.target.value)
                }
                required
              />
            </FormGroup>
          </>
        );
      default:
        return null;
    }
  };

  const renderDynamicFields = () => {
    const params = extractTemplateParameters(template);
    return params.map((param, index) => (
      <FormGroup key={index}>
        <Label>{param.context}</Label>
        <Input
          placeholder={`Enter ${param.context.toLowerCase()}`}
          value={
            formData.components.find((c) => c.type === "body")?.parameters[
              index
            ]?.text || ""
          }
          onChange={(e) => handleParameterChange(index, e.target.value)}
          required
        />
      </FormGroup>
    ));
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loader-container">
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            style={{ width: "200px", height: "200px" }}
          />
        </div>
        <style jsx>{`
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="template-container">
      {/* Back Navigation */}
      <div className="back-nav mb-4">
        <Button
          color="link"
          className="d-flex align-items-center p-0"
          onClick={() => window.history.back()}
        >
          <i className="fas fa-arrow-left me-2"></i>
          <span>Back to Templates</span>
        </Button>
      </div>

      {/* API Section */}
      <Fade>
        <Card className="api-card mb-4">
          <CardHeader className="d-flex justify-content-between align-items-center bg-light">
            <h4 className="mb-0">
              <i className="fas fa-code me-2"></i>
              API Request
            </h4>
            <Dropdown
              isOpen={copyDropdownOpen}
              toggle={() => setCopyDropdownOpen(!copyDropdownOpen)}
            >
              <DropdownToggle caret color="primary" size="sm">
                <i className="fas fa-copy me-2"></i>
                Copy CURL
              </DropdownToggle>
              <DropdownMenu end className="mt-2">
                <DropdownItem
                  onClick={async () => {
                    const curlCommand = getCurlCommand();
                    try {
                      await navigator.clipboard.writeText(curlCommand);
                      toast.success(
                        "Curl command copied for immediate sending!"
                      );
                      setCopyDropdownOpen(false);
                    } catch (err) {
                      const textArea = document.createElement("textarea");
                      textArea.value = curlCommand;
                      document.body.appendChild(textArea);
                      textArea.select();
                      try {
                        document.execCommand("copy");
                        toast.success(
                          "Curl command copied for immediate sending!"
                        );
                      } catch (err) {
                        toast.error(
                          "Failed to copy. Please try selecting and copying manually."
                        );
                      }
                      document.body.removeChild(textArea);
                      setCopyDropdownOpen(false);
                    }
                  }}
                  className="d-flex align-items-center"
                >
                  <i className="fas fa-bolt me-2"></i>
                  Copy Now
                </DropdownItem>
                <DropdownItem
                  onClick={async () => {
                    let scheduledCurl = getCurlCommand().replace(
                      "/sendTemplate",
                      "/scheduleTemplate"
                    );

                    const jsonStart = scheduledCurl.lastIndexOf("{");
                    const jsonEnd = scheduledCurl.lastIndexOf("}");
                    const scheduledTime = new Date();
                    scheduledTime.setHours(scheduledTime.getHours() + 1);

                    const currentJson = scheduledCurl.substring(
                      jsonStart,
                      jsonEnd + 1
                    );
                    const updatedJson = currentJson.replace(
                      "}",
                      `, "scheduledTime": ${scheduledTime.getTime()}}`
                    );

                    scheduledCurl =
                      scheduledCurl.substring(0, jsonStart) +
                      updatedJson +
                      scheduledCurl.substring(jsonEnd + 1);

                    try {
                      await navigator.clipboard.writeText(scheduledCurl);
                      toast.success(
                        "Curl command copied for scheduled sending!"
                      );
                      setCopyDropdownOpen(false);
                    } catch (err) {
                      const textArea = document.createElement("textarea");
                      textArea.value = scheduledCurl;
                      document.body.appendChild(textArea);
                      textArea.select();
                      try {
                        document.execCommand("copy");
                        toast.success(
                          "Curl command copied for scheduled sending!"
                        );
                      } catch (err) {
                        toast.error(
                          "Failed to copy. Please try selecting and copying manually."
                        );
                      }
                      document.body.removeChild(textArea);
                      setCopyDropdownOpen(false);
                    }
                  }}
                  className="d-flex align-items-center"
                >
                  <i className="fas fa-clock me-2"></i>
                  Copy Later
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>
          <CardBody className="p-0">
            <div className="code-container">
              <pre className="m-0 p-3">
                <code>{getCurlCommand()}</code>
              </pre>
            </div>
          </CardBody>
        </Card>
      </Fade>

      <div className="row">
        {/* Form Section */}
        <div className="col-md-6">
          <Fade>
            <Card className="template-form-card">
              <CardHeader className="bg-white border-bottom-0">
                <div className="d-flex align-items-center">
                  <h4 className="mb-0">
                    {/* <i className="fas fa-paper-plane me-2 text-primary"></i> */}
                    {template.name}
                  </h4>
                  <span className="badge bg-info ms-2">
                    {template.language}
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="template-form">
                  {/* Phone Input Group */}
                  <FormGroup className="phone-input-group">
                    <Label className="form-label">
                      {/* <i className="fas fa-phone me-2"></i> */}
                      Recipient's Phone Number
                    </Label>
                    <InputGroup>
                      <Dropdown
                        isOpen={countryDropdownOpen}
                        toggle={() =>
                          setCountryDropdownOpen(!countryDropdownOpen)
                        }
                        className="country-dropdown"
                      >
                        <DropdownToggle caret className="country-toggle">
                          <span className="me-1">{selectedCountry.flag}</span>+
                          {selectedCountry.code}
                        </DropdownToggle>
                        <DropdownMenu className="country-menu">
                          <div className="px-2 pb-2">
                            <Input
                              type="text"
                              placeholder="Search countries..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="search-input"
                            />
                          </div>
                          <div className="country-list">
                            {filteredCountries.map((country) => (
                              <DropdownItem
                                key={country.code}
                                onClick={() => handleCountrySelect(country)}
                                className="country-item"
                              >
                                <span className="me-2">{country.flag}</span>
                                <span className="country-name">
                                  {country.country}
                                </span>
                                <span className="country-code">
                                  +{country.code}
                                </span>
                              </DropdownItem>
                            ))}
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.to}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="phone-input"
                        required
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Dynamic Fields */}
                  <div className="dynamic-fields">{renderDynamicFields()}</div>

                  {/* Header Parameters */}
                  <div className="header-params">{renderHeaderParams()}</div>

                  {/* Submit Button */}
                  <div className="d-flex gap-3">
                    <Button
                      color="primary"
                      type="submit"
                      className="flex-grow-1"
                      disabled={isSending || template.status !== "APPROVED"}
                    >
                      {isSending ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Send Now
                        </>
                      )}
                    </Button>
                    <Button
                      color="secondary"
                      type="button"
                      className="flex-grow-1"
                      onClick={() => setScheduleModalOpen(true)}
                      disabled={template.status !== "APPROVED"}
                    >
                      <i className="fas fa-clock me-2"></i>
                      Send Later
                    </Button>
                  </div>

                  <Modal
                    isOpen={scheduleModalOpen}
                    toggle={() => setScheduleModalOpen(false)}
                  >
                    <ModalHeader toggle={() => setScheduleModalOpen(false)}>
                      Schedule Message
                    </ModalHeader>
                    <ModalBody>
                      <FormGroup>
                        <Label for="scheduleDateTime">
                          Select Date and Time
                        </Label>
                        <Input
                          type="datetime-local"
                          id="scheduleDateTime"
                          value={scheduleDateTime}
                          onChange={(e) => setScheduleDateTime(e.target.value)}
                          min={getMinDateTime()}
                          className="form-control"
                        />
                      </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        onClick={() => setScheduleModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        onClick={handleScheduleSend}
                        disabled={isScheduling || !scheduleDateTime}
                      >
                        {isScheduling ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Scheduling...
                          </>
                        ) : (
                          "Schedule Send"
                        )}
                      </Button>
                    </ModalFooter>
                  </Modal>

                  {template.status !== "APPROVED" && (
                    <Alert color="warning" className="status-alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      This template is not approved and cannot be sent.
                    </Alert>
                  )}
                </form>
              </CardBody>
            </Card>
          </Fade>
        </div>

        {/* Preview Section */}
        <div className="col-md-6">
          <Fade>
            <Card className="preview-card">
              <CardHeader className="bg-white border-bottom-0">
                <h4 className="mb-0">
                  {/* <i className="fas fa-eye me-2 text-primary"></i> */}
                  Message Preview
                </h4>
              </CardHeader>
              <CardBody>
                <div className="preview-container">
                  <div className="message-bubble">
                    {template.components.find((c) => c.type === "HEADER")
                      ?.format === "IMAGE" && (
                      <div className="preview-image">
                        {headerParams.mediaUrl ? (
                          <img
                            src={headerParams.mediaUrl}
                            alt="Preview"
                            className="preview-img"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <div className="placeholder-image">
                            <i className="fas fa-image"></i>
                            <span>Add an image</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="message-text">{getPreviewText()}</div>
                    {template.components.find((c) => c.type === "FOOTER") && (
                      <div className="message-footer">
                        {
                          template.components.find((c) => c.type === "FOOTER")
                            .text
                        }
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default SendTemplate;
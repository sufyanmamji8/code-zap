import React, { useState } from 'react';
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
  Tooltip,
  UncontrolledTooltip
} from 'reactstrap';

const WhatsAppCampaigns = () => {
  const [campaignData, setCampaignData] = useState({
    campaignName: '',
    template: '',
    sendType: 'now',
    scheduledTime: '',
    selectedGroups: [],
    priority: 'normal'
  });

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const templates = [
    { id: 1, name: '👋 Welcome Message', category: 'Onboarding', previewText: 'Hey {name}, welcome to our community!' },
    { id: 2, name: '🎉 Special Offer', category: 'Marketing', previewText: 'Exclusive offer: Get 20% off on your next purchase!' },
    { id: 3, name: '📅 Event Reminder', category: 'Events', previewText: 'Don\'t forget! Your event starts in 24 hours.' },
    { id: 4, name: '⭐ Feedback Request', category: 'Customer Service', previewText: 'How was your experience with us?' }
  ];

  const groups = [
    { id: 1, name: '💎 Premium Customers', members: 1200, activity: 'High' },
    { id: 2, name: '🆕 New Subscribers', members: 450, activity: 'Medium' },
    { id: 3, name: '🎯 Event Attendees', members: 800, activity: 'Very High' },
    { id: 4, name: '👑 VIP Members', members: 150, activity: 'High' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGroupSelection = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setCampaignData(prev => ({
      ...prev,
      selectedGroups: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with loading animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowSuccess(true);
    setIsSubmitting(false);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getCompletionPercentage = () => {
    let filled = 0;
    const total = 5; // Total required fields
    if (campaignData.campaignName) filled++;
    if (campaignData.template) filled++;
    if (campaignData.selectedGroups.length > 0) filled++;
    if (campaignData.sendType === 'now' || campaignData.scheduledTime) filled++;
    if (campaignData.priority) filled++;
    return (filled / total) * 100;
  };

  return (
    <div className="bg-light min-vh-100" style={{ backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)' }}>
      <Container fluid className="p-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col lg={8} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0 text-primary">
                <i className="fas fa-paper-plane me-2"></i>
                New Campaign
              </h2>
              <div>
                <Button
                  color="light"
                  className="me-2 shadow-sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <i className="fas fa-eye me-1"></i>
                  Preview
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            {showSuccess && (
              <Alert 
                color="success" 
                className="mb-4 shadow-sm border-0"
                style={{ 
                  borderLeft: '4px solid #28a745',
                  animation: 'slideDown 0.5s ease-out'
                }}
              >
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle fa-lg me-2"></i>
                  <div>
                    <h5 className="mb-1">Campaign Created Successfully!</h5>
                    <p className="mb-0">Your messages will be delivered as scheduled.</p>
                  </div>
                </div>
              </Alert>
            )}

            <Card className="shadow border-0 rounded-lg">
              <div className="p-4 border-bottom bg-white rounded-top">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-1">Campaign Progress</h4>
                    <p className="text-muted mb-0">Complete all required fields</p>
                  </div>
                  <h3 className="mb-0">{Math.round(getCompletionPercentage())}%</h3>
                </div>
                <Progress 
                  value={getCompletionPercentage()} 
                  className="mt-3"
                  style={{ 
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: '#e9ecef'
                  }}
                />
              </div>

              <CardBody className="p-4">
                <Form onSubmit={handleSubmit}>
                  {/* Campaign Name */}
                  <FormGroup className="mb-4">
                    <Label for="campaignName" className="fw-bold h6">
                      Campaign Name
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-tag"></i>
                      </span>
                      <Input
                        type="text"
                        name="campaignName"
                        id="campaignName"
                        placeholder="Enter a memorable name for your campaign"
                        value={campaignData.campaignName}
                        onChange={handleInputChange}
                        className="form-control-lg"
                        required
                      />
                    </div>
                  </FormGroup>

                  {/* Template Selection */}
                  <FormGroup className="mb-4">
                    <Label for="template" className="fw-bold h6">
                      Message Template
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <Input
                        type="select"
                        name="template"
                        id="template"
                        value={campaignData.template}
                        onChange={handleInputChange}
                        className="form-control-lg"
                        required
                      >
                        <option value="">Select a template...</option>
                        {templates.map(template => (
                          <option key={template.id} value={template.id}>
                            {template.name} • {template.category}
                          </option>
                        ))}
                      </Input>
                    </div>
                    {campaignData.template && (
                      <div className="mt-3 p-3 bg-light rounded border">
                        <small className="text-muted d-block mb-1">Template Preview</small>
                        <div className="preview-text">
                          {templates.find(t => t.id === parseInt(campaignData.template))?.previewText}
                        </div>
                      </div>
                    )}
                  </FormGroup>

                  {/* Send Type Selection */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold h6 d-block mb-3">
                      Sending Schedule
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <ButtonGroup className="w-100 shadow-sm">
                      <Button
                        color={campaignData.sendType === 'now' ? 'primary' : 'light'}
                        onClick={() => setCampaignData(prev => ({ ...prev, sendType: 'now' }))}
                        className="py-3 px-4"
                        outline={campaignData.sendType !== 'now'}
                      >
                        <i className="fas fa-bolt me-2"></i>
                        Send Immediately
                      </Button>
                      <Button
                        color={campaignData.sendType === 'later' ? 'primary' : 'light'}
                        onClick={() => setCampaignData(prev => ({ ...prev, sendType: 'later' }))}
                        className="py-3 px-4"
                        outline={campaignData.sendType !== 'later'}
                      >
                        <i className="fas fa-clock me-2"></i>
                        Schedule for Later
                      </Button>
                    </ButtonGroup>
                  </FormGroup>

                  {/* Schedule Time */}
                  {campaignData.sendType === 'later' && (
                    <FormGroup className="mb-4">
                      <Label for="scheduledTime" className="fw-bold h6">
                        Schedule Time
                        <Badge color="primary" pill className="ms-2">Required</Badge>
                      </Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="fas fa-calendar"></i>
                        </span>
                        <Input
                          type="datetime-local"
                          name="scheduledTime"
                          id="scheduledTime"
                          value={campaignData.scheduledTime}
                          onChange={handleInputChange}
                          className="form-control-lg"
                          required
                        />
                      </div>
                    </FormGroup>
                  )}

                  {/* Priority Selection */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold h6">
                      Campaign Priority
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <div className="d-flex gap-2">
                      {['low', 'normal', 'high'].map((priority) => (
                        <Button
                          key={priority}
                          color={campaignData.priority === priority ? 'primary' : 'light'}
                          outline={campaignData.priority !== priority}
                          onClick={() => setCampaignData(prev => ({ ...prev, priority }))}
                          className="flex-grow-1 py-2 text-capitalize"
                        >
                          <i className={`fas fa-${priority === 'low' ? 'angle-down' : priority === 'normal' ? 'equals' : 'angle-up'} me-2`}></i>
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </FormGroup>

                  {/* Group Selection */}
                  <FormGroup className="mb-4">
                    <Label for="groups" className="fw-bold h6">
                      Target Groups
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-users"></i>
                      </span>
                      <Input
                        type="select"
                        name="groups"
                        id="groups"
                        multiple
                        value={campaignData.selectedGroups}
                        onChange={handleGroupSelection}
                        className="form-control-lg"
                        style={{ height: '200px' }}
                      >
                        {groups.map(group => (
                          <option key={group.id} value={group.id}>
                            {group.name} • {group.members.toLocaleString()} members • {group.activity} Activity
                          </option>
                        ))}
                      </Input>
                    </div>
                    <div className="mt-2 d-flex justify-content-between">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        Hold Ctrl/Cmd to select multiple groups
                      </small>
                      <small className="text-primary">
                        Selected: {campaignData.selectedGroups.length} groups
                      </small>
                    </div>
                  </FormGroup>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <Button
                      color="primary"
                      size="lg"
                      type="submit"
                      className="py-3"
                      disabled={isSubmitting}
                      style={{
                        background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(33, 150, 243, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Your Campaign...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Launch Campaign
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>

            {/* Campaign Summary */}
            {campaignData.campaignName && campaignData.template && (
              <Card className="mt-4 shadow-sm border-0">
                <CardBody>
                  <h5 className="mb-3">Campaign Summary</h5>
                  <Row>
                    <Col sm={6}>
                      <p className="mb-1 text-muted">Campaign Name</p>
                      <p className="fw-bold">{campaignData.campaignName}</p>
                    </Col>
                    <Col sm={6}>
                      <p className="mb-1 text-muted">Template</p>
                      <p className="fw-bold">{templates.find(t => t.id === parseInt(campaignData.template))?.name}</p>
                    </Col>
                    <Col sm={6}>
                      <p className="mb-1 text-muted">Schedule</p>
                      <p className="fw-bold">
                        {campaignData.sendType === 'now' ? 'Immediate Send' : 
                         campaignData.scheduledTime ? new Date(campaignData.scheduledTime).toLocaleString() : 
                         'Not Scheduled'}
                      </p>
                    </Col>
                    <Col sm={6}>
                      <p className="mb-1 text-muted">Priority</p>
                      <p className="fw-bold text-capitalize">
                        {campaignData.priority} Priority
                      </p>
                    </Col>
                    <Col sm={6}>
                      <p className="mb-1 text-muted">Selected Groups</p>
                      <p className="fw-bold">
                        {campaignData.selectedGroups.length} Groups Selected
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}

            {/* Help Card */}
            <Card className="mt-4 shadow-sm border-0 bg-light">
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <i className="fas fa-lightbulb text-warning me-2 fa-lg"></i>
                  <h5 className="mb-0">Tips for Better Campaign Performance</h5>
                </div>
                <ul className="mb-0 ps-3">
                  <li className="mb-2">Choose peak activity hours for better engagement</li>
                  <li className="mb-2">Personalize your message using template variables</li>
                  <li className="mb-2">Test your campaign with a small group first</li>
                  <li>Monitor delivery rates and user responses</li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Custom CSS */}
        <style>
          {`
            .form-control-lg, .input-group-text {
              font-size: 1rem;
              padding: 0.75rem 1rem;
            }

            .form-control:focus {
              box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
            }

            .btn:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .card {
              transition: all 0.3s ease;
            }

            .preview-text {
              font-size: 0.9rem;
              color: #666;
            }

            @keyframes slideDown {
              from {
                transform: translateY(-10px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }

            /* Custom scrollbar for select multiple */
            select[multiple] {
              scrollbar-width: thin;
              scrollbar-color: #90A4AE #CFD8DC;
            }

            select[multiple]::-webkit-scrollbar {
              width: 8px;
            }

            select[multiple]::-webkit-scrollbar-track {
              background: #CFD8DC;
              border-radius: 4px;
            }

            select[multiple]::-webkit-scrollbar-thumb {
              background-color: #90A4AE;
              border-radius: 4px;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
              .card {
                margin: 0;
                border-radius: 0;
              }

              .container-fluid {
                padding: 0;
              }

              .btn-group {
                flex-direction: column;
              }

              .btn-group .btn {
                border-radius: 4px !important;
                margin-bottom: 0.5rem;
              }
            }
          `}
        </style>
      </Container>
    </div>
  );
};

export default WhatsAppCampaigns;
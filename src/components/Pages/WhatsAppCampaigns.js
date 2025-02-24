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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    template: false,
    groups: false
  });

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

  const toggleDropdown = (type) => {
    setDropdownOpen(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleTemplateSelect = (templateId) => {
    setCampaignData(prev => ({
      ...prev,
      template: templateId
    }));
    toggleDropdown('template');
  };

  const handleGroupSelect = (groupId) => {
    setCampaignData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter(id => id !== groupId)
        : [...prev.selectedGroups, groupId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowSuccess(true);
    setIsSubmitting(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getCompletionPercentage = () => {
    let filled = 0;
    const total = 5;
    if (campaignData.campaignName) filled++;
    if (campaignData.template) filled++;
    if (campaignData.selectedGroups.length > 0) filled++;
    if (campaignData.sendType === 'now' || campaignData.scheduledTime) filled++;
    if (campaignData.priority) filled++;
    return (filled / total) * 100;
  };

  return (
    <div className="py-4">
      <Container>
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
                      <Badge color="primary" pill className="ms-2">Required</Badge>
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

                  {/* Template Selection */}
                  <FormGroup className="mb-4 position-relative">
                    <Label className="fw-bold">
                      Message Template
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <Dropdown isOpen={dropdownOpen.template} toggle={() => toggleDropdown('template')} className="w-100">
                      <DropdownToggle caret color="light" className="w-100 text-start">
                        {campaignData.template 
                          ? templates.find(t => t.id === parseInt(campaignData.template))?.name 
                          : 'Select a template...'}
                      </DropdownToggle>
                      <DropdownMenu className="w-100">
                        {templates.map(template => (
                          <DropdownItem 
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            {template.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>

                  {/* Priority Selection */}
                  {/* <FormGroup className="mb-4">
                    <Label className="fw-bold">
                      Priority
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <ButtonGroup className="w-100">
                      {['low', 'normal', 'high'].map((priority) => (
                        <Button
                          key={priority}
                          color={campaignData.priority === priority ? 'primary' : 'light'}
                          onClick={() => setCampaignData(prev => ({ ...prev, priority }))}
                          className="text-capitalize"
                        >
                          {priority}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </FormGroup> */}
                </Col>

                {/* Column 2 */}
                <Col md={6}>
                  {/* Send Type */}
                  <FormGroup className="mb-4">
                    <Label className="fw-bold">
                      Sending Schedule
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <ButtonGroup className="w-100">
                      <Button
                        color={campaignData.sendType === 'now' ? 'primary' : 'light'}
                        onClick={() => setCampaignData(prev => ({ ...prev, sendType: 'now' }))}
                      >
                        Send Now
                      </Button>
                      <Button
                        color={campaignData.sendType === 'later' ? 'primary' : 'light'}
                        onClick={() => setCampaignData(prev => ({ ...prev, sendType: 'later' }))}
                      >
                        Schedule
                      </Button>
                    </ButtonGroup>
                    {campaignData.sendType === 'later' && (
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
                      <Badge color="primary" pill className="ms-2">Required</Badge>
                    </Label>
                    <Dropdown isOpen={dropdownOpen.groups} toggle={() => toggleDropdown('groups')} className="w-100">
                      <DropdownToggle caret color="light" className="w-100 text-start">
                        {campaignData.selectedGroups.length 
                          ? `${campaignData.selectedGroups.length} groups selected`
                          : 'Select target groups...'}
                      </DropdownToggle>
                      <DropdownMenu className="w-100">
                        {groups.map(group => (
                          <DropdownItem 
                            key={group.id}
                            onClick={() => handleGroupSelect(group.id)}
                            className="d-flex align-items-center"
                          >
                            <input
                              type="checkbox"
                              checked={campaignData.selectedGroups.includes(group.id)}
                              onChange={() => {}}
                              className="me-2"
                            />
                            {group.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>
                </Col>
              </Row>

              {/* Submit Button - Full Width */}
              <Row>
                <Col>
                  <Button
                    color="primary"
                    type="submit"
                    className="w-100 mt-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Campaign...
                      </>
                    ) : (
                      'Launch Campaign'
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default WhatsAppCampaigns;
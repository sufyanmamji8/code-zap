import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Input,
  Table,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';

const WhatsAppCampaigns = () => {
  const [activeTab, setActiveTab] = useState('1');
  
  // Sample campaign data
  const campaigns = [
    { id: 1, name: 'Eid Special Offer', status: 'Active', sent: 1200, delivered: 1150, read: 980 },
    { id: 2, name: 'Customer Feedback', status: 'Scheduled', sent: 0, delivered: 0, read: 0 },
    { id: 3, name: 'Product Launch', status: 'Completed', sent: 2500, delivered: 2480, read: 2100 }
  ];

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Scheduled': return 'warning';
      case 'Completed': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="p-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">WhatsApp Campaigns</h2>
              <p className="text-muted">Manage your marketing campaigns</p>
            </div>
            <Button color="success">
              <i className="fas fa-plus mr-2"></i> New Campaign
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md="4">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">Total Campaigns</p>
                  <h3>12</h3>
                </div>
                <div className="text-success">
                  <i className="fas fa-chart-line fa-2x"></i>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">Total Messages</p>
                  <h3>5,240</h3>
                </div>
                <div className="text-primary">
                  <i className="fas fa-envelope fa-2x"></i>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">Success Rate</p>
                  <h3>98.5%</h3>
                </div>
                <div className="text-warning">
                  <i className="fas fa-percentage fa-2x"></i>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={activeTab === '1' ? 'active' : ''}
            onClick={() => toggle('1')}
          >
            All Campaigns
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '2' ? 'active' : ''}
            onClick={() => toggle('2')}
          >
            Active
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '3' ? 'active' : ''}
            onClick={() => toggle('3')}
          >
            Scheduled
          </NavLink>
        </NavItem>
      </Nav>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md="6">
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="form-control-lg"
          />
        </Col>
        <Col md="6" className="d-flex justify-content-end">
          <Button color="secondary" className="mr-2">
            Filter
          </Button>
          <Button color="secondary">
            Export
          </Button>
        </Col>
      </Row>

      {/* Campaigns Table */}
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Card>
            <CardBody>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Campaign Name</th>
                    <th>Status</th>
                    <th>Sent</th>
                    <th>Delivered</th>
                    <th>Read</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(campaign => (
                    <tr key={campaign.id}>
                      <td>{campaign.name}</td>
                      <td>
                        <Badge color={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td>{campaign.sent}</td>
                      <td>{campaign.delivered}</td>
                      <td>{campaign.read}</td>
                      <td>
                        <Button color="primary" size="sm" className="mr-2">
                          Edit
                        </Button>
                        <Button color="danger" size="sm">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </TabPane>
      </TabContent>
    </Container>
  );
};

export default WhatsAppCampaigns;
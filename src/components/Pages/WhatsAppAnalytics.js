import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Spinner,
  Container,
  Input,
  Label,
  FormGroup
} from 'reactstrap';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { TrendingUp, MessageCircle, DollarSign, FileQuestion, Search } from 'lucide-react';

// Define consistent colors
const CONVERSATION_COLOR = 'rgba(54, 162, 235, 0.6)';
const COST_COLOR = 'rgba(255, 99, 132, 0.6)';

const NoDataState = () => (
  <div className="text-center py-5">
    <div className="mb-4">
      <FileQuestion size={64} className="text-muted" strokeWidth={1.5} />
    </div>
    <h5 className="mb-2">No Data Found</h5>
    <p className="text-muted mb-4">
      We couldn't find any analytics data for the selected time period.
    </p>
    <div className="d-flex gap-2 justify-content-center">
      <div className="bg-light rounded px-3 py-2 text-muted small">
        <Search size={14} className="me-1" />
        Try adjusting your date range
      </div>
    </div>
  </div>
);

const WhatsAppAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.companyId) {
      setCompanyId(location.state.companyId);
      setCompanyName(location.state.companyName || localStorage.getItem('selectedCompanyName') || '');
    } else if (localStorage.getItem('selectedCompanyId')) {
      setCompanyId(localStorage.getItem('selectedCompanyId'));
      setCompanyName(localStorage.getItem('selectedCompanyName') || '');
    }
  }, [location]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!companyId || !token) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
        const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
  
        const response = await axios.post(
          `http://192.168.0.108:25483/api/v1/analytics/fetchConversationAnalytics`,
          { companyId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            params: {
              fields: `conversation_analytics.start(${startTimestamp}).end(${endTimestamp}).granularity(DAILY).phone_numbers(966538897170)`
            }
          }
        );
  
        if (response.data.success) {
          const formattedData = response.data.data.conversation_analytics.data[0].data_points.map(
            point => ({
              date: new Date(point.start * 1000).toLocaleDateString(),
              conversations: point.conversation,
              cost: Number(point.cost.toFixed(3)),
            })
          );
          setAnalyticsData(formattedData);
        } else {
          toast.error('Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error(`No analytics Found For ${companyName}`);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAnalytics();
  }, [companyId, token, startDate, endDate]);

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <Col md="4" className="mb-4 mb-md-0">
      <Card className="border-0 shadow-sm h-100">
        <CardBody className="d-flex align-items-center p-4">
          <div 
            className="me-3 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: bgColor,
              width: '48px',
              height: '48px'
            }}
          >
            <Icon size={24} color={color} />
          </div>
          <div>
            <p className="text-muted mb-1 small">{title}</p>
            <h4 className="mb-0 fw-bold">{value}</h4>
          </div>
        </CardBody>
      </Card>
    </Col>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 shadow-sm rounded">
          <p className="mb-1 fw-bold">{label}</p>
          <p className="mb-1" style={{ color: CONVERSATION_COLOR }}>
            Conversations: {payload[0].value}
          </p>
          <p className="mb-0" style={{ color: COST_COLOR }}>
            Cost: ${payload[1].value.toFixed(3)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={analyticsData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" tick={{ fill: '#6c757d' }} stroke="#6c757d" />
        <YAxis yAxisId="left" tick={{ fill: '#6c757d' }} stroke="#6c757d" />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6c757d' }} stroke="#6c757d" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="conversations"
          fill={CONVERSATION_COLOR}
          radius={[4, 4, 0, 0]}
          name="Conversations"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cost"
          stroke={COST_COLOR}
          strokeWidth={2}
          dot={{ fill: COST_COLOR, strokeWidth: 2 }}
          activeDot={{ fill: COST_COLOR }}
          name="Cost ($)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <Container fluid className="px-4 py-4">
      <Card className="shadow-lg rounded-3 border-0 overflow-hidden">
        <CardHeader className="bg-white border-bottom-0 py-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h4 className="mb-1 fw-bold">WhatsApp Analytics Dashboard</h4>
              {companyName && (
                <div className="text-muted">
                  <TrendingUp size={16} className="me-2" />
                  {companyName}
                </div>
              )}
            </div>
            <Row className="g-3 align-items-center">
              <Col xs="auto">
                <FormGroup className="mb-0">
                  <Label for="startDate" className="me-2 small">From:</Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ width: '140px' }}
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col xs="auto">
                <FormGroup className="mb-0">
                  <Label for="endDate" className="me-2 small">To:</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ width: '140px' }}
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
        </CardHeader>
        <CardBody className="bg-light bg-opacity-50 p-4">
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner color="primary" className="mb-2" />
              <div className="text-muted">Loading analytics data...</div>
            </div>
          ) : !companyId ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <Search size={64} className="text-muted" strokeWidth={1.5} />
              </div>
              <h5 className="mb-2">Select a Company</h5>
              <p className="text-muted">
                Please select a company to view its WhatsApp analytics data.
              </p>
            </div>
          ) : analyticsData.length === 0 ? (
            <NoDataState />
          ) : (
            <>
              <Row className="mb-4">
                <StatCard
                  title="Total Conversations"
                  value={analyticsData.reduce((sum, item) => sum + item.conversations, 0)}
                  icon={MessageCircle}
                  color={CONVERSATION_COLOR}
                  bgColor="rgba(54, 162, 235, 0.1)"
                />
                <StatCard
                  title="Total Cost"
                  value={`$${analyticsData.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}`}
                  icon={DollarSign}
                  color={COST_COLOR}
                  bgColor="rgba(255, 99, 132, 0.1)"
                />
                <StatCard
                  title="Avg Cost per Conversation"
                  value={`$${(analyticsData.reduce((sum, item) => sum + item.cost, 0) / 
                    analyticsData.reduce((sum, item) => sum + item.conversations, 0)).toFixed(3)}`}
                  icon={TrendingUp}
                  color={COST_COLOR}
                  bgColor="rgba(255, 99, 132, 0.1)"
                />
              </Row>
              <Card className="border-0 shadow-sm">
                <CardBody>
                  {renderChart()}
                </CardBody>
              </Card>
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default WhatsAppAnalytics;
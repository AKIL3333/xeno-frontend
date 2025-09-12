import React, { useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';
const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tenantName = auth.tenantName;

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(`/dashboard/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'x-tenant-id': auth.tenantId
        }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Reset data on tab change to prevent old tab state issues
  useEffect(() => {
    setData(null);
    fetchData(activeTab);
  }, [activeTab]);

  // Render charts or table based on active tab
  const renderChart = () => {
    if (!data) return <p>No data available</p>;

    switch (activeTab) {
      case 'orders-by-date':
      case 'new-customers-by-date':
      case 'avg-order-value-by-date':
        if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={
                  activeTab === 'orders-by-date'
                    ? 'orders'
                    : activeTab === 'new-customers-by-date'
                    ? 'newCustomers'
                    : 'avgOrderValue'
                }
                stroke="#007bff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'top-customers':
        if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="customer" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spend" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'summary':
        // Ensure data is an object
        const summaryObj = !data || Array.isArray(data) ? {} : data;
        const summaryData = Object.entries(summaryObj).map(([key, value]) => ({ name: key, value }));

        return (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Metric</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'
                    }}
                  >
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {row.name.replace(/_/g, ' ').toUpperCase()}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <p>Unknown tab</p>;
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#ff4800ff' }}>Data Ingestion & Insights Applications</h1>
        <h1 style={{ color: '#007bff' }}>Welcome, {tenantName}</h1>
      </header>

      <nav style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {['summary', 'orders-by-date', 'top-customers', 'new-customers-by-date', 'avg-order-value-by-date'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab ? '#007bff' : '#f0f0f0',
              color: activeTab === tab ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {tab.replace(/-/g, ' ').toUpperCase()}
          </button>
        ))}
      </nav>

      <section style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '320px' }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && renderChart()}
      </section>
    </div>
  );
};

export default Dashboard;

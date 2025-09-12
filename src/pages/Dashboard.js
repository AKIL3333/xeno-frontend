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

  useEffect(() => {
    setData(null);
    fetchData(activeTab);
  }, [activeTab]);

  const renderChart = () => {
    if (!data) return <p>No data available</p>;

    switch (activeTab) {
      case 'orders-by-date':
      case 'new-customers-by-date':
      case 'avg-order-value-by-date':
        if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Line
                type="monotone"
                dataKey={
                  activeTab === 'orders-by-date'
                    ? 'orders'
                    : activeTab === 'new-customers-by-date'
                    ? 'newCustomers'
                    : 'avgOrderValue'
                }
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1' }}
                activeDot={{ r: 7, fill: '#f97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'top-customers':
        if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis dataKey="customer" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="spend" fill="url(#colorSpend)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'summary':
        const summaryObj = !data || Array.isArray(data) ? {} : data;
        const summaryData = Object.entries(summaryObj).map(([key, value]) => ({ name: key, value }));

        return (
          <div className="summary-wrapper">
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.name.replace(/_/g, ' ').toUpperCase()}</td>
                    <td>{row.value}</td>
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
    <div className="dashboard-container">
      <header>
        <h1 className="title-gradient">Data Ingestion & Insights Applications</h1>
        <h1 className="subtitle">Welcome, {tenantName}</h1>
      </header>

      <nav>
        {['summary', 'orders-by-date', 'top-customers', 'new-customers-by-date', 'avg-order-value-by-date'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab.replace(/-/g, ' ').toUpperCase()}
          </button>
        ))}
      </nav>

      <section className="metrics-section">
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && renderChart()}
      </section>
    </div>
  );
};

export default Dashboard;

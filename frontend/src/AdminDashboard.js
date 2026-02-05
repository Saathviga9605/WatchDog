import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  User, 
  Search, 
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  FileCheck,
  BarChart3,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('today');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeNav, setActiveNav] = useState('dashboard');
  
  const { user, logout } = useAuth();
  const { prompts, systemMetrics } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleViewDetails = (promptId) => {
    navigate(`/admin/analysis/${promptId}`);
  };

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let filtered = prompts.filter(prompt => {
      const matchesSearch = prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prompt.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prompt.response.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || prompt.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'timestamp') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [prompts, searchQuery, statusFilter, sortBy, sortOrder]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'var(--status-safe)';
    if (confidence >= 50) return 'var(--status-warning)';
    return 'var(--status-blocked)';
  };

  const getRagStatusColor = (status) => {
    switch (status) {
      case 'Yes': return 'var(--status-safe)';
      case 'Partial': return 'var(--status-warning)';
      case 'No': return 'var(--status-blocked)';
      default: return 'var(--text-tertiary)';
    }
  };

  const statsCards = [
    {
      title: 'Total Prompts',
      value: systemMetrics.totalPrompts.toLocaleString(),
      icon: <Activity size={24} />,
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Blocked Prompts',
      value: systemMetrics.blockedPrompts.toLocaleString(),
      icon: <XCircle size={24} />,
      change: '-8%',
      trend: 'down'
    },
    {
      title: 'Avg Confidence',
      value: `${systemMetrics.averageConfidence}%`,
      icon: <TrendingUp size={24} />,
      change: '+2%',
      trend: 'up'
    },
    {
      title: 'System Uptime',
      value: systemMetrics.uptime,
      icon: <Shield size={24} />,
      change: systemMetrics.responseTime,
      trend: 'neutral'
    }
  ];

  return (
    <div className="admin-dashboard-layout">
      {/* Top Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <Shield size={24} />
            <span>WATCHDOG</span>
          </div>
        </div>
        
        <div className="navbar-right">
          <div className="navbar-user">
            <User size={16} />
            <span className="user-name">{user?.name || user?.email}</span>
            <span className="user-role">Administrator</span>
          </div>
          <motion.button
            className="navbar-logout"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Logout"
          >
            <LogOut size={16} />
          </motion.button>
        </div>
      </nav>

      {/* Main Layout Container */}
      <div className="admin-layout-container">
        {/* Left Sidebar */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <motion.button
              className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveNav('dashboard')}
              whileHover={{ x: 4 }}
              whileTap={{ x: 2 }}
            >
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </motion.button>
            
            <motion.button
              className={`nav-item ${activeNav === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveNav('logs')}
              whileHover={{ x: 4 }}
              whileTap={{ x: 2 }}
            >
              <FileText size={18} />
              <span>Activity Logs</span>
            </motion.button>
            
            <motion.button
              className={`nav-item ${activeNav === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveNav('analysis')}
              whileHover={{ x: 4 }}
              whileTap={{ x: 2 }}
            >
              <AlertTriangle size={18} />
              <span>Current Prompt</span>
            </motion.button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-content">
          {/* Stats Cards */}
          <div className="stats-container">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="stat-top">
                  <div className="stat-icon-wrapper">
                    {stat.icon}
                  </div>
                  <div className={`stat-trend trend-${stat.trend}`}>
                    {stat.trend === 'up' && <TrendingUp size={14} />}
                    {stat.trend === 'down' && <TrendingDown size={14} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <motion.div 
                  className="stat-value"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  {stat.value}
                </motion.div>
                <div className="stat-label">{stat.title}</div>
              </motion.div>
            ))}
          </div>

          {/* Content Card */}
          <motion.div
            className="content-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Card Header with Controls */}
            <div className="card-header">
              <h2 className="card-title">Prompt Activity</h2>
              
              <div className="card-controls">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search prompts, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="control-select"
                >
                  <option value="all">All Status</option>
                  <option value="Safe">Safe</option>
                  <option value="Warning">Warning</option>
                  <option value="Blocked">Blocked</option>
                </select>

                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="control-select"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>

                <motion.button
                  className="control-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Export data"
                >
                  <Download size={16} />
                </motion.button>

                <motion.button
                  className="control-button"
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  title="Refresh"
                >
                  <RefreshCw size={16} />
                </motion.button>
              </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
              <motion.table 
                className="data-table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <thead>
                  <tr>
                    <th onClick={() => handleSort('timestamp')}>
                      <Calendar size={14} />
                      Timestamp
                    </th>
                    <th>Prompt</th>
                    <th>GPT Answer</th>
                    <th onClick={() => handleSort('confidence')}>
                      Confidence
                    </th>
                    <th>
                      <Database size={14} />
                      RAG
                    </th>
                    <th>
                      <FileCheck size={14} />
                      Contradiction
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredPrompts.map((prompt, index) => (
                      <motion.tr
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className={`table-row ${prompt.flagged ? 'flagged' : ''}`}
                      >
                        <td className="cell-timestamp">
                          <span className="timestamp-badge">{prompt.timestamp}</span>
                        </td>
                        <td className="cell-prompt">
                          <div className="text-truncate" title={prompt.prompt}>
                            {prompt.prompt.length > 50 
                              ? `${prompt.prompt.substring(0, 50)}...`
                              : prompt.prompt
                            }
                          </div>
                        </td>
                        <td className="cell-response">
                          <div className="text-truncate" title={prompt.response}>
                            {prompt.response.length > 60 
                              ? `${prompt.response.substring(0, 60)}...`
                              : prompt.response
                            }
                          </div>
                        </td>
                        <td className="cell-confidence">
                          <div className="confidence-display">
                            <div className="confidence-bar">
                              <motion.div 
                                className="confidence-fill"
                                style={{ backgroundColor: getConfidenceColor(prompt.confidence) }}
                                initial={{ width: 0 }}
                                animate={{ width: `${prompt.confidence}%` }}
                                transition={{ duration: 0.8, delay: 0.3 + index * 0.02 }}
                              />
                            </div>
                            <span style={{ color: getConfidenceColor(prompt.confidence) }}>
                              {prompt.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="cell-rag">
                          <span 
                            className={`badge badge-${prompt.ragStatus.toLowerCase()}`}
                          >
                            {prompt.ragStatus}
                          </span>
                        </td>
                        <td className="cell-contradiction">
                          <div className="status-indicator">
                            {prompt.contradictionCheck === 'Pass' ? (
                              <>
                                <CheckCircle size={14} className="icon-safe" />
                                <span className="text-safe">Pass</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={14} className="icon-blocked" />
                                <span className="text-blocked">Fail</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="cell-actions">
                          <motion.button
                            className="action-button"
                            onClick={() => handleViewDetails(prompt.id)}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            title="View details"
                          >
                            <Eye size={16} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
              
              {filteredPrompts.length === 0 && (
                <motion.div 
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Search size={48} />
                  <h3>No prompts found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
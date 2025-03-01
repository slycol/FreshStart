import React, { useState } from 'react';
import { X, User, Lock, Clock, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import './App.css';

// Main App Component
const CommunityServiceTracker = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('hours');
  const [zipCode, setZipCode] = useState('');

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <div className="container header-container">
          <h1 className="header-title">Community Service Tracker</h1>
          <button 
            onClick={() => setLoggedIn(false)}
            className="logout-button"
          >
            <User size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Navigation Tabs */}
        <div className="tabs-container">
          <button
            onClick={() => setActiveTab('hours')}
            className={`tab-button ${activeTab === 'hours' ? 'tab-active' : 'tab-inactive'}`}
          >
            <Clock size={20} />
            Hours Tracker
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`tab-button ${activeTab === 'opportunities' ? 'tab-active' : 'tab-inactive'}`}
          >
            <MapPin size={20} />
            Future Opportunities
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'hours' ? (
            <HoursTracker />
          ) : (
            <FutureOpportunities zipCode={zipCode} setZipCode={setZipCode} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer>
        © {new Date().getFullYear()} Community Service Tracker | Making a difference together
      </footer>
    </div>
  );
};

// Login Component
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, authenticate with server
    // For demo purposes, we'll just log in
    onLogin();
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Community Service</h1>
          <p className="login-subtitle">Login to track your impact</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <div className="input-container">
              <div className="input-icon">
                <User size={18} />
              </div>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-container">
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Login
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="signup-link">
          Don't have an account?{" "}
          <a href="#">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

// Hours Tracker Component
const HoursTracker = () => {
  // This would come from your backend in a real application
  const serviceData = {
    totalHours: 100,
    completedHours: 42,
    remainingHours: 58,
    completedEvents: [
      { id: 1, name: "Beach Cleanup", date: "2025-02-15", hours: 4 },
      { id: 2, name: "Food Bank Volunteer", date: "2025-02-22", hours: 6 },
      { id: 3, name: "Senior Center Helper", date: "2025-02-28", hours: 3 },
      { id: 4, name: "Park Restoration", date: "2025-03-01", hours: 5 },
      { id: 5, name: "Homeless Shelter", date: "2025-03-15", hours: 8 },
      { id: 6, name: "Library Reading Program", date: "2025-04-05", hours: 4 },
      { id: 7, name: "Animal Shelter", date: "2025-04-12", hours: 6 },
      { id: 8, name: "Community Garden", date: "2025-04-25", hours: 6 },
    ]
  };

  const percentComplete = (serviceData.completedHours / serviceData.totalHours) * 100;

  return (
    <div>
      <h2 className="section-title">Your Service Hours</h2>
      
      {/* Progress Overview */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-label stat-label-blue">Total Hours Needed</div>
          <div className="stat-value">{serviceData.totalHours} hours</div>
        </div>
        
        <div className="stat-card stat-card-green">
          <div className="stat-label stat-label-green">Hours Completed</div>
          <div className="stat-value">{serviceData.completedHours} hours</div>
        </div>
        
        <div className="stat-card stat-card-purple">
          <div className="stat-label stat-label-purple">Hours Remaining</div>
          <div className="stat-value">{serviceData.remainingHours} hours</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <span>Progress</span>
          <span>{percentComplete.toFixed(0)}% Complete</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>
      
      {/* Completed Events */}
      <div>
        <h3 className="events-title">Completed Service Events</h3>
        <div className="events-container">
          {serviceData.completedEvents.length > 0 ? (
            <div className="table-responsive">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceData.completedEvents.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div className="event-name">
                          <CheckCircle size={16} />
                          <span className="event-name-text">{event.name}</span>
                        </div>
                      </td>
                      <td className="event-date">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="hours-badge">
                          {event.hours} hours
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-events">
              You haven't completed any service events yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Future Opportunities Component
const FutureOpportunities = ({ zipCode, setZipCode }) => {
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Sample data - would come from an API in a real application
  const opportunities = [
    { 
      id: 1, 
      title: "Beach Cleanup Day", 
      organization: "Coastal Conservation Network",
      date: "2025-03-15",
      location: "Oceanview Beach",
      distance: "3.2",
      hours: 4,
      spots: 12
    },
    { 
      id: 2, 
      title: "Food Bank Volunteers Needed", 
      organization: "Community Food Bank",
      date: "2025-03-20",
      location: "Downtown Center",
      distance: "1.5",
      hours: 3,
      spots: 8
    },
    { 
      id: 3, 
      title: "Senior Center Assistance", 
      organization: "Elder Care Alliance",
      date: "2025-03-22",
      location: "Sunshine Senior Living",
      distance: "4.7",
      hours: 5,
      spots: 4
    },
    { 
      id: 4, 
      title: "Park Restoration Project", 
      organization: "Parks & Recreation Dept",
      date: "2025-04-05",
      location: "Memorial Park",
      distance: "2.3",
      hours: 6,
      spots: 20
    },
    { 
      id: 5, 
      title: "Animal Shelter Helper", 
      organization: "Furry Friends Rescue",
      date: "2025-04-12",
      location: "Hope Animal Shelter",
      distance: "5.1",
      hours: 4,
      spots: 6
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchPerformed(true);
    // In a real app, this would trigger an API call with the zip code
  };

  return (
    <div>
      <h2 className="section-title">Find Service Opportunities</h2>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <div className="search-input-group">
            <label htmlFor="zipCode" className="search-label">
              Enter your zip code to find nearby opportunities
            </label>
            <input
              type="text"
              id="zipCode"
              className="search-input"
              placeholder="Enter zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              pattern="[0-9]{5}"
              maxLength={5}
            />
          </div>
          <div>
            <button
              type="submit"
              className="search-button"
            >
              Search
            </button>
          </div>
        </div>
      </form>
      
      {/* Results */}
      {searchPerformed && (
        <div>
          <div className="results-header">
            <h3 className="results-title">
              Opportunities near {zipCode}
            </h3>
            <span className="results-count">
              {opportunities.length} results found
            </span>
          </div>
          
          <div className="opportunity-list">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="opportunity-card">
                <div className="opportunity-content">
                  <div className="opportunity-header">
                    <div>
                      <h4 className="opportunity-title">{opportunity.title}</h4>
                      <p className="opportunity-org">{opportunity.organization}</p>
                      <div className="opportunity-tags">
                        <span className="tag tag-blue">
                          <Clock size={12} /> {opportunity.hours} hours
                        </span>
                        <span className="tag tag-green">
                          {opportunity.spots} spots available
                        </span>
                        <span className="tag tag-purple">
                          <MapPin size={12} /> {opportunity.distance} miles
                        </span>
                      </div>
                      <div className="opportunity-details">
                        <div><strong className="opportunity-detail-label">Date:</strong> {new Date(opportunity.date).toLocaleDateString()}</div>
                        <div><strong className="opportunity-detail-label">Location:</strong> {opportunity.location}</div>
                      </div>
                    </div>
                  </div>
                  <div className="opportunity-footer">
                    <button className="signup-button">
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!searchPerformed && (
        <div className="no-results">
          <div className="no-results-title">Ready to make a difference?</div>
          <p className="no-results-desc">Enter your zip code above to find service opportunities in your area.</p>
          <div className="no-results-stats">
            Join over 5,000 volunteers in your community who have logged more than 25,000 service hours this year!
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityServiceTracker;
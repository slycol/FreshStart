import React, { useState, useEffect } from 'react'; // Import useEffect
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
    const [serviceData, setServiceData] = useState({
        totalHours: 100,
        completedHours: 0,
        remainingHours: 100,
        completedEvents: []
    });
    const [newEvent, setNewEvent] = useState({ name: '', date: '', hours: '', description: '' });
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);   // Add error state

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/logs'); // Replace with your Flask API URL
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Transform the data to match the expected format
                const completedEvents = data.map(log => ({
                    id: log.id,
                    name: log.name,
                    date: log.date,
                    hours: parseInt(log.hours, 10), // Ensure hours is a number
                    description: log.description
                }));

                const completedHours = completedEvents.reduce((sum, event) => sum + event.hours, 0);

                setServiceData({
                    ...serviceData,
                    completedEvents: completedEvents,
                    completedHours: completedHours,
                    remainingHours: serviceData.totalHours - completedHours
                });
                setLoading(false);

            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };

        fetchLogs();
    }, []); // Empty dependency array means this runs once on component mount

    const handleInputChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/log_hours', { // Replace with your Flask API URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Optimistically update the UI
            const newEventToAdd = {
                ...newEvent,
                hours: parseInt(newEvent.hours, 10),
                id: serviceData.completedEvents.length + 1, // Simple ID generation
                date: newEvent.date
            };

            setServiceData({
                ...serviceData,
                completedEvents: [...serviceData.completedEvents, newEventToAdd],
                completedHours: serviceData.completedHours + parseInt(newEvent.hours, 10),
                remainingHours: serviceData.remainingHours - parseInt(newEvent.hours, 10)
            });

            // Clear the form
            setNewEvent({ name: '', date: '', hours: '', description: '' });
        } catch (e) {
            setError(e);
        }
    };
    const percentComplete = (serviceData.completedHours / serviceData.totalHours) * 100;
    if (loading) {
        return <div>Loading service logs...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

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
            {/* Add Event Form */}
            <form onSubmit={handleSubmit} className="add-event-form">
                <h3>Add New Event</h3>
                <label>
                    Event Name:
                    <input
                        type="text"
                        name="name"
                        value={newEvent.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={newEvent.date}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Hours:
                    <input
                        type="number"
                        name="hours"
                        value={newEvent.hours}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={newEvent.description}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Add Event</button>
                {error && <div className="error">Error: {error.message}</div>}
            </form>
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
                                </div>
                                <div className="opportunity-footer">
                                    <button className="signup-button">
                                        Sign Up
                                    </button>
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

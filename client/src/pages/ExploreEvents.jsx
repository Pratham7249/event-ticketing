import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const ExploreEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    // Use API_URL from context if available, or fallback
    const { API_URL } = useContext(AuthContext) || { API_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api' };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API_URL}/events/public`);
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [API_URL]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Explore Upcoming Events</h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Discover and book tickets for the hottest events happening around you.
                    From tech conferences to music festivals.
                </p>
                <div className="mt-8">
                    <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                        Organizer Login
                    </Link>
                </div>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto p-6 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => {
                        const isFullyBooked = event.bookedTickets >= event.totalTickets;
                        return (
                            <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                                <div className={`h-32 ${isFullyBooked ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-400 to-indigo-500'} flex items-center justify-center`}>
                                    <span className="text-white text-4xl font-bold opacity-30">EVENT</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{event.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">{event.description || 'No description available.'}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="w-4 h-4 mr-2">📅</span>
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="w-4 h-4 mr-2">📍</span>
                                            {event.venue}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/p/event/${event._id}`}
                                        className={`block w-full text-center py-2 rounded-lg font-semibold transition ${isFullyBooked
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {isFullyBooked ? 'Sold Out' : 'Book Ticket'}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">No upcoming events found. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExploreEvents;

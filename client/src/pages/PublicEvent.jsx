import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PublicEvent = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({ userName: '', userEmail: '' });
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text, ticketId? }
    const [loading, setLoading] = useState(true);

    // Ideally this should be from context or .env, simplified here
    const API_URL = 'http://localhost:5005/api';

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${API_URL}/events/${eventId}`);
                setEvent(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const res = await axios.post(`${API_URL}/registrations`, {
                eventId,
                ...formData
            });

            if (res.data.status === 'approved') {
                setMessage({ type: 'success', text: 'Registration Successful! Here is your ticket.', ticketId: res.data.ticketId });
            } else {
                setMessage({ type: 'info', text: 'Registration received. Current status: Pending approval.', ticketId: res.data.ticketId });
            }
            setFormData({ userName: '', userEmail: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Registration failed' });
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!event) return <div className="flex items-center justify-center min-h-screen">Event not found</div>;

    const isFullyBooked = event.bookedTickets >= event.totalTickets;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
                {/* Event Details Section */}
                <div className="md:w-1/2 p-8 bg-blue-600 text-white flex flex-col justify-center">
                    <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                    <p className="text-blue-100 mb-6">{event.description || 'No description provided.'}</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold w-20">Date:</span>
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold w-20">Venue:</span>
                            <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold w-20">Tickets:</span>
                            <span>{isFullyBooked ? 'SOLD OUT' : `${event.totalTickets - event.bookedTickets} remaining`}</span>
                        </div>
                    </div>
                </div>

                {/* Registration Form Section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' :
                            message.type === 'info' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            <p className="font-bold mb-2">{message.text}</p>
                            {message.ticketId && (
                                <div className="mt-2 text-sm">
                                    <p className="mb-2">Ticket ID: <span className="font-mono bg-white px-2 py-1 rounded border">{message.ticketId}</span></p>
                                    {message.type === 'success' && (
                                        <Link to={`/ticket/${message.ticketId}`} className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                                            View Ticket
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {!message && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Register Now</h2>
                            {isFullyBooked ? (
                                <div className="text-center p-6 bg-gray-100 rounded-lg">
                                    <h3 className="text-xl font-bold text-gray-500">Event Sold Out</h3>
                                    <p className="text-gray-400">Sorry, no more tickets are available.</p>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-600 text-sm font-bold mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={formData.userName}
                                            onChange={onChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 text-sm font-bold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="userEmail"
                                            value={formData.userEmail}
                                            onChange={onChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]"
                                    >
                                        Get Ticket
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicEvent;

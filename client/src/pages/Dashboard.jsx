import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';

const Dashboard = () => {
    const { user, logout, API_URL } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', date: '', venue: '', totalTickets: '', approvalMode: 'auto'
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events/my-events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', newEvent);
            setShowModal(false);
            fetchEvents();
            setNewEvent({ title: '', description: '', date: '', venue: '', totalTickets: '', approvalMode: 'auto' });
        } catch (err) {
            console.error(err);
            alert('Error creating event');
        }
    };

    const onChange = (e) => setNewEvent({ ...newEvent, [e.target.name]: e.target.value });

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Event Manager Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.name}</span>
                    <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
                </div>
            </nav>

            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Events</h2>
                    <div className="flex gap-4">
                        <Link to="/explore" className="text-blue-600 hover:text-blue-800 border border-blue-600 px-4 py-2 rounded-lg transition">
                            Browse Public Events
                        </Link>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            + Create Event
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{new Date(event.date).toLocaleDateString()} at {event.venue}</p>
                            <div className="flex justify-between text-sm text-gray-500 mb-4">
                                <span>Tickets: {event.bookedTickets} / {event.totalTickets}</span>
                                <span className={`capitalize ${event.approvalMode === 'auto' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {event.approvalMode} Approval
                                </span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Link
                                    to={`/event/${event._id}/manage`}
                                    className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
                                >
                                    Manage
                                </Link>
                                <Link
                                    to={`/p/event/${event._id}`}
                                    className="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100"
                                >
                                    View Public
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
                        <form onSubmit={handleCreateEvent} className="space-y-3">
                            <input type="text" name="title" placeholder="Event Title" value={newEvent.title} onChange={onChange} className="w-full p-2 border rounded" required />
                            <textarea name="description" placeholder="Description" value={newEvent.description} onChange={onChange} className="w-full p-2 border rounded" />
                            <div className="flex gap-2">
                                <input type="date" name="date" value={newEvent.date} onChange={onChange} className="w-1/2 p-2 border rounded" required />
                                <input type="text" name="venue" placeholder="Venue" value={newEvent.venue} onChange={onChange} className="w-1/2 p-2 border rounded" required />
                            </div>
                            <div className="flex gap-2">
                                <input type="number" name="totalTickets" placeholder="Total Tickets" value={newEvent.totalTickets} onChange={onChange} className="w-1/2 p-2 border rounded" required />
                                <select name="approvalMode" value={newEvent.approvalMode} onChange={onChange} className="w-1/2 p-2 border rounded">
                                    <option value="auto">Auto Approval</option>
                                    <option value="manual">Manual Approval</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

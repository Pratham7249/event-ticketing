import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

const EventManager = () => {
    const { eventId } = useParams();
    const { API_URL } = useContext(AuthContext);
    const [registrations, setRegistrations] = useState([]);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        fetchData();
    }, [eventId]);

    const fetchData = async () => {
        try {
            const [eventRes, regRes] = await Promise.all([
                api.get(`/events/${eventId}`),
                api.get(`/registrations/event/${eventId}`)
            ]);
            setEvent(eventRes.data);
            setRegistrations(regRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/registrations/${id}`, { status });
            fetchData(); // Refresh data to update counts/status
        } catch (err) {
            alert(err.response?.data?.msg || 'Error updating status');
        }
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
                <div className="flex gap-6 text-gray-600">
                    <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                    <span>Venue: {event.venue}</span>
                    <span>Booked: {event.bookedTickets} / {event.totalTickets}</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <h2 className="text-xl font-bold p-6 border-b">Registrations</h2>
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {registrations.map((reg) => (
                            <tr key={reg._id} className="hover:bg-gray-50">
                                <td className="p-4">{reg.userName}</td>
                                <td className="p-4">{reg.userEmail}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                    ${reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {reg.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {reg.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusChange(reg._id, 'approved')}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(reg._id, 'rejected')}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {reg.status === 'approved' && (
                                        <span className="text-gray-400 text-sm">Approved</span>
                                    )}
                                    {reg.status === 'rejected' && (
                                        <span className="text-gray-400 text-sm">Rejected</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {registrations.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">No registrations yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventManager;

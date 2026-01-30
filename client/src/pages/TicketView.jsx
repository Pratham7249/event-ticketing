import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'react-qr-code';

const TicketView = () => {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await axios.get(`${API_URL}/registrations/ticket/${ticketId}`);
                setTicket(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching ticket');
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [ticketId]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    <div className="text-red-500 text-5xl mb-4">✕</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">
                <div className="bg-gradient-to-r from-blue-900 to-gray-900 text-white p-6 text-center relative z-10">
                    <h2 className="text-2xl font-bold tracking-wider uppercase mb-1">{ticket.eventId.title}</h2>
                    <p className="text-gray-300 text-sm">Admit One</p>

                    {/* Decorative circles */}
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-900 rounded-full z-20"></div>
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-900 rounded-full z-20"></div>
                </div>

                <div className="p-8 relative border-t-2 border-dashed border-gray-300 bg-white">
                    {/* Cutout illusion */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-900 rounded-full"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-900 rounded-full"></div>

                    {/* QR Code Section */}
                    <div className="flex justify-center mb-6">
                        <div className="p-2 border-2 border-gray-100 rounded-lg">
                            <QRCode value={ticket.ticketId} size={128} />
                        </div>
                    </div>

                    <div className="space-y-4 text-center">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Attendee</p>
                            <p className="text-lg font-semibold text-gray-800">{ticket.userName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date & Venue</p>
                            <p className="text-sm font-medium text-gray-700">
                                {new Date(ticket.eventId.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">{ticket.eventId.venue}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 mb-1">TICKET ID</p>
                        <div className="bg-gray-50 p-1 rounded font-mono text-xs text-gray-600 break-all">
                            {ticket.ticketId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketView;

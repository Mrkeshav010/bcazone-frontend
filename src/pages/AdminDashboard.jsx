import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [college, setCollege] = useState({
    name: '', city: '', state: '', address: '', website: '',
    phone: '', affiliation: '', seats: '', fees: '',
  });

  const addCollege = async (e) => {
    e.preventDefault();
    try {
      await api.post('/colleges/add', { ...college, seats: parseInt(college.seats) });
      toast.success('College added!');
      setCollege({ name: '', city: '', state: '', address: '', website: '', phone: '', affiliation: '', seats: '', fees: '' });
    } catch { toast.error('Error'); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="card mb-6">
          <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold mb-4 inline-block">ADMIN PANEL</span>
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Add New College</h2>
          <form onSubmit={addCollege} className="space-y-4">
            {Object.keys(college).map(key => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-600 capitalize">{key}</label>
                <input className="input mt-1" value={college[key]}
                  onChange={e => setCollege({ ...college, [key]: e.target.value })}
                  required={['name', 'city', 'state'].includes(key)} />
              </div>
            ))}
            <button className="btn-primary w-full py-2">Add College</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
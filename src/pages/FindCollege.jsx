import { useState } from 'react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const FindCollege = () => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);

  const indianStates = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
    'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
    'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh'
  ];

  const handleInput = (val) => {
    setLocation(val);
    if (val.length < 2) { setSuggestions([]); return; }
    const filtered = indianStates.filter(s =>
      s.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const selectState = (state) => {
    setLocation(state);
    setSuggestions([]);
  };

  const searchWithAI = async () => {
    if (!location.trim()) { toast.error('State/City daalo!'); return; }
    setLoading(true);
    setColleges([]);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Give me a list of ALL BCA colleges in ${location}, India. 
For each college provide:
- College Name
- Full Address
- Annual Fees (approximate)
- Affiliation (university name)
- Type (Government/Private)
- Seats available
- Any notable features

Format as JSON array like this:
[
  {
    "name": "College Name",
    "address": "Full Address",
    "fees": "₹XX,XXX per year",
    "affiliation": "University Name",
    "type": "Government/Private",
    "seats": "60",
    "features": "NAAC accredited, good placement"
  }
]
Return ONLY the JSON array, nothing else.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setColleges(parsed);
    } catch (err) {
      toast.error('Error fetching colleges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Find BCA Colleges</h2>
        <p className="text-gray-500 mb-6">AI-powered — State ya City name likho</p>

        <div className="relative flex gap-3 mb-8">
          <div className="relative flex-1">
            <input
              className="input w-full"
              placeholder="State ya City likho... (e.g. Odisha, Delhi)"
              value={location}
              onChange={e => handleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchWithAI()}
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-blue-200 rounded-xl shadow-lg z-50 mt-1">
                {suggestions.map(s => (
                  <div key={s} onClick={() => selectState(s)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-blue-800 text-sm font-medium">
                    📍 {s}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn-primary px-6" onClick={searchWithAI} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-blue-600 font-medium">AI {location} ke BCA colleges dhundh raha hai...</p>
          </div>
        )}

        <div className="space-y-4">
          {colleges.map((col, i) => (
            <div key={i} className="card">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <h3 className="text-xl font-bold text-blue-700">{col.name}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  col.type === 'Government'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {col.type}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">📍 {col.address}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                {col.fees && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                    💰 {col.fees}
                  </span>
                )}
                {col.affiliation && (
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg">
                    🏛 {col.affiliation}
                  </span>
                )}
                {col.seats && (
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                    🪑 Seats: {col.seats}
                  </span>
                )}
              </div>
              {col.features && (
                <p className="text-gray-500 text-sm mt-3 border-t pt-3">
                  ✨ {col.features}
                </p>
              )}
            </div>
          ))}

          {!loading && colleges.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">🏫</p>
              <p>State ya city name likhke Search karo</p>
              <p className="text-sm mt-1">AI turant BCA colleges dhundh dega!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindCollege;
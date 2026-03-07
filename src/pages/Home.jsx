import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FaUniversity, FaBook, FaStickyNote, FaFileAlt, FaSearch } from 'react-icons/fa';

const features = [
  { icon: <FaUniversity size={32} />, title: 'Find College', desc: 'BCA colleges near your location', to: '/find-college', color: 'bg-blue-500' },
  { icon: <FaBook size={32} />, title: 'Find Syllabus', desc: 'College-wise BCA syllabus', to: '/find-syllabus', color: 'bg-purple-500' },
  { icon: <FaStickyNote size={32} />, title: 'Find Notes', desc: 'Year & subject wise notes', to: '/find-notes', color: 'bg-green-500' },
  { icon: <FaFileAlt size={32} />, title: 'Previous Papers', desc: 'Year & subject wise Q-Papers', to: '/find-qpapers', color: 'bg-red-500' },
  { icon: <FaSearch size={32} />, title: 'Find by Topic', desc: 'Search notes by topic name', to: '/find-notes?mode=topic', color: 'bg-yellow-500' },
];

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-indigo-700 mb-1">
          Welcome, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mb-8">What do you want to explore today?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link to={f.to} key={f.title}
              className={`${f.color} text-white rounded-2xl p-6 flex flex-col gap-3 hover:scale-105 transition shadow-lg`}>
              {f.icon}
              <div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-sm opacity-80">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
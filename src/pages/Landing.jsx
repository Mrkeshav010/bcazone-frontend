import { Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const Landing = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center px-4">
    <FaGraduationCap size={80} className="text-cyan-400 mb-4" />
    <h1 className="text-5xl font-extrabold mb-2">BCAzone</h1>
    <p className="text-indigo-200 text-xl mb-8 text-center max-w-lg">
      India ka #1 BCA Student Platform — Notes, Syllabus, Q-Papers, Colleges aur aur bhi bahut kuch!
    </p>
    <div className="flex gap-4">
      <Link to="/signup" className="bg-cyan-400 text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-cyan-300 transition">
        Get Started
      </Link>
      <Link to="/login" className="border-2 border-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-900 transition">
        Login
      </Link>
    </div>
  </div>
);

export default Landing;
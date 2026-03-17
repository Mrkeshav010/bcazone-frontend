import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const COURSES = [
  { id: 'python', title: 'Python Programming', icon: '🐍', color: 'from-yellow-400 to-yellow-600', level: 'Beginner', pages: 60, desc: 'Learn Python from scratch - variables, OOP, file handling and more.' },
  { id: 'java', title: 'Java Programming', icon: '☕', color: 'from-orange-400 to-orange-600', level: 'Intermediate', pages: 60, desc: 'Master Java - OOP, collections, multithreading and more.' },
  { id: 'c-programming', title: 'C Programming', icon: '⚙️', color: 'from-blue-400 to-blue-600', level: 'Beginner', pages: 60, desc: 'Learn C programming - pointers, arrays, structures and more.' },
  { id: 'cpp', title: 'C++ Programming', icon: '🔷', color: 'from-indigo-400 to-indigo-600', level: 'Intermediate', pages: 60, desc: 'Master C++ - OOP, STL, templates and more.' },
  { id: 'web-development', title: 'Full Stack Web Development', icon: '🌐', color: 'from-green-400 to-green-600', level: 'Intermediate', pages: 60, desc: 'Learn HTML, CSS, JavaScript, React and Node.js - MERN Stack.' },
  { id: 'data-structures', title: 'Data Structures & Algorithms', icon: '🗂️', color: 'from-purple-400 to-purple-600', level: 'Intermediate', pages: 60, desc: 'Master arrays, linked lists, trees, graphs and algorithms.' },
  { id: 'data-science', title: 'Data Science with Python', icon: '📊', color: 'from-teal-400 to-teal-600', level: 'Advanced', pages: 60, desc: 'Learn data analysis, visualization, ML and AI with Python.' },
  { id: 'dsa', title: 'DSA for Interviews', icon: '🎯', color: 'from-red-400 to-red-600', level: 'Advanced', pages: 60, desc: 'Master DSA for top company interviews - Google, Amazon, Microsoft.' },
  { id: 'cybersecurity', title: 'Cyber Security & Ethical Hacking', icon: '🔐', color: 'from-gray-600 to-gray-800', level: 'Advanced', pages: 60, desc: 'Learn ethical hacking, penetration testing and security tools.' },
  { id: 'android', title: 'Android App Development', icon: '📱', color: 'from-lime-400 to-lime-600', level: 'Intermediate', pages: 60, desc: 'Build Android apps with Kotlin - UI, APIs and more.' },
  { id: 'cloud', title: 'Cloud Computing with AWS/Azure', icon: '☁️', color: 'from-sky-400 to-sky-600', level: 'Advanced', pages: 60, desc: 'Learn cloud services, deployment and infrastructure.' },
  { id: 'devops', title: 'DevOps Engineering', icon: '🔧', color: 'from-pink-400 to-pink-600', level: 'Advanced', pages: 60, desc: 'Master Docker, Kubernetes, CI/CD pipelines and more.' },
];

const levelColor = {
  'Beginner': 'bg-green-100 text-green-700',
  'Intermediate': 'bg-yellow-100 text-yellow-700',
  'Advanced': 'bg-red-100 text-red-700',
};

const Courses = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-indigo-700 mb-2">BCAzone Courses</h2>
          <p className="text-gray-500">Learn, Practice and Get Certified - All in one place</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <div key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all hover:-translate-y-1 overflow-hidden">
              <div className={`bg-gradient-to-r ${course.color} p-6 text-white`}>
                <div className="text-4xl mb-2">{course.icon}</div>
                <h3 className="text-lg font-black">{course.title}</h3>
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-sm mb-3">{course.desc}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${levelColor[course.level]}`}>
                    {course.level}
                  </span>
                  <span className="text-xs text-gray-400">📄 {course.pages} Pages</span>
                </div>
                <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-semibold transition-all">
                  Start Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const TYPES = [
  { label: 'Notes', value: 'notes', fields: ['college', 'year', 'subject', 'topic', 'description'], fileKey: 'notes' },
  { label: 'Syllabus', value: 'syllabus', fields: ['college', 'year', 'description'], fileKey: 'syllabus' },
  { label: 'Question Paper', value: 'qpaper', fields: ['college', 'year', 'subject', 'examYear', 'description'], fileKey: 'questionPaper' },
];

const Upload = () => {
  const [type, setType] = useState('notes');
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const selected = TYPES.find(t => t.value === type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append(selected.fileKey, file);

      const url = type === 'notes' ? '/notes/upload' : type === 'syllabus' ? '/syllabus/upload' : '/questionpapers/upload';
      await api.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Uploaded successfully!');
      setForm({});
      setFile(null);
    } catch { toast.error('Upload failed'); }
    finally { setLoading(false); }
  };

  const labels = {
    college: 'College Name', year: 'BCA Year', subject: 'Subject Name',
    topic: 'Topic (optional)', description: 'Description (optional)', examYear: 'Exam Year (e.g. 2023)',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Upload Content</h2>

        <div className="flex gap-3 mb-6">
          {TYPES.map(t => (
            <button key={t.value} onClick={() => setType(t.value)}
              className={`px-4 py-2 rounded-lg font-medium ${type === t.value ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {selected.fields.map(field => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-600">{labels[field]}</label>
              {field === 'year' ? (
                <select className="input mt-1" value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })}>
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                </select>
              ) : (
                <input className="input mt-1" placeholder={labels[field]} value={form[field] || ''}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  required={!field.includes('optional') && field !== 'topic' && field !== 'description'} />
              )}
            </div>
          ))}

          <div>
            <label className="text-sm font-medium text-gray-600">Upload File (PDF/DOC/IMG)</label>
            <input type="file" className="mt-1 block w-full" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={e => setFile(e.target.files[0])} />
          </div>

          <button className="btn-primary w-full py-2" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
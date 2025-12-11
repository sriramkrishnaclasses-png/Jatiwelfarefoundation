import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Users, Heart, CheckCircle, Download, BookOpen, Phone } from 'lucide-react';
import { getStore, addDonation, addVolunteer, addInquiry } from '../services/storage';
import { StoreData, Program, BlogPost } from '../types';

// Helper Hook for Data
const usePublicData = () => {
  const [data, setData] = useState<StoreData>(getStore());
  useEffect(() => {
    const handleStorageUpdate = () => setData(getStore());
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);
  return data;
};

// --- HOME PAGE ---
export const Home: React.FC = () => {
  const { settings, programs, blogPosts, events } = usePublicData();
  
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-slate-900 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-900/50 z-0">
          <img src="https://picsum.photos/1920/1080?blur=4" alt="Background" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl">{settings.heroText}</h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl">{settings.mission}</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/donate" className="bg-sky-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-sky-700 transition-colors text-center shadow-lg">
              Donate Now
            </Link>
            <Link to="/volunteer" className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors text-center shadow-lg">
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white -mt-10 relative z-20 shadow-lg max-w-6xl mx-auto rounded-lg grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
        <div className="text-center p-4">
          <div className="text-4xl font-bold text-sky-600 mb-2">{settings.stats.beneficiaries}+</div>
          <div className="text-slate-500 text-sm uppercase tracking-wide">Beneficiaries</div>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl font-bold text-sky-600 mb-2">{settings.stats.villages}</div>
          <div className="text-slate-500 text-sm uppercase tracking-wide">Villages Covered</div>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl font-bold text-sky-600 mb-2">{settings.stats.volunteers}</div>
          <div className="text-slate-500 text-sm uppercase tracking-wide">Active Volunteers</div>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl font-bold text-sky-600 mb-2">{settings.stats.meals}+</div>
          <div className="text-slate-500 text-sm uppercase tracking-wide">Meals Served</div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Key Programs</h2>
            <div className="w-16 h-1 bg-sky-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {programs.slice(0, 4).map(p => (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-slate-200 overflow-hidden relative">
                   <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                   <div className="absolute top-2 right-2 bg-sky-600 text-white text-xs px-2 py-1 rounded">{p.category}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-slate-800">{p.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{p.shortDescription}</p>
                  <Link to={`/programs/${p.id}`} className="text-sky-600 font-semibold text-sm flex items-center hover:underline">
                    Learn More <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
             <Link to="/programs" className="inline-block border border-sky-600 text-sky-600 px-6 py-2 rounded-full hover:bg-sky-50 transition-colors">View All Programs</Link>
          </div>
        </div>
      </section>
      
      {/* Latest Updates */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
             <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Latest Updates</h2>
                <div className="w-16 h-1 bg-sky-600"></div>
             </div>
             <Link to="/blog" className="text-sky-600 font-medium hidden md:block">Read Blog</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map(post => (
               <Link to={`/blog/${post.id}`} key={post.id} className="group block">
                 <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4">
                    <img src={post.image} alt={post.imageAlt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <div className="text-xs text-slate-500 mb-2">{post.date}</div>
                 <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">{post.title}</h3>
                 <p className="text-slate-600 line-clamp-2">{post.excerpt}</p>
               </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- ABOUT PAGE ---
export const About: React.FC = () => {
  const { settings } = usePublicData();
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">About Jati Welfare Foundation</h1>
        
        <div className="prose prose-lg text-slate-600 mb-12">
          <p className="lead text-xl">Founded in Salipur, Cuttack, we are a charitable trust committed to uplift the marginalized sections of society.</p>
          <p>Since our inception, we have been working tirelessly in the fields of education, healthcare, and disaster relief. Our roots are deep in the soil of Odisha, and our heart beats for its people.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
           <div className="bg-sky-50 p-8 rounded-xl border border-sky-100">
              <h3 className="text-xl font-bold text-sky-800 mb-4 flex items-center"><Heart className="mr-2"/> Our Mission</h3>
              <p className="text-slate-700">{settings.mission}</p>
           </div>
           <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center"><Users className="mr-2"/> Our Vision</h3>
              <p className="text-slate-700">{settings.vision}</p>
           </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Board of Trustees</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           {/* Placeholder Trustee Cards */}
           {[1, 2].map((i) => (
             <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="Trustee" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Trustee Name {i}</h4>
                  <p className="text-sm text-slate-500">Founding Member</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- PROGRAMS LIST PAGE ---
export const Programs: React.FC = () => {
  const { programs } = usePublicData();
  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Programs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.filter(p => p.active).map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              <div className="h-48 bg-slate-200 relative">
                 <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                 <span className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-sky-700 shadow-sm uppercase tracking-wide">{p.category}</span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-slate-600 mb-4 flex-1">{p.shortDescription}</p>
                <div className="mt-auto border-t pt-4">
                  <Link to={`/programs/${p.id}`} className="block w-full text-center bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold py-2 rounded transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- PROGRAM DETAIL PAGE ---
export const ProgramDetail: React.FC = () => {
  const { id } = useParams();
  const { programs } = usePublicData();
  const program = programs.find(p => p.id === id);

  if (!program) return <div className="p-20 text-center">Program not found</div>;

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/programs" className="text-slate-500 hover:text-sky-600 mb-6 inline-block">&larr; Back to Programs</Link>
        <div className="rounded-2xl overflow-hidden shadow-xl mb-10 h-64 md:h-96 w-full relative">
           <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
           <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8">
              <span className="bg-sky-600 text-white px-3 py-1 rounded text-xs uppercase font-bold mb-2 inline-block">{program.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{program.title}</h1>
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
           <div className="md:col-span-2 prose prose-slate">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">About the Program</h3>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">{program.fullDescription}</p>
           </div>
           <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                 <h4 className="font-bold text-slate-900 mb-4 border-b pb-2">Program Snapshot</h4>
                 <ul className="space-y-4 text-sm">
                    <li className="flex">
                       <Users size={18} className="mr-3 text-sky-500 shrink-0" />
                       <div>
                          <span className="block text-slate-500 text-xs">Beneficiaries</span>
                          <span className="font-medium">{program.beneficiaries}</span>
                       </div>
                    </li>
                    <li className="flex">
                       <MapPin size={18} className="mr-3 text-sky-500 shrink-0" />
                       <div>
                          <span className="block text-slate-500 text-xs">Location</span>
                          <span className="font-medium">{program.location}</span>
                       </div>
                    </li>
                 </ul>
              </div>
              <Link to="/donate" className="block w-full bg-sky-600 text-white text-center py-4 rounded-lg font-bold shadow-lg hover:bg-sky-700 transition-transform hover:-translate-y-1">
                 Support This Cause
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- DONATE PAGE ---
export const Donate: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', amount: '', purpose: 'General' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.amount) {
      addDonation({ ...formData, amount: Number(formData.amount) });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 max-w-md">
           <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
             <CheckCircle size={32} />
           </div>
           <h2 className="text-2xl font-bold mb-4">Thank You, {formData.name}!</h2>
           <p className="text-slate-600 mb-6">Your pledge of ₹{formData.amount} has been recorded. We will contact you shortly with the payment receipt.</p>
           <button onClick={() => setSubmitted(false)} className="text-sky-600 hover:underline">Make another donation</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 mb-6">Make a Difference Today</h1>
           <p className="text-lg text-slate-600 mb-8">Every contribution, no matter how small, helps us provide education, healthcare, and relief to those who need it most in Odisha.</p>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
              <h3 className="font-bold text-lg mb-4">Direct Bank Transfer</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-800">Bank Name:</span> State Bank of India</p>
                <p><span className="font-semibold text-slate-800">Account Name:</span> Jati Welfare Foundation</p>
                <p><span className="font-semibold text-slate-800">A/C No:</span> 1234567890 (Placeholder)</p>
                <p><span className="font-semibold text-slate-800">IFSC Code:</span> SBIN0001234 (Placeholder)</p>
                <p><span className="font-semibold text-slate-800">Branch:</span> Salipur, Cuttack</p>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-4">UPI Donation</h3>
              <div className="flex items-center space-x-4">
                 <div className="w-24 h-24 bg-slate-200 flex items-center justify-center text-xs text-slate-500">QR Code</div>
                 <div>
                    <p className="font-mono bg-slate-100 px-3 py-1 rounded">jatiwelfare@upi</p>
                    <p className="text-xs text-slate-500 mt-2">Scan or copy UPI ID</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
           <h3 className="text-xl font-bold mb-6">Donation Pledge Form</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                 <input required type="number" min="1" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-lg font-semibold" 
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">I want to support</label>
                 <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                    value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}>
                    <option value="General">General Fund (Where Needed Most)</option>
                    <option value="Education">Education Support</option>
                    <option value="Health">Health Camps</option>
                    <option value="Women">Women Empowerment</option>
                 </select>
              </div>
              <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition-colors mt-4">
                 Proceed to Donate
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};

// --- VOLUNTEER PAGE ---
export const Volunteer: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', age: '', email: '', phone: '', city: '', interest: 'Teaching', availability: 'Weekends' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVolunteer({
      ...formData,
      age: parseInt(formData.age),
      interest: formData.interest,
      availability: formData.availability
    });
    setSubmitted(true);
  };

  if (submitted) return <div className="p-20 text-center text-green-600 font-bold text-xl">Thank you! We will contact you soon.</div>;

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Join Our Team</h1>
        <p className="text-center text-slate-600 mb-10">Volunteers are the backbone of our foundation. Join us to make a real impact.</p>
        
        <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-xl border border-slate-200 space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input required type="number" className="w-full p-2 border rounded" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input required type="tel" className="w-full p-2 border rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input required type="text" className="w-full p-2 border rounded" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
             </div>
           </div>
           <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input required type="email" className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
           </div>
           <div>
              <label className="block text-sm font-medium mb-1">Area of Interest</label>
              <select className="w-full p-2 border rounded" value={formData.interest} onChange={e => setFormData({...formData, interest: e.target.value})}>
                <option>Teaching</option>
                <option>Fieldwork / Relief Distribution</option>
                <option>Social Media / Fundraising</option>
                <option>Medical Support</option>
              </select>
           </div>
           <div>
              <label className="block text-sm font-medium mb-1">Availability</label>
              <input type="text" placeholder="e.g. Weekends, 2 hours/week" className="w-full p-2 border rounded" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} />
           </div>
           <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

// --- EVENTS PAGE ---
export const Events: React.FC = () => {
  const { events } = usePublicData();
  return (
    <div className="py-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      <div className="space-y-6">
        {events.map(e => (
          <div key={e.id} className="flex flex-col md:flex-row bg-white shadow rounded-lg overflow-hidden border border-slate-100">
             <div className="md:w-1/3 h-48 md:h-auto relative">
                <img src={e.image} className="w-full h-full object-cover" alt={e.title}/>
                <div className="absolute top-0 left-0 bg-sky-600 text-white p-2 text-center min-w-[60px]">
                   <div className="text-xl font-bold">{new Date(e.date).getDate()}</div>
                   <div className="text-xs uppercase">{new Date(e.date).toLocaleString('default', { month: 'short' })}</div>
                </div>
             </div>
             <div className="p-6 md:w-2/3 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">{e.title}</h3>
                <div className="flex items-center text-slate-500 text-sm mb-4">
                   <MapPin size={16} className="mr-1"/> {e.location}
                </div>
                <p className="text-slate-600 mb-4">{e.shortDescription}</p>
                <Link to={`/events/${e.id}`} className="text-sky-600 font-medium hover:underline">Read Details</Link>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- GALLERY PAGE ---
export const Gallery: React.FC = () => {
  const { gallery } = usePublicData();
  return (
    <div className="py-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Photo Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map(g => (
          <div key={g.id} className="group relative break-inside-avoid">
             <img src={g.imageUrl} alt={g.caption} className="w-full h-auto rounded-lg" />
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <p className="text-white text-sm font-bold text-center px-2">{g.caption}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- REPORTS PAGE ---
export const Reports: React.FC = () => {
  const { reports } = usePublicData();
  return (
    <div className="py-16 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Transparency & Reports</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
         {reports.map((r, idx) => (
           <div key={r.id} className={`p-6 flex items-center justify-between ${idx !== reports.length-1 ? 'border-b': ''}`}>
              <div>
                 <h4 className="font-bold text-lg">{r.title}</h4>
                 <p className="text-slate-500 text-sm">{r.description}</p>
              </div>
              <a href={r.fileUrl} className="flex items-center text-sky-600 hover:bg-sky-50 px-4 py-2 rounded transition-colors">
                 <Download size={18} className="mr-2" /> PDF
              </a>
           </div>
         ))}
      </div>
    </div>
  );
};

// --- BLOG PAGE ---
export const Blog: React.FC = () => {
  const { blogPosts } = usePublicData();
  return (
    <div className="py-16 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-10 text-center">Our Blog</h1>
      <div className="grid gap-10">
        {blogPosts.map(post => (
          <div key={post.id} className="grid md:grid-cols-4 gap-6 items-start">
             <div className="md:col-span-1">
               <img src={post.image} className="w-full h-40 object-cover rounded-lg" alt={post.imageAlt || post.title}/>
             </div>
             <div className="md:col-span-3">
                <div className="flex items-center text-xs text-slate-500 mb-2 space-x-2">
                   <span>{post.date}</span>
                   <span>•</span>
                   <span>{post.author}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 hover:text-sky-600"><Link to={`/blog/${post.id}`}>{post.title}</Link></h2>
                <p className="text-slate-600 mb-3">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="text-sky-600 font-medium text-sm">Read Full Story &rarr;</Link>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CONTACT PAGE ---
export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry(formData);
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-slate-50">
       <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
             <h1 className="text-3xl font-bold mb-6">Get in Touch</h1>
             <p className="text-slate-600 mb-8">Have a question? We'd love to hear from you. Visit us, call us, or send a message.</p>
             
             <div className="space-y-6">
                <div className="flex items-start">
                   <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 shrink-0 mr-4">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900">Address</h4>
                      <p className="text-slate-600">Sapanpur, Near St. Xavier School,<br/>Salipur, Cuttack, Odisha – 754202</p>
                   </div>
                </div>
                <div className="flex items-start">
                   <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 shrink-0 mr-4">
                      <Phone size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900">Phone</h4>
                      <p className="text-slate-600">9937033007</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
             {submitted ? (
                <div className="text-center py-10">
                   <div className="text-green-500 text-5xl mb-4">✓</div>
                   <h3 className="text-xl font-bold">Message Sent</h3>
                   <p className="text-slate-500">We will get back to you shortly.</p>
                </div>
             ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                   <h3 className="text-xl font-bold mb-4">Send a Message</h3>
                   <input required type="text" placeholder="Your Name" className="w-full p-3 border rounded outline-none focus:border-sky-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                   <input required type="email" placeholder="Your Email" className="w-full p-3 border rounded outline-none focus:border-sky-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                   <input type="tel" placeholder="Your Phone" className="w-full p-3 border rounded outline-none focus:border-sky-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                   <textarea required placeholder="How can we help?" rows={4} className="w-full p-3 border rounded outline-none focus:border-sky-500" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                   <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded hover:bg-sky-700">Send Message</button>
                </form>
             )}
          </div>
       </div>
    </div>
  );
};
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import { Home, About, Programs, ProgramDetail, Donate, Volunteer, Events, Gallery, Reports, Blog, Contact } from './pages/Public';
import { AdminLogin, Dashboard, ProgramManager, EventManager, SettingsManager, DonationManager, VolunteerManager, BlogManager, GalleryManager } from './pages/Admin';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Events />} /> {/* Reusing Events list for simplicity in this demo */}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} /> {/* Reusing Blog list for simplicity */}
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Dashboard />} />
           <Route path="programs" element={<ProgramManager />} />
           <Route path="events" element={<EventManager />} />
           <Route path="settings" element={<SettingsManager />} />
           <Route path="donations" element={<DonationManager />} />
           <Route path="volunteers" element={<VolunteerManager />} />
           <Route path="blog" element={<BlogManager />} />
           <Route path="gallery" element={<GalleryManager />} />
           
           {/* Placeholders for other modules to keep code concise */}
           <Route path="reports" element={<div className="p-8">Reports Manager (Placeholder)</div>} />
           <Route path="enquiries" element={<div className="p-8">Enquiries Manager (Placeholder)</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
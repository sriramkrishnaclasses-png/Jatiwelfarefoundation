import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reports', path: '/reports' },
    { name: 'Blog', path: '/blog' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path ? 'text-sky-600 font-semibold' : 'text-slate-600 hover:text-sky-600';

  const socialLinks = {
    facebook: "https://www.facebook.com/jatiwelfarefoundation",
    twitter: "https://www.x.com/jatiwelfarefoundation",
    instagram: "https://www.instagram.com/jatiwelfarefoundation"
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Bar */}
      <div className="bg-sky-700 text-white py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><Phone size={14} className="mr-2" /> 9937033007</span>
            <span className="flex items-center"><Mail size={14} className="mr-2" /> info@jatiwelfare.org</span>
            <span className="flex items-center"><MapPin size={14} className="mr-2" /> Salipur, Cuttack, Odisha</span>
          </div>
          <div className="flex space-x-4">
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-sky-200 transition-colors" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-200 transition-colors" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-sky-200 transition-colors" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex flex-col">
                <span className="text-2xl font-bold text-sky-700 leading-none">JATI WELFARE</span>
                <span className="text-xs text-slate-500 tracking-wider">FOUNDATION</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={`${isActive(link.path)} transition-colors duration-200 text-sm uppercase tracking-wide`}>
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <Link to="/donate" className="flex items-center bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg">
                <Heart size={18} className="mr-2 fill-current" />
                Donate Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-sky-600 focus:outline-none">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 py-4 shadow-lg absolute w-full left-0 z-50">
            <div className="flex flex-col space-y-2 px-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/donate" onClick={() => setIsMenuOpen(false)} className="block w-full text-center mt-4 bg-sky-600 text-white px-4 py-3 rounded-lg font-bold">
                Donate Now
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="mb-8 md:mb-0">
              <h3 className="text-white text-lg font-bold mb-4">Jati Welfare Foundation</h3>
              <p className="text-slate-400 text-sm mb-4">
                Dedicated to empowering communities through education, healthcare, and sustainable development in Odisha.
              </p>
              <div className="flex space-x-4">
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                   <Facebook size={20} />
                </a>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
                   <Twitter size={20} />
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                   <Instagram size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-sky-400">About Us</Link></li>
                <li><Link to="/programs" className="hover:text-sky-400">Our Programs</Link></li>
                <li><Link to="/volunteer" className="hover:text-sky-400">Volunteer</Link></li>
                <li><Link to="/reports" className="hover:text-sky-400">Transparency</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-4">Programs</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/programs" className="hover:text-sky-400">Education Support</Link></li>
                <li><Link to="/programs" className="hover:text-sky-400">Health Camps</Link></li>
                <li><Link to="/programs" className="hover:text-sky-400">Women Empowerment</Link></li>
                <li><Link to="/programs" className="hover:text-sky-400">Disaster Relief</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-sky-500 shrink-0" />
                  <span>Sapanpur, Near St. Xavier School,<br/>Salipur, Cuttack,<br/>Odisha – 754202</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-2 text-sky-500 shrink-0" />
                  <span>9937033007</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-2 text-sky-500 shrink-0" />
                  <span>contact@jatiwelfare.org</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Jati Welfare Foundation. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
               <Link to="/admin" className="hover:text-slate-300 transition-colors">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
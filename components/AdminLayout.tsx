import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, BookOpen, Image, FileText, 
  HeartHandshake, HandCoins, MessageSquare, Settings, LogOut, Menu 
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Check auth
  useEffect(() => {
    const isAuth = localStorage.getItem('jati_admin_auth');
    if (isAuth !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jati_admin_auth');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Programs', path: '/admin/programs', icon: BookOpen },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Volunteers', path: '/admin/volunteers', icon: HeartHandshake },
    { name: 'Donations', path: '/admin/donations', icon: HandCoins },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {sidebarOpen ? (
            <span className="text-xl font-bold tracking-wider">CMS ADMIN</span>
          ) : (
            <span className="font-bold text-xl">CMS</span>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-6 py-3 transition-colors ${
                      isActive ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-800">
            <Menu size={24} />
          </button>
          <div className="flex items-center">
             <span className="text-sm font-medium text-slate-700 mr-4">Administrator</span>
             <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-xs">
               AD
             </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, createItem, updateItem, deleteItem, updateSettings } from '../services/storage';
import { generateText, generateImage } from '../services/ai';
import { StoreData, Program, ProgramCategory, Event, BlogPost, GalleryItem, Report, ContactInquiry } from '../types';
import { Edit, Trash2, Plus, Save, X, Upload, CheckCircle, Wand2, Loader2, FileText, Image as ImageIcon } from 'lucide-react';

// --- LOGIN PAGE ---
export const AdminLogin: React.FC = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.username === 'admin' && creds.password === 'admin123') {
      localStorage.setItem('jati_admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid credentials (use admin / admin123)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input type="text" className="w-full p-2 border rounded" value={creds.username} onChange={e => setCreds({...creds, username: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" className="w-full p-2 border rounded" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 font-medium">Login</button>
        </form>
        <p className="text-xs text-center text-slate-400 mt-4">Demo: admin / admin123</p>
      </div>
    </div>
  );
};

// --- DASHBOARD OVERVIEW ---
export const Dashboard: React.FC = () => {
  const [data, setData] = useState(getStore());
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm font-medium">Total Donations</div>
          <div className="text-3xl font-bold text-sky-600 mt-2">₹{data.donations.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm font-medium">Volunteers</div>
          <div className="text-3xl font-bold text-sky-600 mt-2">{data.volunteers.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm font-medium">Active Programs</div>
          <div className="text-3xl font-bold text-sky-600 mt-2">{data.programs.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm font-medium">Pending Inquiries</div>
          <div className="text-3xl font-bold text-orange-500 mt-2">{data.inquiries.filter(i => i.status === 'Pending').length}</div>
        </div>
      </div>
    </div>
  );
};

// --- GENERIC LIST/EDIT COMPONENT ---
interface CrudProps<T> {
  title: string;
  items: T[];
  renderRow: (item: T, onEdit: () => void, onDelete: () => void) => React.ReactNode;
  onSave: (item: any) => void;
  onDelete: (id: string) => void;
  renderForm: (formData: any, setFormData: React.Dispatch<any>, onClose: () => void) => React.ReactNode;
  initialFormState: any;
}

const GenericCrud = <T extends { id: string }>({ title, items, renderRow, onSave, onDelete, renderForm, initialFormState }: CrudProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (item: T) => {
    setFormData(item);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setFormData({ ...initialFormState, id: Date.now().toString() });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{formData.id && items.find(i => i.id === formData.id) ? 'Edit' : 'Add'} {title}</h2>
          <button onClick={() => setIsEditing(false)}><X size={24} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          {renderForm(formData, setFormData, () => setIsEditing(false))}
          <div className="flex justify-end pt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="mr-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 flex items-center"><Save size={16} className="mr-2"/> Save</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Manage {title}s</h2>
        <button onClick={handleAdd} className="bg-sky-600 text-white px-4 py-2 rounded flex items-center hover:bg-sky-700 text-sm font-medium">
          <Plus size={16} className="mr-2" /> Add New
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
               <th className="px-6 py-3 font-semibold text-slate-700">Item Details</th>
               <th className="px-6 py-3 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                {renderRow(item, () => handleEdit(item), () => onDelete(item.id))}
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-500">No items found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- PROGRAMS MANAGER ---
export const ProgramManager: React.FC = () => {
  const [items, setItems] = useState<Program[]>(getStore().programs);
  const [generating, setGenerating] = useState(false);

  const refresh = () => setItems(getStore().programs);

  const handleAiGenerate = async (data: Program, update: (d: any) => void) => {
    if (!data.title || !data.category) {
      alert("Please enter a Title and Category first.");
      return;
    }
    setGenerating(true);
    try {
      const prompt = `Write a detailed description for a charity program titled "${data.title}" in the category of "${data.category}". 
      Focus on how it helps beneficiaries in rural Odisha. Write about 150-200 words.`;
      const content = await generateText(prompt);
      update({ ...data, fullDescription: content });
    } catch (e) {
      alert("Failed to generate content.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <GenericCrud<Program>
      title="Program"
      items={items}
      initialFormState={{ id: '', title: '', shortDescription: '', fullDescription: '', category: 'Education', beneficiaries: '', location: '', image: '', active: true }}
      onDelete={(id) => { deleteItem('programs', id); refresh(); }}
      onSave={(item) => { 
        const exists = items.find(i => i.id === item.id);
        exists ? updateItem('programs', item) : createItem('programs', item);
        refresh();
      }}
      renderRow={(item, onEdit, onDelete) => (
        <>
          <td className="px-6 py-4">
            <div className="font-bold text-slate-800">{item.title}</div>
            <div className="text-xs text-slate-500">{item.category} • {item.active ? 'Active' : 'Inactive'}</div>
          </td>
          <td className="px-6 py-4 text-right space-x-2">
            <button onClick={onEdit} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </td>
        </>
      )}
      renderForm={(data, update) => (
        <>
           <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-xs font-bold mb-1">Title</label><input required className="w-full border p-2 rounded" value={data.title} onChange={e=>update({...data, title: e.target.value})} /></div>
             <div><label className="block text-xs font-bold mb-1">Category</label>
               <select className="w-full border p-2 rounded" value={data.category} onChange={e=>update({...data, category: e.target.value})}>
                 {['Education','Health','Women Empowerment','Disaster Relief','General'].map(c=><option key={c}>{c}</option>)}
               </select>
             </div>
           </div>
           <div><label className="block text-xs font-bold mb-1">Image URL</label><input required className="w-full border p-2 rounded" value={data.image} onChange={e=>update({...data, image: e.target.value})} /></div>
           <div><label className="block text-xs font-bold mb-1">Short Description</label><textarea required className="w-full border p-2 rounded" rows={2} value={data.shortDescription} onChange={e=>update({...data, shortDescription: e.target.value})} /></div>
           <div>
             <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold">Full Description</label>
                <button 
                  type="button" 
                  onClick={() => handleAiGenerate(data, update)}
                  disabled={generating}
                  className="text-xs flex items-center bg-violet-100 text-violet-700 px-2 py-1 rounded hover:bg-violet-200 transition-colors"
                >
                  {generating ? <Loader2 size={12} className="animate-spin mr-1"/> : <Wand2 size={12} className="mr-1"/>}
                  {generating ? 'Generating...' : 'Auto-Generate with AI'}
                </button>
             </div>
             <textarea required className="w-full border p-2 rounded" rows={5} value={data.fullDescription} onChange={e=>update({...data, fullDescription: e.target.value})} />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-xs font-bold mb-1">Beneficiaries</label><input className="w-full border p-2 rounded" value={data.beneficiaries} onChange={e=>update({...data, beneficiaries: e.target.value})} /></div>
             <div><label className="block text-xs font-bold mb-1">Location</label><input className="w-full border p-2 rounded" value={data.location} onChange={e=>update({...data, location: e.target.value})} /></div>
           </div>
           <div className="flex items-center"><input type="checkbox" checked={data.active} onChange={e=>update({...data, active: e.target.checked})} className="mr-2" /> <span className="text-sm">Active on site</span></div>
        </>
      )}
    />
  );
};

// --- EVENTS MANAGER ---
export const EventManager: React.FC = () => {
  const [items, setItems] = useState<Event[]>(getStore().events);
  const refresh = () => setItems(getStore().events);

  return (
    <GenericCrud<Event>
      title="Event"
      items={items}
      initialFormState={{ id: '', title: '', date: '', location: '', shortDescription: '', fullDescription: '', image: '' }}
      onDelete={(id) => { deleteItem('events', id); refresh(); }}
      onSave={(item) => { items.find(i => i.id === item.id) ? updateItem('events', item) : createItem('events', item); refresh(); }}
      renderRow={(item, onEdit, onDelete) => (
        <>
          <td className="px-6 py-4">
            <div className="font-bold">{item.title}</div>
            <div className="text-xs text-slate-500">{item.date} • {item.location}</div>
          </td>
          <td className="px-6 py-4 text-right space-x-2">
            <button onClick={onEdit} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </td>
        </>
      )}
      renderForm={(data, update) => (
        <>
           <div><label className="block text-xs font-bold mb-1">Title</label><input required className="w-full border p-2 rounded" value={data.title} onChange={e=>update({...data, title: e.target.value})} /></div>
           <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-xs font-bold mb-1">Date</label><input type="date" required className="w-full border p-2 rounded" value={data.date} onChange={e=>update({...data, date: e.target.value})} /></div>
             <div><label className="block text-xs font-bold mb-1">Location</label><input required className="w-full border p-2 rounded" value={data.location} onChange={e=>update({...data, location: e.target.value})} /></div>
           </div>
           <div><label className="block text-xs font-bold mb-1">Image URL</label><input className="w-full border p-2 rounded" value={data.image} onChange={e=>update({...data, image: e.target.value})} /></div>
           <div><label className="block text-xs font-bold mb-1">Description</label><textarea className="w-full border p-2 rounded" rows={3} value={data.shortDescription} onChange={e=>update({...data, shortDescription: e.target.value})} /></div>
        </>
      )}
    />
  );
};

// --- BLOG MANAGER ---
export const BlogManager: React.FC = () => {
  const [items, setItems] = useState<BlogPost[]>(getStore().blogPosts);
  const [generating, setGenerating] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const refresh = () => setItems(getStore().blogPosts);

  const handleAiGenerate = async (data: BlogPost, update: (d: any) => void) => {
    if (!data.title) {
      alert("Please enter a Title first.");
      return;
    }
    setGenerating(true);
    try {
      const prompt = `Write a heartwarming blog post for Jati Welfare Foundation (a charity in Odisha) with the title: "${data.title}". 
      Keep it engaging and under 400 words.`;
      const content = await generateText(prompt);
      update({ ...data, content: content });
    } catch (e) {
      alert("Failed to generate content.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAiImageGenerate = async (data: BlogPost, update: (d: any) => void) => {
    if (!data.title) {
      alert("Please enter a Title first to generate an image.");
      return;
    }
    setGeneratingImage(true);
    try {
      const prompt = `A realistic, high-quality, inspiring blog post header image for a charitable trust in India. Topic: "${data.title}". Context: ${data.excerpt || 'Helping the community'}.`;
      const imageUrl = await generateImage(prompt);
      update({ ...data, image: imageUrl });
    } catch (e) {
      alert("Failed to generate image.");
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <GenericCrud<BlogPost>
      title="Blog Post"
      items={items}
      initialFormState={{ 
        id: '', 
        title: '', 
        slug: '', 
        date: new Date().toISOString().split('T')[0], 
        author: 'Admin', 
        excerpt: '', 
        content: '', 
        image: '',
        imageAlt: ''
      }}
      onDelete={(id) => { deleteItem('blogPosts', id); refresh(); }}
      onSave={(item) => { 
        const exists = items.find(i => i.id === item.id);
        exists ? updateItem('blogPosts', item) : createItem('blogPosts', item);
        refresh();
      }}
      renderRow={(item, onEdit, onDelete) => (
        <>
          <td className="px-6 py-4">
            <div className="flex items-center">
              {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded object-cover mr-3 bg-slate-200" />}
              <div>
                <div className="font-bold text-slate-800">{item.title}</div>
                <div className="text-xs text-slate-500">{item.date} • by {item.author}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-right space-x-2">
            <button onClick={onEdit} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </td>
        </>
      )}
      renderForm={(data, update) => {
        // Check if image is a base64 string (uploaded file) or a URL
        const isBase64 = data.image?.startsWith('data:');

        return (
          <>
             <div>
               <label className="block text-xs font-bold mb-1">Title</label>
               <input required className="w-full border p-2 rounded" value={data.title} onChange={e=>update({...data, title: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold mb-1">Slug</label>
                 <input required className="w-full border p-2 rounded" value={data.slug} onChange={e=>update({...data, slug: e.target.value})} />
               </div>
               <div>
                 <label className="block text-xs font-bold mb-1">Date</label>
                 <input type="date" required className="w-full border p-2 rounded" value={data.date} onChange={e=>update({...data, date: e.target.value})} />
               </div>
             </div>
             <div>
               <label className="block text-xs font-bold mb-1">Author</label>
               <input required className="w-full border p-2 rounded" value={data.author} onChange={e=>update({...data, author: e.target.value})} />
             </div>
             
             <div className="mb-4">
               <label className="block text-xs font-bold mb-1">Featured Image</label>
               
               {/* Preview Area */}
               {data.image && (
                 <div className="mb-2 relative h-40 w-full bg-slate-50 rounded border border-slate-200 overflow-hidden group">
                   <img src={data.image} alt="Preview" className="w-full h-full object-contain" />
                   <button 
                     type="button"
                     onClick={() => update({...data, image: ''})}
                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded shadow hover:bg-red-600"
                     title="Remove image"
                   >
                     <X size={14} />
                   </button>
                 </div>
               )}

               {/* Input Controls */}
               {isBase64 ? (
                  // File Upload State: Show success badge and simple remove action
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center text-green-700 text-sm">
                          <CheckCircle size={16} className="mr-2" />
                          <span>Image uploaded successfully</span>
                      </div>
                      <button 
                          type="button" 
                          onClick={() => update({...data, image: ''})}
                          className="text-xs text-slate-500 hover:text-red-500 underline"
                      >
                          Remove & Use URL
                      </button>
                  </div>
               ) : (
                   // URL Input State: Show Text Input OR File Upload Button OR AI Generation
                   <div className="flex flex-wrap gap-2 items-center">
                     <input 
                       className="flex-1 min-w-[150px] border p-2 rounded text-sm text-slate-600" 
                       placeholder="Paste image URL (https://...)"
                       value={data.image || ''} 
                       onChange={e=>update({...data, image: e.target.value})} 
                     />
                     <span className="text-xs text-slate-400 font-bold uppercase">OR</span>
                     <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-2 rounded flex items-center transition-colors">
                       <Upload size={16} className="mr-2" />
                       <span className="text-sm font-medium whitespace-nowrap">Upload</span>
                       <input 
                         type="file" 
                         accept="image/*" 
                         className="hidden" 
                         onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                             if (file.size > 500000) {
                               alert("File is too large for this demo (max 500KB). Please use a smaller image or a URL.");
                               return;
                             }
                             const reader = new FileReader();
                             reader.onloadend = () => {
                               update({...data, image: reader.result as string});
                             };
                             reader.readAsDataURL(file);
                           }
                         }}
                       />
                     </label>
                     <span className="text-xs text-slate-400 font-bold uppercase">OR</span>
                     <button
                        type="button"
                        onClick={() => handleAiImageGenerate(data, update)}
                        disabled={generatingImage}
                        className="bg-violet-100 hover:bg-violet-200 border border-violet-300 text-violet-700 px-3 py-2 rounded flex items-center transition-colors disabled:opacity-50"
                     >
                        {generatingImage ? <Loader2 size={16} className="animate-spin mr-2"/> : <Wand2 size={16} className="mr-2"/>}
                        <span className="text-sm font-medium whitespace-nowrap">Generate AI</span>
                     </button>
                   </div>
               )}
               <p className="text-[10px] text-slate-400 mt-1">Supported: External URL, File Upload (Max 500KB), or AI Generation.</p>
             </div>

             <div className="mb-4">
               <label className="block text-xs font-bold mb-1">Image Alt Text (Accessibility)</label>
               <input 
                 className="w-full border p-2 rounded" 
                 placeholder="Describe the image for screen readers"
                 value={data.imageAlt || ''} 
                 onChange={e=>update({...data, imageAlt: e.target.value})} 
               />
             </div>

             <div>
               <label className="block text-xs font-bold mb-1">Excerpt</label>
               <textarea required className="w-full border p-2 rounded" rows={2} value={data.excerpt} onChange={e=>update({...data, excerpt: e.target.value})} />
             </div>
             <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-xs font-bold">Full Content</label>
                 <button 
                  type="button" 
                  onClick={() => handleAiGenerate(data, update)}
                  disabled={generating}
                  className="text-xs flex items-center bg-violet-100 text-violet-700 px-2 py-1 rounded hover:bg-violet-200 transition-colors"
                >
                  {generating ? <Loader2 size={12} className="animate-spin mr-1"/> : <Wand2 size={12} className="mr-1"/>}
                  {generating ? 'Generating...' : 'Auto-Generate with AI'}
                </button>
               </div>
               <textarea required className="w-full border p-2 rounded" rows={8} value={data.content} onChange={e=>update({...data, content: e.target.value})} />
             </div>
          </>
        )
      }}
    />
  );
};

// --- GALLERY MANAGER ---
export const GalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(getStore().gallery);
  const refresh = () => setItems(getStore().gallery);

  return (
    <GenericCrud<GalleryItem>
      title="Gallery Item"
      items={items}
      initialFormState={{ 
        id: '', 
        imageUrl: '', 
        caption: '', 
        category: 'General'
      }}
      onDelete={(id) => { deleteItem('gallery', id); refresh(); }}
      onSave={(item) => { 
        const exists = items.find(i => i.id === item.id);
        exists ? updateItem('gallery', item) : createItem('gallery', item);
        refresh();
      }}
      renderRow={(item, onEdit, onDelete) => (
        <>
          <td className="px-6 py-4">
             <div className="flex items-center">
                <img src={item.imageUrl} alt={item.caption} className="w-16 h-12 object-cover rounded mr-4 bg-slate-200 border" />
                <div>
                   <div className="font-bold text-slate-800">{item.caption}</div>
                   <div className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">{item.category}</div>
                </div>
             </div>
          </td>
          <td className="px-6 py-4 text-right space-x-2">
            <button onClick={onEdit} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </td>
        </>
      )}
      renderForm={(data, update) => {
        const isBase64 = data.imageUrl?.startsWith('data:');
        
        return (
          <>
             <div className="mb-4">
               <label className="block text-xs font-bold mb-1">Photo</label>
               
               {/* Preview */}
               {data.imageUrl && (
                 <div className="mb-2 relative h-40 w-full bg-slate-50 rounded border border-slate-200 overflow-hidden group">
                   <img src={data.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                   <button 
                     type="button"
                     onClick={() => update({...data, imageUrl: ''})}
                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded shadow hover:bg-red-600"
                     title="Remove image"
                   >
                     <X size={14} />
                   </button>
                 </div>
               )}

               {/* Input Controls */}
               {isBase64 ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center text-green-700 text-sm">
                          <CheckCircle size={16} className="mr-2" />
                          <span>Image uploaded successfully</span>
                      </div>
                      <button 
                          type="button" 
                          onClick={() => update({...data, imageUrl: ''})}
                          className="text-xs text-slate-500 hover:text-red-500 underline"
                      >
                          Remove & Use URL
                      </button>
                  </div>
               ) : (
                   <div className="flex gap-2 items-center">
                     <input 
                       className="flex-1 border p-2 rounded text-sm text-slate-600" 
                       placeholder="Paste image URL (https://...)"
                       value={data.imageUrl || ''} 
                       onChange={e=>update({...data, imageUrl: e.target.value})} 
                     />
                     <span className="text-xs text-slate-400 font-bold uppercase">OR</span>
                     <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-2 rounded flex items-center transition-colors">
                       <Upload size={16} className="mr-2" />
                       <span className="text-sm font-medium whitespace-nowrap">Upload</span>
                       <input 
                         type="file" 
                         accept="image/*" 
                         className="hidden" 
                         onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                             if (file.size > 500000) {
                               alert("File is too large for this demo (max 500KB).");
                               return;
                             }
                             const reader = new FileReader();
                             reader.onloadend = () => {
                               update({...data, imageUrl: reader.result as string});
                             };
                             reader.readAsDataURL(file);
                           }
                         }}
                       />
                     </label>
                   </div>
               )}
             </div>

             <div>
               <label className="block text-xs font-bold mb-1">Caption</label>
               <input required className="w-full border p-2 rounded" value={data.caption} onChange={e=>update({...data, caption: e.target.value})} placeholder="Short description of the photo" />
             </div>
             
             <div>
               <label className="block text-xs font-bold mb-1">Category</label>
               <select className="w-full border p-2 rounded" value={data.category} onChange={e=>update({...data, category: e.target.value})}>
                 {['General', 'Education', 'Health', 'Relief', 'Events', 'Volunteers'].map(c=><option key={c} value={c}>{c}</option>)}
               </select>
             </div>
          </>
        )
      }}
    />
  );
};

// --- REPORTS MANAGER ---
export const ReportsManager: React.FC = () => {
  const [items, setItems] = useState<Report[]>(getStore().reports);
  const refresh = () => setItems(getStore().reports);

  return (
    <GenericCrud<Report>
      title="Report"
      items={items}
      initialFormState={{ 
        id: '', 
        title: '', 
        year: new Date().getFullYear().toString(), 
        description: '', 
        fileUrl: ''
      }}
      onDelete={(id) => { deleteItem('reports', id); refresh(); }}
      onSave={(item) => { 
        const exists = items.find(i => i.id === item.id);
        exists ? updateItem('reports', item) : createItem('reports', item);
        refresh();
      }}
      renderRow={(item, onEdit, onDelete) => (
        <>
          <td className="px-6 py-4">
             <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center mr-3 text-red-500">
                   <FileText size={20} />
                </div>
                <div>
                   <div className="font-bold text-slate-800">{item.title}</div>
                   <div className="text-xs text-slate-500">{item.year} • {item.description}</div>
                </div>
             </div>
          </td>
          <td className="px-6 py-4 text-right space-x-2">
            <button onClick={onEdit} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </td>
        </>
      )}
      renderForm={(data, update) => {
        // Simple heuristic: if it doesn't start with http, assume it's a simulated upload path or base64
        const isUploaded = data.fileUrl && !data.fileUrl.startsWith('http');
        
        return (
          <>
             <div className="grid grid-cols-3 gap-4">
               <div className="col-span-2">
                 <label className="block text-xs font-bold mb-1">Title</label>
                 <input required className="w-full border p-2 rounded" value={data.title} onChange={e=>update({...data, title: e.target.value})} />
               </div>
               <div>
                 <label className="block text-xs font-bold mb-1">Year</label>
                 <input required className="w-full border p-2 rounded" value={data.year} onChange={e=>update({...data, year: e.target.value})} />
               </div>
             </div>

             <div className="mb-4">
               <label className="block text-xs font-bold mb-1">Document (PDF)</label>
               
               {isUploaded ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center text-green-700 text-sm">
                          <CheckCircle size={16} className="mr-2" />
                          <span>PDF Document Uploaded</span>
                      </div>
                      <button 
                          type="button" 
                          onClick={() => update({...data, fileUrl: ''})}
                          className="text-xs text-slate-500 hover:text-red-500 underline"
                      >
                          Remove
                      </button>
                  </div>
               ) : (
                   <div className="flex gap-2 items-center">
                     <input 
                       className="flex-1 border p-2 rounded text-sm text-slate-600" 
                       placeholder="Paste PDF URL"
                       value={data.fileUrl || ''} 
                       onChange={e=>update({...data, fileUrl: e.target.value})} 
                     />
                     <span className="text-xs text-slate-400 font-bold uppercase">OR</span>
                     <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-2 rounded flex items-center transition-colors">
                       <Upload size={16} className="mr-2" />
                       <span className="text-sm font-medium whitespace-nowrap">Upload PDF</span>
                       <input 
                         type="file" 
                         accept="application/pdf" 
                         className="hidden" 
                         onChange={(e) => {
                           // Simulate upload by setting a fake path or base64 if small
                           // For this demo, we'll just set a marker string
                           if (e.target.files?.[0]) {
                             update({...data, fileUrl: 'simulated_upload/' + e.target.files[0].name});
                           }
                         }}
                       />
                     </label>
                   </div>
               )}
             </div>

             <div>
               <label className="block text-xs font-bold mb-1">Description</label>
               <input required className="w-full border p-2 rounded" value={data.description} onChange={e=>update({...data, description: e.target.value})} />
             </div>
          </>
        )
      }}
    />
  );
};

// --- SITE SETTINGS ---
export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState(getStore().settings);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold mb-6">Site Settings</h2>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
         <div>
            <label className="block font-medium mb-1">Main Hero Text</label>
            <input className="w-full border p-2 rounded" value={settings.heroText} onChange={e => setSettings({...settings, heroText: e.target.value})} />
         </div>
         <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Mission Statement</label>
              <textarea className="w-full border p-2 rounded h-32" value={settings.mission} onChange={e => setSettings({...settings, mission: e.target.value})} />
            </div>
            <div>
              <label className="block font-medium mb-1">Vision Statement</label>
              <textarea className="w-full border p-2 rounded h-32" value={settings.vision} onChange={e => setSettings({...settings, vision: e.target.value})} />
            </div>
         </div>
         <div>
            <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Impact Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div><label className="text-xs">Beneficiaries</label><input type="number" className="w-full border p-2 rounded" value={settings.stats.beneficiaries} onChange={e => setSettings({...settings, stats: {...settings.stats, beneficiaries: Number(e.target.value)}})} /></div>
               <div><label className="text-xs">Villages</label><input type="number" className="w-full border p-2 rounded" value={settings.stats.villages} onChange={e => setSettings({...settings, stats: {...settings.stats, villages: Number(e.target.value)}})} /></div>
               <div><label className="text-xs">Volunteers</label><input type="number" className="w-full border p-2 rounded" value={settings.stats.volunteers} onChange={e => setSettings({...settings, stats: {...settings.stats, volunteers: Number(e.target.value)}})} /></div>
               <div><label className="text-xs">Meals Served</label><input type="number" className="w-full border p-2 rounded" value={settings.stats.meals} onChange={e => setSettings({...settings, stats: {...settings.stats, meals: Number(e.target.value)}})} /></div>
            </div>
         </div>
         <div className="pt-4">
            <button type="submit" className="bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700 font-bold">Save Settings</button>
            {success && <span className="ml-4 text-green-600 text-sm font-medium">Saved Successfully!</span>}
         </div>
      </form>
    </div>
  );
};

// --- DONATIONS MANAGER ---
export const DonationManager: React.FC = () => {
  const [items] = useState(getStore().donations);
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Donation History</h2>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Donor</th>
              <th className="px-6 py-3">Purpose</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {items.map(d => (
               <tr key={d.id} className="hover:bg-slate-50">
                 <td className="px-6 py-4">{new Date(d.date).toLocaleDateString()}</td>
                 <td className="px-6 py-4">
                    <div className="font-medium">{d.donorName}</div>
                    <div className="text-xs text-slate-500">{d.email}</div>
                 </td>
                 <td className="px-6 py-4">{d.purpose}</td>
                 <td className="px-6 py-4 text-right font-bold text-green-600">₹{d.amount}</td>
               </tr>
             ))}
             {items.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No donations recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- VOLUNTEERS MANAGER ---
export const VolunteerManager: React.FC = () => {
  const [items, setItems] = useState(getStore().volunteers);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Volunteer Applications</h2>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
           <thead className="bg-slate-50 border-b">
             <tr>
               <th className="px-6 py-3">Name/Contact</th>
               <th className="px-6 py-3">Interest/City</th>
               <th className="px-6 py-3">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {items.map(v => (
               <tr key={v.id}>
                 <td className="px-6 py-4">
                    <div className="font-bold">{v.name} ({v.age})</div>
                    <div className="text-xs text-slate-500">{v.email} • {v.phone}</div>
                 </td>
                 <td className="px-6 py-4">
                    <div>{v.interest}</div>
                    <div className="text-xs text-slate-500">{v.city} • {v.availability}</div>
                 </td>
                 <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{v.status}</span>
                 </td>
               </tr>
             ))}
             {items.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No volunteers yet.</td></tr>}
           </tbody>
        </table>
      </div>
    </div>
  );
};

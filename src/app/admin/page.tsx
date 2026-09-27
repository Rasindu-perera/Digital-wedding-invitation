'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, ExternalLink, RefreshCw, Settings, Users, Save, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Guest = {
  id: string;
  salutation?: string | null;
  guestName: string;
  phoneNumber: string;
  isOpened: boolean;
  createdAt: string;
};

type WeddingSettings = {
  topText: string;
  brideName: string;
  groomName: string;
  midText: string;
  dateText: string;
  timeText: string;
  venueText: string;
  addressText: string;
  dressCode: string;
  rsvpText: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'invites' | 'settings'>('invites');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [salutation, setSalutation] = useState('Dear');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [settings, setSettings] = useState<WeddingSettings>({
    topText: '', brideName: '', groomName: '', midText: '',
    dateText: '', timeText: '', venueText: '', addressText: '',
    dressCode: '', rsvpText: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchGuests();
    fetchSettings();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await axios.get('/api/guests');
      setGuests(res.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      setSettings(res.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await axios.post('/api/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const generatePDF = async (guestName: string, customSalutation: string) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600&display=swap');
      </style>
      <div style="width: 100%; height: 100%; padding: 20px; background-color: #fcf5f3; font-family: 'Montserrat', sans-serif; box-sizing: border-box; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.4; background: radial-gradient(circle at 20% 30%, #ffe4e6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #fff7ed 0%, transparent 50%); pointer-events: none;"></div>
        
        <div style="width: 100%; height: 100%; border: 1px solid #cda86b; position: relative; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; padding: 40px 20px; box-sizing: border-box; z-index: 10;">
          
          <div style="position: absolute; top: -2px; left: -2px; width: 30px; height: 30px; border-top: 2px solid #cda86b; border-left: 2px solid #cda86b;"></div>
          <div style="position: absolute; top: -2px; right: -2px; width: 30px; height: 30px; border-top: 2px solid #cda86b; border-right: 2px solid #cda86b;"></div>
          <div style="position: absolute; bottom: -2px; left: -2px; width: 30px; height: 30px; border-bottom: 2px solid #cda86b; border-left: 2px solid #cda86b;"></div>
          <div style="position: absolute; bottom: -2px; right: -2px; width: 30px; height: 30px; border-bottom: 2px solid #cda86b; border-right: 2px solid #cda86b;"></div>

          <div style="color: #b68c4a; margin-top: 20px;">
            <p style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">${settings.topText}</p>
            <p style="font-size: 12px; font-style: italic; margin-top: 10px; opacity: 0.8;">${customSalutation} ${guestName},</p>
          </div>

          <div style="margin: 40px 0;">
            <h1 style="font-family: 'Great Vibes', cursive; color: #b68c4a; font-size: 70px; line-height: 0.6; margin: 0; font-weight: normal; transform: rotate(-2deg);">${settings.brideName}</h1>
            <h1 style="font-family: 'Great Vibes', cursive; color: #b68c4a; font-size: 50px; line-height: 0.6; margin: 15px 0; font-weight: normal; transform: rotate(-2deg);">&</h1>
            <h1 style="font-family: 'Great Vibes', cursive; color: #b68c4a; font-size: 70px; line-height: 0.6; margin: 0 0 0 50px; font-weight: normal; transform: rotate(-2deg);">${settings.groomName}</h1>
          </div>

          <div style="color: #b68c4a; width: 100%;">
            <div style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; border-bottom: 1px solid rgba(205, 168, 107, 0.3); padding-bottom: 15px; width: 70%; margin: 0 auto 20px auto; line-height: 1.8; white-space: pre-wrap;">
              ${settings.midText}<br/><br/>
              <span style="font-size: 12px;">${settings.dateText}</span>
            </div>
            
            <div style="font-size: 13px; letter-spacing: 2px; line-height: 1.8;">
              <p style="margin: 0;">${settings.timeText}</p>
              <p style="margin: 0;">${settings.venueText}</p>
              <p style="margin: 0;">${settings.addressText}</p>
            </div>

            <div style="font-size: 13px; letter-spacing: 2px; margin-top: 20px;">
              ${settings.dressCode}
            </div>

            <div style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin-top: 30px;">
              ${settings.rsvpText}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(element);
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.width = '794px'; 
    element.style.height = '1123px';
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const opt = {
      margin: 0,
      filename: `Invitation_${guestName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg' as const, quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'px', format: [794, 1123] as [number, number], orientation: 'portrait' as const }
    };

    const html2pdf = (await import('html2pdf.js')).default;
    await html2pdf().from(element).set(opt).save();
    document.body.removeChild(element);
  };

  const handleGenerateAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/guests', { guestName: name, phoneNumber: phone, salutation });
      const newGuest = res.data;
      const inviteUrl = `${window.location.origin}/invite/${newGuest.id}`;

      await generatePDF(newGuest.guestName, newGuest.salutation || 'Dear');

      const message = `Hello ${newGuest.guestName}, we are delighted to invite you to our wedding! View your invitation here: ${inviteUrl}`;
      const whatsappUrl = `https://wa.me/${newGuest.phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      fetchGuests();
      setName('');
      setPhone('');
      setSalutation('Dear');
    } catch (error) {
      console.error('Error generating invite:', error);
      alert('Failed to generate invitation.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete('/api/auth');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-serif font-bold text-amber-900">Wedding Admin</h1>
          <div className="flex bg-white rounded-lg shadow-sm border border-amber-100 p-1">
            <button 
              onClick={() => setActiveTab('invites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${activeTab === 'invites' ? 'bg-amber-100 text-amber-900' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Users className="w-4 h-4" /> Invites
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${activeTab === 'settings' ? 'bg-amber-100 text-amber-900' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button 
              onClick={handleLogout}
              title="Logout"
              className="flex items-center justify-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition ml-2 border-l border-amber-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeTab === 'settings' ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Global Invitation Details</h2>
            <form onSubmit={saveSettings} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bride Name</label>
                  <input type="text" value={settings.brideName} onChange={e => setSettings({...settings, brideName: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Groom Name</label>
                  <input type="text" value={settings.groomName} onChange={e => setSettings({...settings, groomName: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Top Intro Text</label>
                <input type="text" value={settings.topText} onChange={e => setSettings({...settings, topText: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Invitation Text</label>
                <textarea value={settings.midText} onChange={e => setSettings({...settings, midText: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none h-20" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="text" value={settings.dateText} onChange={e => setSettings({...settings, dateText: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="text" value={settings.timeText} onChange={e => setSettings({...settings, timeText: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                  <input type="text" value={settings.venueText} onChange={e => setSettings({...settings, venueText: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City/State/Address</label>
                  <input type="text" value={settings.addressText} onChange={e => setSettings({...settings, addressText: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dress Code</label>
                  <input type="text" value={settings.dressCode} onChange={e => setSettings({...settings, dressCode: e.target.value})} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RSVP Deadline</label>
                  <input type="text" value={settings.rsvpText} onChange={e => setSettings({...settings, rsvpText: e.target.value})} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button type="submit" disabled={savingSettings} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-50">
                  {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save All Details
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Form Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">New Invitation</h2>
              <form onSubmit={handleGenerateAndSend} className="flex gap-4 items-end flex-wrap">
                <div className="flex-none w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salutation</label>
                  <select 
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white text-gray-900"
                  >
                    <option value="Dear">Dear</option>
                    <option value="To">To</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="The">The</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    placeholder="e.g. 1234567890"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Generate & Send
                </button>
              </form>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Invitation History</h2>
                <button onClick={fetchGuests} className="text-amber-600 hover:text-amber-700 p-2">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-amber-50/50 text-gray-600 text-sm">
                      <th className="p-4 font-medium border-b border-amber-100">Guest Name</th>
                      <th className="p-4 font-medium border-b border-amber-100">Phone Number</th>
                      <th className="p-4 font-medium border-b border-amber-100">Status</th>
                      <th className="p-4 font-medium border-b border-amber-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {guests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-amber-50/30 transition">
                        <td className="p-4 text-gray-800 font-medium">{guest.guestName}</td>
                        <td className="p-4 text-gray-600">{guest.phoneNumber}</td>
                        <td className="p-4">
                          {guest.isOpened ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Opened
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Sent
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/invite/${guest.id}`);
                                alert('Link copied to clipboard!');
                              }}
                              className="text-amber-600 hover:text-amber-800 text-sm flex items-center gap-1"
                            >
                              Copy Link
                            </button>
                            <a 
                              href={`/invite/${guest.id}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-gray-500 hover:text-gray-800 flex items-center"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {guests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">
                          No invitations generated yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

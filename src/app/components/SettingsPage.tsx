import { useState } from 'react';
import {
  User, Lock, Bell, Globe, Palette, Shield, Trash2, Check,
  Eye, EyeOff, Camera, MapPin, Phone, Mail, Clock, Save,
  ToggleLeft, ToggleRight, AlertTriangle, X
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Page } from './Navbar';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'appearance' | 'danger';

const TABS: { id: SettingsTab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Club Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

const SPORTS_OPTIONS = ['Football', 'Gym', 'Swimming', 'Basketball', 'Tennis', 'Yoga', 'Volleyball', 'Karate', 'Boxing', 'Padel', 'CrossFit', 'Pilates'];

export function SettingsPage({ navigate }: { navigate: (page: Page) => void }) {
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [flash, setFlash] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  
  const [clubName, setClubName] = useState('Arena Sports Club');
  const [description, setDescription] = useState('Premier multi-sport facility in downtown SF with world-class amenities and professional coaching staff.');
  const [address, setAddress] = useState('123 Sports Ave, San Francisco, CA 94102');
  const [phone, setPhone] = useState('+1 (415) 555-0190');
  const [email, setEmail] = useState('info@arenasports.com');
  const [website, setWebsite] = useState('arenasports.com');
  const [openTime, setOpenTime] = useState('06:00');
  const [closeTime, setCloseTime] = useState('23:00');
  const [selectedSports, setSelectedSports] = useState(['Football', 'Gym', 'Swimming', 'Yoga']);
  const [capacity, setCapacity] = useState('500');
  const [priceFrom, setPriceFrom] = useState('45');

  
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState(true);

  
  const [notifs, setNotifs] = useState({
    newBooking: true, cancelBooking: true, newMember: true,
    memberLeft: false, paymentReceived: true, paymentFailed: true,
    eventReminder: true, reviewPosted: true, weeklyReport: true,
    smsAlerts: false, pushNotifs: true,
  });

  
  const [primaryColor, setPrimaryColor] = useState('#0F62FE');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const toast = (m: string) => { setFlash(m); setTimeout(() => setFlash(''), 2800); };

  const toggleSport = (s: string) =>
    setSelectedSports(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  const saveProfile = () => toast('Club profile saved successfully.');
  const saveSecurity = () => {
    if (!currentPass) { toast('Please enter your current password.'); return; }
    if (newPass !== confirmPass) { toast('New passwords do not match.'); return; }
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    toast('Password updated successfully.');
  };
  const saveNotifs = () => toast('Notification preferences saved.');
  const saveAppearance = () => toast('Appearance settings saved.');

  const passStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passStrength(newPass);
  const strengthColors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <DashboardLayout navigate={navigate} currentPage="settings">
      {}
      {flash && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#0D1B2A', color: 'white', borderRadius: 12, padding: '12px 18px', zIndex: 300, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <Check size={14} color="#22C55E" /> {flash}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Manage your club profile, security and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>

        {}
        <div style={{ background: 'white', borderRadius: 14, padding: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 88 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2, background: tab === t.id ? (t.id === 'danger' ? '#FFF1F2' : '#EFF4FF') : 'transparent', color: tab === t.id ? (t.id === 'danger' ? '#EF4444' : '#0F62FE') : t.id === 'danger' ? '#EF4444' : '#374151', transition: 'all 0.2s', textAlign: 'left' }}
              onMouseEnter={e => { if (tab !== t.id) (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'; }}
              onMouseLeave={e => { if (tab !== t.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
              <t.icon size={16} />
              <span style={{ fontSize: 13, fontWeight: tab === t.id ? 700 : 500 }}>{t.label}</span>
            </button>
          ))}
        </div>

        {}
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

          {}
          {tab === 'profile' && (
            <div>
              <div style={{ padding: '22px 26px', borderBottom: '1px solid #F3F4F6' }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: 0 }}>Club Profile</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>Update your club's public information</p>
              </div>

              {}
              <div style={{ position: 'relative', height: 160, background: 'linear-gradient(135deg,#0F62FE,#0043CE)', marginBottom: 0 }}>
                <img src="https://images.unsplash.com/photo-1761971975769-97e598bf526b?w=800&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                <button style={{ position: 'absolute', bottom: 12, right: 16, padding: '7px 14px', borderRadius: 9, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: 'white', fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Camera size={13} /> Change Cover
                </button>

                <div style={{ position: 'absolute', bottom: -32, left: 26, width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#0F62FE,#0043CE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', border: '3px solid white', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>A
                  <button style={{ position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: '50%', background: '#0F62FE', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Camera size={10} color="white" />
                  </button>
                </div>
              </div>

              <div style={{ padding: '44px 26px 26px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <FField label="Club Name *" value={clubName} onChange={setClubName} placeholder="Your club name" />
                    <FField label="Price From ($/mo)" value={priceFrom} onChange={setPriceFrom} type="number" placeholder="45" />
                  </div>

                  {}
                  <div>
                    <label style={lbl}>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#111827', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }} onFocus={e => (e.target.style.borderColor = '#0F62FE')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
                  </div>

                  {}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <FField label="Email" value={email} onChange={setEmail} type="email" placeholder="info@club.com" icon={<Mail size={14} color="#9CA3AF" />} />
                    <FField label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+1 555 000 0000" icon={<Phone size={14} color="#9CA3AF" />} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <FField label="Website" value={website} onChange={setWebsite} placeholder="yourclub.com" icon={<Globe size={14} color="#9CA3AF" />} />
                    <FField label="Max Capacity" value={capacity} onChange={setCapacity} type="number" placeholder="200" />
                  </div>
                  <FField label="Address" value={address} onChange={setAddress} placeholder="Street, City, State ZIP" icon={<MapPin size={14} color="#9CA3AF" />} />

                  {}
                  <div>
                    <label style={lbl}>Working Hours</label>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <Clock size={14} color="#9CA3AF" />
                        <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} style={inp} />
                        <span style={{ fontSize: 13, color: '#6B7280' }}>to</span>
                        <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} style={inp} />
                      </div>
                    </div>
                  </div>

                  {}
                  <div>
                    <label style={lbl}>Sports Offered <span style={{ fontWeight: 400, color: '#9CA3AF' }}>({selectedSports.length} selected)</span></label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {SPORTS_OPTIONS.map(s => {
                        const active = selectedSports.includes(s);
                        return (
                          <button key={s} onClick={() => toggleSport(s)} style={{ padding: '6px 14px', borderRadius: 100, border: active ? 'none' : '1.5px solid #E5E7EB', background: active ? '#0F62FE' : 'white', color: active ? 'white' : '#374151', fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                    <button onClick={saveProfile} style={{ padding: '10px 28px', borderRadius: 10, background: 'linear-gradient(135deg,#0F62FE,#0043CE)', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(15,98,254,0.3)' }}>
                      <Save size={14} /> Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}
          {tab === 'security' && (
            <div style={{ padding: '22px 26px' }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Security</h2>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>Manage your password and account security</p>

              {}
              <div style={{ background: '#F9FAFB', borderRadius: 14, padding: '20px', marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 18px' }}>Change Password</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <PassField label="Current Password" value={currentPass} onChange={setCurrentPass} show={showCurrent} onToggle={() => setShowCurrent(s => !s)} />
                  <PassField label="New Password" value={newPass} onChange={setNewPass} show={showNew} onToggle={() => setShowNew(s => !s)} />
                  {newPass && (
                    <div>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i <= strength ? strengthColors[strength] : '#E5E7EB', transition: 'all 0.3s' }} />)}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                    </div>
                  )}
                  <PassField label="Confirm New Password" value={confirmPass} onChange={setConfirmPass} show={showNew} onToggle={() => setShowNew(s => !s)}
                    error={confirmPass && newPass !== confirmPass ? 'Passwords do not match' : ''} />
                  <button onClick={saveSecurity} style={{ alignSelf: 'flex-start', padding: '9px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#0F62FE,#0043CE)', color: 'white', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Lock size={13} /> Update Password
                  </button>
                </div>
              </div>

              {}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ToggleRow icon={<Shield size={16} color="#0F62FE" />} label="Two-Factor Authentication" sub="Require OTP on every login for extra security" checked={twoFA} onChange={() => setTwoFA(v => !v)} />
                <ToggleRow icon={<Globe size={16} color="#8B5CF6" />} label="Track Active Sessions" sub="See and manage all devices logged into your account" checked={sessions} onChange={() => setSessions(v => !v)} />
              </div>

              {}
              <div style={{ background: '#F9FAFB', borderRadius: 14, padding: '18px', marginTop: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 14px' }}>Active Sessions</h4>
                {[{ device: 'MacBook Pro — Chrome', loc: 'San Francisco, CA', time: 'Now · Current session', active: true }, { device: 'iPhone 15 — Safari', loc: 'San Francisco, CA', time: '2 hours ago', active: false }, { device: 'Windows PC — Chrome', loc: 'New York, NY', time: '3 days ago', active: false }].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid #E5E7EB' : 'none' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{s.device}</p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{s.loc} · {s.time}</p>
                    </div>
                    {s.active ? (
                      <span style={{ padding: '3px 10px', borderRadius: 100, background: '#F0FDF4', color: '#22C55E', fontSize: 11, fontWeight: 700 }}>Active</span>
                    ) : (
                      <button style={{ padding: '4px 12px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: '#EF4444', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {tab === 'notifications' && (
            <div style={{ padding: '22px 26px' }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Notifications</h2>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>Choose which alerts you want to receive</p>

              {[
                { title: 'Bookings', items: [{ key: 'newBooking', label: 'New booking received', sub: 'Get notified when a member books a session' }, { key: 'cancelBooking', label: 'Booking cancelled', sub: 'Alert when a booking is cancelled' }] },
                { title: 'Members', items: [{ key: 'newMember', label: 'New member joined', sub: 'When a new member subscribes to a plan' }, { key: 'memberLeft', label: 'Member unsubscribed', sub: 'When a member cancels their plan' }] },
                { title: 'Payments', items: [{ key: 'paymentReceived', label: 'Payment received', sub: 'Confirmation of successful payments' }, { key: 'paymentFailed', label: 'Payment failed', sub: 'Alert on failed or declined transactions' }] },
                { title: 'Events & Reviews', items: [{ key: 'eventReminder', label: 'Event reminders', sub: '24h before an event starts' }, { key: 'reviewPosted', label: 'New review posted', sub: 'When a member leaves a review' }] },
                { title: 'Reports', items: [{ key: 'weeklyReport', label: 'Weekly performance report', sub: 'Summary of key metrics every Monday' }] },
                { title: 'Channels', items: [{ key: 'smsAlerts', label: 'SMS alerts', sub: 'Critical notifications via SMS' }, { key: 'pushNotifs', label: 'Push notifications', sub: 'Browser/mobile push alerts' }] },
              ].map(section => (
                <div key={section.title} style={{ marginBottom: 22 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 10px' }}>{section.title}</h4>
                  <div style={{ background: '#F9FAFB', borderRadius: 12, overflow: 'hidden' }}>
                    {section.items.map((item, i) => (
                      <ToggleRow key={item.key} label={item.label} sub={item.sub} checked={notifs[item.key as keyof typeof notifs]} onChange={() => toggleNotif(item.key as keyof typeof notifs)} divider={i < section.items.length - 1} />
                    ))}
                  </div>
                </div>
              ))}

              <button onClick={saveNotifs} style={{ padding: '10px 26px', borderRadius: 10, background: 'linear-gradient(135deg,#0F62FE,#0043CE)', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(15,98,254,0.3)' }}>
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {}
          {tab === 'appearance' && (
            <div style={{ padding: '22px 26px' }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Appearance</h2>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>Customize the look and regional preferences</p>

              {}
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Primary Brand Color</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {['#0F62FE', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#0D1B2A'].map(c => (
                    <button key={c} onClick={() => setPrimaryColor(c)} style={{ width: 36, height: 36, borderRadius: 10, background: c, border: primaryColor === c ? '3px solid white' : '3px solid transparent', boxShadow: primaryColor === c ? `0 0 0 2.5px ${c}` : '0 2px 6px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'all 0.2s' }} />
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: 36, height: 36, border: '1.5px solid #E5E7EB', borderRadius: 10, cursor: 'pointer', padding: 2 }} />
                    <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'monospace' }}>{primaryColor}</span>
                  </div>
                </div>
                <div style={{ marginTop: 14, padding: '14px 18px', borderRadius: 12, background: primaryColor, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Preview Button</span>
                </div>
              </div>

              {}
              <div style={{ marginBottom: 22 }}>
                <label style={lbl}>Theme</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{ label: 'Light', active: !darkMode }, { label: 'Dark', active: darkMode }].map(t => (
                    <button key={t.label} onClick={() => setDarkMode(t.label === 'Dark')} style={{ flex: 1, padding: '14px', borderRadius: 12, border: `2px solid ${t.active ? '#0F62FE' : '#E5E7EB'}`, background: t.active ? '#EFF4FF' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ width: '100%', height: 60, borderRadius: 8, background: t.label === 'Dark' ? '#0D1B2A' : '#F8FAFC', border: '1px solid #E5E7EB', marginBottom: 8 }} />
                      <p style={{ fontSize: 13, fontWeight: t.active ? 700 : 500, color: t.active ? '#0F62FE' : '#374151', margin: 0 }}>{t.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                {[['Language', language, setLanguage, ['English', 'Arabic', 'French', 'Spanish', 'Portuguese']], ['Timezone', timezone, setTimezone, ['America/Los_Angeles', 'America/New_York', 'Europe/London', 'Europe/Paris', 'Asia/Dubai']], ['Currency', currency, setCurrency, ['USD', 'EUR', 'GBP', 'AED', 'SAR']], ['Date Format', dateFormat, setDateFormat, ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']]].map(([label, val, setter, opts]) => (
                  <div key={label as string}>
                    <label style={lbl}>{label as string}</label>
                    <select value={val as string} onChange={e => (setter as any)(e.target.value)} style={{ ...inp, height: 40 }}>
                      {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <button onClick={saveAppearance} style={{ padding: '10px 26px', borderRadius: 10, background: 'linear-gradient(135deg,#0F62FE,#0043CE)', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(15,98,254,0.3)' }}>
                <Save size={14} /> Save Appearance
              </button>
            </div>
          )}

          {}
          {tab === 'danger' && (
            <div style={{ padding: '22px 26px' }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#EF4444', margin: '0 0 4px' }}>Danger Zone</h2>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>These actions are permanent and cannot be undone</p>

              {[
                { title: 'Export All Data', sub: 'Download a full backup of your club data including members, bookings, and payments.', btn: 'Export Data', btnColor: '#374151', btnBg: '#F9FAFB', action: () => toast('Data export started. You\'ll receive an email shortly.') },
                { title: 'Deactivate Club', sub: 'Temporarily hide your club from SportifyHub. Members won\'t be able to book new sessions.', btn: 'Deactivate', btnColor: '#D97706', btnBg: '#FFFBEB', action: () => toast('Club deactivated. Contact support to reactivate.') },
                { title: 'Delete Club Account', sub: 'Permanently delete your club and all associated data. This action cannot be reversed.', btn: 'Delete Club', btnColor: '#DC2626', btnBg: '#FFF1F2', action: () => setShowDeleteConfirm(true) },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderRadius: 12, border: '1.5px solid #E5E7EB', marginBottom: 14, flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>{item.sub}</p>
                  </div>
                  <button onClick={item.action} style={{ padding: '8px 18px', borderRadius: 9, background: item.btnBg, color: item.btnColor, fontSize: 13, fontWeight: 700, border: `1.5px solid ${item.btnColor}30`, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {item.btn}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ background: 'white', borderRadius: 18, padding: 28, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <AlertTriangle size={26} color="#EF4444" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>Delete Club Account?</h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 22px', lineHeight: 1.6 }}>
              This will permanently delete <strong>Arena Sports Club</strong> and all data including <strong>2,847 members</strong>, bookings, payments, and events. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
              <button onClick={() => { setShowDeleteConfirm(false); navigate('landing'); }} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg,#EF4444,#DC2626)', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}


function FField({ label, value, onChange, type = 'text', placeholder, icon }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>{icon}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...inp, paddingLeft: icon ? 34 : 12, height: 40 }} onFocus={e => (e.target.style.borderColor = '#0F62FE')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
      </div>
    </div>
  );
}

function PassField({ label, value, onChange, show, onToggle, error }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; error?: string }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Lock size={14} color="#9CA3AF" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder="••••••••" style={{ ...inp, paddingLeft: 34, paddingRight: 40, height: 40, borderColor: error ? '#EF4444' : '#E5E7EB' }} onFocus={e => (e.target.style.borderColor = error ? '#EF4444' : '#0F62FE')} onBlur={e => (e.target.style.borderColor = error ? '#EF4444' : '#E5E7EB')} />
        <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0', fontWeight: 500 }}>{error}</p>}
    </div>
  );
}

function ToggleRow({ icon, label, sub, checked, onChange, divider }: { icon?: React.ReactNode; label: string; sub: string; checked: boolean; onChange: () => void; divider?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: divider ? '1px solid #E5E7EB' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
        {icon && <div style={{ width: 32, height: 32, borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>{icon}</div>}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{label}</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{sub}</p>
        </div>
      </div>
      <button onClick={onChange} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: 16 }}>
        {checked ? <ToggleRight size={28} color="#0F62FE" /> : <ToggleLeft size={28} color="#D1D5DB" />}
      </button>
    </div>
  );
}

const lbl: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 };
const inp: React.CSSProperties = { width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '0 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#111827', background: 'white', height: 38 };

import { Download, TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DashboardLayout } from './DashboardLayout';
import { Page } from './Navbar';

const revenueData = [
  { month: 'Jan', revenue: 24000, profit: 12000, expenses: 8000 },
  { month: 'Feb', revenue: 32000, profit: 15000, expenses: 9000 },
  { month: 'Mar', revenue: 28000, profit: 14000, expenses: 7000 },
  { month: 'Apr', revenue: 36000, profit: 18000, expenses: 9000 },
  { month: 'May', revenue: 42000, profit: 21000, expenses: 10000 },
  { month: 'Jun', revenue: 39000, profit: 19500, expenses: 9500 },
];

const membersGrowth = [
  { month: 'Jan', total: 1200, new: 120, churned: 12 },
  { month: 'Feb', total: 1320, new: 140, churned: 10 },
  { month: 'Mar', total: 1440, new: 150, churned: 30 },
  { month: 'Apr', total: 1620, new: 220, churned: 40 },
  { month: 'May', total: 1750, new: 160, churned: 30 },
  { month: 'Jun', total: 1860, new: 130, churned: 20 },
];

const bookingsBySport = [
  { sport: 'Football', bookings: 320 },
  { sport: 'Tennis', bookings: 210 },
  { sport: 'Swimming', bookings: 150 },
  { sport: 'Gym', bookings: 420 },
  { sport: 'Yoga', bookings: 120 },
];

const planDistribution = [
  { name: 'Elite', value: 420, color: '#F59E0B' },
  { name: 'Premium', value: 720, color: '#0F62FE' },
  { name: 'Basic', value: 320, color: '#6B7280' },
];

const occupancyByDay = [
  { day: 'Mon', rate: 78 },
  { day: 'Tue', rate: 82 },
  { day: 'Wed', rate: 91 },
  { day: 'Thu', rate: 69 },
  { day: 'Fri', rate: 74 },
  { day: 'Sat', rate: 95 },
  { day: 'Sun', rate: 60 },
];

const kpiCards = [
  { label: 'Revenue', value: '$39,000', change: '12%', bg: '#EFF4FF', color: '#0F62FE', icon: DollarSign },
  { label: 'New Members', value: '130', change: '9%', bg: '#F0FDF4', color: '#22C55E', icon: Users },
  { label: 'Bookings', value: '1,720', change: '5%', bg: '#FFF7ED', color: '#F59E0B', icon: BookOpen },
  { label: 'Active Users', value: '1,860', change: '8%', bg: '#F3F4F6', color: '#8B5CF6', icon: TrendingUp },
];

export function ReportsPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <DashboardLayout navigate={navigate} currentPage="reports">
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>Reports & Analytics</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Performance overview — June 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select style={{ height: 36, border: '1.5px solid #E5E7EB', borderRadius: 9, fontSize: 13, color: '#374151', padding: '0 12px', outline: 'none', background: 'white' }}>
            <option>Last 6 months</option><option>Last 3 months</option><option>This year</option>
          </select>
          <button style={{ padding: '0 16px', height: 36, borderRadius: 9, border: '1.5px solid #E5E7EB', background: 'white', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
        {kpiCards.map(c => (
          <div key={c.label} style={{ background: 'white', borderRadius: 14, padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><c.icon size={17} color={c.color} /></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', background: '#F0FDF4', padding: '2px 8px', borderRadius: 100 }}>↑ {c.change}</span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 3px', letterSpacing: '-0.5px' }}>{c.value}</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{c.label}</p>
          </div>
        ))}
      </div>

      {}
      <div style={{ background: 'white', borderRadius: 16, padding: '22px', marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div><h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Revenue & Profit</h3><p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>Monthly breakdown</p></div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[{ color: '#0F62FE', label: 'Revenue' }, { color: '#22C55E', label: 'Profit' }, { color: '#F3F4F6', label: 'Expenses' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} /><span style={{ fontSize: 12, color: '#6B7280' }}>{l.label}</span></div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F62FE" stopOpacity={0.12} /><stop offset="95%" stopColor="#0F62FE" stopOpacity={0} /></linearGradient>
              <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.12} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'K'} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']} />
            <Area type="monotone" dataKey="revenue" stroke="#0F62FE" strokeWidth={2.5} fill="url(#gRev)" dot={false} />
            <Area type="monotone" dataKey="profit" stroke="#22C55E" strokeWidth={2.5} fill="url(#gProfit)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, marginBottom: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Member Growth</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 16px' }}>New vs. churned members monthly</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={membersGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="total" stroke="#0F62FE" strokeWidth={2.5} dot={false} name="Total" />
              <Line type="monotone" dataKey="new" stroke="#22C55E" strokeWidth={2} dot={false} name="New" />
              <Line type="monotone" dataKey="churned" stroke="#EF4444" strokeWidth={2} dot={false} name="Churned" strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', minWidth: 220 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Plan Distribution</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 10px' }}>Subscribers by plan</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {planDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Bookings by Sport</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 16px' }}>Total sessions this month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bookingsBySport} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="sport" tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="bookings" fill="#0F62FE" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Weekly Occupancy Rate</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 16px' }}>Average facility usage %</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={occupancyByDay} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v: any) => [`${v}%`, 'Occupancy']} />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                {occupancyByDay.map((entry, i) => (
                  <Cell key={i} fill={entry.rate >= 90 ? '#22C55E' : entry.rate >= 70 ? '#0F62FE' : '#F59E0B'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'center' }}>
            {[{ color: '#22C55E', label: '≥90% Full' }, { color: '#0F62FE', label: '≥70%' }, { color: '#F59E0B', label: '<70%' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} /><span style={{ fontSize: 11, color: '#6B7280' }}>{l.label}</span></div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

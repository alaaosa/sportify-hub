import { useState, useMemo } from 'react';
import { Download, Search, DollarSign, TrendingUp, CreditCard, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Page } from './Navbar';

type PayStatus = 'paid' | 'pending' | 'failed' | 'refunded';

interface Transaction {
  id: string; member: string; avatar: string; gradient: string;
  type: 'membership' | 'session' | 'event'; description: string;
  amount: number; status: PayStatus; method: string; date: string;
}

const TXS: Transaction[] = [
  { id: '#T-1001', member: 'Aisha Ali', avatar: 'AA', gradient: 'linear-gradient(135deg, #0F62FE, #22C55E)', type: 'membership', description: 'Annual membership - Elite plan', amount: 299, status: 'paid', method: 'Credit Card', date: '2026-06-28' },
  { id: '#T-1002', member: 'Omar Khaled', avatar: 'OK', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)', type: 'session', description: 'Personal training session (x1)', amount: 35, status: 'paid', method: 'Stripe', date: '2026-07-01' },
  { id: '#T-1003', member: 'Sara Nabil', avatar: 'SN', gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)', type: 'event', description: 'Yoga workshop ticket', amount: 20, status: 'pending', method: 'Credit Card', date: '2026-07-10' },
  { id: '#T-1004', member: 'Mohamed Youssef', avatar: 'MY', gradient: 'linear-gradient(135deg, #06B6D4, #F59E0B)', type: 'membership', description: 'Monthly membership - Basic', amount: 25, status: 'failed', method: 'Card', date: '2026-06-30' },
  { id: '#T-1005', member: 'Lina Farouk', avatar: 'LF', gradient: 'linear-gradient(135deg, #0F62FE, #8B5CF6)', type: 'session', description: 'Swimming lesson - group', amount: 15, status: 'paid', method: 'Cash', date: '2026-07-02' },
  { id: '#T-1006', member: 'Yousef Adel', avatar: 'YA', gradient: 'linear-gradient(135deg, #22C55E, #06B6D4)', type: 'event', description: '5-a-side tournament fee', amount: 50, status: 'refunded', method: 'Stripe', date: '2026-06-20' },
  { id: '#T-1007', member: 'Hana Said', avatar: 'HS', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', type: 'membership', description: 'Quarterly membership - Premium', amount: 120, status: 'paid', method: 'Credit Card', date: '2026-07-03' },
  { id: '#T-1008', member: 'Khaled Mansour', avatar: 'KM', gradient: 'linear-gradient(135deg, #EF4444, #F59E0B)', type: 'session', description: 'Tennis coach session', amount: 40, status: 'pending', method: 'Card', date: '2026-07-05' },
  { id: '#T-1009', member: 'Mona Rami', avatar: 'MR', gradient: 'linear-gradient(135deg, #8B5CF6, #0F62FE)', type: 'event', description: 'Pilates masterclass', amount: 30, status: 'paid', method: 'Credit Card', date: '2026-07-06' },
  { id: '#T-1010', member: 'Ibrahim Omar', avatar: 'IO', gradient: 'linear-gradient(135deg, #06B6D4, #22C55E)', type: 'session', description: 'Boxing trial session', amount: 10, status: 'paid', method: 'Cash', date: '2026-07-07' },
];

const SC: Record<PayStatus, { bg: string; text: string; dot: string; label: string }> = {
  paid: { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E', label: 'Paid' },
  pending: { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B', label: 'Pending' },
  failed: { bg: '#FFF1F2', text: '#DC2626', dot: '#EF4444', label: 'Failed' },
  refunded: { bg: '#F5F3FF', text: '#7C3AED', dot: '#8B5CF6', label: 'Refunded' },
};

const typeConfig: Record<string, { bg: string; text: string }> = {
  membership: { bg: '#EFF4FF', text: '#0F62FE' },
  session: { bg: '#F0FDF4', text: '#16A34A' },
  event: { bg: '#FFFBEB', text: '#D97706' },
};

const PER_PAGE = 8;

export function PaymentsPage({ navigate }: { navigate: (page: Page) => void }) {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<'All' | PayStatus>('All');
  const [typeF, setTypeF] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => TXS.filter(t => {
    if (search && !t.member.toLowerCase().includes(search.toLowerCase()) && !t.id.includes(search) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusF !== 'All' && t.status !== statusF) return false;
    if (typeF !== 'All' && t.type !== typeF) return false;
    return true;
  }), [search, statusF, typeF]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalPaid = TXS.filter(t => t.status === 'paid').reduce((a, t) => a + t.amount, 0);
  const totalPending = TXS.filter(t => t.status === 'pending').reduce((a, t) => a + t.amount, 0);
  const totalFailed = TXS.filter(t => t.status === 'failed').length;
  const totalRefunded = TXS.filter(t => t.status === 'refunded').reduce((a, t) => a + t.amount, 0);

  return (
    <DashboardLayout navigate={navigate} currentPage="payments">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>Payments</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Track all transactions and revenue</p>
        </div>
        <button style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px,1fr))', gap: 14, marginBottom: 22 }}>
        {[{ icon: DollarSign, label: 'Total Collected', value: '$' + totalPaid.toLocaleString(), color: '#22C55E', bg: '#F0FDF4', sub: 'this month' }, { icon: Clock, label: 'Pending', value: '$' + totalPending.toLocaleString(), color: '#F59E0B', bg: '#FFFBEB', sub: '$' + TXS.filter(t => t.status === 'pending').length + ' transactions' }, { icon: TrendingUp, label: 'Failed Payments', value: totalFailed, color: '#EF4444', bg: '#FFF1F2', sub: 'need follow-up' }, { icon: CreditCard, label: 'Refunded', value: `$${totalRefunded}`, color: '#8B5CF6', bg: '#F5F3FF', sub: `${TXS.filter(t => t.status === 'refunded').length} transactions` }].map(c => (
          <div key={c.label} style={{ background: 'white', borderRadius: 14, padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><c.icon size={18} color={c.color} /></div>
            <div><p style={{ fontSize: 19, fontWeight: 800, color: '#111827', margin: 0 }}>{c.value}</p><p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{c.label}</p></div>
          </div>
        ))}
      </div>

      {}
      <div style={{ background: 'white', borderRadius: 12, padding: '13px 16px', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search member, ID, description…" style={{ paddingLeft: 33, paddingRight: 12, height: 36, border: '1.5px solid #E5E7EB', borderRadius: 9, fontSize: 13, color: '#111827', outline: 'none', width: '100%', boxSizing: 'border-box' }} onFocus={e => (e.target.style.borderColor = '#0F62FE')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {(['All', 'paid', 'pending', 'failed', 'refunded'] as const).map(s => (
            <button key={s} onClick={() => { setStatusF(s); setPage(1); }} style={{ padding: '5px 11px', borderRadius: 100, border: statusF === s ? 'none' : '1.5px solid #E5E7EB', background: statusF === s ? (s === 'All' ? '#0F62FE' : SC[s as PayStatus]?.bg ?? '#0F62FE') : 'white', color: statusF === s ? (s === 'All' ? 'white' : SC[s as PayStatus]?.text ?? 'white') : '#374151', fontSize: 11, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
        <select value={typeF} onChange={e => { setTypeF(e.target.value); setPage(1); }} style={{ height: 36, border: '1.5px solid #E5E7EB', borderRadius: 9, fontSize: 13, color: '#374151', padding: '0 10px', outline: 'none', background: 'white' }}>
          <option value="All">All Types</option>
          <option value="membership">Membership</option>
          <option value="session">Session</option>
          <option value="event">Event</option>
        </select>
      </div>

      {}
      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Transaction ID', 'Member', 'Description', 'Type', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '11px 13px', fontSize: 11, fontWeight: 700, color: '#6B7280', textAlign: 'left', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>No transactions found</td></tr>
              ) : paginated.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < paginated.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFF')} onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                  <td style={{ padding: '12px 13px', fontSize: 12, fontWeight: 600, color: '#6B7280' }}>{t.id}</td>
                  <td style={{ padding: '12px 13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0 }}>{t.avatar}</div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{t.member}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 13px', fontSize: 13, color: '#374151', maxWidth: 180 }}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{t.description}</span></td>
                  <td style={{ padding: '12px 13px' }}><span style={{ padding: '3px 9px', borderRadius: 100, background: typeConfig[t.type].bg, color: typeConfig[t.type].text, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{t.type}</span></td>
                  <td style={{ padding: '12px 13px', fontSize: 14, fontWeight: 800, color: t.status === 'refunded' ? '#8B5CF6' : t.status === 'failed' ? '#EF4444' : '#111827' }}>{'$' + t.amount}</td>
                  <td style={{ padding: '12px 13px', fontSize: 12, color: '#6B7280' }}>{t.method}</td>
                  <td style={{ padding: '12px 13px', fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>{t.date}</td>
                  <td style={{ padding: '12px 13px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 100, background: SC[t.status].bg, color: SC[t.status].text, fontSize: 11, fontWeight: 700 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: SC[t.status].dot }} />{SC[t.status].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>{filtered.length} transactions</span>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 30, height: 30, borderRadius: 7, border: '1.5px solid #E5E7EB', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={13} /></button>
            {[...Array(pages)].map((_, i) => <button key={i} onClick={() => setPage(i + 1)} style={{ width: 30, height: 30, borderRadius: 7, border: '1.5px solid', borderColor: page === i + 1 ? '#0F62FE' : '#E5E7EB', background: page === i + 1 ? '#0F62FE' : 'white', color: page === i + 1 ? 'white' : '#374151', fontSize: 12, fontWeight: page === i + 1 ? 700 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</button>)}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ width: 30, height: 30, borderRadius: 7, border: '1.5px solid #E5E7EB', background: 'white', cursor: page === pages ? 'not-allowed' : 'pointer', opacity: page === pages ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={13} /></button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

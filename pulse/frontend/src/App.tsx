import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Bell, 
  CheckCircle2, 
  XCircle,
  Activity,
  Tag,
  Flame,
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  category: string;
  currentPrice: number;
  originalPrice: number;
  movingAvg30d: number;
  trueDiscount: number;
  trustScore: number;
  isFakeDiscount: boolean;
  riskFlags: string[];
  sellerName: string;
  sellerAgeDays: number;
  imageUrl: string;
}

const INITIAL_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    category: 'Electronics',
    currentPrice: 24999,
    originalPrice: 34999,
    movingAvg30d: 29999,
    trueDiscount: 16.6,
    trustScore: 92,
    isFakeDiscount: false,
    riskFlags: ['VERIFIED_HISTORIC_LOW', 'AUTHENTIC_SELLER_SCORE'],
    sellerName: 'Appario Retail',
    sellerAgeDays: 450,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'UltraSpeed 2TB Portable NVMe External SSD',
    category: 'Storage',
    currentPrice: 8999,
    originalPrice: 18999,
    movingAvg30d: 14999,
    trueDiscount: 40.0,
    trustScore: 45,
    isFakeDiscount: true,
    riskFlags: ['ARTIFICIAL_PRICE_INFLATION_DETECTED', 'NEW_SELLER_ACCOUNT'],
    sellerName: 'Global Deals Express',
    sellerAgeDays: 12,
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Ergonomic Mesh Office Executive Chair',
    category: 'Furniture',
    currentPrice: 6499,
    originalPrice: 12999,
    movingAvg30d: 6800,
    trueDiscount: 4.4,
    trustScore: 88,
    isFakeDiscount: false,
    riskFlags: ['STABLE_MARKET_PRICE'],
    sellerName: 'GreenSoul Home',
    sellerAgeDays: 820,
    imageUrl: 'https://images.unsplash.com/photo-1580481077494-e3299ac25e94?auto=format&fit=crop&w=600&q=80',
  },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'fake'>('all');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(INITIAL_DEALS[0]);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredDeals = INITIAL_DEALS.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) || deal.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterMode === 'verified') return matchesSearch && !deal.isFakeDiscount;
    if (filterMode === 'fake') return matchesSearch && deal.isFakeDiscount;
    return matchesSearch;
  });

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertEmail) {
      setAlertSuccess(true);
      setTimeout(() => setAlertSuccess(false), 4000);
      setAlertEmail('');
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0c0f] text-slate-100 flex flex-col font-sans selection:bg-[#FF3B60] selection:text-white relative overflow-x-hidden">
      
      {/* Background Decorative Neon Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF3B60]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-rose-500/20 bg-[#0d1015]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-2xl shadow-rose-950/20">
        <div className="flex items-center space-x-3.5">
          <div className="bg-gradient-to-br from-[#FF3B60] to-[#10B981] p-2.5 rounded-2xl shadow-lg shadow-rose-500/20 text-white animate-float">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              FlashCart <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B60] via-rose-400 to-[#10B981] font-mono text-xs px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 uppercase tracking-widest font-black">WATERMELON PULSE</span>
            </h1>
            <p className="text-xs text-slate-400">Juicy Flash Deals & Fake Discount Verification Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={triggerRefresh}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-rose-500/40 transition-all duration-300"
            title="Refresh Ingestion"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FF3B60]' : ''}`} />
          </button>
          
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-3.5 py-2 rounded-xl border border-[#10B981]/30 shadow-inner">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span>Redis Stream: Active (0.8ms)</span>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Column: Deals Feed & Filters */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search & Action Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#131720]/80 backdrop-blur-md p-4 rounded-3xl border border-rose-500/15 shadow-xl">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search juicy deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0c0f] border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#FF3B60] transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setFilterMode('all')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-2xl border transition-all duration-300 ${filterMode === 'all' ? 'bg-[#FF3B60]/20 border-[#FF3B60] text-[#FF3B60] shadow-lg shadow-rose-500/20' : 'bg-[#0a0c0f] border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                All Deals
              </button>
              <button 
                onClick={() => setFilterMode('verified')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-2xl border transition-all duration-300 ${filterMode === 'verified' ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981] shadow-lg shadow-emerald-500/20' : 'bg-[#0a0c0f] border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                🍉 Genuine Lows
              </button>
              <button 
                onClick={() => setFilterMode('fake')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-2xl border transition-all duration-300 ${filterMode === 'fake' ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/20' : 'bg-[#0a0c0f] border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                🚨 Fake Drop
              </button>
            </div>
          </div>

          {/* Deals Cards Grid with Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDeals.map((deal) => {
              const isSelected = selectedDeal?.id === deal.id;
              return (
                <div 
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  className={`bg-[#131720]/90 border rounded-3xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden group ${
                    isSelected 
                      ? 'border-[#FF3B60] bg-[#181d28] shadow-2xl shadow-rose-500/15 animate-watermelon-glow scale-[1.01]' 
                      : 'border-slate-800/80 hover:border-[#FF3B60]/40'
                  }`}
                >
                  {/* Top Watermelon Rind Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-[#FF3B60] via-rose-400 to-[#10B981]' : 'bg-transparent group-hover:bg-rose-500/30'}`} />

                  {deal.isFakeDiscount && (
                    <div className="absolute top-3 right-3 bg-rose-500/20 text-rose-400 text-[10px] font-mono font-black px-3 py-1 rounded-full border border-rose-500/40 flex items-center gap-1 shadow-lg shadow-rose-950/40 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> FAKE DISCOUNT
                    </div>
                  )}

                  <div>
                    <div className="flex gap-4 mb-3">
                      <img 
                        src={deal.imageUrl} 
                        alt={deal.title} 
                        className="w-16 h-16 rounded-2xl object-cover bg-slate-800 flex-shrink-0 border border-slate-700 group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div>
                        <span className="text-[10px] font-mono tracking-widest uppercase text-[#FF3B60] bg-[#FF3B60]/10 px-2.5 py-1 rounded-lg border border-[#FF3B60]/20 font-black">
                          {deal.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-100 mt-2 line-clamp-2 group-hover:text-[#10B981] transition-colors duration-300">
                          {deal.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-white font-mono">₹{deal.currentPrice.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 line-through font-mono">₹{deal.originalPrice.toLocaleString()}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#10B981] flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3 h-3 text-[#10B981] animate-spin" /> {deal.trueDiscount}% Verified Drop
                      </span>
                    </div>

                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-black transition-all ${
                      deal.trustScore >= 80 
                        ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 shadow-md shadow-emerald-950/30' 
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{deal.trustScore}/100</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Watermelon Deal Inspector Panel */}
        <div className="space-y-6">
          {selectedDeal ? (
            <div className="bg-[#131720] border border-rose-500/30 rounded-3xl p-6 sticky top-24 space-y-5 shadow-2xl shadow-rose-950/40 relative overflow-hidden transition-all duration-500">
              
              {/* Card Ambient Glow Header */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF3B60]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-xs font-black font-mono text-[#FF3B60] uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#10B981]" /> Watermelon Inspector
                </h2>
                <span className="text-xs text-slate-400 font-mono">ID: #{selectedDeal.id}</span>
              </div>

              <div>
                <h3 className="text-base font-black text-white leading-snug">{selectedDeal.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5">
                  Merchant: <span className="text-slate-200 font-bold">{selectedDeal.sellerName}</span> 
                  <span className="text-slate-500"> ({selectedDeal.sellerAgeDays} days active)</span>
                </p>
              </div>

              {/* Price Breakdown Matrix */}
              <div className="bg-[#0a0c0f] p-4 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Listed Price:</span>
                  <span className="font-mono font-black text-white">₹{selectedDeal.currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">30-Day Moving Average:</span>
                  <span className="font-mono font-bold text-[#FF3B60]">₹{selectedDeal.movingAvg30d.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs pt-2.5 border-t border-slate-900">
                  <span className="text-slate-400">True Verified Discount:</span>
                  <span className="font-mono font-black text-[#10B981] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +{selectedDeal.trueDiscount}%
                  </span>
                </div>
              </div>

              {/* Risk Flags Analysis */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Verification Diagnostics</label>
                <div className="space-y-2">
                  {selectedDeal.riskFlags.map((flag, idx) => (
                    <div 
                      key={idx} 
                      className={`text-xs px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 font-mono font-bold transition-all duration-300 ${
                        selectedDeal.isFakeDiscount 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-md shadow-rose-950/20' 
                          : 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981] shadow-md shadow-emerald-950/20'
                      }`}
                    >
                      {selectedDeal.isFakeDiscount ? (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 animate-bounce" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                      )}
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Alert Subscription Box */}
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                  <Bell className="w-3.5 h-3.5 text-[#FF3B60]" /> Setup Real-Time Webhook Alert
                </h4>
                <form onSubmit={handleSetAlert} className="space-y-2.5">
                  <input 
                    type="email"
                    required
                    placeholder="Enter your email for price drops..."
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    className="w-full bg-[#0a0c0f] border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#FF3B60] transition-colors"
                  />
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FF3B60] to-[#10B981] hover:opacity-90 text-white font-black text-xs py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-rose-500/25 uppercase tracking-wider active:scale-[0.98]"
                  >
                    Subscribe to Kafka Event Alert
                  </button>
                </form>
                {alertSuccess && (
                  <p className="text-[11px] text-[#10B981] font-mono font-bold mt-2.5 text-center animate-pulse">
                    ✓ Juicy alert registered via Kafka topic!
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-[#131720] border border-slate-800 rounded-3xl p-8 text-center text-slate-500 font-mono">
              Select any deal card to inspect trust scores and historical pricing.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
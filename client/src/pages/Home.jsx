import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Search, MapPin, Calendar, Plane, Mountain, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  'Paris', 'Bali', 'Tokyo', 'Goa', 'Dubai',
  'Manali', 'New York', 'Santorini', 'Rajasthan', 'Maldives',
];

const FEATURES = [
  { icon: '🗺️', title: 'Day-wise Planning', desc: 'Structured itinerary for every day of your trip' },
  { icon: '🌤️', title: 'Live Weather', desc: 'Current weather conditions at your destination' },
  { icon: '📍', title: 'Interactive Map', desc: 'See all your places pinned on a live map' },
  { icon: '🧳', title: 'Smart Packing List', desc: 'AI-curated packing checklist for your trip' },
  { icon: '📄', title: 'PDF Export', desc: 'Download your itinerary and take it offline' },
  { icon: '🔗', title: 'Share Itinerary', desc: 'Share your trip plan with friends via a link' },
];

export default function Home() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return toast.error('Please enter a destination');
    const d = parseInt(days);
    if (!d || d < 2 || d > 14) return toast.error('Please choose between 2 and 14 days');

    setLoading(true);
    try {
      const res = await api.post('/itinerary/generate', {
        destination: destination.trim(),
        days: d,
      });
      navigate(`/itinerary/${res.data.shareId}`, { state: { itinerary: res.data.itinerary } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/20">
            <Plane className="w-4 h-4" />
            AI-Powered Travel Planning
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Plan Your Perfect
            <br />
            <span className="text-indigo-200">Escape</span>
          </h1>

          <p className="text-indigo-100 text-lg sm:text-xl mb-10 max-w-xl mx-auto">
            Enter any destination. Get a detailed day-by-day itinerary crafted just for you in seconds.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-xl mx-auto">
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm appearance-none cursor-pointer"
                >
                  <option value="">How many days? (2–14)</option>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Crafting your itinerary…
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Plan My Trip
                  </>
                )}
              </button>
            </div>

            {/* Suggestions */}
            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-2 text-left">Popular destinations</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDestination(s)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-slate-200 dark:border-slate-600"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-indigo-950 text-indigo-200 py-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-indigo-400" />
            <span>Any destination worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-indigo-400" />
            <span>National & international trips</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>2–14 day plans</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            Everything you need for a great trip
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            PlanMyEscape handles the research so you can focus on the experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

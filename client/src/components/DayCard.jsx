import { useState } from 'react';
import { RefreshCw, MapPin, Clock, Utensils, Lightbulb } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TYPE_BADGE = {
  monument: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  nature: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  food: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  museum: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  beach: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  market: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  religious: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

export default function DayCard({ day, shareId, onRegenerated, isActive, onSelect }) {
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await axios.post('/api/itinerary/regenerate-day', {
        shareId,
        dayNumber: day.day,
      });
      onRegenerated(day.day - 1, res.data.day);
      toast.success(`Day ${day.day} refreshed!`);
    } catch {
      toast.error('Failed to regenerate. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border transition-all duration-200 cursor-pointer ${
        isActive
          ? 'border-indigo-400 dark:border-indigo-500 shadow-md shadow-indigo-100 dark:shadow-indigo-900/20'
          : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
      } bg-white dark:bg-slate-800`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Day {day.day}
            </span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {day.theme}
            </h3>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 rounded-lg px-2.5 py-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Regenerating…' : 'Regenerate'}
          </button>
        </div>

        <div className="space-y-3">
          {day.places.map((place, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                    {place.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      TYPE_BADGE[place.type] || TYPE_BADGE.default
                    }`}
                  >
                    {place.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {place.description}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{place.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {day.food && day.food.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 mb-2">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Where to Eat
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {day.food.map((f, i) => (
                <span
                  key={i}
                  className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-800/40"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {day.tips && (
          <div className="mt-3 flex gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{day.tips}</p>
          </div>
        )}
      </div>
    </div>
  );
}

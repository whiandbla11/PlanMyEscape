import { Info, AlertTriangle, Calendar } from 'lucide-react';

export default function TravelTipsCard({ travelTips, bestTimeToVisit, emergencyInfo }) {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Travel Tips</h3>
        </div>
        <ul className="space-y-2">
          {travelTips.map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Best Time to Visit</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{bestTimeToVisit}</p>
      </div>

      {emergencyInfo && (
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-5 border border-red-100 dark:border-red-800/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-red-700 dark:text-red-400">Emergency Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            {emergencyInfo.emergencyNumber && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Emergency</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{emergencyInfo.emergencyNumber}</span>
              </div>
            )}
            {emergencyInfo.policeNumber && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Police</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{emergencyInfo.policeNumber}</span>
              </div>
            )}
            {emergencyInfo.hospitalTip && (
              <p className="text-slate-600 dark:text-slate-300 pt-1">{emergencyInfo.hospitalTip}</p>
            )}
            {emergencyInfo.embassyNote && (
              <p className="text-slate-500 dark:text-slate-400 text-xs pt-1">{emergencyInfo.embassyNote}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

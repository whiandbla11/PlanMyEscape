import { useState } from 'react';
import { CheckSquare, Square, Luggage } from 'lucide-react';

const CATEGORY_LABELS = {
  essentials: { label: 'Essentials', emoji: '🎒' },
  clothing: { label: 'Clothing', emoji: '👕' },
  documents: { label: 'Documents', emoji: '📄' },
  electronics: { label: 'Electronics', emoji: '🔌' },
};

export default function PackingChecklist({ packingList }) {
  const [checked, setChecked] = useState({});

  const toggle = (category, index) => {
    const key = `${category}-${index}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const total = Object.values(packingList).flat().length;
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
            <Luggage className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Packing Checklist</h3>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {done}/{total} packed
        </span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mb-5">
        <div
          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${total ? (done / total) * 100 : 0}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(CATEGORY_LABELS).map(([cat, { label, emoji }]) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {emoji} {label}
            </p>
            <ul className="space-y-1.5">
              {(packingList[cat] || []).map((item, i) => {
                const key = `${cat}-${i}`;
                const isChecked = !!checked[key];
                return (
                  <li
                    key={i}
                    onClick={() => toggle(cat, i)}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0 group-hover:text-slate-400" />
                    )}
                    <span
                      className={`text-sm transition-colors ${
                        isChecked
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

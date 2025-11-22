import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Loader2 } from 'lucide-react';
import { getFinancialInsight } from '../services/geminiService';

interface GeminiCardProps {
  currentAmount: number;
  currencySymbol: string;
}

const GeminiCard: React.FC<GeminiCardProps> = ({ currentAmount, currencySymbol }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<{ text: string; items: string[] } | null>(null);

  const handleAnalyze = async () => {
    if (currentAmount <= 0) return;
    setLoading(true);
    const data = await getFinancialInsight(currentAmount, currencySymbol);
    setInsight(data);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-indigo-200 font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Gemini 财富洞察
          </h3>
          <button
            onClick={handleAnalyze}
            disabled={loading || currentAmount <= 0.01}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-3 py-1.5 rounded-full transition-all shadow-lg shadow-indigo-900/50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '我现在能买什么？'}
          </button>
        </div>

        {!insight && !loading && (
          <p className="text-zinc-400 text-sm italic">
            再多赚点钱，然后问问 Gemini 你现在的财富在现实世界能买到什么。
          </p>
        )}

        {loading && (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-indigo-500/20 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-500/20 rounded w-1/2"></div>
          </div>
        )}

        {insight && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-indigo-100 text-lg font-medium leading-relaxed mb-4">
              "{insight.text}"
            </p>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-indigo-400 font-bold">可能买得起：</p>
              <div className="flex flex-wrap gap-2">
                {insight.items.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-sm">
                    <ShoppingBag className="w-3 h-3" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiCard;
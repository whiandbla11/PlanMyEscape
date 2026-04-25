import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  ArrowLeft, Share2, Download, MapPin, Clock, CheckCircle,
} from 'lucide-react';
import DayCard from '../components/DayCard';
import WeatherWidget from '../components/WeatherWidget';
import PackingChecklist from '../components/PackingChecklist';
import TravelTipsCard from '../components/TravelTipsCard';
import MapView from '../components/MapView';

export default function ItineraryPage() {
  const { shareId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [itinerary, setItinerary] = useState(location.state?.itinerary || null);
  const [loading, setLoading] = useState(!itinerary);
  const [activeDay, setActiveDay] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!itinerary) {
      axios
        .get(`/api/itinerary/share/${shareId}`)
        .then((res) => setItinerary(res.data.itinerary))
        .catch(() => toast.error('Itinerary not found'))
        .finally(() => setLoading(false));
    }
  }, [shareId, itinerary]);

  const handleRegenerated = (index, newDay) => {
    setItinerary((prev) => {
      const days = [...prev.days];
      days[index] = newDay;
      return { ...prev, days };
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/itinerary/${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      const el = printRef.current;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let y = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      while (y < pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, -y, pdfWidth, pdfHeight);
        y += pageHeight;
        if (y < pdfHeight) pdf.addPage();
      }

      pdf.save(`PlanMyEscape-${itinerary.destination.replace(/\s+/g, '-')}.pdf`);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading your itinerary…</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">Itinerary not found</p>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        {itinerary.imageUrl ? (
          <img
            src={itinerary.imageUrl}
            alt={itinerary.destination}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-6xl mx-auto flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>Your Itinerary</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {itinerary.destination}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <Clock className="w-4 h-4" />
                  {itinerary.duration} days
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {itinerary.days?.reduce((acc, d) => acc + d.places.length, 0)} places
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-xl transition-all border border-white/20"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={exporting}
                className="flex items-center gap-1.5 bg-white text-slate-800 hover:bg-slate-100 text-sm px-3 py-2 rounded-xl transition-all font-medium disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{exporting ? 'Exporting…' : 'PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Plan another trip
        </button>
      </div>

      {/* Content */}
      <div ref={printRef} className="max-w-6xl mx-auto px-4 py-6">
        {/* Overview */}
        {itinerary.overview && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{itinerary.overview}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Itinerary days */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Day-wise Itinerary
              </h2>
              <span className="text-xs text-slate-400">
                Click a day to highlight on map
              </span>
            </div>

            {itinerary.days?.map((day, i) => (
              <DayCard
                key={`${day.day}-${day.theme}`}
                day={day}
                shareId={shareId}
                onRegenerated={handleRegenerated}
                isActive={activeDay === i}
                onSelect={() => setActiveDay(activeDay === i ? null : i)}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Weather */}
            {itinerary.weather && <WeatherWidget weather={itinerary.weather} />}

            {/* Map */}
            {itinerary.days && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {activeDay !== null ? `Day ${activeDay + 1} Map` : 'Full Trip Map'}
                </h3>
                <MapView days={itinerary.days} activeDay={activeDay} />
              </div>
            )}

            {/* Packing checklist */}
            {itinerary.packingList && (
              <PackingChecklist packingList={itinerary.packingList} />
            )}

            {/* Travel tips + best time + emergency */}
            {itinerary.travelTips && (
              <TravelTipsCard
                travelTips={itinerary.travelTips}
                bestTimeToVisit={itinerary.bestTimeToVisit}
                emergencyInfo={itinerary.emergencyInfo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

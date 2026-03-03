import { Incident } from '../lib/utils';
import { AlertTriangle, RefreshCw, ExternalLink, CheckCircle, Circle } from 'lucide-react';

export default function IntelPanel({ incidents, loading, onRefresh, onUpdateStatus }: { 
  incidents: Incident[], 
  loading: boolean,
  onRefresh: () => void,
  onUpdateStatus: (id: string, status: 'active' | 'resolved') => void
}) {
  return (
    <div className="flex flex-col h-full bg-[#181b21] border-l border-[#2d3139]">
      <div className="p-4 border-b border-[#2d3139] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#e5e7eb]">
          <AlertTriangle className="text-yellow-500" size={20} />
          <h2 className="font-bold tracking-wider text-sm uppercase">Active Incidents</h2>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className={`p-2 rounded-full transition-colors hover:bg-gray-800 text-gray-400 ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className={`bg-[#232730] rounded-lg p-3 border transition-colors cursor-pointer group ${incident.status === 'resolved' ? 'border-green-900/30 opacity-60' : 'border-[#2d3139] hover:border-gray-600'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                incident.status === 'resolved' ? 'bg-green-900/20 text-green-500' :
                incident.type === 'police' ? 'bg-blue-500/20 text-blue-400' :
                incident.type === 'fire' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-700 text-gray-300'
              }`}>
                {incident.status === 'resolved' ? 'RESOLVED' : incident.type}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">{new Date(incident.timestamp).toLocaleTimeString()}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(incident.id, incident.status === 'active' ? 'resolved' : 'active');
                  }}
                  className="text-gray-500 hover:text-green-400 transition-colors"
                  title={incident.status === 'active' ? "Mark as Resolved" : "Mark as Active"}
                >
                  {incident.status === 'active' ? <Circle size={14} /> : <CheckCircle size={14} className="text-green-500" />}
                </button>
              </div>
            </div>
            <h3 className={`font-bold text-sm mb-1 group-hover:text-white ${incident.status === 'resolved' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{incident.title}</h3>
            <p className="text-xs text-gray-400 mb-2 line-clamp-2">{incident.description}</p>
            <div className="flex items-center text-[10px] text-gray-500 gap-1">
              <span className="truncate max-w-[150px]">{incident.location.address || "Location pending..."}</span>
              <ExternalLink size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
        {incidents.length === 0 && !loading && (
          <div className="text-center text-gray-600 mt-10">
            <p>No active incidents reported via news sources.</p>
          </div>
        )}
      </div>
    </div>
  );
}

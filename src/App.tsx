/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ScannerPanel from './components/ScannerPanel';
import IntelPanel from './components/IntelPanel';
import IncidentMap from './components/IncidentMap';
import { useScanner, useIntel } from './lib/hooks';
import { Menu, Map as MapIcon, Radio, X } from 'lucide-react';

export default function App() {
  const { messages, isListening, setIsListening } = useScanner();
  const { incidents, loading, refresh, updateIncidentStatus } = useIntel();
  const [mobileTab, setMobileTab] = useState<'map' | 'scanner' | 'intel'>('map');

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f1115] text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-[#2d3139] flex items-center px-4 justify-between bg-[#181b21] z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h1 className="font-bold tracking-tight text-lg">GALVESTON<span className="text-gray-500 font-light">WATCH</span></h1>
        </div>
        <div className="text-[10px] font-mono text-gray-500 hidden md:block">
          SYSTEM ONLINE • {new Date().toLocaleDateString()}
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Scanner (Desktop: Visible, Mobile: Conditional) */}
        <div className={`
          absolute md:relative z-20 inset-0 md:inset-auto w-full md:w-80 bg-[#181b21] transition-transform duration-300
          ${mobileTab === 'scanner' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <ScannerPanel 
            messages={messages} 
            isListening={isListening} 
            toggleListening={() => setIsListening(!isListening)} 
          />
        </div>

        {/* Center: Map (Always rendered, hidden on mobile if other tabs active) */}
        <div className="flex-1 relative z-10 h-full w-full">
          <IncidentMap incidents={incidents} />
          
          {/* Mobile Tab Overlay for Map */}
          {mobileTab !== 'map' && <div className="absolute inset-0 bg-[#0f1115] md:hidden" />}
        </div>

        {/* Right Panel: Intel (Desktop: Visible, Mobile: Conditional) */}
        <div className={`
          absolute md:relative z-20 inset-0 md:inset-auto w-full md:w-96 bg-[#181b21] transition-transform duration-300 border-l border-[#2d3139]
          ${mobileTab === 'intel' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <IntelPanel 
            incidents={incidents} 
            loading={loading} 
            onRefresh={refresh} 
            onUpdateStatus={updateIncidentStatus}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden h-16 bg-[#181b21] border-t border-[#2d3139] flex items-center justify-around z-50">
        <button 
          onClick={() => setMobileTab('scanner')}
          className={`flex flex-col items-center gap-1 ${mobileTab === 'scanner' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Radio size={20} />
          <span className="text-[10px] uppercase">Scanner</span>
        </button>
        <button 
          onClick={() => setMobileTab('map')}
          className={`flex flex-col items-center gap-1 ${mobileTab === 'map' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <MapIcon size={20} />
          <span className="text-[10px] uppercase">Map</span>
        </button>
        <button 
          onClick={() => setMobileTab('intel')}
          className={`flex flex-col items-center gap-1 ${mobileTab === 'intel' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Menu size={20} />
          <span className="text-[10px] uppercase">Intel</span>
        </button>
      </div>
    </div>
  );
}


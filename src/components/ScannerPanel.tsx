import { ScannerMessage } from '../lib/utils';
import { Radio, Volume2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScannerPanel({ messages, isListening, toggleListening }: { 
  messages: ScannerMessage[], 
  isListening: boolean,
  toggleListening: () => void 
}) {
  return (
    <div className="flex flex-col h-full bg-[#181b21] border-r border-[#2d3139]">
      <div className="p-4 border-b border-[#2d3139] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#e5e7eb]">
          <Radio className={isListening ? "text-red-500 animate-pulse" : "text-gray-500"} size={20} />
          <h2 className="font-bold tracking-wider text-sm uppercase">Live Scanner</h2>
        </div>
        <button 
          onClick={toggleListening}
          className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/10 text-red-500' : 'bg-gray-800 text-gray-400'}`}
        >
          <Volume2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="border-l-2 border-blue-500 pl-3 py-1"
            >
              <div className="flex justify-between text-gray-500 text-[10px] mb-1">
                <span>{msg.channel}</span>
                <span>{msg.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="text-blue-100">
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-10">
            <Activity className="mx-auto mb-2 opacity-20" size={32} />
            <p>Waiting for transmission...</p>
          </div>
        )}
      </div>
      
      <div className="p-2 bg-[#0f1115] text-[10px] text-gray-500 text-center border-t border-[#2d3139]">
        SIMULATED FEED • GALVESTON COUNTY P25
      </div>
      <div className="p-2 border-t border-[#2d3139] bg-[#181b21]">
        <a 
          href="https://www.broadcastify.com/listen/ctid/2606" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded transition-colors"
        >
          <Volume2 size={12} />
          <span>Open Broadcastify (Real Audio)</span>
        </a>
      </div>
    </div>
  );
}

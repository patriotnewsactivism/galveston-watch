import { useEffect, useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Incident, ScannerMessage } from './utils';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mock data generator for "Scanner" simulation (since we can't tap real radio)
const POLICE_CODES = [
  "10-31 Crime in progress", "10-50 Accident", "10-70 Fire", "10-80 Pursuit", 
  "Code 3 Emergency", "Suspicious person", "Disturbance", "Medical emergency"
];

const LOCATIONS = [
  "Seawall Blvd", "Broadway St", "Strand St", "Harborside Dr", "61st St", 
  "Ferry Rd", "Market St", "Postoffice St", "Stewart Rd", "Termini San Luis Pass Rd"
];

export function useScanner() {
  const [messages, setMessages] = useState<ScannerMessage[]>([]);
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new message per tick
        const newMsg: ScannerMessage = {
          id: Math.random().toString(36).substr(2, 9),
          channel: Math.random() > 0.5 ? "GPD Dispatch 1" : "GFD Fire Main",
          content: `${POLICE_CODES[Math.floor(Math.random() * POLICE_CODES.length)]} at ${Math.floor(Math.random() * 5000)} ${LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]}`,
          timestamp: new Date(),
          isTranscribing: false
        };
        setMessages(prev => [newMsg, ...prev].slice(0, 50));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isListening]);

  return { messages, isListening, setIsListening };
}

export function useIntel() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      // Use Gemini to search for real recent news
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Search for the absolute latest breaking news, police blotter entries, fire department calls, and traffic accidents specifically for Galveston County and Galveston Island, Texas from the last 24 hours. Look for sources like 'Galveston County Daily News', 'i45NOW', local TV stations (KPRC, KHOU), and official police social media. Return a JSON array of incidents. Each incident must have: 'title', 'description' (brief summary), 'location' (object with lat/lng numbers if findable, otherwise a specific address string), 'type' (police, fire, medical, traffic), and 'timestamp' (ISO string if possible, or just use current time). If no *very* recent specific events are found, find the most recent major ones from the last week.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text;
      if (text) {
        let cleanText = text.trim();
        // Remove markdown code blocks if present
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        
        const data = JSON.parse(cleanText);
        // Transform to Incident type
        const newIncidents = Array.isArray(data) ? data.map((item: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: item.type?.toLowerCase() || 'other',
          title: item.title || 'Unknown Incident',
          description: item.description || '',
          location: {
            lat: item.location?.lat || 29.3013 + (Math.random() * 0.05 - 0.025), // Fallback to random spot on island if no coords
            lng: item.location?.lng || -94.7977 + (Math.random() * 0.05 - 0.025),
            address: item.location?.address
          },
          timestamp: new Date(), // In a real app, parse the actual time
          source: 'news',
          status: 'active'
        })) : [];
        
        setIncidents(newIncidents);
      }
    } catch (e) {
      console.error("Failed to fetch intel", e);
    } finally {
      setLoading(false);
    }
  };

  const updateIncidentStatus = (id: string, status: 'active' | 'resolved') => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, status } : inc
    ));
  };

  useEffect(() => {
    fetchIntel();
    const interval = setInterval(fetchIntel, 300000); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  return { incidents, loading, refresh: fetchIntel, updateIncidentStatus };
}

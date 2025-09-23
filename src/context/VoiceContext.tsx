import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyContext } from './StudyContext';
import { useToast } from '@/hooks/use-toast';

// Type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

interface VoiceContextType {
  isListening: boolean;
  isEnabled: boolean;
  hasPermission: boolean;
  isSpeaking: boolean;
  lastCommand: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleVoice: () => void;
  requestPermission: () => Promise<boolean>;
  speak: (text: string) => void;
  executeCommand: (command: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const navigate = useNavigate();
  const { searchStudies, setSearchQuery } = useStudyContext();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        if (event.results[event.results.length - 1].isFinal) {
          executeCommand(transcript.trim());
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      toast({
        title: "Microphone Permission Required",
        description: "Please allow microphone access to use voice features",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const startListening = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        toast({
          title: "Voice Recognition Active",
          description: "Listening for commands..."
        });
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  }, [recognition, isListening, hasPermission, requestPermission, toast]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const toggleVoice = useCallback(() => {
    setIsEnabled(!isEnabled);
    if (isListening) {
      stopListening();
    }
  }, [isEnabled, isListening, stopListening]);

  const speak = useCallback((text: string) => {
    if (speechSynthesis && isEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  }, [speechSynthesis, isEnabled]);

  // Command intent patterns for natural language understanding
  const commandPatterns = {
    navigation: {
      actions: ['go', 'navigate', 'open', 'show', 'display', 'take me to', 'switch to', 'move to', 'visit'],
      destinations: {
        dashboard: ['dashboard', 'dash', 'studies', 'main', 'data'],
        home: ['home', 'start', 'beginning', 'main page', 'homepage'],
        reports: ['reports', 'report', 'documents', 'analysis', 'summary'],
        about: ['about', 'info', 'information', 'details', 'help']
      }
    },
    search: {
      actions: ['search', 'find', 'look for', 'show me', 'get', 'display', 'filter', 'locate'],
      extractors: [/search (?:for )?(.+)/i, /find (.+)/i, /look for (.+)/i, /show me (.+)/i, /get (.+)/i]
    },
    reports: {
      actions: ['generate', 'create', 'make', 'export', 'download', 'produce', 'build'],
      objects: ['report', 'pdf', 'document', 'analysis', 'summary', 'file']
    }
  };

  const executeCommand = useCallback((command: string) => {
    setLastCommand(command);
    const lowercaseCommand = command.toLowerCase().trim();
    
    // Tokenize the command
    const words = lowercaseCommand.split(/\s+/);
    
    // Intent recognition with fuzzy matching
    const recognizeIntent = (command: string, words: string[]) => {
      // Navigation Intent Detection
      const hasNavigationAction = commandPatterns.navigation.actions.some(action => 
        words.some(word => word.includes(action) || action.includes(word) || 
          (action.length > 3 && word.startsWith(action.substring(0, 3))))
      );
      
      if (hasNavigationAction || words.length === 1) {
        for (const [destination, synonyms] of Object.entries(commandPatterns.navigation.destinations)) {
          const matchesDestination = synonyms.some(synonym => 
            words.some(word => 
              word.includes(synonym) || synonym.includes(word) ||
              (synonym.length > 3 && (word.startsWith(synonym.substring(0, 3)) || synonym.startsWith(word)))
            )
          );
          
          if (matchesDestination) {
            return { type: 'navigation', destination, confidence: hasNavigationAction ? 0.9 : 0.7 };
          }
        }
      }
      
      // Search Intent Detection
      const hasSearchAction = commandPatterns.search.actions.some(action => 
        command.includes(action) || words.some(word => word.startsWith(action.substring(0, 3)))
      );
      
      if (hasSearchAction) {
        // Extract search term using multiple patterns
        let searchTerm = '';
        for (const extractor of commandPatterns.search.extractors) {
          const match = command.match(extractor);
          if (match && match[1]) {
            searchTerm = match[1].trim();
            break;
          }
        }
        
        // Fallback: remove action words and use remaining text
        if (!searchTerm) {
          const filteredWords = words.filter(word => 
            !commandPatterns.search.actions.some(action => 
              word.includes(action) || action.includes(word)
            )
          );
          searchTerm = filteredWords.join(' ').trim();
        }
        
        if (searchTerm) {
          return { type: 'search', query: searchTerm, confidence: 0.8 };
        }
      }
      
      // Report Intent Detection
      const hasReportAction = commandPatterns.reports.actions.some(action => 
        words.some(word => word.includes(action) || action.includes(word))
      );
      
      const hasReportObject = commandPatterns.reports.objects.some(obj => 
        words.some(word => word.includes(obj) || obj.includes(word))
      );
      
      if (hasReportAction || hasReportObject) {
        return { type: 'report', confidence: hasReportAction && hasReportObject ? 0.9 : 0.6 };
      }
      
      return null;
    };
    
    const intent = recognizeIntent(lowercaseCommand, words);
    
    if (intent && intent.confidence > 0.5) {
      switch (intent.type) {
        case 'navigation':
          const destinationMap: Record<string, string> = {
            dashboard: '/dashboard',
            home: '/',
            reports: '/reports',
            about: '/about'
          };
          
          const route = destinationMap[intent.destination];
          if (route) {
            navigate(route);
            speak(`Navigating to ${intent.destination}`);
            return;
          }
          break;
          
        case 'search':
          if (intent.query) {
            setSearchQuery(intent.query);
            searchStudies(intent.query, new Set());
            speak(`Searching for ${intent.query}`);
            navigate('/dashboard');
            return;
          }
          break;
          
        case 'report':
          speak('Navigating to reports section');
          navigate('/reports');
          toast({
            title: "Voice Command Recognized",
            description: "Opening reports section"
          });
          return;
      }
    }
    
    // Enhanced fallback with suggestions
    const suggestions = [];
    
    // Suggest navigation if any destination words detected
    const detectedDestinations = Object.entries(commandPatterns.navigation.destinations)
      .filter(([_, synonyms]) => 
        synonyms.some(synonym => 
          words.some(word => word.includes(synonym.substring(0, 3)))
        )
      )
      .map(([dest]) => dest);
    
    if (detectedDestinations.length > 0) {
      suggestions.push(`Try: "go to ${detectedDestinations[0]}"`);
    }
    
    // Suggest search if query-like words detected
    if (words.length > 1 && !intent) {
      suggestions.push(`Try: "search for ${words.join(' ')}"`);
    }
    
    if (suggestions.length === 0) {
      suggestions.push('"go to dashboard"', '"search for studies"', '"generate report"');
    }
    
    const suggestionText = suggestions.slice(0, 2).join(' or ');
    
    toast({
      title: "Voice Command",
      description: `Heard: "${command}" - Try: ${suggestionText}`
    });
    
    speak(`I didn't understand that command. ${suggestionText.replace(/"/g, '')}`);
    
  }, [navigate, speak, setSearchQuery, searchStudies, toast]);

  const value: VoiceContextType = {
    isListening,
    isEnabled,
    hasPermission,
    isSpeaking,
    lastCommand,
    startListening,
    stopListening,
    toggleVoice,
    requestPermission,
    speak,
    executeCommand
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoiceContext = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoiceContext must be used within a VoiceProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useConversation } from '@11labs/react';
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
  
  const navigate = useNavigate();
  const { searchStudies, setSearchQuery } = useStudyContext();
  const { toast } = useToast();
  
  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: "Voice Assistant Connected",
        description: "You can now use voice commands"
      });
    },
    onDisconnect: () => {
      setIsListening(false);
    },
    onError: (error) => {
      console.error('Voice error:', error);
      toast({
        title: "Voice Error",
        description: "There was an issue with voice recognition",
        variant: "destructive"
      });
    }
  });

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
      speechSynthesis.speak(utterance);
    }
  }, [speechSynthesis, isEnabled]);

  const executeCommand = useCallback((command: string) => {
    setLastCommand(command);
    const lowercaseCommand = command.toLowerCase();
    
    // Navigation Commands
    if (lowercaseCommand.includes('go to dashboard') || lowercaseCommand.includes('open dashboard')) {
      navigate('/dashboard');
      speak('Navigating to dashboard');
      return;
    }
    
    if (lowercaseCommand.includes('go to reports') || lowercaseCommand.includes('open reports')) {
      navigate('/reports');
      speak('Navigating to reports');
      return;
    }
    
    if (lowercaseCommand.includes('go to home') || lowercaseCommand.includes('open home')) {
      navigate('/');
      speak('Navigating to home');
      return;
    }
    
    if (lowercaseCommand.includes('go to about') || lowercaseCommand.includes('open about')) {
      navigate('/about');
      speak('Navigating to about page');
      return;
    }
    
    // Search Commands
    if (lowercaseCommand.includes('search for') || lowercaseCommand.includes('find')) {
      const searchTerm = command.replace(/search for|find/gi, '').trim();
      if (searchTerm) {
        setSearchQuery(searchTerm);
        searchStudies(searchTerm, new Set());
        speak(`Searching for ${searchTerm}`);
        navigate('/dashboard');
        return;
      }
    }
    
    // Export Commands
    if (lowercaseCommand.includes('export') || lowercaseCommand.includes('download')) {
      speak('Export functionality would be triggered here');
      toast({
        title: "Voice Command Recognized",
        description: "Export command received - this would trigger report export"
      });
      return;
    }
    
    // Generate Report
    if (lowercaseCommand.includes('generate report') || lowercaseCommand.includes('create report')) {
      speak('Generating report');
      navigate('/reports');
      return;
    }
    
    // Fallback
    toast({
      title: "Voice Command",
      description: `Heard: "${command}" - Command not recognized`
    });
    speak('Command not recognized. Try saying go to dashboard, search for studies, or generate report.');
    
  }, [navigate, speak, setSearchQuery, searchStudies, toast]);

  const value: VoiceContextType = {
    isListening,
    isEnabled,
    hasPermission,
    isSpeaking: conversation.isSpeaking || false,
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
import { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVoiceContext } from '@/context/VoiceContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const VoiceCommands = () => {
  const {
    isListening,
    isEnabled,
    isSpeaking,
    lastCommand,
    startListening,
    stopListening,
    toggleVoice,
    requestPermission
  } = useVoiceContext();
  
  const [showCommands, setShowCommands] = useState(false);

  const handleMicClick = async () => {
    if (!isEnabled) {
      toggleVoice();
      const hasPermission = await requestPermission();
      if (hasPermission) {
        startListening();
      }
    } else if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const voiceCommands = [
    { category: 'Navigation', commands: [
      'Go to dashboard',
      'Open reports', 
      'Go to home',
      'Go to about'
    ]},
    { category: 'Search', commands: [
      'Search for microgravity studies',
      'Find plant research',
      'Search for genetics'
    ]},
    { category: 'Reports', commands: [
      'Generate report',
      'Create report',
      'Export report'
    ]}
  ];

  return (
    <div className="flex items-center space-x-2">
      {/* Voice Status */}
      {isListening && (
        <Badge variant="outline" className="animate-pulse">
          <Volume2 className="w-3 h-3 mr-1" />
          Listening...
        </Badge>
      )}
      
      {isSpeaking && (
        <Badge variant="outline" className="animate-pulse">
          <VolumeX className="w-3 h-3 mr-1" />
          Speaking...
        </Badge>
      )}

      {/* Last Command Display */}
      {lastCommand && !isListening && (
        <Badge variant="secondary" className="max-w-32 truncate">
          "{lastCommand}"
        </Badge>
      )}

      {/* Voice Commands Help */}
      <Dialog open={showCommands} onOpenChange={setShowCommands}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs">
            Voice Help
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voice Commands</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use these voice commands to navigate and control GenSpace:
            </p>
            {voiceCommands.map((category) => (
              <div key={category.category}>
                <h3 className="font-medium mb-2">{category.category}</h3>
                <ul className="space-y-1">
                  {category.commands.map((command) => (
                    <li key={command} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      "{command}"
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Microphone Button */}
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={handleMicClick}
        className={`relative ${isListening ? 'animate-pulse' : ''}`}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        
        {/* Recording indicator */}
        {isListening && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </Button>
    </div>
  );
};

export default VoiceCommands;
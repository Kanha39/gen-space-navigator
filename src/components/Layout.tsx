import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Mic, MicIcon } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceAssistant = () => {
    setIsRecording(!isRecording);
    // Simulate recording for 3 seconds
    if (!isRecording) {
      setTimeout(() => setIsRecording(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-cosmic flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-glow">GenSpace</span>
            </NavLink>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? "text-primary text-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? "text-primary text-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? "text-primary text-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                Reports
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? "text-primary text-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                About
              </NavLink>
            </nav>

            {/* Voice Assistant Button */}
            <button
              onClick={handleVoiceAssistant}
              className={`btn-voice ${isRecording ? "recording-pulse" : ""}`}
              title="Voice Assistant"
            >
              <MicIcon className={`w-5 h-5 ${isRecording ? "text-destructive" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
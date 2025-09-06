import { ExternalLink, Calendar, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Study {
  id: string;
  title: string;
  year: string;
  mission: string;
  summary: string;
  tags: string[];
  references: string[];
}

interface StudyCardProps {
  study: Study;
  isSelected: boolean;
  onToggleSelection: () => void;
}

const StudyCard = ({ study, isSelected, onToggleSelection }: StudyCardProps) => {
  return (
    <div className={`cosmic-card relative ${isSelected ? "ring-2 ring-primary" : ""}`}>
      {/* Selection Checkbox */}
      <div className="absolute top-4 right-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
        />
      </div>

      {/* Study Header */}
      <div className="mb-4 pr-8">
        <h3 className="text-lg font-semibold mb-2 leading-tight">
          {study.title}
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{study.year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Rocket className="w-4 h-4" />
            <span>{study.mission}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-muted-foreground mb-4 leading-relaxed">
        {study.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {study.tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* References */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium mb-2">References</h4>
        <div className="space-y-1">
          {study.references.map((ref, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <a
                href="#"
                className="text-sm text-accent hover:text-accent-glow transition-colors truncate"
                title={ref}
              >
                {ref}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-0 hover:opacity-5 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </div>
  );
};

export default StudyCard;
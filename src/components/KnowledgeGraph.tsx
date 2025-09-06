import { useState, useEffect } from "react";

interface GraphNode {
  id: string;
  label: string;
  type: "organism" | "tissue" | "condition" | "outcome" | "pathway";
  x: number;
  y: number;
  connections: string[];
}

interface KnowledgeGraphProps {
  selectedStudyIds: Set<string>;
}

const nodeTypes = {
  organism: { color: "#8B5CF6", glow: "#A78BFA" },
  tissue: { color: "#06B6D4", glow: "#67E8F9" },
  condition: { color: "#F59E0B", glow: "#FCD34D" },
  outcome: { color: "#EF4444", glow: "#FCA5A5" },
  pathway: { color: "#10B981", glow: "#6EE7B7" },
};

const sampleNodes: GraphNode[] = [
  { id: "n1", label: "Mouse", type: "organism", x: 150, y: 100, connections: ["n2", "n6"] },
  { id: "n2", label: "Liver", type: "tissue", x: 250, y: 150, connections: ["n1", "n3", "n5"] },
  { id: "n3", label: "Microgravity", type: "condition", x: 350, y: 100, connections: ["n2", "n4"] },
  { id: "n4", label: "Metabolism", type: "outcome", x: 450, y: 150, connections: ["n3", "n5"] },
  { id: "n5", label: "Glucose Pathway", type: "pathway", x: 300, y: 250, connections: ["n2", "n4"] },
  { id: "n6", label: "Arabidopsis", type: "organism", x: 100, y: 200, connections: ["n1", "n7"] },
  { id: "n7", label: "Roots", type: "tissue", x: 200, y: 300, connections: ["n6", "n8"] },
  { id: "n8", label: "Radiation", type: "condition", x: 400, y: 280, connections: ["n7", "n9"] },
  { id: "n9", label: "DNA Repair", type: "pathway", x: 450, y: 350, connections: ["n8"] },
];

const KnowledgeGraph = ({ selectedStudyIds }: KnowledgeGraphProps) => {
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    const newActiveNodes = new Set(activeNodes);
    if (activeNodes.has(nodeId)) {
      newActiveNodes.delete(nodeId);
    } else {
      newActiveNodes.add(nodeId);
      // Add connected nodes
      const node = sampleNodes.find(n => n.id === nodeId);
      if (node) {
        node.connections.forEach(connId => newActiveNodes.add(connId));
      }
    }
    setActiveNodes(newActiveNodes);
  };

  const isNodeHighlighted = (nodeId: string) => {
    return activeNodes.has(nodeId) || hoveredNode === nodeId;
  };

  const shouldShowConnection = (node1Id: string, node2Id: string) => {
    return isNodeHighlighted(node1Id) && isNodeHighlighted(node2Id);
  };

  return (
    <div className="w-full h-96 bg-background-secondary rounded-lg relative overflow-hidden border border-border">
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full">
        {sampleNodes.map(node => 
          node.connections.map(connId => {
            const connectedNode = sampleNodes.find(n => n.id === connId);
            if (!connectedNode) return null;
            
            const isHighlighted = shouldShowConnection(node.id, connId);
            
            return (
              <line
                key={`${node.id}-${connId}`}
                x1={node.x}
                y1={node.y}
                x2={connectedNode.x}
                y2={connectedNode.y}
                stroke={isHighlighted ? nodeTypes[node.type].glow : "#374151"}
                strokeWidth={isHighlighted ? 2 : 1}
                opacity={isHighlighted ? 0.8 : 0.3}
                className="transition-all duration-300"
              />
            );
          })
        )}
      </svg>

      {/* Nodes */}
      {sampleNodes.map(node => {
        const isHighlighted = isNodeHighlighted(node.id);
        const nodeColor = nodeTypes[node.type];
        
        return (
          <div
            key={node.id}
            className={`absolute graph-node ${isHighlighted ? "graph-node-active" : ""}`}
            style={{
              left: node.x - 25,
              top: node.y - 25,
              transform: isHighlighted ? "scale(1.1)" : "scale(1)",
            }}
            onClick={() => handleNodeClick(node.id)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Node Circle */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border-2"
              style={{
                backgroundColor: isHighlighted ? nodeColor.glow : nodeColor.color,
                borderColor: isHighlighted ? nodeColor.glow : nodeColor.color,
                boxShadow: isHighlighted ? `0 0 15px ${nodeColor.glow}` : "none",
              }}
            >
              <div className="w-6 h-6 bg-white rounded-full opacity-80"></div>
            </div>
            
            {/* Node Label */}
            <div className={`absolute top-14 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-opacity duration-300 ${
              isHighlighted ? "opacity-100" : "opacity-70"
            }`}>
              {node.label}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">Node Types</div>
        {Object.entries(nodeTypes).map(([type, colors]) => (
          <div key={type} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.color }}
            ></div>
            <span className="text-xs text-muted-foreground capitalize">
              {type}
            </span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 text-xs text-muted-foreground max-w-48">
        Click nodes to highlight connections
      </div>
    </div>
  );
};

export default KnowledgeGraph;
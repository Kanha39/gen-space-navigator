import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import spaceBiologyHero from "@/assets/space-biology-hero.jpg";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative mb-8 rounded-2xl overflow-hidden">
              <img 
                src={spaceBiologyHero} 
                alt="Futuristic space biology laboratory"
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-glow">
              About GenSpace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Pioneering the future of space biology research through advanced AI-powered knowledge discovery
            </p>
          </div>

          {/* Mission Section */}
          <div className="cosmic-card mb-12">
            <h2 className="text-2xl font-bold mb-6 text-accent-glow">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              GenSpace revolutionizes space biology research by providing scientists, researchers, and space agencies 
              with an intelligent platform that accelerates discovery through AI-powered analysis of complex biological 
              data from space missions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We bridge the gap between vast amounts of space biology data and meaningful scientific insights, 
              enabling breakthrough discoveries that advance our understanding of life beyond Earth.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="cosmic-card">
              <h3 className="text-xl font-semibold mb-4">Advanced AI Analysis</h3>
              <p className="text-muted-foreground">
                Our proprietary AI engine processes complex space biology datasets, identifying patterns and 
                connections that would take human researchers months to discover.
              </p>
            </div>

            <div className="cosmic-card">
              <h3 className="text-xl font-semibold mb-4">Interactive Knowledge Graphs</h3>
              <p className="text-muted-foreground">
                Visualize research connections through dynamic knowledge graphs that reveal hidden relationships 
                between organisms, conditions, and outcomes.
              </p>
            </div>

            <div className="cosmic-card">
              <h3 className="text-xl font-semibold mb-4">Comprehensive Reports</h3>
              <p className="text-muted-foreground">
                Generate publication-ready reports with AI-powered insights, complete with visualizations, 
                references, and actionable recommendations.
              </p>
            </div>

            <div className="cosmic-card">
              <h3 className="text-xl font-semibold mb-4">Global Collaboration</h3>
              <p className="text-muted-foreground">
                Connect with researchers worldwide through our platform, sharing discoveries and building 
                on collective knowledge to advance space biology.
              </p>
            </div>
          </div>

          {/* Technology Section */}
          <div className="cosmic-card mb-12">
            <h2 className="text-2xl font-bold mb-6 text-accent-glow">Technology Stack</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">AI & Machine Learning</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Neural Networks</li>
                  <li>• Natural Language Processing</li>
                  <li>• Pattern Recognition</li>
                  <li>• Predictive Analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Processing</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time Analytics</li>
                  <li>• Big Data Processing</li>
                  <li>• Multi-omics Integration</li>
                  <li>• Cloud Computing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Visualization</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Interactive Graphs</li>
                  <li>• 3D Modeling</li>
                  <li>• Data Visualization</li>
                  <li>• Responsive Design</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="cosmic-card mb-12">
            <h2 className="text-2xl font-bold mb-6 text-accent-glow">Research Partners</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Space Agencies</h4>
                <ul className="text-muted-foreground space-y-2">
                  <li>NASA - National Aeronautics and Space Administration</li>
                  <li>ESA - European Space Agency</li>
                  <li>JAXA - Japan Aerospace Exploration Agency</li>
                  <li>SpaceX Commercial Research</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Academic Institutions</h4>
                <ul className="text-muted-foreground space-y-2">
                  <li>MIT - Space Biology Consortium</li>
                  <li>Stanford - Aerospace Medicine</li>
                  <li>Harvard - Astrobiology Institute</li>
                  <li>UC Berkeley - Space Sciences Laboratory</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center cosmic-card bg-gradient-cosmic text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
            <p className="mb-6">
              Join the next generation of space biology research with GenSpace
            </p>
            <Button 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => navigate("/")}
            >
              Start Your Research Journey
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, TrendingUp, MessageSquare, Brain, Zap, Shield, Globe } from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Real-Time Feedback",
      description: "Collect opinions through text and voice instantly"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced sentiment analysis and keyword extraction"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Visual Insights",
      description: "Interactive charts and real-time dashboards"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Public Engagement",
      description: "Connect with diverse perspectives and voices"
    }
  ];

  const stats = [
    { label: "Active Issues", value: "24", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Total Responses", value: "12.5K", icon: <Users className="h-5 w-5" /> },
    { label: "AI Insights", value: "89%", icon: <Brain className="h-5 w-5" /> },
    { label: "Real-Time", value: "< 1s", icon: <Zap className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-gradient-hero opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 text-sm">
              <Globe className="h-4 w-4 mr-2" />
              Real-Time Public Opinion Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                PulseView
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              AI-powered dashboard that captures, analyzes, and visualizes public opinion on trending issues in real-time
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate("/issues")}
                className="text-lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Sharing Opinion
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate("/dashboard")}
                className="text-lg backdrop-blur-sm"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2 text-chart-1">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How PulseView Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From collecting feedback to generating insights, our platform makes public opinion analysis accessible and actionable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4 text-chart-1">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple Three-Step Process
              </h2>
              <p className="text-lg text-muted-foreground">
                Share your voice and see the collective pulse of public opinion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="relative">
                <CardContent className="p-8 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-chart-1" />
                  <h3 className="text-xl font-semibold mb-3">Choose Issue</h3>
                  <p className="text-muted-foreground">
                    Select from trending topics or suggest your own issue to discuss
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardContent className="p-8 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <Users className="h-12 w-12 mx-auto mb-4 text-chart-2" />
                  <h3 className="text-xl font-semibold mb-3">Share Opinion</h3>
                  <p className="text-muted-foreground">
                    Express your thoughts through text or voice - completely anonymous
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardContent className="p-8 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-chart-3" />
                  <h3 className="text-xl font-semibold mb-3">View Insights</h3>
                  <p className="text-muted-foreground">
                    See real-time analysis, sentiment trends, and AI-generated insights
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-background/90" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of people sharing their perspectives on the issues that matter most
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate("/issues")}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Get Started Now
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="backdrop-blur-sm"
              >
                <Shield className="h-5 w-5 mr-2" />
                Learn About Privacy
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              PulseView
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time public opinion dashboard powered by AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
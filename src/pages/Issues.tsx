import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MessageSquare, ArrowLeft } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
  responseCount: number;
  trending: boolean;
}

const TRENDING_ISSUES: Issue[] = [
  {
    id: "1",
    title: "Rising housing prices & affordable housing crisis in Indian cities",
    description: "With home prices going up, many are pushed into expensive rentals affecting quality of life.",
    category: "Economics",
    urgency: "high",
    responseCount: 1247,
    trending: true
  },
  {
    id: "2", 
    title: "Should AI tools be allowed in college assignments?",
    description: "Universities are debating whether AI assistance should be permitted for academic work.",
    category: "Education",
    urgency: "medium",
    responseCount: 892,
    trending: true
  },
  {
    id: "3",
    title: "Public health: Dengue, malaria outbreaks after monsoons",
    description: "Vector-borne diseases are seeing increased cases after heavy rains and floods.",
    category: "Health",
    urgency: "high", 
    responseCount: 564,
    trending: true
  },
  {
    id: "4",
    title: "Campus security and mental health support systems",
    description: "Students are raising concerns about safety and mental health resources in universities.",
    category: "Education",
    urgency: "medium",
    responseCount: 423,
    trending: false
  },
  {
    id: "5",
    title: "Data privacy & regulation of AI technologies",
    description: "Questions about privacy, bias, and oversight in AI development and deployment.",
    category: "Technology",
    urgency: "medium",
    responseCount: 756,
    trending: true
  },
  {
    id: "6",
    title: "Environmental risks: heat waves and air pollution",
    description: "Extreme weather and environmental degradation affecting daily life and health.",
    category: "Environment",
    urgency: "high",
    responseCount: 689,
    trending: false
  }
];

const Issues = () => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const handleSelectIssue = (issueId: string) => {
    setSelectedIssue(issueId);
    // Navigate to feedback page with the selected issue
    setTimeout(() => {
      navigate(`/feedback?issue=${issueId}`);
    }, 500);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-destructive";
      case "medium": return "bg-sentiment-neutral";
      case "low": return "bg-sentiment-positive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Select an Issue
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose a Topic to Share Your Opinion</h2>
          <p className="text-muted-foreground text-lg">
            Select from trending issues or browse by category. Your voice matters in shaping public discourse.
          </p>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRENDING_ISSUES.map((issue) => (
            <Card 
              key={issue.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-glow hover:-translate-y-1 ${
                selectedIssue === issue.id ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
              onClick={() => handleSelectIssue(issue.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {issue.trending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getUrgencyColor(issue.urgency)} text-white border-none`}
                    >
                      {issue.urgency.toUpperCase()}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {issue.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {issue.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {issue.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {issue.responseCount.toLocaleString()} responses
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Share Opinion
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-secondary">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4">Don't see your issue?</h3>
              <p className="text-muted-foreground mb-6">
                We're constantly adding new topics based on current events and user suggestions.
              </p>
              <Button variant="outline" size="lg">
                Suggest a Topic
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Issues;
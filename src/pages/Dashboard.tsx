import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share, TrendingUp, Users, MessageSquare, Eye } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface FeedbackData {
  id: string;
  issueId: string;
  issue: string;
  feedback: string;
  sentiment: "positive" | "negative" | "neutral";
  timestamp: string;
  metadata: {
    name?: string;
    age?: string;
    role?: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string>("all");

  useEffect(() => {
    // Load feedback data from localStorage
    const stored = localStorage.getItem("pulseview-feedback");
    const data = stored ? JSON.parse(stored) : [];
    
    // Add some mock data if empty for demo purposes
    if (data.length === 0) {
      const mockData: FeedbackData[] = [
        {
          id: "1",
          issueId: "1",
          issue: "Rising housing prices & affordable housing crisis in Indian cities",
          feedback: "Housing costs are making it impossible for young professionals to live independently",
          sentiment: "negative",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          metadata: { role: "Professional" }
        },
        {
          id: "2",
          issueId: "2",
          issue: "Should AI tools be allowed in college assignments?",
          feedback: "AI tools should be allowed but with proper guidelines and transparency",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          metadata: { role: "Student" }
        },
        {
          id: "3",
          issueId: "3",
          issue: "Public health: Dengue, malaria outbreaks after monsoons",
          feedback: "Better drainage systems and awareness campaigns are needed urgently",
          sentiment: "neutral",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          metadata: { role: "Health Worker" }
        }
      ];
      setFeedbackData(mockData);
      localStorage.setItem("pulseview-feedback", JSON.stringify(mockData));
    } else {
      setFeedbackData(data);
    }
  }, []);

  const filteredData = selectedIssue === "all" 
    ? feedbackData 
    : feedbackData.filter(item => item.issueId === selectedIssue);

  // Sentiment analysis
  const sentimentData = [
    {
      name: "Positive",
      value: filteredData.filter(item => item.sentiment === "positive").length,
      color: "hsl(var(--sentiment-positive))"
    },
    {
      name: "Negative", 
      value: filteredData.filter(item => item.sentiment === "negative").length,
      color: "hsl(var(--sentiment-negative))"
    },
    {
      name: "Neutral",
      value: filteredData.filter(item => item.sentiment === "neutral").length,
      color: "hsl(var(--sentiment-neutral))"
    }
  ];

  // Timeline data (last 7 days)
  const timelineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    const dayData = filteredData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate.toDateString() === date.toDateString();
    });
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      positive: dayData.filter(item => item.sentiment === "positive").length,
      negative: dayData.filter(item => item.sentiment === "negative").length,
      neutral: dayData.filter(item => item.sentiment === "neutral").length
    };
  });

  // Top keywords (mock data for demo)
  const keywordData = [
    { keyword: "Housing", count: 45, sentiment: "negative" },
    { keyword: "AI Tools", count: 38, sentiment: "positive" },
    { keyword: "Health", count: 29, sentiment: "neutral" },
    { keyword: "Education", count: 25, sentiment: "positive" },
    { keyword: "Privacy", count: 22, sentiment: "neutral" },
    { keyword: "Environment", count: 18, sentiment: "negative" }
  ];

  const uniqueIssues = Array.from(new Set(feedbackData.map(item => item.issue))).map(issue => {
    const item = feedbackData.find(f => f.issue === issue);
    return { id: item?.issueId || "", title: issue };
  });

  const totalResponses = filteredData.length;
  const averageSentiment = totalResponses > 0 
    ? (sentimentData[0].value * 1 + sentimentData[2].value * 0 + sentimentData[1].value * -1) / totalResponses
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                Public Opinion Dashboard
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Issue Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedIssue === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedIssue("all")}
            >
              All Issues
            </Button>
            {uniqueIssues.map((issue) => (
              <Button
                key={issue.id}
                variant={selectedIssue === issue.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedIssue(issue.id)}
                className="text-xs"
              >
                {issue.title.slice(0, 40)}...
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Responses</p>
                  <p className="text-3xl font-bold">{totalResponses}</p>
                </div>
                <Users className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sentiment Score</p>
                  <p className="text-3xl font-bold">
                    {averageSentiment > 0 ? "+" : ""}{(averageSentiment * 100).toFixed(0)}
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${averageSentiment > 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Issues</p>
                  <p className="text-3xl font-bold">{uniqueIssues.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Views</p>
                  <p className="text-3xl font-bold">2.4K</p>
                </div>
                <Eye className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>
                Overall sentiment breakdown of public opinion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {sentimentData.map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}: {item.value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Response Timeline</CardTitle>
              <CardDescription>
                Daily sentiment trends over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="positive" 
                      stroke="hsl(var(--sentiment-positive))" 
                      strokeWidth={2}
                      name="Positive"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="negative" 
                      stroke="hsl(var(--sentiment-negative))" 
                      strokeWidth={2}
                      name="Negative"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="neutral" 
                      stroke="hsl(var(--sentiment-neutral))" 
                      strokeWidth={2}
                      name="Neutral"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Top Keywords</CardTitle>
              <CardDescription>
                Most frequently mentioned terms in feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={keywordData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="keyword" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>
                AI-generated summary of public opinion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-gradient-secondary rounded-lg">
                  <h4 className="font-medium text-sentiment-positive mb-2">📈 Positive Trend</h4>
                  <p className="text-sm text-muted-foreground">
                    Most respondents support regulated AI use in education, emphasizing transparency and learning value.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-secondary rounded-lg">
                  <h4 className="font-medium text-sentiment-negative mb-2">⚠️ Main Concern</h4>
                  <p className="text-sm text-muted-foreground">
                    Housing affordability crisis is causing significant stress among urban professionals and students.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-secondary rounded-lg">
                  <h4 className="font-medium text-sentiment-neutral mb-2">🎯 Action Needed</h4>
                  <p className="text-sm text-muted-foreground">
                    Public health infrastructure improvements are urgently needed for disease prevention.
                  </p>
                </div>
              </div>

              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Generate Detailed Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
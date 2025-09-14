import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Download, Share, TrendingUp, Users, MessageSquare, Eye, Link, Facebook, Twitter, Linkedin, Copy, FileDown, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import jsPDF from 'jspdf';
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

// Utility function to generate CSV data
const generateCSV = (data: FeedbackData[]) => {
  // Generate summary statistics
  const totalResponses = data.length;
  const positiveCount = data.filter(item => item.sentiment === "positive").length;
  const negativeCount = data.filter(item => item.sentiment === "negative").length;
  const neutralCount = data.filter(item => item.sentiment === "neutral").length;

  // Calculate percentages
  const positivePercentage = ((positiveCount / totalResponses) * 100).toFixed(1);
  const negativePercentage = ((negativeCount / totalResponses) * 100).toFixed(1);
  const neutralPercentage = ((neutralCount / totalResponses) * 100).toFixed(1);

  // Create CSV content with sections
  const summarySection = [
    ['DASHBOARD SUMMARY'],
    ['Total Responses', totalResponses],
    ['Positive Feedback', `${positiveCount} (${positivePercentage}%)`],
    ['Negative Feedback', `${negativeCount} (${negativePercentage}%)`],
    ['Neutral Feedback', `${neutralCount} (${neutralPercentage}%)`],
    [''],
  ];

  // Group feedback by issue
  const issueGroups = data.reduce((acc, item) => {
    if (!acc[item.issue]) {
      acc[item.issue] = [];
    }
    acc[item.issue].push(item);
    return acc;
  }, {} as Record<string, FeedbackData[]>);

  // Create issue-wise summary
  const issueSummary = [
    ['ISSUE-WISE BREAKDOWN'],
    ['Issue', 'Total Responses', 'Positive', 'Negative', 'Neutral'],
    ...Object.entries(issueGroups).map(([issue, items]) => [
      issue,
      items.length,
      items.filter(i => i.sentiment === "positive").length,
      items.filter(i => i.sentiment === "negative").length,
      items.filter(i => i.sentiment === "neutral").length,
    ]),
    [''],
  ];

  // Detailed feedback section
  const detailedSection = [
    ['DETAILED FEEDBACK'],
    ['ID', 'Issue', 'Feedback', 'Sentiment', 'Timestamp', 'Role'],
    ...data.map(item => [
      item.id,
      item.issue,
      item.feedback,
      item.sentiment,
      new Date(item.timestamp).toLocaleString(),
      item.metadata.role || 'N/A'
    ]),
  ];

  // Combine all sections
  const allRows = [
    ...summarySection,
    ...issueSummary,
    ...detailedSection,
  ];

  // Convert to CSV format with proper escaping
  return allRows.map(row =>
    row.map(cell => {
      // Handle cells that might contain commas or quotes
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',')
  ).join('\n');
};

// Utility function to generate a PDF report
const generatePDF = (data: FeedbackData[]) => {
  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yOffset = 20;
  const lineHeight = 7;

  // Helper function for text wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * lineHeight;
  };

  // Helper function to add a section title
  const addSectionTitle = (title: string) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yOffset);
    yOffset += lineHeight + 3;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
  };

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Public Opinion Dashboard Report', 20, yOffset);
  yOffset += lineHeight + 5;

  // Date
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yOffset);
  yOffset += lineHeight * 2;

  // Calculate statistics
  const totalResponses = data.length;
  const positiveCount = data.filter(item => item.sentiment === "positive").length;
  const negativeCount = data.filter(item => item.sentiment === "negative").length;
  const neutralCount = data.filter(item => item.sentiment === "neutral").length;

  // Calculate percentages
  const positivePercentage = ((positiveCount / totalResponses) * 100).toFixed(1);
  const negativePercentage = ((negativeCount / totalResponses) * 100).toFixed(1);
  const neutralPercentage = ((neutralCount / totalResponses) * 100).toFixed(1);

  // Executive Summary
  addSectionTitle('Executive Summary');
  doc.text(`Total Responses: ${totalResponses}`, 20, yOffset);
  yOffset += lineHeight;
  doc.text('Sentiment Distribution:', 20, yOffset);
  yOffset += lineHeight;
  doc.text(`• Positive: ${positiveCount} responses (${positivePercentage}%)`, 25, yOffset);
  yOffset += lineHeight;
  doc.text(`• Negative: ${negativeCount} responses (${negativePercentage}%)`, 25, yOffset);
  yOffset += lineHeight;
  doc.text(`• Neutral: ${neutralCount} responses (${neutralPercentage}%)`, 25, yOffset);
  yOffset += lineHeight * 2;

  // Group feedback by issue
  const issueGroups = data.reduce((acc, item) => {
    if (!acc[item.issue]) {
      acc[item.issue] = [];
    }
    acc[item.issue].push(item);
    return acc;
  }, {} as Record<string, FeedbackData[]>);

  // Issue-wise Breakdown
  addSectionTitle('Issue-wise Breakdown');
  Object.entries(issueGroups).forEach(([issue, items]) => {
    // Check if we need a new page
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
    }

    const height = addWrappedText(issue, 20, yOffset, pageWidth - 40);
    yOffset += height;
    doc.text(`Total Responses: ${items.length}`, 25, yOffset);
    yOffset += lineHeight;
    doc.text(`Positive: ${items.filter(i => i.sentiment === "positive").length}`, 25, yOffset);
    yOffset += lineHeight;
    doc.text(`Negative: ${items.filter(i => i.sentiment === "negative").length}`, 25, yOffset);
    yOffset += lineHeight;
    doc.text(`Neutral: ${items.filter(i => i.sentiment === "neutral").length}`, 25, yOffset);
    yOffset += lineHeight * 1.5;
  });

  // Detailed Feedback
  addSectionTitle('Detailed Feedback');
  data.forEach((item, index) => {
    // Check if we need a new page
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
    }

    doc.setFont('helvetica', 'bold');
    const height = addWrappedText(`${index + 1}. ${item.issue}`, 20, yOffset, pageWidth - 40);
    yOffset += height;

    doc.setFont('helvetica', 'normal');
    yOffset += addWrappedText(`Feedback: ${item.feedback}`, 25, yOffset, pageWidth - 45);
    doc.text(`Sentiment: ${item.sentiment}`, 25, yOffset);
    yOffset += lineHeight;
    doc.text(`Role: ${item.metadata.role || 'N/A'}`, 25, yOffset);
    yOffset += lineHeight;
    doc.text(`Time: ${new Date(item.timestamp).toLocaleString()}`, 25, yOffset);
    yOffset += lineHeight * 1.5;
  });

  // Key Insights
  if (yOffset > 220) {
    doc.addPage();
    yOffset = 20;
  }

  addSectionTitle('Key Insights');
  doc.text('1. Most Discussed Issues:', 20, yOffset);
  yOffset += lineHeight;

  Object.entries(issueGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3)
    .forEach(([issue, items]) => {
      const text = `• ${issue} (${items.length} responses)`;
      yOffset += addWrappedText(text, 25, yOffset, pageWidth - 45);
    });

  yOffset += lineHeight;
  doc.text('2. Sentiment Trends:', 20, yOffset);
  yOffset += lineHeight;

  const overallSentiment = positiveCount > negativeCount ? 'POSITIVE' : 'NEGATIVE';
  doc.text(`• Overall sentiment is ${overallSentiment}`, 25, yOffset);
  yOffset += lineHeight;

  const maxPercentage = Math.max(
    Number(positivePercentage),
    Number(negativePercentage),
    Number(neutralPercentage)
  );
  const dominantSentiment =
    Number(positivePercentage) === maxPercentage ? 'positive' :
      Number(negativePercentage) === maxPercentage ? 'negative' : 'neutral';

  doc.text(`• ${maxPercentage}% of responses are ${dominantSentiment}`, 25, yOffset);

  return doc.output('blob');
};// Utility function to download files
const downloadFile = (content: string | Blob, filename: string, contentType: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Dashboard</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Share Link</label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={window.location.href}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied to clipboard!");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Share on Social Media</label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out this public opinion dashboard!')}`, '_blank')}
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Dashboard</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        const csvContent = generateCSV(feedbackData);
                        downloadFile(csvContent, 'dashboard-data.csv', 'text/csv');
                        toast.success("CSV file downloaded!");
                      }}
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        const pdfContent = generatePDF(feedbackData);
                        downloadFile(pdfContent, 'dashboard-report.pdf', 'application/pdf');
                        toast.success("PDF file downloaded!");
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    Generate Detailed Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Detailed Analysis Report</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Overview Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Executive Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Based on {totalResponses} responses collected across {uniqueIssues.length} active issues,
                          the overall public sentiment is {averageSentiment > 0 ? "positive" : "negative"}
                          with a score of {(averageSentiment * 100).toFixed(0)}.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Sentiment Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Sentiment Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {sentimentData.map((item, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                                {item.name}
                              </span>
                              <span>{((item.value / totalResponses) * 100).toFixed(1)}% ({item.value} responses)</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Issue-wise Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Issue-wise Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {uniqueIssues.map((issue) => {
                            const issueData = feedbackData.filter(item => item.issueId === issue.id);
                            const positiveFeedback = issueData.filter(item => item.sentiment === "positive").length;
                            const negativeFeedback = issueData.filter(item => item.sentiment === "negative").length;
                            const neutralFeedback = issueData.filter(item => item.sentiment === "neutral").length;

                            return (
                              <div key={issue.id} className="space-y-2">
                                <h4 className="font-medium">{issue.title}</h4>
                                <div className="flex gap-4">
                                  <Badge variant="outline">👍 {positiveFeedback}</Badge>
                                  <Badge variant="outline">👎 {negativeFeedback}</Badge>
                                  <Badge variant="outline">😐 {neutralFeedback}</Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Findings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Key Findings & Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Top Discussion Points</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {keywordData.slice(0, 3).map((item, index) => (
                              <li key={index}>
                                {item.keyword}: Mentioned {item.count} times with {item.sentiment} sentiment
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Recommendations</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Focus on addressing housing affordability concerns in urban areas</li>
                            <li>Develop clear guidelines for AI tool usage in educational settings</li>
                            <li>Strengthen public health infrastructure for disease prevention</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Download Options */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          const csvContent = generateCSV(feedbackData);
                          downloadFile(csvContent, 'detailed-report.csv', 'text/csv');
                          toast.success("CSV report downloaded!");
                        }}
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Download as CSV
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          const pdfContent = generatePDF(feedbackData);
                          downloadFile(pdfContent, 'detailed-report.pdf', 'application/pdf');
                          toast.success("PDF report downloaded!");
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Download as PDF
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
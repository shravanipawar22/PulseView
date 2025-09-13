import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, User, Briefcase, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Issue {
  id: string;
  title: string;
  category: string;
}

const ISSUES_MAP: Record<string, Issue> = {
  "1": {
    id: "1",
    title: "Rising housing prices & affordable housing crisis in Indian cities",
    category: "Economics"
  },
  "2": {
    id: "2", 
    title: "Should AI tools be allowed in college assignments?",
    category: "Education"
  },
  "3": {
    id: "3",
    title: "Public health: Dengue, malaria outbreaks after monsoons",
    category: "Health"
  },
  "4": {
    id: "4",
    title: "Campus security and mental health support systems",
    category: "Education"
  },
  "5": {
    id: "5",
    title: "Data privacy & regulation of AI technologies",
    category: "Technology"
  },
  "6": {
    id: "6",
    title: "Environmental risks: heat waves and air pollution",
    category: "Environment"
  }
};

const Feedback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const issueId = searchParams.get("issue") || "1";
  const currentIssue = ISSUES_MAP[issueId];
  
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please share your opinion before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store feedback in localStorage for demo
    const existingFeedback = JSON.parse(localStorage.getItem("pulseview-feedback") || "[]");
    const newFeedback = {
      id: Date.now().toString(),
      issueId,
      issue: currentIssue.title,
      feedback: feedback.trim(),
      metadata: { name: name.trim(), age: age.trim(), role: role.trim() },
      timestamp: new Date().toISOString(),
      // Mock sentiment analysis
      sentiment: Math.random() > 0.3 ? (Math.random() > 0.5 ? "positive" : "neutral") : "negative"
    };
    
    existingFeedback.push(newFeedback);
    localStorage.setItem("pulseview-feedback", JSON.stringify(existingFeedback));
    
    setIsSubmitting(false);
    
    toast({
      title: "Thank you for your feedback!",
      description: "Your opinion has been recorded and will be analyzed.",
    });
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  if (!currentIssue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Issue not found</h2>
            <Button onClick={() => navigate("/issues")}>
              Choose Another Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/issues")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Issues
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Share Your Opinion
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Issue Context */}
        <Card className="mb-8 bg-gradient-secondary">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold leading-tight">
                {currentIssue.title}
              </h2>
              <Badge variant="outline">{currentIssue.category}</Badge>
            </div>
            <p className="text-muted-foreground">
              Your opinion matters. Share your thoughts, experiences, and perspectives on this important issue.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Your Feedback
                </CardTitle>
                <CardDescription>
                  Share your thoughts, experiences, or suggestions regarding this issue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="feedback" className="text-base font-medium">
                      What's your opinion?
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder="Type your thoughts here... Be specific about your experiences, suggestions, or concerns."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[120px] mt-2 resize-none"
                      maxLength={1000}
                    />
                    <div className="text-right text-sm text-muted-foreground mt-1">
                      {feedback.length}/1000 characters
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1">
                      <Mic className="h-4 w-4 mr-2" />
                      Record Audio
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Optional Metadata */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Optional Details</CardTitle>
                <CardDescription>
                  Help us understand different perspectives (completely optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="age" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Age Range
                  </Label>
                  <Input
                    id="age"
                    placeholder="e.g., 25-35"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Role/Profession
                  </Label>
                  <Input
                    id="role"
                    placeholder="e.g., Student, Teacher, Professional"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-secondary">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Privacy Notice</h4>
                <p className="text-sm text-muted-foreground">
                  Your feedback is anonymous unless you choose to provide personal details. 
                  We use this data only for analysis and insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
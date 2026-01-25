'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Send, Home, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/animate-ui/Navbar";
import Footer from "@/components/landing/Footer";

export default function FeedbackPage() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!feedback.trim()) {
      setError('Please provide your feedback');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          feedback: feedback.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('An error occurred while submitting feedback');
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background dark:bg-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="max-w-md w-full bg-card dark:bg-[oklch(0.205_0_0)] border border-border">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Thank You!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your feedback has been submitted successfully. We appreciate you taking the time to help us improve Ziora.
              </p>
              <Button 
                onClick={handleReturnHome}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card dark:bg-[oklch(0.205_0_0)] border border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl font-bold text-foreground">
                Share Your Feedback
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Help us improve Ziora by sharing your thoughts and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating Section */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">
                    Rate Your Experience <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`h-10 w-10 ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-3 text-sm text-muted-foreground">
                        {rating} {rating === 1 ? 'star' : 'stars'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Feedback Text */}
                <div className="space-y-3">
                  <Label htmlFor="feedback" className="text-foreground font-medium">
                    Your Feedback <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you think about Ziora. What do you like? What can we improve? Any suggestions?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[150px] bg-background dark:bg-black border-border text-foreground placeholder:text-muted-foreground resize-none"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Share your thoughts, suggestions, or any issues you've encountered
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
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
      </div>
      <Footer />
    </div>
  );
}

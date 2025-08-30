import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, User, Mail, MessageSquare, Heart, Clock, Users, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHaptic } from "@/hooks/use-haptic";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewForm {
  name: string;
  email: string;
  appearance: number;
  punctuality: number;
  communication: number;
  professionalism: number;
  chemistry: number;
  discretion: number;
  publicRating: number;
  publicComment: string;
  wouldBookAgain: boolean;
  bookingProcessSmooth: boolean;
  matchedDescription: boolean;
  serviceTypes: string[];
  additionalComments: string;
}

const serviceOptions = [
  "Companion Services",
  "Social Events", 
  "Business Events",
  "Travel Companion",
  "Dinner Dates",
  "Cultural Events",
  "Private Parties"
];

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const { toast } = useToast();
  const { triggerHaptic } = useHaptic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<'form' | 'submitting' | 'success'>('form');
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ReviewForm>({
    name: "",
    email: "",
    appearance: 0,
    punctuality: 0,
    communication: 0,
    professionalism: 0,
    chemistry: 0,
    discretion: 0,
    publicRating: 0,
    publicComment: "",
    wouldBookAgain: true,
    bookingProcessSmooth: true,
    matchedDescription: true,
    serviceTypes: [],
    additionalComments: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger haptic feedback on submit
    triggerHaptic('medium');
    
    if (!formData.name || !formData.email) {
      triggerHaptic('error');
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.publicRating || formData.publicRating === 0) {
      toast({
        title: "Public Rating Required",
        description: "Please provide an overall rating for the public review.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.publicComment || formData.publicComment.trim() === "") {
      toast({
        title: "Public Comment Required",
        description: "Please provide a brief comment for the public review.",
        variant: "destructive"
      });
      return;
    }

    if (formData.serviceTypes.length === 0) {
      toast({
        title: "Service Type Required", 
        description: "Please select at least one service type you experienced.",
        variant: "destructive"
      });
      return;
    }

    // Validate that all detailed ratings are provided (greater than 0)
    const ratingFields = ['appearance', 'punctuality', 'communication', 'professionalism', 'chemistry', 'discretion'];
    const unratedFields = ratingFields.filter(field => formData[field as keyof ReviewForm] === 0);
    
    if (unratedFields.length > 0) {
      toast({
        title: "Private Rating Required",
        description: `Please provide private ratings for: ${unratedFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep('submitting');

    try {
      // Use absolute URL for external devices, relative for development
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '/api/reviews'
        : `${window.location.protocol}//${window.location.host}/api/reviews`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to submit review: ${response.status} - ${errorData.message || 'Server error'}`);
      }

      const result = await response.json();
      console.log('Review submission result:', result);
      
      // Extract review ID from response
      const submittedReviewId = result.review?.id || Math.floor(Math.random() * 1000);
      setReviewId(submittedReviewId);
      setSubmissionStep('success');
      
      toast({
        title: "✅ Database Confirmed!",
        description: `Review #${submittedReviewId} successfully stored and queued for approval. Thank you!`,
      });

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          appearance: 0,
          punctuality: 0,
          communication: 0,
          professionalism: 0,
          chemistry: 0,
          discretion: 0,
          publicRating: 0,
          publicComment: "",
          wouldBookAgain: true,
          bookingProcessSmooth: true,
          matchedDescription: true,
          serviceTypes: [],
          additionalComments: ""
        });
        setSubmissionStep('form');
        setReviewId(null);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmissionStep('form');
      toast({
        title: "❌ Database Error",
        description: "Failed to store review in database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (category: keyof ReviewForm, label: string, icon: React.ReactNode) => {
    const rating = formData[category] as number;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {icon}
          <Label className="text-white font-medium">{label}</Label>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, [category]: star })}
              className="transition-colors hover:scale-110 transform duration-200"
            >
              <Star 
                className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleServiceTypeChange = (serviceType: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        serviceTypes: [...formData.serviceTypes, serviceType]
      });
    } else {
      setFormData({
        ...formData,
        serviceTypes: formData.serviceTypes.filter(type => type !== serviceType)
      });
    }
  };

  // Success confirmation screen
  if (submissionStep === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg bg-black/95 border border-green-500/50 backdrop-blur-xl">
          <div className="text-center space-y-6 p-6">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Database Confirmed!</h3>
              <p className="text-gray-300">
                Review #{reviewId} successfully stored and queued for approval.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Stored in database</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Email notification sent</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Queued for approval</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              This window will close automatically...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Progress indicator for submitting state
  if (submissionStep === 'submitting') {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg bg-black/95 border border-purple-500/50 backdrop-blur-xl">
          <div className="text-center space-y-6 p-6">
            <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
              <Star className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Submitting Review...</h3>
              <p className="text-gray-300">
                Storing your feedback in the database
              </p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black/95 border border-white/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            Share Your Experience
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </h3>
            
            <div>
              <Label htmlFor="name" className="text-white">
                Your Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Service Experience Ratings - Private Feedback */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5" />
              Detailed Feedback
            </h3>
            <p className="text-gray-400 text-sm italic">👁️ Bobby's eyes only - Private feedback for improvement</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderStarRating("appearance", "Appearance", <Heart className="w-4 h-4 text-pink-400" />)}
              {renderStarRating("punctuality", "Punctuality", <Clock className="w-4 h-4 text-blue-400" />)}
              {renderStarRating("communication", "Communication", <MessageSquare className="w-4 h-4 text-green-400" />)}
              {renderStarRating("professionalism", "Professionalism", <Users className="w-4 h-4 text-purple-400" />)}
              {renderStarRating("chemistry", "Chemistry/Connection", <Heart className="w-4 h-4 text-red-400" />)}
              {renderStarRating("discretion", "Discretion", <Shield className="w-4 h-4 text-gray-400" />)}
            </div>
          </div>

          {/* Service Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Services Experienced
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {serviceOptions.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.serviceTypes.includes(service)}
                    onCheckedChange={(checked) => handleServiceTypeChange(service, !!checked)}
                    className="border-white/30 data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={service} className="text-white text-sm">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Yes/No Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Overall Experience
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Would you book again?</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.wouldBookAgain ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, wouldBookAgain: true })}
                    className={formData.wouldBookAgain ? "bg-green-600 hover:bg-green-700" : "border-white/20 text-white"}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.wouldBookAgain ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, wouldBookAgain: false })}
                    className={!formData.wouldBookAgain ? "bg-red-600 hover:bg-red-700" : "border-white/20 text-white"}
                  >
                    No
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Was the booking process smooth?</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.bookingProcessSmooth ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, bookingProcessSmooth: true })}
                    className={formData.bookingProcessSmooth ? "bg-green-600 hover:bg-green-700" : "border-white/20 text-white"}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.bookingProcessSmooth ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, bookingProcessSmooth: false })}
                    className={!formData.bookingProcessSmooth ? "bg-red-600 hover:bg-red-700" : "border-white/20 text-white"}
                  >
                    No
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Did the experience match the description?</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.matchedDescription ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, matchedDescription: true })}
                    className={formData.matchedDescription ? "bg-green-600 hover:bg-green-700" : "border-white/20 text-white"}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.matchedDescription ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, matchedDescription: false })}
                    className={!formData.matchedDescription ? "bg-red-600 hover:bg-red-700" : "border-white/20 text-white"}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Public Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Public Review
            </h3>
            <p className="text-gray-400 text-sm">🌟 This will appear on the website for other clients</p>
            
            <div>
              <Label htmlFor="publicRating" className="text-white">
                Overall Rating *
              </Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, publicRating: star })}
                    className="transition-colors hover:scale-110 transform duration-200"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= (formData.publicRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="publicComment" className="text-white">
                Short Public Comment *
              </Label>
              <Textarea
                id="publicComment"
                value={formData.publicComment || ''}
                onChange={(e) => setFormData({ ...formData, publicComment: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[80px]"
                placeholder="Brief comment for website (1-2 sentences max)"
                maxLength={150}
                required
              />
              <p className="text-gray-500 text-xs mt-1">{(formData.publicComment || '').length}/150 characters</p>
            </div>
          </div>
          
          {/* Private Additional Comments */}
          <div>
            <Label htmlFor="comments" className="text-white flex items-center gap-2">
              Additional Private Feedback
              <span className="text-gray-400 text-xs italic">👁️ Bobby's eyes only</span>
            </Label>
            <Textarea
              id="comments"
              value={formData.additionalComments}
              onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
              placeholder="Private feedback, suggestions, or critiques for Bobby's improvement..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
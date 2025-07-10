import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/api/reviews', 'POST', formData);

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review will be published once approved.",
      });
      
      // Reset form and close modal
      setFormData({ name: "", email: "", rating: 5, message: "" });
      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
        className={`text-2xl transition-colors ${
          i < formData.rating 
            ? 'text-yellow-400 hover:text-yellow-300' 
            : 'text-gray-400 hover:text-yellow-200'
        }`}
      >
        <Star className="w-6 h-6" fill={i < formData.rating ? 'currentColor' : 'none'} />
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect p-8 rounded-3xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Leave a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="glass-effect border-white/20 text-white placeholder-gray-400"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="glass-effect border-white/20 text-white placeholder-gray-400"
              placeholder="your@email.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your email won't be displayed publicly
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating *
            </label>
            <div className="flex gap-1">
              {renderStars()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.rating} out of 5 stars
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Review *
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="glass-effect border-white/20 text-white placeholder-gray-400 min-h-[120px]"
              placeholder="Share your experience with Bobby's companion services..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 glass-effect rounded-2xl border border-white/10">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Your review will be carefully reviewed before being published. 
            We appreciate honest feedback about your experience with Bobby's companion services.
          </p>
        </div>
      </div>
    </div>
  );
}
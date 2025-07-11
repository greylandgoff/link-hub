import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
    appearance: 5,
    punctuality: 5,
    communication: 5,
    professionalism: 5,
    chemistry: 5,
    discretion: 5,
    wouldBookAgain: true,
    bookingProcessSmooth: true,
    matchedDescription: true,
    serviceTypes: [] as string[],
    additionalComments: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || formData.serviceTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, email, and select at least one service type.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/reviews', formData);

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review will be published once approved.",
      });
      
      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        appearance: 5,
        punctuality: 5,
        communication: 5,
        professionalism: 5,
        chemistry: 5,
        discretion: 5,
        wouldBookAgain: true,
        bookingProcessSmooth: true,
        matchedDescription: true,
        serviceTypes: [],
        additionalComments: ""
      });
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

  const renderStarRating = (category: string, value: number, onChange: (value: number) => void) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={`text-lg transition-colors ${
              i < value 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-gray-400 hover:text-yellow-200'
            }`}
          >
            <Star className="w-5 h-5" fill={i < value ? 'currentColor' : 'none'} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-400">{value}/5</span>
      </div>
    );
  };

  const handleServiceTypeChange = (serviceType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: checked 
        ? [...prev.serviceTypes, serviceType]
        : prev.serviceTypes.filter(type => type !== serviceType)
    }));
  };

  const serviceTypeOptions = [
    "Incall",
    "Outcall",
    "Dinner companion",
    "Overnight",
    "Social event",
    "Travel partner",
    "Other"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Share Your Experience
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-gray-400 hover:text-white h-auto p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
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
          </div>

          {/* Rating Scales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 border-b border-white/10 pb-2">
              Rate Your Experience (1 = Poor, 5 = Excellent)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Appearance
                </label>
                {renderStarRating("appearance", formData.appearance, (value) => 
                  setFormData(prev => ({ ...prev, appearance: value }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Punctuality
                </label>
                {renderStarRating("punctuality", formData.punctuality, (value) => 
                  setFormData(prev => ({ ...prev, punctuality: value }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Communication Ease
                </label>
                {renderStarRating("communication", formData.communication, (value) => 
                  setFormData(prev => ({ ...prev, communication: value }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Professionalism
                </label>
                {renderStarRating("professionalism", formData.professionalism, (value) => 
                  setFormData(prev => ({ ...prev, professionalism: value }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chemistry/Rapport
                </label>
                {renderStarRating("chemistry", formData.chemistry, (value) => 
                  setFormData(prev => ({ ...prev, chemistry: value }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discretion/Confidentiality
                </label>
                {renderStarRating("discretion", formData.discretion, (value) => 
                  setFormData(prev => ({ ...prev, discretion: value }))
                )}
              </div>
            </div>
          </div>

          {/* Yes/No Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 border-b border-white/10 pb-2">
              Quick Questions
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="wouldBookAgain"
                  checked={formData.wouldBookAgain}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, wouldBookAgain: !!checked }))
                  }
                  className="border-white/20"
                />
                <label htmlFor="wouldBookAgain" className="text-sm text-gray-300">
                  Would you book again?
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="bookingProcessSmooth"
                  checked={formData.bookingProcessSmooth}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, bookingProcessSmooth: !!checked }))
                  }
                  className="border-white/20"
                />
                <label htmlFor="bookingProcessSmooth" className="text-sm text-gray-300">
                  Was booking & payment straightforward?
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="matchedDescription"
                  checked={formData.matchedDescription}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, matchedDescription: !!checked }))
                  }
                  className="border-white/20"
                />
                <label htmlFor="matchedDescription" className="text-sm text-gray-300">
                  Did everything match the description?
                </label>
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 border-b border-white/10 pb-2">
              Service Type (Select all that apply) *
            </h3>
            
            <div className="grid md:grid-cols-2 gap-3">
              {serviceTypeOptions.map((serviceType) => (
                <div key={serviceType} className="flex items-center space-x-3">
                  <Checkbox
                    id={serviceType}
                    checked={formData.serviceTypes.includes(serviceType)}
                    onCheckedChange={(checked) => 
                      handleServiceTypeChange(serviceType, !!checked)
                    }
                    className="border-white/20"
                  />
                  <label htmlFor={serviceType} className="text-sm text-gray-300">
                    {serviceType}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Anything else? (max 200 characters)
            </label>
            <Textarea
              value={formData.additionalComments}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setFormData(prev => ({ ...prev, additionalComments: e.target.value }));
                }
              }}
              className="glass-effect border-white/20 text-white placeholder-gray-400 min-h-[80px]"
              placeholder="Optional brief comment..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.additionalComments.length}/200 characters
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
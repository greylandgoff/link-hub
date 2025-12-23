import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useHaptic } from "@/hooks/use-haptic";
import { User, Mail, Phone, MapPin, Calendar, Clock, MessageSquare, Plane } from "lucide-react";

interface ScreeningFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScreeningFormData {
  name: string;
  email: string;
  phone: string;
  cityLocation: string;
  dates: string;
  length: string;
  notes: string;
  requestTravel: boolean;
  arrivalAirport: string;
  hotelBooked: string;
  interestsBoundaries: string;
}

export function ScreeningForm({ isOpen, onClose }: ScreeningFormProps) {
  const { toast } = useToast();
  const { triggerHaptic } = useHaptic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [formData, setFormData] = useState<ScreeningFormData>({
    name: "",
    email: "",
    phone: "",
    cityLocation: "",
    dates: "",
    length: "",
    notes: "",
    requestTravel: false,
    arrivalAirport: "",
    hotelBooked: "",
    interestsBoundaries: ""
  });

  // Calculate form progress
  const calculateProgress = (data: ScreeningFormData) => {
    const requiredFields = [data.name, data.email, data.cityLocation, data.dates, data.length];
    const optionalFields = [data.notes, data.interestsBoundaries];
    const travelFields = data.requestTravel ? [data.arrivalAirport, data.hotelBooked] : [];
    
    const filledRequired = requiredFields.filter(field => field.trim() !== '').length;
    const filledOptional = optionalFields.filter(field => field.trim() !== '').length;
    const filledTravel = travelFields.filter(field => field.trim() !== '').length;
    
    const totalFields = requiredFields.length + optionalFields.length + travelFields.length;
    const filledFields = filledRequired + filledOptional + filledTravel;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  const handleInputChange = (field: keyof ScreeningFormData, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setFormProgress(calculateProgress(newData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger haptic feedback for form submission
    triggerHaptic('medium');
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.cityLocation || !formData.dates || !formData.length) {
      triggerHaptic('error');
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const screeningData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        date: formData.dates,
        time: "TBD",
        duration: formData.length,
        service: "Companion Services",
        location: formData.cityLocation,
        message: null,
        notes: formData.notes || null,
        travel_request: formData.requestTravel,
        arrival_airport: formData.arrivalAirport || null,
        hotel_booked: formData.hotelBooked || null,
        interests_boundaries: formData.interestsBoundaries || null,
        source: "website_screening_form"
      };

      console.log('Submitting screening data:', screeningData);

      // Use absolute URL for external devices, relative for development
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '/api/appointments'
        : `${window.location.protocol}//${window.location.host}/api/appointments`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(screeningData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response error:', errorData);
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Screening submission result:', result);

      // Success haptic feedback
      triggerHaptic('success');
      
      toast({
        title: "Screening Request Submitted",
        description: "Thank you! I'll review your information and get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        cityLocation: "",
        dates: "",
        length: "",
        notes: "",
        requestTravel: false,
        arrivalAirport: "",
        hotelBooked: "",
        interestsBoundaries: ""
      });

      onClose();
    } catch (error) {
      console.error('Screening submission error:', error);
      // Error haptic feedback
      triggerHaptic('error');
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Screening Request {submitSuccess && "✓"}
          </DialogTitle>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Progress</span>
              <span>{formProgress}% complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${formProgress}%` }}
              />
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cityLocation" className="text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              City / Location *
            </Label>
            <Input
              id="cityLocation"
              value={formData.cityLocation}
              onChange={(e) => handleInputChange("cityLocation", e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
              placeholder="Austin, Dallas, NYC, etc."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dates" className="text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date(s) *
              </Label>
              <Input
                id="dates"
                type="date"
                value={formData.dates}
                onChange={(e) => handleInputChange("dates", e.target.value)}
                className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="text-white flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Length *
              </Label>
              <Input
                id="length"
                value={formData.length}
                onChange={(e) => handleInputChange("length", e.target.value)}
                className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
                placeholder="2 hours, overnight, weekend, etc."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Notes *
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500 min-h-[100px]"
              placeholder="Tell me about yourself, what you're looking for, any special requests..."
              required
            />
          </div>

          {/* Travel Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="requestTravel"
                checked={formData.requestTravel}
                onCheckedChange={(checked) => handleInputChange("requestTravel", checked)}
              />
              <Label htmlFor="requestTravel" className="text-white flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Request travel booking
              </Label>
            </div>

            {formData.requestTravel && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-purple-500/30">
                <div className="space-y-2">
                  <Label htmlFor="arrivalAirport" className="text-white">
                    Arrival Airport
                  </Label>
                  <Input
                    id="arrivalAirport"
                    value={formData.arrivalAirport}
                    onChange={(e) => handleInputChange("arrivalAirport", e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
                    placeholder="AUS, DFW, LAX, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotelBooked" className="text-white">
                    Hotel booked?
                  </Label>
                  <Input
                    id="hotelBooked"
                    value={formData.hotelBooked}
                    onChange={(e) => handleInputChange("hotelBooked", e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
                    placeholder="Yes/No, hotel name if booked"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interests/Boundaries Section */}
          <div className="space-y-2">
            <Label htmlFor="interestsBoundaries" className="text-white">
              Interests / Boundaries (Optional)
            </Label>
            <Textarea
              id="interestsBoundaries"
              value={formData.interestsBoundaries}
              onChange={(e) => handleInputChange("interestsBoundaries", e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500 min-h-[80px]"
              placeholder="Private space to discuss any specific interests, boundaries, or limits..."
            />
          </div>

          {/* Rate Information */}
          {!import.meta.env.VITE_SHOW_RATES && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                Rates quoted by date / length after screening.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
            >
              {isSubmitting ? "Submitting..." : "Submit Screening Request"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-purple-500/30 text-white hover:bg-purple-500/20"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
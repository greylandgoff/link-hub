import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format, startOfDay, addDays } from "date-fns";
import { CalendarIcon, Clock, MapPin, User, Phone, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  date: Date | undefined;
  time: string;
  duration: string;
  service: string;
  location: string;
  special_requests: string;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const durations = [
  { value: "1", label: "1 hour" },
  { value: "2", label: "2 hours" },
  { value: "3", label: "3 hours" },
  { value: "4", label: "4 hours" },
  { value: "8", label: "8 hours (full day)" },
  { value: "24", label: "24 hours (overnight)" },
  { value: "custom", label: "Custom duration (specify in message)" }
];

const services = [
  { value: "companion", label: "Companion Services" },
  { value: "social", label: "Social Events" },
  { value: "dinner", label: "Dinner Companion" },
  { value: "travel", label: "Travel Companion" },
  { value: "business", label: "Business Events" },
  { value: "custom", label: "Custom Service (specify in message)" }
];

const locations = [
  { value: "incall_austin", label: "🏠 Incall - My Place (Austin)" },
  { value: "outcall_hotel", label: "🏨 Outcall - Hotel/Resort" },
  { value: "outcall_residence", label: "🏡 Outcall - Your Residence" },
  { value: "outcall_restaurant", label: "🍽️ Outcall - Restaurant/Venue" },
  { value: "outcall_travel", label: "✈️ Outcall - Travel Destination" },
  { value: "outcall_other", label: "📍 Outcall - Other Location" },
  { value: "virtual", label: "💻 Virtual Meeting" }
];

export function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AppointmentForm>({
    name: "",
    email: "",
    phone: "",
    date: undefined,
    time: "",
    duration: "",
    service: "",
    location: "",
    special_requests: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.date || !formData.time || !formData.service) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        appointment_date: formData.date ? format(formData.date, "yyyy-MM-dd") : "",
        appointment_time: formData.time,
        duration: formData.duration,
        service_type: formData.service,
        location: formData.location,
        special_requests: formData.special_requests,
        status: "pending",
        source: "website_booking"
      };

      console.log('Submitting appointment data:', appointmentData);

      // Use absolute URL for external devices, relative for development
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '/api/appointments'
        : `${window.location.protocol}//${window.location.host}/api/appointments`;
        
      console.log('Using API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(appointmentData),
        // Add timeout for mobile compatibility
        ...(typeof AbortController !== 'undefined' && {
          signal: (() => {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 30000); // 30 second timeout
            return controller.signal;
          })()
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);

      toast({
        title: "Appointment Request Submitted! 🗓️",
        description: "I'll review your request and get back to you within 24 hours to confirm availability.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: undefined,
        time: "",
        duration: "",
        service: "",
        location: "",
        special_requests: ""
      });

      onClose();
    } catch (error) {
      console.error("Error submitting appointment:", error);
      
      let errorMessage = "There was an error submitting your appointment request. Please try again or contact me directly.";
      
      if (error instanceof Error) {
        console.error("Detailed error:", error.message);
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          errorMessage = "Network connection issue. Please check your internet and try again.";
        } else if (error.message.includes('500')) {
          errorMessage = "Server error. Please try again in a few moments or contact me directly.";
        } else if (error.message.includes('400')) {
          errorMessage = "Please check all required fields are filled correctly.";
        }
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    return date < startOfDay(new Date());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/95 border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Book an Appointment
            </span>
          </DialogTitle>
          <p className="text-gray-300 text-center mt-2">
            Schedule your professional companion service experience
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-white">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Appointment Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-white">Preferred Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date ? format(formData.date, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const dateValue = e.target.value ? new Date(e.target.value + "T00:00:00") : undefined;
                    setFormData({ ...formData, date: dateValue });
                  }}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="bg-white/10 border-white/20 text-white [color-scheme:dark] cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>

              <div>
                <Label htmlFor="time" className="text-white">Preferred Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  min="09:00"
                  max="22:00"
                  className="bg-white/10 border-white/20 text-white [color-scheme:dark] cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <Clock className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value} className="text-white hover:bg-white/10">
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Service Type *</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value} className="text-white hover:bg-white/10">
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-white">Location/Venue</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value} className="text-white hover:bg-white/10">
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Additional Information
            </h3>
            
            <div>
              <Label htmlFor="special_requests" className="text-white">
                Special Requests & Location Details
              </Label>
              <Textarea
                id="special_requests"
                value={formData.special_requests}
                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                placeholder="For outcalls, please provide address or area (e.g., 'Downtown Austin', '123 Main St'). Include any special requests, dress code preferences, or other important details..."
              />
              <p className="text-xs text-gray-400 mt-2">
                💡 <strong>Incall:</strong> Appointment at my place in Austin<br/>
                💡 <strong>Outcall:</strong> I'll come to your location - please specify address or general area
              </p>
            </div>
          </div>

          {/* Terms Notice */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <strong>Booking Process:</strong> This form submits a request for an appointment. 
              I'll review your request and respond within 24 hours to confirm availability and discuss details. 
              All services are professional companion services as outlined in my terms of service.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
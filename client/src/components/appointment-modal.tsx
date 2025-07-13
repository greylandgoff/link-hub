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
  message: string;
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
    message: ""
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
        ...formData,
        date: formData.date ? format(formData.date, "yyyy-MM-dd") : "",
        timestamp: new Date().toISOString(),
        status: "pending",
        source: "website_booking"
      };

      // Use absolute URL for external devices, relative for development
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '/api/appointments'
        : `${window.location.protocol}//${window.location.host}/api/appointments`;
        
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit appointment request");
      }

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
        message: ""
      });

      onClose();
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your appointment request. Please try again or contact me directly.",
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
                <Label className="text-white">Preferred Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                        !formData.date && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      disabled={isDateDisabled}
                      initialFocus
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-white">Preferred Time *</Label>
                <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <Clock className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="text-white hover:bg-white/10">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Label htmlFor="message" className="text-white">
                Special Requests & Location Details
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
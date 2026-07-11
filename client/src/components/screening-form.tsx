import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useHaptic } from "@/hooks/use-haptic";

interface ScreeningFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "contact" | "booking" | "details" | "done";

const DURATIONS = [
  "1 hour",
  "2 hours",
  "3 hours",
  "4 hours",
  "Overnight",
  "Full day",
  "Weekend",
  "Multi-day",
];

const LOCATIONS = [
  "Austin (incall)",
  "Austin (outcall)",
  "Dallas",
  "Houston",
  "San Antonio",
  "NYC",
  "LA",
  "Other city (specify in notes)",
];

export function ScreeningForm({ isOpen, onClose }: ScreeningFormProps) {
  const { toast } = useToast();
  const { triggerHaptic } = useHaptic();
  const [step, setStep] = useState<Step>("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [booking, setBooking] = useState({ date: "", duration: "", location: "", duo: false });
  const [details, setDetails] = useState({
    travel: false,
    arrivalAirport: "",
    hotelBooked: "",
    notes: "",
    interests: "",
  });

  const stepIndex = { contact: 0, booking: 1, details: 2, done: 3 }[step];
  const progress = Math.round((stepIndex / 3) * 100);

  const nextStep = () => {
    triggerHaptic("light");
    if (step === "contact") {
      if (!contact.name.trim() || !contact.email.trim()) {
        triggerHaptic("error");
        toast({ title: "Name and email are required", variant: "destructive" });
        return;
      }
      setStep("booking");
    } else if (step === "booking") {
      if (!booking.date.trim() || !booking.duration || !booking.location) {
        triggerHaptic("error");
        toast({ title: "Date, duration and location are required", variant: "destructive" });
        return;
      }
      setStep("details");
    }
  };

  const handleSubmit = async () => {
    triggerHaptic("medium");
    setIsSubmitting(true);

    try {
      const payload = {
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim() || null,
        date: booking.date.trim(),
        time: "TBD",
        duration: booking.duration,
        service: booking.duo ? "Duo Session (Bobby + Nick)" : "Companion Services",
        location: booking.location,
        duo: booking.duo,
        travel_request: details.travel,
        arrival_airport: details.arrivalAirport.trim() || null,
        hotel_booked: details.hotelBooked.trim() || null,
        notes: details.notes.trim() || null,
        interests_boundaries: details.interests.trim() || null,
        source: "website_screening_form",
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status}`);
      }

      triggerHaptic("success");
      setStep("done");
    } catch (err) {
      triggerHaptic("error");
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("contact");
    setContact({ name: "", email: "", phone: "" });
    setBooking({ date: "", duration: "", location: "", duo: false });
    setDetails({ travel: false, arrivalAirport: "", hotelBooked: "", notes: "", interests: "" });
    onClose();
  };

  const glassInput =
    "bg-white border border-[#3E5F44]/20 text-[#283A2C] placeholder-[#6B7362] focus:border-[#3E5F44] rounded-xl h-11 px-4 w-full text-sm outline-none transition-all";
  const glassTextarea =
    "bg-white border border-[#3E5F44]/20 text-[#283A2C] placeholder-[#6B7362] focus:border-[#3E5F44] rounded-xl px-4 py-3 w-full text-sm outline-none transition-all resize-none min-h-[90px]";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto border-0 p-0"
        style={{
          backgroundColor: "#FBF9F0",
          boxShadow: "0 30px 60px rgba(62,95,68,0.15)",
          border: "1px solid rgba(62,95,68,0.15)",
          borderRadius: "24px",
        }}
      >
        <div className="p-7">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-[#283A2C] text-xl font-semibold tracking-tight">
              {step === "done" ? "Request received" : "Request appointment"}
            </DialogTitle>
            {step !== "done" && (
              <div className="mt-4">
                <div className="flex gap-2">
                  {(["contact", "booking", "details"] as Step[]).map((s, i) => (
                    <div
                      key={s}
                      className="flex-1 h-0.5 rounded-full transition-all duration-500"
                      style={{
                        background: i <= stepIndex
                          ? "#3E5F44"
                          : "rgba(62,95,68,0.15)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[#6B7362] text-xs mt-2">
                  Step {stepIndex + 1} of 3
                </p>
              </div>
            )}
          </DialogHeader>

          {step === "contact" && (
            <div className="space-y-4">
              <div>
                <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">Name *</Label>
                <input
                  className={glassInput}
                  placeholder="Your name"
                  value={contact.name}
                  onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">Email *</Label>
                <input
                  type="email"
                  className={glassInput}
                  placeholder="your@email.com"
                  value={contact.email}
                  onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">
                  Phone <span className="normal-case text-[#6B7362]">(optional — for faster replies)</span>
                </Label>
                <input
                  type="tel"
                  className={glassInput}
                  placeholder="+1 (555) 123-4567"
                  value={contact.phone}
                  onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === "booking" && (
            <div className="space-y-4">
              <div>
                <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">Date *</Label>
                <input
                  type="date"
                  className={glassInput}
                  value={booking.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setBooking(b => ({ ...b, date: e.target.value }))}
                  style={{ colorScheme: "light" }}
                />
              </div>
              <div>
                <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">Duration *</Label>
                <Select value={booking.duration} onValueChange={v => setBooking(b => ({ ...b, duration: v }))}>
                  <SelectTrigger
                    className="bg-white border border-[#3E5F44]/20 text-[#283A2C] rounded-xl h-11 focus:border-[#3E5F44]"
                    style={{ background: "#ffffff" }}
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FBF9F0] border-[#3E5F44]/15 text-[#283A2C]">
                    {DURATIONS.map(d => (
                      <SelectItem key={d} value={d} className="focus:bg-[#EFE9D3]">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">Location *</Label>
                <Select value={booking.location} onValueChange={v => setBooking(b => ({ ...b, location: v }))}>
                  <SelectTrigger
                    className="bg-white border border-[#3E5F44]/20 text-[#283A2C] rounded-xl h-11 focus:border-[#3E5F44]"
                    style={{ background: "#ffffff" }}
                  >
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FBF9F0] border-[#3E5F44]/15 text-[#283A2C]">
                    {LOCATIONS.map(l => (
                      <SelectItem key={l} value={l} className="focus:bg-[#EFE9D3]">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setBooking(b => ({ ...b, duo: !b.duo }))}
                  className="w-full py-3 px-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between"
                  style={{
                    background: booking.duo ? "rgba(62,95,68,0.1)" : "#FBF9F0",
                    border: booking.duo ? "1px solid #3E5F44" : "1px solid rgba(62,95,68,0.15)",
                  }}
                >
                  <div>
                    <p className="text-[#283A2C] text-sm font-medium">Duo session with Nick</p>
                    <p className="text-[#6B7362] text-xs mt-0.5">Bobby + Nick together</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: booking.duo ? "#3E5F44" : "rgba(62,95,68,0.3)",
                      background: booking.duo ? "rgba(62,95,68,0.15)" : "transparent",
                    }}
                  >
                    {booking.duo && <div className="w-2 h-2 rounded-full bg-[#3E5F44]" />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              <div>
                <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">
                  Notes <span className="normal-case text-[#6B7362]">(tell me about yourself, what you're looking for)</span>
                </Label>
                <textarea
                  className={glassTextarea}
                  placeholder="Anything you'd like me to know before we connect..."
                  value={details.notes}
                  onChange={e => setDetails(d => ({ ...d, notes: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">
                  Interests / Limits <span className="normal-case text-[#6B7362]">(private, just for me)</span>
                </Label>
                <textarea
                  className={glassTextarea}
                  placeholder="What you're into, any hard limits, preferences..."
                  value={details.interests}
                  onChange={e => setDetails(d => ({ ...d, interests: e.target.value }))}
                />
              </div>
              <button
                type="button"
                onClick={() => setDetails(d => ({ ...d, travel: !d.travel }))}
                className="w-full py-3 px-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between"
                style={{
                  background: details.travel ? "rgba(62,95,68,0.1)" : "#FBF9F0",
                  border: details.travel ? "1px solid #3E5F44" : "1px solid rgba(62,95,68,0.15)",
                }}
              >
                <div>
                  <p className="text-[#283A2C] text-sm font-medium">Requesting travel</p>
                  <p className="text-[#6B7362] text-xs mt-0.5">I'll need to fly to you</p>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: details.travel ? "#3E5F44" : "rgba(62,95,68,0.3)",
                    background: details.travel ? "rgba(62,95,68,0.15)" : "transparent",
                  }}
                >
                  {details.travel && <div className="w-2 h-2 rounded-full bg-[#3E5F44]" />}
                </div>
              </button>
              {details.travel && (
                <div className="space-y-3 pl-4 border-l border-[#3E5F44]/15">
                  <div>
                    <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">Arrival airport</Label>
                    <input
                      className={glassInput}
                      placeholder="AUS, DFW, LAX..."
                      value={details.arrivalAirport}
                      onChange={e => setDetails(d => ({ ...d, arrivalAirport: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-[#6B7362] text-xs uppercase tracking-widest mb-2 block">Hotel booked?</Label>
                    <input
                      className={glassInput}
                      placeholder="Yes / No / Hotel name if booked"
                      value={details.hotelBooked}
                      onChange={e => setDetails(d => ({ ...d, hotelBooked: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(62,95,68,0.1)", border: "1px solid rgba(62,95,68,0.2)" }}
              >
                <span className="text-2xl text-[#3E5F44]">✓</span>
              </div>
              <p className="text-[#283A2C] text-base mb-2">Got it — I'll be in touch soon.</p>
              <p className="text-[#6B7362] text-sm">Usually within a few hours.</p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step !== "done" && step !== "contact" && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setStep(step === "details" ? "booking" : "contact");
                }}
                className="px-5 py-3 rounded-full text-[#3E5F44] text-sm transition-all bg-[#EFE9D3] hover:bg-[#E6DEC2]"
              >
                Back
              </button>
            )}
            {step === "done" ? (
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-full text-[#3E5F44] text-sm font-medium transition-all bg-[#EFE9D3] hover:bg-[#E6DEC2]"
              >
                Close
              </button>
            ) : step === "details" ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-full text-[#FBF9F0] text-sm font-medium transition-all disabled:opacity-50 bg-[#3E5F44] hover:bg-[#33503A]"
              >
                {isSubmitting ? "Sending..." : "Submit request"}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-3 rounded-full text-[#FBF9F0] text-sm font-medium transition-all bg-[#3E5F44] hover:bg-[#33503A]"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

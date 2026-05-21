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
    "bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-white/30 rounded-xl h-11 px-4 w-full text-sm outline-none transition-all";
  const glassTextarea =
    "bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-white/30 rounded-xl px-4 py-3 w-full text-sm outline-none transition-all resize-none min-h-[90px]";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto border-0 p-0"
        style={{
          background: "linear-gradient(135deg, rgba(15,15,20,0.97) 0%, rgba(10,10,15,0.99) 100%)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08), 0 30px 60px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
        }}
      >
        <div className="p-7">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-white text-xl font-semibold tracking-tight">
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
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-2">
                  Step {stepIndex + 1} of 3
                </p>
              </div>
            )}
          </DialogHeader>

          {step === "contact" && (
            <div className="space-y-4">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Name *</Label>
                <input
                  className={glassInput}
                  placeholder="Your name"
                  value={contact.name}
                  onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Email *</Label>
                <input
                  type="email"
                  className={glassInput}
                  placeholder="your@email.com"
                  value={contact.email}
                  onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
                  Phone <span className="normal-case text-white/30">(optional — for faster replies)</span>
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
                <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Date *</Label>
                <input
                  type="date"
                  className={glassInput}
                  value={booking.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setBooking(b => ({ ...b, date: e.target.value }))}
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Duration *</Label>
                <Select value={booking.duration} onValueChange={v => setBooking(b => ({ ...b, duration: v }))}>
                  <SelectTrigger
                    className="bg-white/5 border border-white/10 text-white rounded-xl h-11 focus:border-white/30"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    {DURATIONS.map(d => (
                      <SelectItem key={d} value={d} className="focus:bg-white/10">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Location *</Label>
                <Select value={booking.location} onValueChange={v => setBooking(b => ({ ...b, location: v }))}>
                  <SelectTrigger
                    className="bg-white/5 border border-white/10 text-white rounded-xl h-11 focus:border-white/30"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    {LOCATIONS.map(l => (
                      <SelectItem key={l} value={l} className="focus:bg-white/10">
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
                    background: booking.duo ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                    border: booking.duo ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div>
                    <p className="text-white/80 text-sm font-medium">Duo session with Nick</p>
                    <p className="text-white/30 text-xs mt-0.5">Bobby + Nick together</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: booking.duo ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                      background: booking.duo ? "rgba(255,255,255,0.15)" : "transparent",
                    }}
                  >
                    {booking.duo && <div className="w-2 h-2 rounded-full bg-white/80" />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
                  Notes <span className="normal-case text-white/30">(tell me about yourself, what you're looking for)</span>
                </Label>
                <textarea
                  className={glassTextarea}
                  placeholder="Anything you'd like me to know before we connect..."
                  value={details.notes}
                  onChange={e => setDetails(d => ({ ...d, notes: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
                  Interests / Limits <span className="normal-case text-white/30">(private, just for me)</span>
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
                  background: details.travel ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                  border: details.travel ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div>
                  <p className="text-white/80 text-sm font-medium">Requesting travel</p>
                  <p className="text-white/30 text-xs mt-0.5">I'll need to fly to you</p>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: details.travel ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                    background: details.travel ? "rgba(255,255,255,0.15)" : "transparent",
                  }}
                >
                  {details.travel && <div className="w-2 h-2 rounded-full bg-white/80" />}
                </div>
              </button>
              {details.travel && (
                <div className="space-y-3 pl-4 border-l border-white/10">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Arrival airport</Label>
                    <input
                      className={glassInput}
                      placeholder="AUS, DFW, LAX..."
                      value={details.arrivalAirport}
                      onChange={e => setDetails(d => ({ ...d, arrivalAirport: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Hotel booked?</Label>
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
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-white/80 text-base mb-2">Got it — I'll be in touch soon.</p>
              <p className="text-white/40 text-sm">Usually within a few hours.</p>
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
                className="px-5 py-3 rounded-xl text-white/50 text-sm transition-all hover:text-white/80"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Back
              </button>
            )}
            {step === "done" ? (
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                Close
              </button>
            ) : step === "details" ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                {isSubmitting ? "Sending..." : "Submit request"}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
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

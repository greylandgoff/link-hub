import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, MessageSquare, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in your name and message.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide either an email or phone number.",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Validation Error", 
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSendEmail = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast({
        title: "Success!",
        description: "Email sent successfully!",
      });
      
      setFormData({ name: "", email: "", phone: "", message: "" });
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendText = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send text");
      }

      toast({
        title: "Success!",
        description: "Text message sent successfully!",
      });
      
      setFormData({ name: "", email: "", phone: "", message: "" });
      onClose();
    } catch (error) {
      console.error("Error sending text:", error);
      toast({
        title: "Error",
        description: "Failed to send text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect bg-gray-900/95 border border-white/20 text-white max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Get In Touch</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Phone (optional)</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Message</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message..."
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSendEmail}
              disabled={isSubmitting}
              className="flex-1 glass-effect bg-transparent border border-white/20 hover:bg-white/10 font-medium"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button
              onClick={handleSendText}
              disabled={isSubmitting}
              className="flex-1 glass-effect bg-transparent border border-white/20 hover:bg-white/10 font-medium"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

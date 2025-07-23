import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
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
        title: "Fill Required Fields",
        description: "Please fill in your name and message to continue.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };



  const handleDirectText = () => {
    if (!validateForm()) return;
    
    const message = formData.message.trim() 
      ? `Hi Bobby! ${formData.name ? `This is ${formData.name}. ` : ''}${formData.message}`
      : `Hi Bobby! ${formData.name ? `This is ${formData.name}. ` : ''}I'd like to get in touch with you.`;
    
    const encodedMessage = encodeURIComponent(message);
    const smsUrl = `sms:+17372972747${window.navigator.userAgent.includes('iPhone') ? '&' : '?'}body=${encodedMessage}`;
    
    window.location.href = smsUrl;
    
    toast({
      title: "Opening Messages",
      description: "Your phone's messaging app should open with Bobby's number pre-filled.",
    });

    // Clear form and close modal
    setFormData({ name: "", message: "" });
    onClose();
  };

  const handleQuickText = () => {
    const smsUrl = `sms:+17372972747`;
    window.location.href = smsUrl;
    
    toast({
      title: "Opening Messages",
      description: "Your phone's messaging app should open with Bobby's number.",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect bg-gray-900/95 border border-white/20 text-white max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Get In Touch</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-gray-300 text-sm">
              Ready to connect? Choose your preferred way to reach Bobby.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleQuickText}
              className="w-full glass-effect bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30 font-medium text-purple-100 h-12"
            >
              <Phone className="w-5 h-5 mr-3" />
              Text Bobby: (737) 297-2747
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or compose a message</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Your Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Message</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="What would you like to tell Bobby?"
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50 resize-none"
                />
              </div>
              
              <Button
                onClick={handleDirectText}
                disabled={isSubmitting}
                className="w-full glass-effect bg-transparent border border-white/20 hover:bg-white/10 font-medium"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message via Text
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

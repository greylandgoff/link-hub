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
    const smsUrl = `sms:+18177918598${window.navigator.userAgent.includes('iPhone') ? '&' : '?'}body=${encodedMessage}`;
    
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
    const smsUrl = `sms:+18177918598`;
    window.location.href = smsUrl;
    
    toast({
      title: "Opening Messages",
      description: "Your phone's messaging app should open with Bobby's number.",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#FBF9F0] border border-[#3E5F44]/15 text-[#283A2C] max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#283A2C]">Get In Touch</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-[#6B7362] text-sm">
              Ready to connect? Choose your preferred way to reach Bobby.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleQuickText}
              className="w-full rounded-full bg-[#3E5F44] hover:bg-[#33503A] font-medium text-[#FBF9F0] h-12"
            >
              <Phone className="w-5 h-5 mr-3" />
              Text Bobby: (817) 791-8598
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#3E5F44]/15" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FBF9F0] px-2 text-[#6B7362]">Or compose a message</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[#6B7362] text-sm font-medium mb-2">Your Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="bg-white border-[#3E5F44]/20 text-[#283A2C] placeholder-[#6B7362] focus:border-[#3E5F44] focus:ring-[#3E5F44]/30"
                />
              </div>
              
              <div>
                <label className="block text-[#6B7362] text-sm font-medium mb-2">Message</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="What would you like to tell Bobby?"
                  rows={3}
                  className="bg-white border-[#3E5F44]/20 text-[#283A2C] placeholder-[#6B7362] focus:border-[#3E5F44] focus:ring-[#3E5F44]/30 resize-none"
                />
              </div>
              
              <Button
                onClick={handleDirectText}
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#EFE9D3] border-none text-[#3E5F44] hover:bg-[#E6DEC2] font-medium"
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

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface QuickChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickReplies = [
  "What are your rates?",
  "Are you available this weekend?",
  "Do you travel?",
  "What services do you offer?",
  "How do I book an appointment?"
];

export function QuickChat({ isOpen, onClose }: QuickChatProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: contact.includes('@') ? contact.trim() : undefined,
          phone: !contact.includes('@') ? contact.trim() : undefined,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.emailSent) {
        toast({
          title: "Message sent!",
          description: "I'll get back to you soon.",
        });
        setName("");
        setContact("");
        setMessage("");
        onClose();
      } else if (response.ok && !data.emailSent) {
        toast({
          title: "Couldn't deliver your message",
          description: "Email isn't configured right now. Please use the contact form or book an appointment.",
          variant: "destructive",
        });
      } else {
        throw new Error(data.message || 'Failed to send');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to send message';
      toast({
        title: "Message not sent",
        description: msg.includes('required')
          ? "Please fill in all fields."
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-20 z-50 w-80">
      <div className="bg-[#FBF9F0] border border-[#3E5F44]/15 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3E5F44]/15">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#3E5F44]" />
            <span className="text-[#283A2C] font-semibold">Quick Chat</span>
          </div>
          <Button
            onClick={onClose}
            className="p-1 h-auto bg-transparent hover:bg-[#EFE9D3] text-[#6B7362] hover:text-[#283A2C]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Replies */}
        <div className="px-4 pt-4 space-y-2">
          <p className="text-[#6B7362] text-sm mb-2">Quick questions:</p>
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="w-full text-left p-2 text-sm bg-[#EFE9D3] hover:bg-[#E6DEC2] rounded-lg text-[#283A2C] hover:text-[#283A2C] transition-colors border border-[#3E5F44]/15 hover:border-[#3E5F44]/30"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 border-t border-[#3E5F44]/15 mt-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="bg-white border-[#3E5F44]/20 text-[#283A2C] placeholder-[#6B7362] focus:border-[#3E5F44]"
            disabled={isSubmitting}
            required
          />
          <Input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or phone number"
            className="bg-white border-[#3E5F44]/20 text-[#283A2C] placeholder-[#6B7362] focus:border-[#3E5F44]"
            disabled={isSubmitting}
            required
          />
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              className="bg-white border-[#3E5F44]/20 text-[#283A2C] placeholder-[#6B7362] focus:border-[#3E5F44]"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={!name.trim() || !contact.trim() || !message.trim() || isSubmitting}
              className="px-3 rounded-full bg-[#3E5F44] text-[#FBF9F0] hover:bg-[#33503A] shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-[#6B7362]">I'll respond within a few hours</p>
        </form>
      </div>
    </div>
  );
}

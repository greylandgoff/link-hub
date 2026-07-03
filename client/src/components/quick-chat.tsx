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
      <div className="glass-effect bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">Quick Chat</span>
          </div>
          <Button
            onClick={onClose}
            className="p-1 h-auto bg-transparent hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Replies */}
        <div className="px-4 pt-4 space-y-2">
          <p className="text-gray-300 text-sm mb-2">Quick questions:</p>
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="w-full text-left p-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors border border-white/10 hover:border-purple-500/30"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 border-t border-white/10 mt-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
            disabled={isSubmitting}
            required
          />
          <Input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or phone number"
            className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
            disabled={isSubmitting}
            required
          />
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={!name.trim() || !contact.trim() || !message.trim() || isSubmitting}
              className="px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400">I'll respond within a few hours</p>
        </form>
      </div>
    </div>
  );
}

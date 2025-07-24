import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Check, X, Eye, EyeOff, Calendar, Users, Mail, Phone, Clock, MapPin, Search, Filter, Download } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  name: string;
  email: string;
  appearance: number;
  punctuality: number;
  communication: number;
  professionalism: number;
  chemistry: number;
  discretion: number;
  would_book_again: boolean;
  booking_process_smooth: boolean;
  matched_description: boolean;
  service_types: string[];
  additional_comments: string;
  is_approved: boolean;
  created_at: string;
}

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  duration: string;
  service_type: string;
  location: string;
  special_requests: string;
  status: string;
  source: string;
  created_at: string;
}

export default function Admin() {
  const { toast } = useToast();
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews"],
    queryFn: async () => {
      const response = await fetch("/api/admin/reviews");
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/admin/appointments"],
    queryFn: async () => {
      const response = await fetch("/api/admin/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      const response = await fetch(`/api/reviews/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!response.ok) throw new Error("Failed to update review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Success",
        description: "Review status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    },
  });

  const handleLogin = () => {
    // Simple password check - in production, use proper authentication
    if (adminPassword === "bobby2025admin") {
      setIsAuthenticated(true);
      toast({
        title: "Welcome",
        description: "Successfully logged in to admin panel",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'var(--pure-black)' }}>
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />

        {/* Login Form */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 
                className="text-4xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(255, 0, 255, 0.3))',
                }}
              >
                Admin Panel
              </h1>
              <p className="text-gray-300">Manage appointments and reviews</p>
            </div>

            <Card className="glass-effect bg-gray-900/95 border border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50"
                />
                <Button 
                  onClick={handleLogin}
                  className="w-full glass-effect bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/30 hover:from-purple-600/40 hover:to-pink-600/40 text-white font-medium"
                >
                  Access Admin Panel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (reviewsLoading || appointmentsLoading) {
    return (
      <div className="min-h-screen w-full relative" style={{ background: 'var(--pure-black)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-xl">Loading admin data...</div>
          </div>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments?.filter(appointment =>
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.phone.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredReviews = reviews?.filter(review =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen w-full relative" style={{ background: 'var(--pure-black)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10" />

      {/* Header */}
      <div className="relative z-10 glass-effect backdrop-blur-md border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 
                className="text-3xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(255, 0, 255, 0.3))',
                }}
              >
                Admin Dashboard
              </h1>
              <p className="text-gray-300">Manage appointments and reviews</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50"
                />
              </div>
              
              <Button
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="glass-effect bg-gray-900/50 border border-white/20">
            <TabsTrigger 
              value="appointments" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-pink-600/30 data-[state=active]:text-white text-gray-300"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Appointments ({appointments?.length || 0})
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-pink-600/30 data-[state=active]:text-white text-gray-300"
            >
              <Star className="w-4 h-4 mr-2" />
              Reviews ({reviews?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="glass-effect bg-gray-900/95 border border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          <h3 className="text-lg font-semibold text-white">{appointment.name}</h3>
                          <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/30">
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="w-3 h-3" />
                            {appointment.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone className="w-3 h-3" />
                            {appointment.phone}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="w-3 h-3" />
                            {appointment.appointment_date} at {appointment.appointment_time}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="w-3 h-3" />
                            {appointment.duration}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="w-3 h-3" />
                            {appointment.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {appointment.service_type}
                            </Badge>
                          </div>
                        </div>
                        
                        {appointment.special_requests && (
                          <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-gray-300 text-sm">
                              <span className="font-medium">Special Requests:</span> {appointment.special_requests}
                            </p>
                          </div>
                        )}
                        
                        <p className="text-gray-500 text-xs">
                          Submitted: {new Date(appointment.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="grid gap-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="glass-effect bg-gray-900/95 border border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{review.name}</h3>
                        <p className="text-gray-400 text-sm">{review.email}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          variant={review.is_approved ? "default" : "secondary"}
                          className={review.is_approved ? "bg-green-600" : "bg-gray-600"}
                        >
                          {review.is_approved ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                          {review.is_approved ? "Published" : "Hidden"}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate({ id: review.id, approved: !review.is_approved })}
                          className="glass-effect bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/30 hover:from-purple-600/40 hover:to-pink-600/40 text-white"
                        >
                          {review.is_approved ? "Hide" : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(review.id)}
                          className="bg-red-600/20 border-red-400/30 hover:bg-red-600/30"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Ratings Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {[
                        ["Appearance", review.appearance],
                        ["Punctuality", review.punctuality],
                        ["Communication", review.communication],
                        ["Professionalism", review.professionalism],
                        ["Chemistry", review.chemistry],
                        ["Discretion", review.discretion],
                      ].map(([label, rating]) => (
                        <div key={label} className="text-center">
                          <p className="text-gray-400 text-sm">{label}</p>
                          <div className="flex justify-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Number(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Service Types */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {review.service_types.map((service, idx) => (
                          <Badge key={idx} variant="outline" className="border-purple-500/30 text-purple-300">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Comments */}
                    {review.additional_comments && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium">Comments:</span> {review.additional_comments}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
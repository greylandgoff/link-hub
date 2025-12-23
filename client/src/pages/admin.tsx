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
  wouldBookAgain: boolean;
  bookingProcessSmooth: boolean;
  matchedDescription: boolean;
  serviceTypes: string[];
  additionalComments: string;
  isApproved: boolean;
  createdAt: string;
}

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  serviceType: string;
  location: string;
  specialRequests: string;
  notes: string;
  travelRequest: boolean;
  arrivalAirport: string;
  hotelBooked: string;
  interestsBoundaries: string;
  status: string;
  source: string;
  createdAt: string;
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
      const response = await fetch(`/api/admin/reviews/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!response.ok) throw new Error("Failed to update review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
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
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
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
      <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-amber-50 via-stone-100 to-orange-100">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-amber-300/40 to-orange-300/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-amber-200/20" />

        {/* Login Form */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 
                className="text-4xl font-bold mb-2 text-stone-800"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Admin Panel
              </h1>
              <p className="text-stone-600">Manage appointments and reviews</p>
            </div>

            <Card className="bg-white/80 border border-stone-200/50 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6 space-y-4">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-white/80 border-stone-300 text-stone-800 placeholder-stone-500 focus:border-amber-500 focus:ring-amber-500/30"
                />
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium shadow-md"
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
      <div className="min-h-screen w-full relative bg-gradient-to-br from-amber-50 via-stone-100 to-orange-100">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-amber-200/20" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-stone-700 text-xl">Loading admin data...</div>
          </div>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments?.filter(appointment =>
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (appointment.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredReviews = reviews?.filter(review =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-amber-50 via-stone-100 to-orange-100">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-amber-100/20" />

      {/* Header */}
      <div className="relative z-10 bg-white/60 backdrop-blur-md border-b border-stone-200/50 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 
                className="text-3xl font-bold mb-2 text-stone-800"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Admin Dashboard
              </h1>
              <p className="text-stone-600">Manage appointments and reviews</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-stone-300 text-stone-800 placeholder-stone-500 focus:border-amber-500 focus:ring-amber-500/30"
                />
              </div>
              
              <Button
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
                className="border-stone-300 text-stone-700 hover:bg-stone-100 bg-white/80"
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
          <TabsList className="bg-white/70 border border-stone-200/50 shadow-sm backdrop-blur-sm">
            <TabsTrigger 
              value="appointments" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white text-stone-700 data-[state=active]:shadow-md"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Appointments ({appointments?.length || 0})
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white text-stone-700 data-[state=active]:shadow-md"
            >
              <Star className="w-4 h-4 mr-2" />
              Reviews ({reviews?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white/80 border border-stone-200/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-amber-600" />
                          <h3 className="text-lg font-semibold text-stone-800">{appointment.name}</h3>
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-stone-600">
                            <Mail className="w-3 h-3 text-amber-600" />
                            {appointment.email}
                          </div>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Phone className="w-3 h-3 text-amber-600" />
                            {appointment.phone}
                          </div>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Calendar className="w-3 h-3 text-amber-600" />
                            {appointment.appointmentDate} at {appointment.appointmentTime}
                          </div>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {appointment.duration}
                          </div>
                          <div className="flex items-center gap-2 text-stone-600">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            {appointment.location}
                          </div>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Badge variant="outline" className="border-stone-300 text-stone-700 bg-white/50">
                              {appointment.serviceType}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Separate field snippets for screening data */}
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {appointment.notes && (
                            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/50">
                              <p className="text-stone-700 text-sm">
                                <span className="font-medium text-blue-700">Notes:</span><br/>
                                {appointment.notes}
                              </p>
                            </div>
                          )}
                          
                          {appointment.travelRequest && (
                            <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200/50">
                              <p className="text-stone-700 text-sm">
                                <span className="font-medium text-purple-700">Travel Request:</span> Yes
                                {appointment.arrivalAirport && (
                                  <><br/>Airport: {appointment.arrivalAirport}</>
                                )}
                                {appointment.hotelBooked && (
                                  <><br/>Hotel: {appointment.hotelBooked}</>
                                )}
                              </p>
                            </div>
                          )}
                          
                          {appointment.interestsBoundaries && (
                            <div className="p-3 bg-pink-50/50 rounded-lg border border-pink-200/50">
                              <p className="text-stone-700 text-sm">
                                <span className="font-medium text-pink-700">Interests/Boundaries:</span><br/>
                                {appointment.interestsBoundaries}
                              </p>
                            </div>
                          )}
                          
                          {appointment.specialRequests && (
                            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/50">
                              <p className="text-stone-700 text-sm">
                                <span className="font-medium text-amber-700">Special Requests:</span><br/>
                                {appointment.specialRequests}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-stone-500 text-xs">
                          Submitted: {new Date(appointment.createdAt).toLocaleString()}
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
                <Card key={review.id} className="bg-white/80 border border-stone-200/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-stone-800">{review.name}</h3>
                        <p className="text-stone-600 text-sm">{review.email}</p>
                        <p className="text-stone-500 text-xs">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          variant={review.isApproved ? "default" : "secondary"}
                          className={review.isApproved ? "bg-green-100 text-green-800 border-green-200" : "bg-stone-100 text-stone-600 border-stone-200"}
                        >
                          {review.isApproved ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                          {review.isApproved ? "Published" : "Hidden"}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate({ id: review.id, approved: !review.isApproved })}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                        >
                          {review.isApproved ? "Hide" : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(review.id)}
                          className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
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
                        <div key={label} className="text-center p-2 bg-amber-50/50 rounded-lg border border-amber-200/30">
                          <p className="text-stone-600 text-sm font-medium">{label}</p>
                          <div className="flex justify-center mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Number(rating) ? "fill-amber-400 text-amber-400" : "text-stone-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Service Types */}
                    <div className="mb-4">
                      <p className="text-stone-600 text-sm mb-2 font-medium">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {review.serviceTypes?.map((service: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Comments */}
                    {review.additionalComments && (
                      <div className="p-3 bg-stone-50/80 rounded-lg border border-stone-200/50">
                        <p className="text-stone-700 text-sm">
                          <span className="font-medium">Comments:</span> {review.additionalComments}
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
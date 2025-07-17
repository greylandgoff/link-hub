import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Eye, EyeOff } from "lucide-react";
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

export default function Admin() {
  const { toast } = useToast();
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", "admin"],
    queryFn: async () => {
      const response = await fetch("/api/reviews?admin=true");
      if (!response.ok) throw new Error("Failed to fetch reviews");
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-purple-500/20 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-white">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-2 bg-black/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <Button 
              onClick={handleLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Review Management</h1>
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-purple-500/30 text-white hover:bg-purple-500/20"
          >
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          {reviews?.map((review) => (
            <Card key={review.id} className="bg-black/40 border-purple-500/20 backdrop-blur-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{review.name}</CardTitle>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ratings */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Boolean checks */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">Would Book Again</p>
                    {review.would_book_again ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Smooth Booking</p>
                    {review.booking_process_smooth ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Matched Description</p>
                    {review.matched_description ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </div>
                </div>

                {/* Service types */}
                <div>
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
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Comments:</p>
                    <p className="text-white bg-black/20 p-3 rounded-lg">
                      {review.additional_comments}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-purple-500/20">
                  <Button
                    onClick={() => approveMutation.mutate({ 
                      id: review.id, 
                      approved: !review.is_approved 
                    })}
                    disabled={approveMutation.isPending}
                    className={`${
                      review.is_approved 
                        ? "bg-gray-600 hover:bg-gray-700" 
                        : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {review.is_approved ? "Hide" : "Publish"}
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(review.id)}
                    disabled={deleteMutation.isPending}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reviews?.length === 0 && (
          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-lg">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No reviews found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
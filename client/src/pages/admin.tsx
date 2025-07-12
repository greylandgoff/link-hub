import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Trash2, Eye, EyeOff, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
  additionalComments: string | null;
  isApproved: boolean;
  createdAt: string;
}

export default function Admin() {
  const [showApproved, setShowApproved] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Check if already authenticated on mount
  useEffect(() => {
    const authToken = sessionStorage.getItem('admin_auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', 'authenticated');
        setUsername("");
        setPassword("");
      } else {
        setAuthError("Invalid credentials");
      }
    } catch (error) {
      setAuthError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  // Fetch reviews only when authenticated
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/admin/reviews"],
    queryFn: async () => {
      const response = await fetch("/api/admin/reviews");
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const approveMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest("POST", "/api/admin/reviews/approve", { reviewId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest("POST", "/api/admin/reviews/reject", { reviewId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest("DELETE", "/api/admin/reviews/delete", { reviewId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
  });

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
            <CardTitle className="text-white">Admin Access</CardTitle>
            <p className="text-gray-400 text-sm">Please login to access the review dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              {authError && (
                <p className="text-red-400 text-sm">{authError}</p>
              )}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredReviews = reviews.filter((review: Review) => 
    showApproved ? review.isApproved : !review.isApproved
  );

  const pendingCount = reviews.filter((r: Review) => !r.isApproved).length;
  const approvedCount = reviews.filter((r: Review) => r.isApproved).length;

  if (reviewsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Review Management</h1>
            <p className="text-gray-400">Manage client reviews and testimonials</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">{reviews.length}</div>
              <div className="text-gray-400">Total Reviews</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-400">{approvedCount}</div>
              <div className="text-gray-400">Approved</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
              <div className="text-gray-400">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Toggle View */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setShowApproved(false)}
            variant={!showApproved ? "default" : "outline"}
            className={!showApproved ? 
              "bg-orange-600 hover:bg-orange-700 text-white border-orange-600" : 
              "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
            }
          >
            🟠 Pending Reviews ({pendingCount})
          </Button>
          <Button
            onClick={() => setShowApproved(true)}
            variant={showApproved ? "default" : "outline"}
            className={showApproved ? 
              "bg-green-600 hover:bg-green-700 text-white border-green-600" : 
              "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            }
          >
            ✅ Approved Reviews ({approvedCount})
          </Button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">
                  {showApproved ? "No approved reviews found." : "No pending reviews found."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review: Review) => (
              <Card key={review.id} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{review.name}</CardTitle>
                      <p className="text-gray-400 text-sm">{review.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={review.isApproved ? "default" : "secondary"}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                      <span className="text-gray-500 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Rating breakdown */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Appearance:</span>
                      <span className="text-yellow-400">{"★".repeat(review.appearance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Punctuality:</span>
                      <span className="text-yellow-400">{"★".repeat(review.punctuality)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Communication:</span>
                      <span className="text-yellow-400">{"★".repeat(review.communication)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Professionalism:</span>
                      <span className="text-yellow-400">{"★".repeat(review.professionalism)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chemistry:</span>
                      <span className="text-yellow-400">{"★".repeat(review.chemistry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discretion:</span>
                      <span className="text-yellow-400">{"★".repeat(review.discretion)}</span>
                    </div>
                  </div>

                  <Separator className="my-4 bg-gray-700" />

                  {/* Yes/No questions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Would book again:</span>
                      <span className={review.wouldBookAgain ? "text-green-400" : "text-red-400"}>
                        {review.wouldBookAgain ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Process smooth:</span>
                      <span className={review.bookingProcessSmooth ? "text-green-400" : "text-red-400"}>
                        {review.bookingProcessSmooth ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Matched description:</span>
                      <span className={review.matchedDescription ? "text-green-400" : "text-red-400"}>
                        {review.matchedDescription ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4 bg-gray-700" />

                  {/* Service types */}
                  <div className="mb-4">
                    <span className="text-gray-400 text-sm">Service Types: </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {review.serviceTypes.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  {review.additionalComments && (
                    <div className="mb-4">
                      <span className="text-gray-400 text-sm">Comments:</span>
                      <p className="text-gray-300 mt-1 italic">"{review.additionalComments}"</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-4">
                    {!review.isApproved && (
                      <Button
                        onClick={() => approveMutation.mutate(review.id)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={approveMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    {review.isApproved && (
                      <Button
                        onClick={() => rejectMutation.mutate(review.id)}
                        variant="outline"
                        className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                        disabled={rejectMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Unapprove
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteMutation.mutate(review.id)}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
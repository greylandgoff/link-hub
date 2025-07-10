import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Trash2, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Review {
  id: number;
  name: string;
  email: string;
  rating: number;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export default function Admin() {
  const [showApproved, setShowApproved] = useState(true);
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/admin/reviews"],
    queryFn: async () => {
      const response = await fetch("/api/admin/reviews");
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest("/api/admin/reviews/approve", "POST", { reviewId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest("/api/admin/reviews/reject", "POST", { reviewId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest("/api/admin/reviews/delete", "DELETE", { reviewId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
  });

  const filteredReviews = reviews.filter((review: Review) => 
    showApproved ? review.is_approved : !review.is_approved
  );

  const pendingCount = reviews.filter((r: Review) => !r.is_approved).length;
  const approvedCount = reviews.filter((r: Review) => r.is_approved).length;

  if (isLoading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Review Management</h1>
          <p className="text-gray-400">Manage client reviews and testimonials</p>
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

        {/* Filter Toggle */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setShowApproved(true)}
            variant={showApproved ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Show Approved ({approvedCount})
          </Button>
          <Button
            onClick={() => setShowApproved(false)}
            variant={!showApproved ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <EyeOff className="w-4 h-4" />
            Show Pending ({pendingCount})
          </Button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">
                  {showApproved ? "No approved reviews yet" : "No pending reviews"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review: Review) => (
              <Card key={review.id} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{review.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={review.is_approved ? "default" : "secondary"}>
                        {review.is_approved ? "Approved" : "Pending"}
                      </Badge>
                      <div className="flex text-yellow-400">
                        {"★".repeat(review.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {review.email} • {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 italic">"{review.message}"</p>
                  
                  <Separator className="my-4 bg-gray-800" />
                  
                  <div className="flex gap-2">
                    {!review.is_approved && (
                      <Button
                        onClick={() => approveMutation.mutate(review.id)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    
                    {review.is_approved && (
                      <Button
                        onClick={() => rejectMutation.mutate(review.id)}
                        disabled={rejectMutation.isPending}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Unapprove
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this review?")) {
                          deleteMutation.mutate(review.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
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
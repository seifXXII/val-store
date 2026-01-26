"use client";

/**
 * Admin Reviews Page
 *
 * Moderate customer reviews - approve, reject, delete.
 */

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Check, X, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: Date | string;
  userName: string | null;
}

function ReviewTable({
  reviews,
  showApproved,
  onApprove,
  onReject,
  onDelete,
}: {
  reviews: ReviewItem[];
  showApproved: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rating</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            {showApproved && <TableHead>Status</TableHead>}
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={showApproved ? 6 : 5}
                className="text-center py-8 text-muted-foreground"
              >
                No reviews found
              </TableCell>
            </TableRow>
          )}
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <StarRating rating={review.rating} />
              </TableCell>
              <TableCell>
                <div className="max-w-md">
                  {review.title && (
                    <p className="font-medium text-sm">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {review.comment}
                    </p>
                  )}
                  {review.isVerifiedPurchase && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {review.userName ?? "Anonymous"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(review.createdAt), "MMM d, yyyy")}
              </TableCell>
              {showApproved && (
                <TableCell>
                  <Badge variant={review.isApproved ? "default" : "secondary"}>
                    {review.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
              )}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!review.isApproved && (
                      <DropdownMenuItem onClick={() => onApprove(review.id)}>
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                    )}
                    {review.isApproved && (
                      <DropdownMenuItem onClick={() => onReject(review.id)}>
                        <X className="h-4 w-4 mr-2" />
                        Unapprove
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminReviewsPage() {
  const { data: allReviews = [], isLoading } = trpc.admin.reviews.list.useQuery(
    {}
  );
  const { data: pendingReviews = [] } = trpc.admin.reviews.list.useQuery({
    onlyPending: true,
  });

  const utils = trpc.useUtils();

  const approveMutation = trpc.admin.reviews.approve.useMutation({
    onSuccess: () => {
      utils.admin.reviews.list.invalidate();
      toast.success("Review approved");
    },
    onError: (err) => toast.error(err.message),
  });

  const rejectMutation = trpc.admin.reviews.reject.useMutation({
    onSuccess: () => {
      utils.admin.reviews.list.invalidate();
      toast.success("Review rejected");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.reviews.delete.useMutation({
    onSuccess: () => {
      utils.admin.reviews.list.invalidate();
      toast.success("Review deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleApprove = (id: string) => approveMutation.mutate({ id });
  const handleReject = (id: string) => rejectMutation.mutate({ id });
  const handleDelete = (id: string) => deleteMutation.mutate({ id });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        {pendingReviews.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {pendingReviews.length} pending approval
          </Badge>
        )}
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Reviews ({allReviews.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <ReviewTable
            reviews={pendingReviews}
            showApproved={false}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="all">
          <ReviewTable
            reviews={allReviews}
            showApproved={true}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

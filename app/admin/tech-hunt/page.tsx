"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/adminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Trophy,
  Loader2,
  User,
  Key,
  Award,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface TechHuntResult {
  _id: string;
  name: string;
  email: string;
  teamName: string;
  level: number;
  key: string;
  level1Key: string;
  level2Key?: string;
  level3Key?: string;
  submittedAt: string;
  level1Time?: string;
  level2Time?: string;
  level3Time?: string;
}

export default function AdminTechHuntPage() {
  const [results, setResults] = useState<TechHuntResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<TechHuntResult | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/tech-hunt", {
        credentials: "include",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch results");
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(
    (result) =>
      result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLevelBadge = (level: number) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-yellow-100 text-yellow-700",
      "bg-green-100 text-green-700",
    ];

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide ${colors[level - 1]}`}
      >
        Level {level}
      </span>
    );
  };

  const viewDetails = (result: TechHuntResult) => {
    setSelectedResult(result);
    setDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/tech-hunt?id=${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete user");
      }

      setResults(results.filter((r) => r._id !== deletingId));

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="container mx-auto px-4 pt-16 md:pt-28 pb-6">
        <div className="flex flex-col gap-2 mt-16 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Tech Hunt Results
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            View and manage participants and their progress.
          </p>
        </div>

        <Card className="shadow-sm rounded-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search name, email, team, key..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-3 text-xs md:text-sm text-gray-500 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Level 1
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  Level 2
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  Level 3
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col justify-center items-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="text-gray-500 text-sm mt-2">Loading results...</p>
              </div>
            ) : (
              <>
                {/* Mobile View → Card List */}
                <div className="grid md:hidden gap-4">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((result) => (
                      <div
                        key={result._id}
                        className="p-4 bg-white rounded-lg shadow-sm border space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">
                            {result.name}
                          </h3>
                          {renderLevelBadge(result.level)}
                        </div>

                        <p className="text-sm text-gray-600">
                          Team: {result.teamName}
                        </p>
                        <p className="text-sm text-gray-600">{result.email}</p>

                        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                          Key:{" "}
                          {
                            result[
                              `level${result.level}Key` as keyof TechHuntResult
                            ]
                          }
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(result)}
                          >
                            View
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete(result._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No results found.
                    </p>
                  )}
                </div>

                {/* Desktop View → Table */}
                <div className="hidden md:block rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white shadow-sm">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredResults.length > 0 ? (
                        filteredResults.map((result) => (
                          <TableRow key={result._id}>
                            <TableCell className="font-medium">
                              {result.name}
                            </TableCell>
                            <TableCell>{result.teamName}</TableCell>
                            <TableCell>{result.email}</TableCell>
                            <TableCell>
                              {renderLevelBadge(result.level)}
                            </TableCell>
                            <TableCell className="font-mono">
                              {
                                result[
                                  `level${result.level}Key` as keyof TechHuntResult
                                ]
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewDetails(result)}
                                className="mr-2"
                              >
                                View
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => confirmDelete(result._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-gray-500"
                          >
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedResult && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle>{selectedResult.name}</DialogTitle>
                    <DialogDescription>
                      {selectedResult.email} • {selectedResult.teamName}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Level</Label>
                    {renderLevelBadge(selectedResult.level)}
                  </div>
                  <div>
                    <Label>Unique Key</Label>
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-500" />
                      <span className="font-mono px-2 py-1 bg-gray-100 rounded">
                        {selectedResult.key}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Level Keys</Label>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-500" />
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedResult.level1Key}
                      </span>
                    </div>

                    {selectedResult.level2Key && (
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-gray-500" />
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {selectedResult.level2Key}
                        </span>
                      </div>
                    )}

                    {selectedResult.level3Key && (
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-gray-500" />
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {selectedResult.level3Key}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

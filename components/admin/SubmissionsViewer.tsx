"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, Download, Eye, Trash2 } from "lucide-react";
import { toIndianDateString, toIndianDateTimeString } from "@/lib/formatDate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Submission {
  _id: string;
  registrationSlug: string;
  data: { [key: string]: unknown };
  submittedAt: string;
  metadata: {
    emailVerified: boolean;
  };
}

interface RegistrationTemplate {
  slug: string;
  fields: Array<{
    key: string;
    label: string;
  }>;
}

export default function RegistrationSubmissionsViewer() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterForm, setFilterForm] = useState<string>("all");
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(
    null
  );
  const [formSlugs, setFormSlugs] = useState<string[]>([]);
  const [templates, setTemplates] = useState<RegistrationTemplate[]>([]);

  useEffect(() => {
    fetchSubmissions();
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/registration-templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/registration-submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);

        // Extract unique form slugs
        const slugs = [
          ...new Set(data.map((s: Submission) => s.registrationSlug)),
        ] as string[];
        setFormSlugs(slugs);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const response = await fetch(
        `/api/admin/registration-submissions?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSubmissions(submissions.filter((s) => s._id !== id));
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete submission");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission");
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredSubmissions();
    if (filtered.length === 0) return;

    // Get field labels from template
    const getFieldLabel = (key: string, slug: string): string => {
      const template = templates.find((t) => t.slug === slug);
      if (template) {
        const field = template.fields.find((f) => f.key === key);
        if (field) return field.label;
      }
      return key; // fallback to key if label not found
    };

    // Get all unique keys from submissions
    const allKeys = new Set<string>();
    filtered.forEach((sub) => {
      Object.keys(sub.data).forEach((key) => allKeys.add(key));
    });

    // Use labels for headers
    const headers = [
      "Submission ID",
      "Form",
      "Submitted At",
      ...Array.from(allKeys).map((key) => {
        // Get label from the first submission's template
        const firstSlug = filtered[0]?.registrationSlug;
        return getFieldLabel(key, firstSlug);
      }),
    ];

    const rows = filtered.map((sub) => [
      sub._id,
      sub.registrationSlug,
      toIndianDateTimeString(sub.submittedAt),
      ...Array.from(allKeys).map((key) => {
        const value = sub.data[key];
        return Array.isArray(value) ? value.join(", ") : value || "";
      }),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registration-submissions-${filterForm}-${toIndianDateTimeString(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredSubmissions = () => {
    return submissions.filter((sub) => {
      if (filterForm !== "all" && sub.registrationSlug !== filterForm)
        return false;
      return true;
    });
  };

  const filtered = getFilteredSubmissions();

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Registration Submissions</CardTitle>
            <Button onClick={exportToCSV} disabled={filtered.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={filterForm} onValueChange={setFilterForm}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                {formSlugs.map((slug) => (
                  <SelectItem key={slug} value={slug}>
                    {slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No submissions found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((submission) => (
                    <TableRow key={submission._id}>
                      <TableCell className="font-medium">
                        {submission.registrationSlug}
                      </TableCell>
                      <TableCell>{String(submission.data.name ?? "-")}</TableCell>
                      <TableCell>{String(submission.data.email ?? "-")}</TableCell>
                      <TableCell>{String(submission.data.phone ?? "-")}</TableCell>
                      <TableCell>
                        {toIndianDateString(submission.submittedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewingSubmission(submission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSubmission(submission._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!viewingSubmission}
        onOpenChange={() => setViewingSubmission(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {viewingSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Registration Form
                  </p>
                  <p className="text-sm">
                    {viewingSubmission.registrationSlug}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Submitted At
                  </p>
                  <p className="text-sm">
                    {toIndianDateTimeString(viewingSubmission.submittedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Verified
                  </p>
                  <p className="text-sm">
                    {viewingSubmission.metadata.emailVerified ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Form Data</h4>
                <div className="space-y-3">
                  {Object.entries(viewingSubmission.data).map(
                    ([key, value]) => (
                      <div key={key}>
                        <p className="text-sm font-medium text-gray-500 capitalize">
                          {key}
                        </p>
                        <p className="text-sm">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

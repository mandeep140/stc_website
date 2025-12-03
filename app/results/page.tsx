"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Trophy,
  Medal,
  Award,
  Search,
  Filter,
  Mail,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompetitionResult {
  _id: string;
  name: string;
  collegeMail: string;
  rollNo: string;
  competitionName: string;
  club: string;
  rank: number;
  createdAt: string;
  uploadedBy: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<CompetitionResult[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState<string>("all");
  const [selectedCompetition, setSelectedCompetition] = useState<string>("all");

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchQuery, selectedClub, selectedCompetition, results]);

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/admin/competitions");
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setFilteredResults(data);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = () => {
    let filtered = [...results];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (result) =>
          result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.competitionName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          result.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Club filter
    if (selectedClub !== "all") {
      filtered = filtered.filter((result) => result.club === selectedClub);
    }

    // Competition filter
    if (selectedCompetition !== "all") {
      filtered = filtered.filter(
        (result) => result.competitionName === selectedCompetition
      );
    }

    setFilteredResults(filtered);
  };

  const getAvailableClubs = () => {
    const clubs = results.map((result) => result.club);
    return [...new Set(clubs)].sort();
  };

  const getAvailableCompetitions = () => {
    const competitions = results.map((result) => result.competitionName);
    return [...new Set(competitions)].sort();
  };

  // Group results by competition
  const groupedResults = filteredResults.reduce(
    (acc, result) => {
      if (!acc[result.competitionName]) {
        acc[result.competitionName] = [];
      }
      acc[result.competitionName].push(result);
      return acc;
    },
    {} as Record<string, CompetitionResult[]>
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
    }
  };

  const getRankBadge = (rank: number) => {
    const badges = {
      1: {
        label: "1st Place",
        color: "bg-yellow-500 hover:bg-yellow-600 text-white",
      },
      2: {
        label: "2nd Place",
        color: "bg-gray-400 hover:bg-gray-500 text-white",
      },
      3: {
        label: "3rd Place",
        color: "bg-amber-600 hover:bg-amber-700 text-white",
      },
    };
    return (
      badges[rank as keyof typeof badges] || {
        label: `Rank ${rank}`,
        color: "bg-blue-500 hover:bg-blue-600 text-white",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-24">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a4b8c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-28 pb-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0f2a4d] to-[#1a4b8c] rounded-full mb-4 sm:mb-6 shadow-lg">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f2a4d] mb-3 sm:mb-4">
            Competition Results
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Results of all competitions conducted under STC IITP hybrid
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-8 space-y-3 max-w-5xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, competition, or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 sm:h-12 border-2 border-gray-200 focus:border-[#1a4b8c] text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger className="h-11 sm:h-12 border-2 border-gray-200 text-sm sm:text-base flex-1">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Clubs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clubs</SelectItem>
                {getAvailableClubs().map((club) => (
                  <SelectItem key={club} value={club}>
                    {club}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCompetition}
              onValueChange={setSelectedCompetition}
            >
              <SelectTrigger className="h-11 sm:h-12 border-2 border-gray-200 text-sm sm:text-base flex-2">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Competitions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitions</SelectItem>
                {getAvailableCompetitions().map((comp) => (
                  <SelectItem key={comp} value={comp}>
                    {comp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery ||
              selectedClub !== "all" ||
              selectedCompetition !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedClub("all");
                  setSelectedCompetition("all");
                }}
                className="border-2 h-11 sm:h-12 px-4 sm:px-6"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {filteredResults.length > 0 && (
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-gray-600">
              Showing{" "}
              <span className="font-semibold text-[#1a4b8c]">
                {filteredResults.length}
              </span>{" "}
              {filteredResults.length === 1 ? "result" : "results"}
              {Object.keys(groupedResults).length > 0 && (
                <>
                  {" "}
                  across{" "}
                  <span className="font-semibold text-[#1a4b8c]">
                    {Object.keys(groupedResults).length}
                  </span>{" "}
                  {Object.keys(groupedResults).length === 1
                    ? "competition"
                    : "competitions"}
                </>
              )}
            </p>
          </div>
        )}

        {/* No Results */}
        {filteredResults.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 sm:py-16 text-center">
              <Trophy className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
                No Results Found
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                {searchQuery ||
                selectedClub !== "all" ||
                selectedCompetition !== "all"
                  ? "Try adjusting your search or filters"
                  : "No competition results available yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Competition Results by Competition Name */
          <div className="space-y-8 sm:space-y-10">
            {Object.entries(groupedResults)
              .sort(
                ([, a], [, b]) =>
                  new Date(b[0].createdAt).getTime() -
                  new Date(a[0].createdAt).getTime()
              )
              .map(([competitionName, competitionResults]) => {
                // Sort results by rank
                const sortedResults = [...competitionResults].sort(
                  (a, b) => a.rank - b.rank
                );
                const firstResult = sortedResults[0];

                return (
                  <Card
                    key={competitionName}
                    className={`overflow-hidden shadow-xl border-2 transition-all duration-300`}
                  >
                    <CardHeader className="bg-gradient-to-r from-[#0f2a4d] to-[#1a4b8c] text-white p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                            {competitionName}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-blue-100">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-4 h-4" />
                              <span>{firstResult.club}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Trophy className="w-4 h-4" />
                              <span>
                                {sortedResults.length}{" "}
                                {sortedResults.length === 1
                                  ? "Winner"
                                  : "Winners"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        {sortedResults.map((result) => {
                          const badge = getRankBadge(result.rank);
                          return (
                            <div
                              key={result._id}
                              className="group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-[#1a4b8c] hover:shadow-lg transition-all duration-300"
                            >
                              {/* Rank Icon */}
                              <div className="flex-shrink-0 flex items-center justify-center">
                                {getRankIcon(result.rank)}
                              </div>

                              {/* Winner Details */}
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <h3 className="font-bold text-[#0f2a4d] text-base sm:text-lg truncate">
                                    {result.name}
                                  </h3>
                                  <Badge
                                    className={`${badge.color} text-xs sm:text-sm w-fit`}
                                  >
                                    {badge.label}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
                                  <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a4b8c]" />
                                    <span className="truncate">
                                      {result.collegeMail}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-[#1a4b8c]">
                                      Roll No:
                                    </span>
                                    <span className="font-mono">
                                      {result.rollNo}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Position Number (for top 3) */}
                              {result.rank <= 3 && (
                                <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 group-hover:scale-110 transition-transform">
                                  <span className="text-xl font-bold text-gray-600">
                                    #{result.rank}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

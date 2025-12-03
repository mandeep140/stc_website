"use client"

import { useState, useEffect } from 'react'
import AdminNav from '@/components/adminNav'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trophy, Edit, Trash2, Loader2, Medal, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CompetitionResult {
  _id: string
  name: string
  collegeMail: string
  rollNo: string
  competitionName: string
  club: string
  rank: number
  uploadedBy: string
  createdAt: string
}

export default function AdminCompetitionsPage() {
  const [results, setResults] = useState<CompetitionResult[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingResult, setEditingResult] = useState<CompetitionResult | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    collegeMail: '',
    rollNo: '',
    competitionName: '',
    club: '',
    rank: '',
    uploadedBy: '',
  })

  useEffect(() => {
    fetchResults()
  },)

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/admin/competitions')
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      toast({
        title: "Error",
        description: "Failed to fetch competition results",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const resultData = {
        ...formData,
        rank: parseInt(formData.rank),
      }

      const response = editingResult
        ? await fetch('/api/admin/competitions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingResult._id, ...resultData }),
          })
        : await fetch('/api/admin/competitions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resultData),
          })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Competition result ${editingResult ? 'updated' : 'added'} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchResults()
      } else {
        throw new Error('Failed to save result')
      }
    } catch (error) {
      console.error('Error saving result:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingResult ? 'update' : 'add'} competition result`,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (result: CompetitionResult) => {
    if (!confirm('Are you sure you want to delete this competition result?')) return

    try {
      const response = await fetch(`/api/admin/competitions?id=${result._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Competition result deleted successfully",
        })
        fetchResults()
      } else {
        throw new Error('Failed to delete result')
      }
    } catch (error) {
      console.error('Error deleting result:', error)
      toast({
        title: "Error",
        description: "Failed to delete competition result",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (result: CompetitionResult) => {
    setEditingResult(result)
    setFormData({
      name: result.name,
      collegeMail: result.collegeMail,
      rollNo: result.rollNo,
      competitionName: result.competitionName,
      club: result.club,
      rank: result.rank.toString(),
      uploadedBy: result.uploadedBy,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      collegeMail: '',
      rollNo: '',
      competitionName: '',
      club: '',
      rank: '',
      uploadedBy: '',
    })
    setEditingResult(null)
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold"><Trophy className="w-4 h-4" /> 1st Place</span>
    if (rank === 2) return <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold"><Medal className="w-4 h-4" /> 2nd Place</span>
    if (rank === 3) return <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold"><Award className="w-4 h-4" /> 3rd Place</span>
    return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Rank {rank}</span>
  }

  // Group results by competition
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.competitionName]) {
      acc[result.competitionName] = []
    }
    acc[result.competitionName].push(result)
    return acc
  }, {} as Record<string, CompetitionResult[]>)

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#0f2a4d] mb-2">Competition Results</h1>
              <p className="text-lg text-[#1a4b8c]">Publish and manage competition winners</p>
            </div>
            <Button 
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
              className="bg-[#0f2a4d] hover:bg-[#1a4b8c]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a4b8c]" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-xl text-gray-500">No competition results published yet</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedResults).map(([competitionName, competitionResults]) => (
                  <Card key={competitionName} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-[#0f2a4d] to-[#1a4b8c] p-6">
                        <div className="flex items-center gap-3">
                          <Trophy className="w-6 h-6 text-white" />
                          <h2 className="text-2xl font-bold text-white">{competitionName}</h2>
                        </div>
                        <p className="text-sm text-blue-100 mt-2">
                          Club: {competitionResults[0].club} • {competitionResults.length} Winner{competitionResults.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rank</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Roll No</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Published By</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {competitionResults.sort((a, b) => a.rank - b.rank).map((result) => (
                              <TableRow key={result._id}>
                                <TableCell>{getRankBadge(result.rank)}</TableCell>
                                <TableCell className="font-medium">{result.name}</TableCell>
                                <TableCell>{result.rollNo}</TableCell>
                                <TableCell className="text-sm text-gray-600">{result.collegeMail}</TableCell>
                                <TableCell className="text-sm text-gray-600">{result.uploadedBy}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      onClick={() => handleEdit(result)}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => handleDelete(result)}
                                      variant="destructive"
                                      size="sm"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResult ? 'Edit Competition Result' : 'Add Competition Result'}
            </DialogTitle>
            <DialogDescription>
              {editingResult ? 'Update competition result details' : 'Fill in the details to add a new competition result'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="competitionName">Competition Name *</Label>
              <Input
                id="competitionName"
                value={formData.competitionName}
                onChange={(e) => setFormData({ ...formData, competitionName: e.target.value })}
                placeholder="e.g., CodeFest 2024"
                required
              />
            </div>

            <div>
              <Label htmlFor="club">Club*</Label>
              <Input
                id="club"
                value={formData.club}
                onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                placeholder="e.g., STC Hybrid"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Winner Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rollNo">Roll Number *</Label>
                <Input
                  id="rollNo"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="e.g., 2201CS01"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="collegeMail">College Email *</Label>
              <Input
                id="collegeMail"
                type="email"
                value={formData.collegeMail}
                onChange={(e) => setFormData({ ...formData, collegeMail: e.target.value })}
                placeholder="student@iitp.ac.in"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rank">Rank/Position *</Label>
                <Input
                  id="rank"
                  type="number"
                  min="1"
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  placeholder="1, 2, 3..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="uploadedBy">Published By *</Label>
                <Input
                  id="uploadedBy"
                  value={formData.uploadedBy}
                  onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#0f2a4d] hover:bg-[#1a4b8c]"
              >
                <Trophy className="w-4 h-4 mr-2" />
                {editingResult ? 'Update Result' : 'Add Result'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

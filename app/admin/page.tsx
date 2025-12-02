"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Bell,
  UserPlus,
  Trophy,
  FileText,
  ListChecks,
} from "lucide-react"
import AdminNav from "@/components/adminNav"

interface Stats {
  events: number
  notifications: number
  registrations: number
  registrationResponses: number
  competitionResults: number
  techHuntResults?: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    notifications: 0,
    registrations: 0,
    registrationResponses: 0,
    competitionResults: 0,
    techHuntResults: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Events",
      value: stats.events,
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      description: "Total events posted",
      href: "/admin/events",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      title: "Notifications",
      value: stats.notifications,
      icon: <Bell className="w-6 h-6 text-purple-600" />,
      description: "Active notifications",
      href: "/admin/notifications",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      title: "Registrations",
      value: stats.registrations,
      icon: <FileText className="w-6 h-6 text-green-600" />,
      description: "Total registration forms",
      href: "/admin/registration",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-700"
    },
    {
      title: "Responses",
      value: stats.registrationResponses,
      icon: <UserPlus className="w-6 h-6 text-orange-600" />,
      description: "Total responses received",
      href: "/admin/registration",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      textColor: "text-orange-700"
    },
    {
      title: "Competitions",
      value: stats.competitionResults,
      icon: <Trophy className="w-6 h-6 text-yellow-600" />,
      description: "Published result entries",
      href: "/admin/competitions",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-700"
    },
    {
      title: "Tech Hunt",
      value: stats.techHuntResults ?? 0,
      icon: <ListChecks className="w-6 h-6 text-indigo-600" />,
      description: "Participants & progress",
      href: "/admin/tech-hunt",
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      textColor: "text-indigo-700"
    },
  ]

  return (
    <>
      <AdminNav />

      {/* Adds responsive top padding for fixed navbar */}
      <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your system activity</p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse p-6 shadow-sm border rounded-xl">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statsCards.map((card, index) => (
                <a key={index} href={card.href} className="group">
                  <Card className={`p-6 rounded-xl shadow-sm hover:shadow-md border transition-all ${card.bgColor} hover:${card.bgColor.replace('50', '100')}`}>
                    <CardHeader className="flex flex-row justify-between items-center p-0 mb-4">
                      <CardTitle className={`text-lg font-medium ${card.textColor}`}>
                        {card.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${card.iconBg} ${card.textColor}`}>
                        {card.icon}
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <div className={`text-4xl font-bold ${card.textColor}`}>
                        {card.value}
                      </div>
                      <p className={`text-sm ${card.textColor.replace('700', '600')} mt-1`}>
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

import { NextResponse } from 'next/server'
import connectDB from '@/lib/connectdb'
import Events from '@/schema/EventsSchema'
import Notifications from '@/schema/NotificationsSchema'
import RegistrationTemplate from '@/schema/RegistrationTemplateSchema'
import RegistrationSubmission from '@/schema/RegistrationSubmissionSchema'
import CompetitionResult from '@/schema/CompetitionResultSchema'
import Xenith from '@/schema/XenithSchema'
import { getServerSession } from 'next-auth'

export async function GET() {
    const session = await getServerSession()
    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        )
    }
    try {
        await connectDB()
        const EventsCount = await Events.countDocuments()
        const NotificationsCount = await Notifications.countDocuments()
        const RegistrationFormsCount = await RegistrationTemplate.countDocuments({active: true})
        const RegistrationSubmissionsCount = await RegistrationSubmission.countDocuments()
        const CompetitionResultsCount = await CompetitionResult.countDocuments()

        const techHuntResultsCount = await Xenith.countDocuments()

        const stats = {
            events: EventsCount,
            notifications: NotificationsCount,
            registrations: RegistrationFormsCount,
            registrationResponses: RegistrationSubmissionsCount,
            competitionResults: CompetitionResultsCount,
            techHuntResults: techHuntResultsCount
        }

        return NextResponse.json(
            { success: true, stats },
            { status: 200 }
        )
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stats'
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        )
    }
}

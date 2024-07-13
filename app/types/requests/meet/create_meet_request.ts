export interface CreateMeetRequest {
  title: string
  description: string
  size: number
  date: Date
  poiId: number
  ticketId: number | null
  createdById: number
}

export interface UpdateTicketRequest {
  title?: string
  description?: string | null
  quantity?: number
  price?: number
  groupSize?: number
}

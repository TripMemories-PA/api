export interface CreateTicketRequest {
  title: string
  description: string | null
  quantity: number
  price: number
  groupSize: number
  poiId: number
}

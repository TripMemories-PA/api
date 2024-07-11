export interface CreatePoiRequest {
  name: string
  description: string
  coverId: number
  latitude: number
  longitude: number
  cityId: number
  address: string
  typeId: number
}

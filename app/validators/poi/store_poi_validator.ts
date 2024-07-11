import City from '#models/city'
import PoiType from '#models/poi_type'
import UploadFile from '#models/upload_file'
import vine from '@vinejs/vine'

export const storePoiValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    description: vine.string().maxLength(500),
    coverId: vine.number().exists(async (_, value) => {
      const image = await UploadFile.query().where('id', value).first()

      return !!image
    }),
    latitude: vine.number(),
    longitude: vine.number(),
    cityId: vine.number().exists(async (_, value) => {
      const city = await City.query().where('id', value).first()

      return !!city
    }),
    address: vine.string().maxLength(100),
    typeId: vine.number().exists(async (_, value) => {
      const poiType = await PoiType.query().where('id', value).first()

      return !!poiType
    }),
  })
)

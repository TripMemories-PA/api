import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { PoiTypes } from '../../app/types/models/poi_types.js'
import PoiType from '#models/poi_type'

export default class extends BaseSeeder {
  async run() {
    const types = [
      {
        id: PoiTypes.MUSEUM,
        name: 'Musée',
      },
      {
        id: PoiTypes.PARK,
        name: 'Parc et jardin',
      },
      {
        id: PoiTypes.MONUMENT,
        name: 'Monument',
      },
      {
        id: PoiTypes.RELIGIOUS,
        name: 'Lieu de culte',
      },
    ]

    for (const type of types) {
      await PoiType.updateOrCreate({ id: type.id }, type)
    }
  }
}

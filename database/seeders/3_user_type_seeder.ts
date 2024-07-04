import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserTypes } from '../../app/types/models/user_types.js'
import UserType from '#models/user_type'

export default class extends BaseSeeder {
  async run() {
    const types = [
      {
        id: UserTypes.ADMIN,
        name: 'Admin',
      },
      {
        id: UserTypes.USER,
        name: 'User',
      },
      {
        id: UserTypes.POI,
        name: 'Poi Owner',
      },
    ]

    for (const type of types) {
      await UserType.updateOrCreate({ id: type.id }, type)
    }
  }
}

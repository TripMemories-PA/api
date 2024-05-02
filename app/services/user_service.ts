import User from '#models/user'
import { IndexUserRequest } from '../types/requests/user/index_user_request.js'

export default class UserService {
  async index(user: User, request: IndexUserRequest) {
    const query = User.query()

    if (request.search) {
      query.where((builder) => {
        builder
          .where('username', 'like', `%${request.search}%`)
          .orWhereRaw("concat(firstname, ' ', lastname) like ?", [`%${request.search}%`])
          .orWhereRaw("concat(lastname, ' ', firstname) like ?", [`%${request.search}%`])
      })
    }

    return await query.whereNot('id', user.id).paginate(request.page, request.perPage)
  }
}

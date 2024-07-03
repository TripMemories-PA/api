import User from '#models/user'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { IndexUserRequest } from '../types/requests/user/index_user_request.js'
import { UpdateUserRequest } from '../types/requests/user/update_user_request.js'
import AuthService from './auth_service.js'
import FileService from './file_service.js'
import { inject } from '@adonisjs/core'
import { UserTypes } from '../types/models/user_types.js'

@inject()
export default class UserService {
  constructor(
    private authService: AuthService,
    private fileService: FileService
  ) {}

  async index(request: IndexUserRequest) {
    const query = User.query().where('userTypeId', UserTypes.USER)

    if (request.search) {
      query.where((builder) => {
        builder
          .where('username', 'ilike', `%${request.search}%`)
          .orWhereRaw("concat(firstname, ' ', lastname) ilike ?", [`%${request.search}%`])
          .orWhereRaw("concat(lastname, ' ', firstname) ilike ?", [`%${request.search}%`])
      })
    }

    try {
      const authUser = this.authService.getAuthenticatedUser()
      query.whereNot('id', authUser.id)
    } catch {}

    return await query.paginate(request.page, request.perPage)
  }

  async show(id: number) {
    return await User.query().where('id', id).firstOrFail()
  }

  async update(userId: number, payload: UpdateUserRequest) {
    const user = await User.findOrFail(userId)

    user.merge({
      username: payload.username ?? user.username,
      email: payload.email ?? user.email,
      firstname: payload.firstname ?? user.firstname,
      lastname: payload.lastname ?? user.lastname,
    })

    return await user.save()
  }

  async storeAvatar(userId: number, file: MultipartFile) {
    const user = await User.query().where('id', userId).firstOrFail()

    if (user.avatar) {
      await this.fileService.delete(user.avatar)
    }

    const uploadedFile = await this.fileService.store(file)
    await user.related('avatar').associate(uploadedFile)

    return uploadedFile
  }

  async storeBanner(userId: number, file: MultipartFile) {
    const user = await User.query().where('id', userId).firstOrFail()

    if (user.banner) {
      await this.fileService.delete(user.banner)
    }

    const uploadedFile = await this.fileService.store(file)
    await user.related('banner').associate(uploadedFile)

    return uploadedFile
  }

  async delete(userId: number) {
    const user = await User.query().where('id', userId).firstOrFail()

    if (user.avatar) {
      await this.fileService.delete(user.avatar)
    }

    if (user.banner) {
      await this.fileService.delete(user.banner)
    }

    await user.delete()
  }
}

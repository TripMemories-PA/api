import User from '#models/user'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { IndexUserRequest } from '../types/requests/user/index_user_request.js'
import { UpdateUserRequest } from '../types/requests/user/update_user_request.js'
import AuthService from './auth_service.js'
import FileService from './file_service.js'
import { inject } from '@adonisjs/core'
import { UserTypes } from '../types/models/user_types.js'
import { CreateUserRequest } from '../types/requests/user/create_user_request.js'
import { randomUUID } from 'node:crypto'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class UserService {
  constructor(
    private authService: AuthService,
    private fileService: FileService
  ) {}

  async index(request: IndexUserRequest) {
    const query = User.query()

    let searchPoi = false

    try {
      const authUser = this.authService.getAuthenticatedUser()
      if (authUser.userTypeId === UserTypes.USER) {
        query.whereNot('id', authUser.id).where('userTypeId', UserTypes.USER)
      } else if (authUser.userTypeId === UserTypes.ADMIN) {
        if (request.userTypeId) {
          query.where('userTypeId', request.userTypeId)

          if (request.userTypeId === UserTypes.POI) {
            searchPoi = true
          }
        } else {
          query.where('userTypeId', UserTypes.USER)
        }
      }
    } catch {}

    if (request.search) {
      if (searchPoi) {
        query.where((builder) => {
          builder.whereHas('poi', (poiQuery) => {
            poiQuery.where('name', 'ilike', `%${request.search}%`)
          })
        })
      } else {
        query.where((builder) => {
          builder
            .where('username', 'ilike', `%${request.search}%`)
            .orWhereRaw("concat(firstname, ' ', lastname) ilike ?", [`%${request.search}%`])
            .orWhereRaw("concat(lastname, ' ', firstname) ilike ?", [`%${request.search}%`])
        })
      }
    }

    if (request.sortBy && request.order) {
      const order = request.order === 'asc' ? 'asc' : 'desc'
      query.orderBy(request.sortBy, order)
    } else {
      query.orderBy('id', 'desc')
    }

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
      longitude: payload.longitude ?? user.longitude,
      latitude: payload.latitude ?? user.latitude,
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

  async create(payload: CreateUserRequest) {
    return await User.create({
      username: randomUUID(),
      email: payload.email,
      password: payload.password,
      userTypeId: UserTypes.POI,
      poiId: payload.poiId,
      firstname: '',
      lastname: '',
    })
  }

  async updatePassword(userId: number, password: string) {
    const user = await User.findOrFail(userId)

    user.password = password

    return await user.save()
  }
}

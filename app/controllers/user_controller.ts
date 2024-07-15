import PostService from '#services/post_service'
import UserService from '#services/user_service'
import { passwordValidator } from '#validators/auth/password_validator'
import { indexPostValidator } from '#validators/post/index_post_validator'
import { indexUserValidator } from '#validators/user/index_user_validator'
import { storeUserValidator } from '#validators/user/store_user_validator'
import { updateUserValidator } from '#validators/user/update_user_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserController {
  constructor(
    protected userService: UserService,
    protected postService: PostService
  ) {}

  async index({ response, request }: HttpContext) {
    const payload = await request.validateUsing(indexUserValidator)

    const users = await this.userService.index(payload)

    return response.ok(users.toJSON())
  }

  async show({ response, params }: HttpContext) {
    const user = await this.userService.show(params.id)

    return response.ok(user.toJSON())
  }

  async indexPosts({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(indexPostValidator)

    const posts = await this.postService.indexUserPosts(params.id, payload)

    return response.ok(posts.toJSON())
  }

  async create({ response, request }: HttpContext) {
    const payload = await request.validateUsing(storeUserValidator)

    const user = await this.userService.create(payload)

    return response.created(user.toJSON())
  }

  async update({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator, {
      meta: { userId: params.id },
    })

    const user = await this.userService.update(params.id, payload)

    return response.ok(user.toJSON())
  }

  async updatePassword({ response, request, params }: HttpContext) {
    const { password } = await request.validateUsing(passwordValidator)

    await this.userService.updatePassword(params.id, password)

    return response.noContent()
  }
}

import Post from '#models/post'
import { inject } from '@adonisjs/core'
import { CreatePostRequest } from '../types/requests/post/create_post_request.js'
import { IndexPostRequest } from '../types/requests/post/index_post_request.js'
import AuthService from './auth_service.js'
import { Exception } from '@adonisjs/core/exceptions'
import FileService from './file_service.js'
import Poi from '#models/poi'
import User from '#models/user'
import { UserTypes } from '../types/models/user_types.js'

@inject()
export default class PostService {
  constructor(
    private authService: AuthService,
    private fileService: FileService
  ) {}

  async indexPoiPosts(poiId: number, payload: IndexPostRequest) {
    const poi = await Poi.query().where('id', poiId).firstOrFail()

    return await poi
      .related('posts')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(payload.page, payload.perPage)
  }

  async indexUserPosts(userId: number, payload: IndexPostRequest) {
    const user = await User.query()
      .where('id', userId)
      .where('userTypeId', UserTypes.USER)
      .firstOrFail()

    return await user
      .related('posts')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(payload.page, payload.perPage)
  }

  async indexUserFriendsPosts(userId: number, payload: IndexPostRequest) {
    const user = await User.query()
      .where('id', userId)
      .where('userTypeId', UserTypes.USER)
      .firstOrFail()

    const userFriends = await user.related('friends').query()
    const friendsIds = userFriends.map((friend) => friend.id)

    return await Post.query()
      .whereIn('createdById', friendsIds)
      .orderBy('created_at', 'desc')
      .paginate(payload.page, payload.perPage)
  }

  async indexCityPosts(cityId: number, payload: IndexPostRequest) {
    const pois = await Poi.query().where('cityId', cityId)
    const poiIds = pois.map((poi) => poi.id)

    return await Post.query()
      .whereIn('poiId', poiIds)
      .orderBy('created_at', 'desc')
      .paginate(payload.page, payload.perPage)
  }

  async index(payload: IndexPostRequest) {
    try {
      const user = this.authService.getAuthenticatedUser()

      if (user.userTypeId === UserTypes.ADMIN) {
        return await Post.query()
          .select('posts.*')
          .count('reports.id as reports_count')
          .leftJoin('reports', 'posts.id', 'reports.post_id')
          .groupBy('posts.id')
          .orderBy('reports_count', 'desc')
          .paginate(payload.page, payload.perPage)
      }
    } catch {}

    return await Post.query().orderBy('created_at', 'desc').paginate(payload.page, payload.perPage)
  }

  async show(id: number) {
    return await Post.query().where('id', id).firstOrFail()
  }

  async create(userId: number, payload: CreatePostRequest) {
    return await Post.create({
      title: payload.title,
      createdById: userId,
      poiId: payload.poiId,
      content: payload.content,
      imageId: payload.imageId,
      note: payload.note,
    })
  }

  async delete(id: number) {
    const authUser = this.authService.getAuthenticatedUser()

    const post = await Post.query().where('id', id).firstOrFail()

    if (post.createdById !== authUser.id && authUser.userTypeId !== UserTypes.ADMIN) {
      throw new Exception('You are not authorized to delete this post', { status: 403 })
    }

    const image = post.image

    await post.delete()
    await this.fileService.delete(image)
  }
}

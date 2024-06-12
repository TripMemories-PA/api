import Post from '#models/post'
import { CreatePostRequest } from '../types/requests/post/create_post_request.js'
import { IndexPostRequest } from '../types/requests/post/index_post_request.js'

export default class PostService {
  async indexPoiPosts(poiId: number, payload: IndexPostRequest) {
    return await Post.query()
      .where('poiId', poiId)
      .orderBy('created_at', 'desc')
      .paginate(payload.page, payload.perPage)
  }

  async show(id: number) {
    return await Post.query().where('id', id).firstOrFail()
  }

  async create(userId: number, payload: CreatePostRequest) {
    return await Post.create({
      createdById: userId,
      poiId: payload.poiId,
      content: payload.content,
      imageId: payload.imageId,
      note: payload.note,
    })
  }
}

import Post from '#models/post'
import vine from '@vinejs/vine'

export const storeCommentValidator = vine.compile(
  vine.object({
    content: vine.string().maxLength(500),
    postId: vine.number().exists(async (_, value) => {
      const post = await Post.query().where('id', value).first()

      return !!post
    }),
  })
)

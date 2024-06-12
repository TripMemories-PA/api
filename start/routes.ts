/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const PostController = () => import('#controllers/post_controller')
const PoiController = () => import('#controllers/poi_controller')
const AuthController = () => import('#controllers/auth_controller')
const MeController = () => import('#controllers/me_controller')
const UserController = () => import('#controllers/user_controller')
const FriendController = () => import('#controllers/friend_controller')
const FriendRequestController = () => import('#controllers/friend_request_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('auth')

router
  .group(() => {
    router.get('', [MeController, 'show'])
    router.put('', [MeController, 'update'])
    router.delete('', [MeController, 'delete'])
    router.post('/avatar', [MeController, 'storeAvatar'])
    router.post('/banner', [MeController, 'storeBanner'])

    router
      .group(() => {
        router.get('', [FriendRequestController, 'index'])
        router.post('', [FriendRequestController, 'store'])
        router.delete('/:id', [FriendRequestController, 'delete'])
        router.put('/:id/accept', [FriendRequestController, 'accept'])
      })
      .prefix('/friend-requests')

    router
      .group(() => {
        router.get('', [FriendController, 'indexMyFriends'])
        router.delete('/:id', [FriendController, 'delete'])
      })
      .prefix('/friends')
  })
  .prefix('me')
  .middleware(middleware.auth())

router
  .group(() => {
    router.get('', [UserController, 'index'])
    router.get('/:id', [UserController, 'show'])
    router.get('/:id/friends', [FriendController, 'indexFriends'])
  })
  .prefix('users')
  .middleware(middleware.auth())

router
  .group(() => {
    router.get('', [PoiController, 'index'])
    router.get('/:id', [PoiController, 'show'])
    router.get('/:id/posts', [PoiController, 'indexPosts'])
  })
  .prefix('pois')

router
  .group(() => {
    router.post('', [PostController, 'store'])
    router.post('/image', [PostController, 'storeImage'])
    router.get('/:id', [PostController, 'show'])
  })
  .prefix('posts')
  .middleware(middleware.auth())

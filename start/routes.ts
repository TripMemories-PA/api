/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const MeController = () => import('#controllers/me_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
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
    router.post('/avatar', [MeController, 'storeAvatar'])
  })
  .prefix('me')
  .middleware(middleware.auth())

router
  .group(() => {
    router.post('', [FriendRequestController, 'store'])
  })
  .prefix('friend-requests')
  .middleware(middleware.auth())

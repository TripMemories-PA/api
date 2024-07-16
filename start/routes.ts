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
import { UserTypes } from '../app/types/models/user_types.js'
const MessageController = () => import('#controllers/message_controller')
const QuestController = () => import('#controllers/quest_controller')
const MeetController = () => import('#controllers/meet_controller')
const QuestionController = () => import('#controllers/question_controller')
const TicketController = () => import('#controllers/ticket_controller')
const CityController = () => import('#controllers/city_controller')
const CommentController = () => import('#controllers/comment_controller')
const PostController = () => import('#controllers/post_controller')
const PoiController = () => import('#controllers/poi_controller')
const AuthController = () => import('#controllers/auth_controller')
const MeController = () => import('#controllers/me_controller')
const UserController = () => import('#controllers/user_controller')
const FriendController = () => import('#controllers/friend_controller')
const FriendRequestController = () => import('#controllers/friend_request_controller')

// HEALTH CHECK
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// AUTH
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('auth')

router
  .group(() => {
    router.post('/refresh', [AuthController, 'refresh'])
  })
  .prefix('auth')
  .middleware(middleware.auth())

// ME
router
  .group(() => {
    router.get('', [MeController, 'show'])
    router.put('', [MeController, 'update'])
    router.put('/password', [MeController, 'updatePassword'])
    router.delete('', [MeController, 'delete'])
    router.post('/avatar', [MeController, 'storeAvatar'])
    router.post('/banner', [MeController, 'storeBanner'])
    router.get('/posts', [MeController, 'indexPosts'])
    router.get('/tickets', [MeController, 'indexTickets'])
    router.get('/meets', [MeController, 'indexMeets'])

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
        router.get('/posts', [FriendController, 'indexMyFriendsPosts'])
      })
      .prefix('/friends')

    router
      .group(() => {
        router.post('/buy', [TicketController, 'buy'])
      })
      .prefix('/tickets')
  })
  .prefix('me')
  .middleware(middleware.auth())

// USERS
router
  .group(() => {
    router.get('', [UserController, 'index'])
    router.get('/:id', [UserController, 'show'])
    router.get('/:id/friends', [FriendController, 'indexFriends'])
    router.get('/:id/posts', [UserController, 'indexPosts'])
  })
  .prefix('users')
  .middleware(middleware.public())

router
  .group(() => {
    router.get('/:id/messages', [MessageController, 'indexPrivateMessages'])
    router.post('/:id/messages', [MessageController, 'storePrivateMessage'])
  })
  .prefix('users')
  .middleware(middleware.auth())

router
  .group(() => {
    router.post('', [UserController, 'create'])
    router.put('/:id', [UserController, 'update'])
    router.put('/:id/password', [UserController, 'updatePassword'])
  })
  .prefix('users')
  .middleware(middleware.auth({ userTypes: [UserTypes.ADMIN] }))

// POIS
router
  .group(() => {
    router.get('', [PoiController, 'index'])
    router.get('/types', [PoiController, 'indexTypes'])
    router.get('/:id', [PoiController, 'show'])
    router.get('/:id/posts', [PoiController, 'indexPosts'])
    router.get('/:id/tickets', [PoiController, 'indexTickets'])
    router.get('/:id/questions', [PoiController, 'indexQuestions'])
    router.get('/:id/meets', [PoiController, 'indexMeets'])
    router.get('/:id/quests', [PoiController, 'indexQuests'])
  })
  .prefix('pois')
  .middleware(middleware.public())

router
  .group(() => {
    router.post('/cover', [PoiController, 'storeCover'])
    router.put('/:id', [PoiController, 'update'])
  })
  .prefix('pois')
  .middleware(middleware.auth({ userTypes: [UserTypes.POI, UserTypes.ADMIN] }))

router
  .group(() => {
    router.post('', [PoiController, 'store'])
    router.get('/:id/sales', [PoiController, 'indexSales'])
  })
  .prefix('pois')
  .middleware(middleware.auth({ userTypes: [UserTypes.ADMIN] }))

// POSTS
router
  .group(() => {
    router.get('', [PostController, 'index'])
    router.get('/:id', [PostController, 'show'])
    router.get('/:id/comments', [PostController, 'indexComments'])
  })
  .prefix('posts')
  .middleware(middleware.public())

router
  .group(() => {
    router.post('', [PostController, 'store'])
    router.post('/image', [PostController, 'storeImage'])
    router.delete('/:id', [PostController, 'delete'])
    router.post('/:id/like', [PostController, 'like'])
    router.delete('/:id/like', [PostController, 'unlike'])
  })
  .prefix('posts')
  .middleware(middleware.auth())

// COMMENTS
router
  .group(() => {
    router.post('', [CommentController, 'store'])
    router.delete('/:id', [CommentController, 'delete'])
    router.post('/:id/like', [CommentController, 'like'])
    router.delete('/:id/like', [CommentController, 'unlike'])
  })
  .prefix('comments')
  .middleware(middleware.auth())

router
  .group(() => {
    router.get('', [CommentController, 'index'])
  })
  .prefix('comments')
  .middleware(middleware.auth({ userTypes: [UserTypes.ADMIN] }))

// CITIES
router
  .group(() => {
    router.get('', [CityController, 'index'])
    router.get('/:id/pois', [CityController, 'indexCityPois'])
    router.get('/:id/posts', [CityController, 'indexCityPosts'])
  })
  .prefix('cities')
  .middleware(middleware.public())

// TICKETS
router
  .group(() => {
    router.get('/:id', [TicketController, 'show'])
  })
  .prefix('tickets')
  .middleware(middleware.public())

router
  .group(() => {
    router.post('/webhook', [TicketController, 'webhook'])
  })
  .prefix('tickets')
  .middleware(middleware.stripe())

router
  .group(() => {
    router.post('', [TicketController, 'store'])
    router.put('/:id', [TicketController, 'update'])
    router.delete('/:id', [TicketController, 'delete'])
    router.post('/validate', [TicketController, 'validate'])
  })
  .prefix('tickets')
  .middleware(middleware.auth({ userTypes: [UserTypes.POI] }))

// QUESTIONS
router
  .group(() => {
    router.get('', [QuestionController, 'index'])
    router.post('/:questionId/answers/:answerId', [QuestionController, 'validateAnswer'])
  })
  .prefix('questions')
  .middleware(middleware.public())

router
  .group(() => {
    router.post('', [QuestionController, 'store'])
    router.post('/image', [QuestionController, 'storeImage'])
    router.put('/:id', [QuestionController, 'update'])
    router.delete('/:id', [QuestionController, 'delete'])
  })
  .prefix('questions')
  .middleware(middleware.auth({ userTypes: [UserTypes.POI] }))

// MEETS
router
  .group(() => {
    router.post('', [MeetController, 'store'])
    router.get('/:id', [MeetController, 'show'])
    router.put('/:id', [MeetController, 'update'])
    router.delete('/:id', [MeetController, 'delete'])
    router.post('/:id/join', [MeetController, 'join'])
    router.post('/:id/leave', [MeetController, 'leave'])
    router.post('/:id/pay', [MeetController, 'pay'])

    router.get('/:id/users', [MeetController, 'indexUsers'])
    router.delete('/:meetId/users/:userId', [MeetController, 'deleteUser'])

    router.get('/:id/messages', [MessageController, 'indexMeetMessages'])
    router.post('/:id/messages', [MessageController, 'storeMeetMessage'])
  })
  .prefix('meets')
  .middleware(middleware.auth())

// QUESTS

router
  .group(() => {
    router.post('/image', [QuestController, 'storeImage'])
    router.post('/', [QuestController, 'store'])
    router.get('/:id', [QuestController, 'show'])
    router.put('/:id', [QuestController, 'update'])
    router.delete('/:id', [QuestController, 'delete'])
    router.post('/:id/validate', [QuestController, 'validate'])
  })
  .prefix('quests')
  .middleware(middleware.auth())

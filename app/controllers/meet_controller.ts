import MeetService from '#services/meet_service'
import { indexMeetUserValidator } from '#validators/meet/index_meet_user_validator'
import { storeMeetValidator } from '#validators/meet/store_meet_validator'
import { updateMeetValidator } from '#validators/meet/update_meet_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MeetController {
  constructor(private meetService: MeetService) {}

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(storeMeetValidator)
    const meet = await this.meetService.create({
      ...payload,
      createdById: auth.user!.id,
    })

    return response.created(meet.toJSON())
  }

  async show({ params, response }: HttpContext) {
    const meet = await this.meetService.show(params.id)

    return response.ok(meet.toJSON())
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateMeetValidator)
    const meet = await this.meetService.update(params.id, payload)

    return response.ok(meet.toJSON())
  }

  async delete({ params, response }: HttpContext) {
    await this.meetService.delete(params.id)

    return response.noContent()
  }

  async join({ params, response, auth }: HttpContext) {
    await this.meetService.join(params.id, auth.user!.id)

    return response.noContent()
  }

  async leave({ params, response, auth }: HttpContext) {
    await this.meetService.leave(params.id, auth.user!.id)

    return response.noContent()
  }

  async indexUsers({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(indexMeetUserValidator)
    const users = await this.meetService.indexUsers(params.id, payload)

    return response.ok(users.toJSON())
  }

  async deleteUser({ params, response }: HttpContext) {
    await this.meetService.deleteUser(Number(params.meetId), Number(params.userId))

    return response.noContent()
  }
}

import env from '#start/env'
import Pusher from 'pusher'

export default class PusherService {
  client: Pusher

  constructor() {
    this.client = new Pusher({
      appId: env.get('PUSHER_APP_ID'),
      key: env.get('PUSHER_KEY'),
      secret: env.get('PUSHER_SECRET'),
      cluster: env.get('PUSHER_CLUSTER'),
      useTLS: true,
    })
  }

  sendMessage(channel: string, event: string, message: string) {
    return this.client.trigger(channel, event, {
      message,
    })
  }
}

import Stripe from 'stripe'
import env from '#start/env'
import User from '#models/user'

export default class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
      typescript: true,
    })
  }

  async createPaymentIntent(amount: number, customerId: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      customer: customerId,
      payment_method_types: ['card'],
    })
  }

  verifyWebhook(payload: string, signature: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, env.get('STRIPE_WEBHOOK_SECRET'))
  }

  async getCustomerId(userId: number) {
    const user = await User.query().where('id', userId).firstOrFail()

    if (user.customerId) {
      return user.customerId
    }

    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
      metadata: {
        id: user.id,
      },
    })

    user.customerId = customer.id
    await user.save()

    return customer.id
  }
}

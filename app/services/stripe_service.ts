import Stripe from 'stripe'
import env from '#start/env'

export default class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
      typescript: true,
    })
  }

  async createPaymentIntent(amount: number) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method_types: ['card'],
    })
  }

  verifyWebhook(payload: string, signature: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, env.get('STRIPE_WEBHOOK_SECRET'))
  }
}

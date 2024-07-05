import StripeService from '#services/stripe_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

@inject()
export default class StripeMiddleware {
  constructor(private stripeService: StripeService) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const request = ctx.request
    const signature = request.header('stripe-signature')
    const payload = request.raw()

    if (!signature) {
      return ctx.response.forbidden({ error: 'Missing Stripe webhook signature' })
    }

    if (!payload) {
      return ctx.response.forbidden({ error: 'Missing Stripe webhook payload' })
    }

    try {
      this.stripeService.verifyWebhook(payload, signature)
    } catch (error) {
      return ctx.response.forbidden({ error: 'Invalid Stripe webhook signature' })
    }

    return next()
  }
}

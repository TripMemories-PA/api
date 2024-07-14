import vine from '@vinejs/vine'
import dayjs from 'dayjs'

export const indexSaleValidator = vine.compile(
  vine.object({
    startDate: vine
      .date({
        formats: ['YYYY/MM/DD'],
      })
      .before(() => {
        return dayjs().format('YYYY-MM-DD')
      })
      .optional()
      .requiredIfExists(['endDate']),
    endDate: vine
      .date({
        formats: ['YYYY/MM/DD'],
      })
      .afterOrEqual((field) => {
        return dayjs(field.parent.startDate).format('YYYY-MM-DD')
      })
      .beforeOrEqual(() => {
        return dayjs().format('YYYY-MM-DD')
      })
      .optional()
      .requiredIfExists(['startDate']),
  })
)

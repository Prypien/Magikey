import { describe, it, expect } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import CompanyReviews from './CompanyReviews.vue'
describe('CompanyReviews', () => {
  it('rendert beide Bewertungsspalten korrekt', async () => {
    const app = createSSRApp(CompanyReviews, {
      googleReviewsUrl: 'https://maps.google.com/?cid=123#reviews',
      magikeyReviews: [
        {
          id: 'r1',
          author: 'Max Mustermann',
          rating: 4,
          comment: 'Schnelle Hilfe vor Ort.',
          created_at: '2024-04-10T12:00:00.000Z',
        },
        {
          id: 'r2',
          author: 'Erika Muster',
          rating: 5,
          comment: 'Sehr freundlich und zuverlässig.',
          created_at: '2024-04-12T16:30:00.000Z',
        },
      ],
    })

    const html = await renderToString(app)

    expect(html).toMatchSnapshot()
  })
})

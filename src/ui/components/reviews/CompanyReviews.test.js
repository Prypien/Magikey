import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import CompanyReviews from './CompanyReviews.vue'

describe('CompanyReviews', () => {
  it('renders both google and magikey review columns', async () => {
    const app = createSSRApp({
      render() {
        return h(CompanyReviews, {
          googleReviewsUrl: 'https://maps.google.com/?cid=123#reviews',
          googlePlaceUrl: 'https://maps.google.com/?cid=123',
          googleRating: 4.7,
          googleReviewCount: 213,
          magikeyReviews: [
            {
              id: 'r1',
              author: 'Alex P.',
              rating: 5,
              comment: 'Super schnelle Hilfe und fairer Preis!',
              created_at: '05. Januar 2024',
            },
            {
              id: 'r2',
              author: 'Mara L.',
              rating: 4,
              comment: 'Freundlich und zuverlässig.',
              created_at: '17. Dezember 2023',
            },
          ],
        })
      },
    })

    const html = await renderToString(app)
    const normalizedHtml = html.replace(/data-v-[0-9a-f]+/g, 'data-v-xxxx')
    expect(normalizedHtml).toMatchSnapshot()
  })
})

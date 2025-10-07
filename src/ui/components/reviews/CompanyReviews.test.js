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

  it('derives an embeddable URL from a Google Maps place link with hex CID', async () => {
    const app = createSSRApp({
      render() {
        return h(CompanyReviews, {
          googlePlaceUrl:
            'https://www.google.com/maps/place/Beispielunternehmen/@52.52,13.405,15z/data=!3m1!4b1!4m6!3m5!1s0x47a84e972b98136d:0x29c431787c5136d9!8m2!3d52.52!4d13.405!16s%2Fg%2F11c4wfp15b?entry=ttu',
        })
      },
    })

    const html = await renderToString(app)
    expect(html).toContain('src="https://www.google.com/maps?cid=3009584844541867737&amp;output=embed"')
  })
})

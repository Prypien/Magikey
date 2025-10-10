<template src="./reutlingen/index.html"></template>

<script setup>
import { useHead } from '@vueuse/head'

const pageTitle = 'Schlüsseldienst Reutlingen – geprüfte Notdienste & faire Preise'
const pageDescription =
  'Vergleiche mit Magikey verifizierte Schlüsseldienste in Reutlingen. Transparente Preise, echte Bewertungen und schnelle Notdienste – direkt vorgefiltert für deine Stadt.'

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Schlüsseldienst Reutlingen Suche',
  provider: {
    '@type': 'Organization',
    name: 'Magikey',
    url: 'https://magikey.de',
  },
  areaServed: {
    '@type': 'City',
    name: 'Reutlingen',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Reutlingen',
      postalCode: '72764',
      addressCountry: 'DE',
    },
  },
  description: pageDescription,
  serviceType: ['Türöffnung', 'Schlüsselnotdienst', 'Smart-Lock Installation'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Schlüsseldienst Leistungen in Reutlingen',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Türöffnung & Notdienst',
        price: '89.00',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        name: 'Zylinderwechsel & Sicherheitstechnik',
      },
      {
        '@type': 'Offer',
        name: 'Smart-Lock Beratung & Montage',
      },
    ],
  },
  url: 'https://www.magikey.de/schluesseldienst/reutlingen',
}

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    {
      name: 'keywords',
      content:
        'Schlüsseldienst Reutlingen, Schlüsselnotdienst Reutlingen, Türöffnung Reutlingen, Magikey Reutlingen, Schlüsseldienst Preise Reutlingen',
    },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'article' },
  ],
  link: [
    { rel: 'canonical', href: 'https://www.magikey.de/schluesseldienst/reutlingen' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(schemaOrg, null, 2),
    },
  ],
})
</script>

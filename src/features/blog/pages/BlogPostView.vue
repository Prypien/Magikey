<template>
  <div class="space-y-10">
    <article
      v-if="post"
      class="overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-xl backdrop-blur"
    >
      <div class="relative h-32 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent sm:h-40">
        <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(217,169,8,0.28),transparent_60%)]"></div>
        <div class="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gold/70">Magikey Blog</p>
          <h1 class="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">{{ post.title }}</h1>
          <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
              <i class="fa fa-calendar"></i>
              {{ post.formattedDate }}
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
              <i class="fa fa-user"></i>
              {{ post.author }}
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
              <i class="fa fa-clock-o"></i>
              {{ post.readingTime }} Min. Lesezeit
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-8 px-6 py-10 sm:px-10 sm:py-12">
        <p class="text-base text-slate-600 sm:text-lg">{{ post.excerpt }}</p>
        <div class="blog-content" v-html="post.html"></div>
        <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/70 p-6">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-gold/70">Bereit für den Ernstfall?</p>
            <p class="mt-2 text-sm text-slate-600">
              Speichere deine Lieblingsanbieter in Magikey und finde sie im Notfall mit einem Klick wieder.
            </p>
          </div>
          <RouterLink
            to="/"
            class="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gold/90"
          >
            Zur Schlüsseldienst-Suche
            <i class="fa fa-long-arrow-right"></i>
          </RouterLink>
        </div>
      </div>
    </article>

    <div v-else class="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-10 text-center">
      <p class="text-lg font-semibold text-slate-900">Dieser Beitrag ist nicht mehr verfügbar.</p>
      <p class="mt-2 text-sm text-slate-600">
        Vielleicht interessiert dich einer unserer aktuellen Ratgeber – stöbere einfach weiter im Blog.
      </p>
      <RouterLink
        :to="{ name: 'blog' }"
        class="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-gold/90"
      >
        Zur Übersicht
        <i class="fa fa-book"></i>
      </RouterLink>
    </div>

    <section v-if="suggestedPosts.length" class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-slate-900">Weitere Artikel</h2>
        <RouterLink
          :to="{ name: 'blog' }"
          class="text-sm font-semibold text-gold transition hover:text-gold/80"
        >
          Alle Beiträge ansehen
          <i class="fa fa-angle-right"></i>
        </RouterLink>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        <article
          v-for="entry in suggestedPosts"
          :key="entry.slug"
          class="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm transition hover:border-gold/50 hover:shadow-lg"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Magikey Blog</p>
          <h3 class="mt-3 text-lg font-semibold text-slate-900">{{ entry.title }}</h3>
          <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{{ entry.excerpt }}</p>
          <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100/60 px-3 py-1">
              <i class="fa fa-calendar"></i>
              {{ entry.formattedDate }}
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100/60 px-3 py-1">
              <i class="fa fa-user"></i>
              {{ entry.author }}
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100/60 px-3 py-1">
              <i class="fa fa-clock-o"></i>
              {{ entry.readingTime }} Min.
            </span>
          </div>
          <RouterLink
            :to="{ name: 'blog-post', params: { slug: entry.slug } }"
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:text-gold/80"
          >
            Weiterlesen
            <i class="fa fa-long-arrow-right"></i>
          </RouterLink>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { findBlogPost, getBlogPosts } from '../data/blogPosts'
import { applySeoMeta, DEFAULT_SEO } from '@/core/seo'

const route = useRoute()

const allPosts = computed(() => getBlogPosts())
const post = computed(() => findBlogPost(`${route.params.slug ?? ''}`))

const suggestedPosts = computed(() =>
  allPosts.value.filter((entry) => entry.slug !== post.value?.slug).slice(0, 2)
)

watchEffect(() => {
  if (!post.value) {
    applySeoMeta({
      title: 'Blogartikel nicht gefunden | Magikey',
      description:
        'Der gewünschte Artikel ist nicht verfügbar. Entdecke stattdessen unsere aktuellen Ratgeber.',
      robots: 'noindex,nofollow',
    })
    return
  }

  applySeoMeta({
    title: `${post.value.title} | Magikey Blog`,
    description: post.value.excerpt,
    ogImage: post.value.coverImage || DEFAULT_SEO.ogImage,
    keywords: post.value.keywords.join(', '),
    ogType: 'article',
    articlePublishedTime: post.value.isoDate,
    articleModifiedTime: post.value.isoDate,
    articleAuthor: post.value.author,
  })
})
</script>

<style scoped>
.blog-content {
  display: grid;
  gap: 1.5rem;
  color: #475569;
  font-size: 1rem;
  line-height: 1.7;
}

.blog-content h2,
.blog-content h3,
.blog-content h4 {
  color: #0f172a;
  font-weight: 600;
}

.blog-content h2 {
  font-size: clamp(1.5rem, 2vw, 1.75rem);
}

.blog-content h3 {
  font-size: clamp(1.25rem, 1.6vw, 1.5rem);
}

.blog-content p {
  margin: 0;
}

.blog-content ul,
.blog-content ol {
  margin: 0;
  padding-left: 1.5rem;
  display: grid;
  gap: 0.5rem;
}

.blog-content blockquote {
  border-left: 3px solid rgba(217, 169, 8, 0.5);
  padding-left: 1rem;
  color: #334155;
  font-style: italic;
}

.blog-content a {
  color: #b08906;
  font-weight: 600;
  text-decoration: underline;
}

.blog-content code {
  padding: 0.15rem 0.35rem;
  border-radius: 0.375rem;
  background-color: rgba(15, 23, 42, 0.08);
  font-size: 0.875rem;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

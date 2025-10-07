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

      <figure
        v-if="post.coverImage"
        class="relative flex items-center justify-center bg-slate-100/70"
      >
        <img
          :src="post.coverImage"
          :alt="post.coverImageAlt || post.title"
          class="aspect-[16/9] w-full object-cover"
        />
      </figure>

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

.blog-content hr {
  border: none;
  border-top: 1px dashed rgba(148, 163, 184, 0.6);
  margin: 1rem 0;
}

.blog-content pre {
  background: #0f172a;
  color: #f1f5f9;
  padding: 1.25rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  overflow-x: auto;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.2);
}

.blog-content pre code {
  background: transparent;
  padding: 0;
  font-family: 'Fira Code', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.blog-content .md-task {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.25rem 0;
}

.blog-content .md-task-box {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  border: 1.5px solid rgba(15, 23, 42, 0.2);
  font-size: 0.75rem;
  font-weight: 700;
  color: #0f172a;
  background: rgba(241, 245, 249, 0.8);
}

.blog-content .md-task--checked .md-task-box {
  background: rgba(217, 169, 8, 0.85);
  border-color: rgba(217, 169, 8, 0.85);
  color: white;
}

.blog-content .md-task-label {
  font-size: 0.95rem;
}

.blog-content .md-callout {
  position: relative;
  border-radius: 1.25rem;
  padding: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.9));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.blog-content .md-callout::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  border: 1px solid rgba(217, 169, 8, 0.2);
  pointer-events: none;
  opacity: 0.4;
}

.blog-content .md-callout-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: rgba(15, 23, 42, 0.6);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.blog-content .md-callout-content {
  display: grid;
  gap: 0.75rem;
}

.blog-content .md-callout-info::before,
.blog-content .md-callout-summary::before,
.blog-content .md-callout-tip::before {
  border-color: rgba(217, 169, 8, 0.45);
}

.blog-content .md-callout-warning::before,
.blog-content .md-callout-danger::before {
  border-color: rgba(239, 68, 68, 0.4);
}

.blog-content .md-callout-success::before {
  border-color: rgba(34, 197, 94, 0.35);
}

.blog-content .md-callout-info,
.blog-content .md-callout-summary,
.blog-content .md-callout-tip {
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.95), rgba(217, 169, 8, 0.08));
}

.blog-content .md-callout-warning,
.blog-content .md-callout-danger {
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.95), rgba(248, 113, 113, 0.08));
}

.blog-content .md-callout-success {
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.95), rgba(134, 239, 172, 0.12));
}

.blog-content .md-stat-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.blog-content .md-stat {
  border-radius: 1rem;
  background: radial-gradient(circle at top left, rgba(217, 169, 8, 0.12), transparent 70%), rgba(15, 23, 42, 0.03);
  padding: 1.25rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  display: grid;
  gap: 0.35rem;
}

.blog-content .md-stat-label {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.55);
  font-weight: 600;
}

.blog-content .md-stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
}

.blog-content .md-stat-description {
  font-size: 0.9rem;
  color: #475569;
}

.blog-content .md-timeline {
  position: relative;
  padding-left: 1.5rem;
  display: grid;
  gap: 1.5rem;
}

.blog-content .md-timeline::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgba(217, 169, 8, 0.6), transparent);
}

.blog-content .md-timeline-item {
  position: relative;
  display: grid;
  gap: 0.35rem;
}

.blog-content .md-timeline-dot {
  position: absolute;
  left: -1.1rem;
  top: 0.2rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: #d9a908;
  box-shadow: 0 0 0 4px rgba(217, 169, 8, 0.18);
}

.blog-content .md-timeline-headline {
  font-weight: 600;
  color: #0f172a;
}

.blog-content .md-timeline-body {
  color: #475569;
  font-size: 0.95rem;
}

.blog-content .md-checklist {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  list-style: none;
}

.blog-content .md-checklist-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.9rem;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.blog-content .md-checklist-item--checked {
  background: rgba(217, 169, 8, 0.12);
  border-color: rgba(217, 169, 8, 0.35);
}

.blog-content .md-checklist-box {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.6rem;
  border: 2px solid rgba(15, 23, 42, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.55);
  background: white;
}

.blog-content .md-checklist-item--checked .md-checklist-box {
  background: #d9a908;
  border-color: #d9a908;
  color: #fff;
}

.blog-content .md-checklist-text {
  font-size: 0.95rem;
  color: #334155;
}

.blog-content .blog-template-frame {
  position: relative;
  display: grid;
  gap: 2rem;
  padding: clamp(1.5rem, 2vw, 2rem);
  border-radius: 1.75rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(217, 169, 8, 0.08), rgba(15, 23, 42, 0.03));
  overflow: hidden;
}

.blog-content .blog-template-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at top left, rgba(217, 169, 8, 0.12), transparent 70%);
  opacity: 0.9;
  pointer-events: none;
}

.blog-content .blog-template-frame > * {
  position: relative;
  z-index: 1;
}

.blog-content .blog-template-sidebar {
  display: grid;
}

.blog-content .blog-template-sidebar-inner {
  position: sticky;
  top: 6.5rem;
  display: grid;
  gap: 1.5rem;
  align-content: start;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 18px 35px -25px rgba(15, 23, 42, 0.45);
  padding: 1.5rem;
}

.blog-content .blog-template-sidebar-label {
  font-size: 0.7rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.45);
}

.blog-content .blog-template-toc-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
}

.blog-content .blog-template-toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.blog-content .blog-template-toc-item a {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  color: #0f172a;
  text-decoration: none;
  position: relative;
  padding-left: 1.5rem;
}

.blog-content .blog-template-toc-item a::before {
  content: '';
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 9999px;
  background: rgba(217, 169, 8, 0.45);
  box-shadow: 0 0 0 4px rgba(217, 169, 8, 0.18);
  position: absolute;
  left: 0;
  top: 0.45rem;
  transition: transform 0.2s ease;
}

.blog-content .blog-template-toc-item a:hover::before,
.blog-content .blog-template-toc-item a:focus-visible::before {
  transform: scale(1.15);
}

.blog-content .blog-template-toc-item--level-3 a {
  padding-left: 2.25rem;
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.75);
}

.blog-content .blog-template-toc-empty {
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.6);
}

.blog-content .blog-template-main {
  display: grid;
  gap: 2rem;
}

.blog-content .blog-template-embed {
  display: grid;
  gap: 0.75rem;
}

.blog-content .blog-template-embed-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 20px 45px -30px rgba(15, 23, 42, 0.5);
}

.blog-content .blog-template-embed-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.blog-content .blog-template-embed-caption {
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.7);
}

.blog-content .blog-template-widget {
  display: grid;
  gap: 1rem;
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: linear-gradient(140deg, rgba(217, 169, 8, 0.15), rgba(255, 255, 255, 0.95));
  border: 1px solid rgba(217, 169, 8, 0.25);
}

.blog-content .blog-template-widget-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.blog-content .blog-template-widget-subtitle {
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.7);
}

.blog-content .blog-template-widget-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.blog-content .blog-template-widget-item {
  display: grid;
  gap: 0.35rem;
}

.blog-content .blog-template-widget-headline {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
}

.blog-content .blog-template-widget-description {
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.7);
}

.blog-content .blog-template-widget-cta {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 9999px;
  background: #d9a908;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 12px 25px -15px rgba(217, 169, 8, 0.8);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.blog-content .blog-template-widget-cta:hover,
.blog-content .blog-template-widget-cta:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 15px 30px -12px rgba(217, 169, 8, 0.9);
}

@media (min-width: 1024px) {
  .blog-content .blog-template-frame {
    grid-template-columns: minmax(0, 290px) minmax(0, 1fr);
  }
}

@media (max-width: 1023px) {
  .blog-content .blog-template-sidebar-inner {
    position: static;
  }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

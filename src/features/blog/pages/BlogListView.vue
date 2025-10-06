<template>
  <div class="space-y-12">
    <section
      class="relative overflow-hidden rounded-3xl border border-white/60 bg-white/85 px-6 py-10 shadow-xl backdrop-blur sm:px-10 sm:py-12"
    >
      <div class="absolute -right-28 top-10 hidden h-72 w-72 rounded-full bg-gold/25 blur-3xl md:block"></div>
      <div class="absolute -left-24 bottom-0 hidden h-64 w-64 rounded-full bg-sky-200/40 blur-3xl md:block"></div>
      <div class="relative grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center">
        <header class="space-y-5">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gold/70">
            Magikey Blog
          </p>
          <h1 class="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Wissen, das dich im Schlüssel-Notfall entspannt handeln lässt
          </h1>
          <p class="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Unsere Expertinnen und Experten sammeln Best Practices, Sicherheitstipps und Einblicke aus echten Einsätzen.
            So weißt du im Ernstfall genau, worauf es ankommt – transparent, verständlich und immer aktuell.
          </p>
          <div class="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 sm:text-sm">
            <span class="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/80 px-3 py-1 text-gold shadow-sm">
              <i class="fa fa-lightbulb-o"></i>
              Praxisnahe Ratgeber
            </span>
            <span class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-slate-600 shadow-sm">
              <i class="fa fa-star"></i>
              Direkt aus der Praxis
            </span>
          </div>
        </header>
        <aside class="space-y-4 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Was dich erwartet</h2>
          <ul class="space-y-3 text-sm text-slate-600">
            <li class="flex items-start gap-3">
              <i class="fa fa-shield text-gold/80"></i>
              Sicherheitstipps für Zuhause und unterwegs
            </li>
            <li class="flex items-start gap-3">
              <i class="fa fa-clock text-gold/80"></i>
              Schritt-für-Schritt-Anleitungen für den Ernstfall
            </li>
            <li class="flex items-start gap-3">
              <i class="fa fa-heart text-gold/80"></i>
              Empfehlungen unserer Community
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-slate-900">Aktuelle Beiträge</h2>
          <p class="text-sm text-slate-500">
            Neue Inhalte erscheinen regelmäßig – speichere deine Favoriten für den Notfall.
          </p>
        </div>
      </div>

      <div v-if="posts.length" class="grid gap-6 md:grid-cols-2">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white/85 p-6 shadow-sm transition hover:border-gold/50 hover:shadow-xl"
        >
          <div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-gold/10 opacity-0 transition group-hover:opacity-100"></div>
          <figure
            v-if="post.coverImage"
            class="-mx-6 -mt-6 mb-6 overflow-hidden border-b border-slate-100/80 bg-slate-100/70"
          >
            <img
              :src="post.coverImage"
              :alt="post.coverImageAlt || post.title"
              class="h-48 w-full object-cover transition duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </figure>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Blog</p>
          <h3 class="mt-3 text-xl font-semibold text-slate-900">{{ post.title }}</h3>
          <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{{ post.excerpt }}</p>
          <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100/60 px-3 py-1">
              <i class="fa fa-calendar"></i>
              {{ post.formattedDate }}
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100/60 px-3 py-1">
              <i class="fa fa-user"></i>
              {{ post.author }}
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100/60 px-3 py-1">
              <i class="fa fa-clock-o"></i>
              {{ post.readingTime }} Min. Lesezeit
            </span>
          </div>
          <RouterLink
            :to="{ name: 'blog-post', params: { slug: post.slug } }"
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:text-gold/80"
          >
            Weiterlesen
            <i class="fa fa-long-arrow-right"></i>
          </RouterLink>
        </article>
      </div>
      <div v-else class="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-slate-500">
        <p class="text-base">Der Blog wird gerade vorbereitet. Schau bald wieder vorbei!</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getBlogPosts } from '../data/blogPosts'

const posts = computed(() => getBlogPosts())
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

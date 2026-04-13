<template>
  <header class="topbar">
    <div class="topbar-title">
      <h2>{{ pageTitle }}</h2>
    </div>
    <div class="topbar-actions">
      <LanguageSwitcher />
      <ProfileMenu
        @show-profile-details="$emit('show-profile-details')"
        @show-tasks="$emit('show-tasks')"
      />
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ProfileMenu from './ProfileMenu.vue'

export default {
  name: 'AppTopbar',
  components: {
    LanguageSwitcher,
    ProfileMenu
  },
  emits: ['show-profile-details', 'show-tasks'],
  setup() {
    const route = useRoute()
    const { t } = useI18n()

    const PAGE_TITLES = {
      '/': () => t('nav.overview'),
      '/inventory': () => t('nav.inventory'),
      '/orders': () => t('nav.orders'),
      '/spending': () => t('nav.finance'),
      '/demand': () => t('nav.demandForecast'),
      '/reports': () => 'Reports'
    }

    const pageTitle = computed(() => {
      const getter = PAGE_TITLES[route.path]
      return getter ? getter() : ''
    })

    return {
      pageTitle
    }
  }
}
</script>

<style scoped>
.topbar {
  height: var(--topbar-height);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--page-padding);
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-title h2 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>

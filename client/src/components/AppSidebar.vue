<template>
  <aside class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidebar-brand">
      <h1>{{ isCollapsed ? brandInitial : t('nav.companyName') }}</h1>
      <span class="subtitle">{{ t('nav.subtitle') }}</span>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :title="isCollapsed ? item.label : undefined"
        class="nav-link"
        :class="{ 'nav-active': isNavActive(item) }"
        active-class=""
        exact-active-class=""
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="toggle-btn" @click="toggleSidebar" :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <svg class="toggle-icon" :class="{ 'rotated': isCollapsed }" viewBox="0 0 20 20">
          <polyline points="13 15 8 10 13 5" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useSidebar } from '../composables/useSidebar'

const ICONS = {
  dashboard: `<svg viewBox="0 0 20 20"><rect x="2" y="2" width="7" height="7" rx="1"/><rect x="11" y="2" width="7" height="7" rx="1"/><rect x="2" y="11" width="7" height="7" rx="1"/><rect x="11" y="11" width="7" height="7" rx="1"/></svg>`,
  box: `<svg viewBox="0 0 20 20"><path d="M2 6l8-3 8 3v8l-8 3-8-3V6z"/><path d="M10 3v16M2 6l8 3 8-3"/></svg>`,
  clipboard: `<svg viewBox="0 0 20 20"><rect x="4" y="3" width="12" height="15" rx="1"/><path d="M7 3V2h6v1"/><line x1="7" y1="8" x2="13" y2="8"/><line x1="7" y1="11" x2="13" y2="11"/><line x1="7" y1="14" x2="11" y2="14"/></svg>`,
  currency: `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/><path d="M10 6v8M7.5 8.5C7.5 7.4 8.6 7 10 7s2.5.4 2.5 1.5-1 1.5-2.5 1.5-2.5.6-2.5 1.5S8.6 13 10 13s2.5-.4 2.5-1.5"/></svg>`,
  trending: `<svg viewBox="0 0 20 20"><polyline points="2 14 7 8 11 11 18 4"/><polyline points="14 4 18 4 18 8"/></svg>`,
  barchart: `<svg viewBox="0 0 20 20"><rect x="3" y="9" width="3" height="8" rx="1"/><rect x="8.5" y="5" width="3" height="12" rx="1"/><rect x="14" y="2" width="3" height="15" rx="1"/></svg>`
}

export default {
  name: 'AppSidebar',
  setup() {
    const { t } = useI18n()
    const { isCollapsed, toggleSidebar } = useSidebar()

    const navItems = computed(() => [
      { path: '/', label: t('nav.overview'), icon: ICONS.dashboard, exact: true },
      { path: '/inventory', label: t('nav.inventory'), icon: ICONS.box, exact: false },
      { path: '/orders', label: t('nav.orders'), icon: ICONS.clipboard, exact: false },
      { path: '/spending', label: t('nav.finance'), icon: ICONS.currency, exact: false },
      { path: '/demand', label: t('nav.demandForecast'), icon: ICONS.trending, exact: false },
      { path: '/reports', label: 'Reports', icon: ICONS.barchart, exact: false }
    ])

    const brandInitial = computed(() => {
      const name = t('nav.companyName')
      return name ? name.charAt(0).toUpperCase() : 'I'
    })

    return {
      t,
      isCollapsed,
      toggleSidebar,
      navItems,
      brandInitial
    }
  },
  methods: {
    isNavActive(item) {
      const path = this.$route.path
      if (item.exact) {
        return path === item.path
      }
      return path === item.path || path.startsWith(item.path + '/')
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sidebar-width);
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-4);
  z-index: 100;
  overflow: hidden;
  transition: width 0.2s ease, padding 0.2s ease;
}

.sidebar.is-collapsed {
  width: var(--sidebar-width-collapsed);
  padding-left: var(--space-2);
  padding-right: var(--space-2);
}

.sidebar-brand {
  padding: 0 4px;
  flex-shrink: 0;
}

.sidebar-brand h1 {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.is-collapsed .sidebar-brand h1 {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}

.subtitle {
  color: var(--text-sidebar);
  font-size: 11px;
  opacity: 0.7;
  display: block;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.15s, max-height 0.2s;
  max-height: 20px;
}

.sidebar.is-collapsed .subtitle {
  opacity: 0;
  max-height: 0;
}

.sidebar-nav {
  margin-top: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-sidebar);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.is-collapsed .nav-link {
  padding: 10px 0;
  justify-content: center;
  gap: 0;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.nav-link.nav-active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-sidebar-active);
  box-shadow: inset 3px 0 0 var(--accent);
}

.sidebar.is-collapsed .nav-link.nav-active {
  box-shadow: none;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.12);
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.nav-icon :deep(svg) {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 1.75;
  fill: none;
  flex-shrink: 0;
}

.nav-label {
  transition: opacity 0.15s, max-width 0.2s;
  opacity: 1;
  max-width: 200px;
  overflow: hidden;
}

.sidebar.is-collapsed .nav-label {
  opacity: 0;
  max-width: 0;
}

.sidebar-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: auto;
}

.sidebar.is-collapsed .sidebar-footer {
  justify-content: center;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-sidebar);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.toggle-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  transition: transform 0.2s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}
</style>

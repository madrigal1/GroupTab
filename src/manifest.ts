import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'GroupTab',
  description:
    'Group tab is a keyboard driven tab manager to allow you to manage multi page workflows with ease.',
  version: '0.0.0.1',
  manifest_version: 3,
  icons: {
    '16': 'img/icon_black.png',
    '32': 'img/icon_black.png',
    '48': 'img/icon_black.png',
    '128': 'img/icon_black.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/icon_black.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/content/index.ts'],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'img/icon_black.png',
        'img/icon_green.png',
        'img/logo-16.png',
        'img/logo-34.png',
        'img/logo-48.png',
        'img/logo-128.png',
      ],
      matches: [],
    },
  ],
  permissions: ['tabGroups', 'tabs', 'activeTab', 'storage', 'unlimitedStorage', 'scripting'],
})

import liveReload from 'vite-plugin-live-reload'

export default {
  base: '/dist/',
  plugins: [
    liveReload('src/*.*'),
  ]
}
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://aps-codepen.autodesk.io',
        changeOrigin: true,
        secure: false
      }
    }
  }
}


import { defineStore } from "pinia";
import pages from '@/pages.json'

export const useStore = defineStore('store', {
  state: () => ({
    images: [],
    pages: pages,
    general: [],
    primary_colors: [],
    primary_color: null,
    secondary_colors: [],
    secondary_color: null,
    border_radius: [],
    radius: null
  }),

  getters: {
    getImageBySlug: (state) => {
      return (slug) => state.images.find((img) => img.slug === slug)
    },

    getPageBySlug: (state) => {
      return (slug) => state.pages.find((p) => p.slug === slug)
    },
  },

  actions: {
    async getImages() {
      try {
        const data = await $fetch('/api/data')

        this.images = data

      } catch (e) {}
 
    },

    // async getPages() {
    //   try {
    //     const pages = await $fetch('/api/pages')

    //     this.pages = pages

    //   } catch (e) {}
 
    // },

    async getGeneral() {
      const general = await $fetch('/api/general')

      this.general = general
      this.primary_color = general.primary_color
      this.secondary_color = general.secondary_color
      this.radius = general.radius
    },

    async getPrimaryColors() {
      const primary_colors = await $fetch('/api/primary_colors')

      this.primary_colors = primary_colors
    },

    async getSecondaryColors() {
      const secondary_colors = await $fetch('/api/secondary_colors')

      this.secondary_colors = secondary_colors
    },

    async getBorderRadius() {
      const border_radius = await $fetch('/api/border_radius') 

      this.border_radius = border_radius
    },

    async updateStyle() {
      try {
        const style = await $fetch('/api/style', {
          method: 'PATCH',
          body: {
            id: this.general.id,
            primary_color: this.primary_color.id,
            secondary_color: this.secondary_color.id,
            radius: this.radius.id
          }
        })

        console.log('Updated general:', style)
      } catch (e) {
        console.error('Update failed:', e)
      }
    }
  }
});

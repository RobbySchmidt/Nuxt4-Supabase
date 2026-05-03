import { defineStore } from "pinia";

export const useStore = defineStore('store', {
  state: () => ({
    images: [],
    pages: [],
    general: [],
    primary_colors: [],
    primary_color: null,
    secondary_colors: [],
    secondary_color: null,
    border_radius: [],
    radius: null,
    task: '',
    tasks: []
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
        this.images = await $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'select',
            table: 'data',
            select: '*',
            order: [{ column: 'sort', ascending: true }],
          },
        })
      } catch (e) {
        console.error(e)
      }
    },

    async getPages() {
      try {
        this.pages = await $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'select',
            table: 'pages',
            select: '*, components(*, type(type))',
            order: [
              { column: 'sort', ascending: true },
              { column: 'sort', ascending: true, foreignTable: 'components' },
            ],
          },
        })
      } catch (e) {
        console.error(e)
      }
    },

    async getGeneral() {
      const general = await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'select',
          table: 'general',
          select: '*, primary_color(color), secondary_color(color), radius(value)',
          single: true,
        },
      })

      this.general = general
      this.primary_color = general.primary_color
      this.secondary_color = general.secondary_color
      this.radius = general.radius
    },

    async getPrimaryColors() {
      this.primary_colors = await $fetch('/api/data', {
        method: 'POST',
        body: { action: 'select', table: 'primary_colors', select: '*' },
      })
    },

    async getSecondaryColors() {
      this.secondary_colors = await $fetch('/api/data', {
        method: 'POST',
        body: { action: 'select', table: 'secondary_colors', select: '*' },
      })
    },

    async getBorderRadius() {
      this.border_radius = await $fetch('/api/data', {
        method: 'POST',
        body: { action: 'select', table: 'border_radius', select: '*' },
      })
    },

    async updateStyle() {
      try {
        const style = await $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'update',
            table: 'general',
            single: true,
            values: {
              primary_color: this.primary_color.id,
              secondary_color: this.secondary_color.id,
              radius: this.radius.id,
            },
            filters: [{ column: 'id', operator: 'eq', value: this.general.id }],
          },
        })

        console.log('Updated general:', style)
      } catch (e) {
        console.error('Update failed:', e)
      }
    },

    async getTasks() {
      this.tasks = await $fetch('/api/data', {
        method: 'POST',
        body: { action: 'select', table: 'tasks', select: '*' },
      })
    },

    async addTask() {
      if (!this.task) return

      try {
        const task = await $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'insert',
            table: 'tasks',
            single: true,
            values: { task: this.task },
          },
        })

        this.task = ''

        await this.getTasks()

        console.log('New task added:', task)
      } catch (e) {
        console.error('adding task failed:', e)
      }
    },

    async checkTask(task) {
      task.done = !task.done

      try {
        const updated = await $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'update',
            table: 'tasks',
            single: true,
            values: { done: task.done },
            filters: [{ column: 'id', operator: 'eq', value: task.id }],
          },
        })

        console.log('Updated task:', updated)
      } catch (e) {
        console.error('Update failed:', e)
      }
    },

    async deleteTask(id) {
      try {
        const deleted = await $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'delete',
            table: 'tasks',
            single: true,
            filters: [{ column: 'id', operator: 'eq', value: id }],
          },
        })

        await this.getTasks()

        console.log('Task deleted:', deleted)
      } catch (e) {
        console.error('falied to delete task:', e)
      }
    }
  }
});

import { defineStore } from "pinia";
import { toast } from 'vue-sonner'
import { initialContentFor } from "~/lib/blockSchemas";

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
    tasks: [],
    types: [],
  }),

  getters: {
    getImageBySlug: (state) => {
      return (slug) => state.images.find((img) => img.slug === slug)
    },

    getPageBySlug: (state) => {
      return (slug) => state.pages.find((p) => p.slug === slug)
    },

    getPageById: (state) => {
      return (id) => state.pages.find((p) => p.id === id)
    },

    homePage: (state) => state.pages.find((p) => p.is_home),
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
      return await $fetch('/api/data', {
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

        toast.success('New task added')
      } catch (e) {
        toast.error('adding task failed')
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

        toast.success('Task updated')
      } catch (e) {
        toast.error('failed to update Task')
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

        toast.success('Task deleted')
      } catch (e) {
        toast.error('failed to delete Task')
        console.error('falied to delete task:', e)
      }
    },

    async getTypes() {
      this.types = await $fetch('/api/data', {
        method: 'POST',
        body: { action: 'select', table: 'types', select: '*' },
      })
    },

    async addPage(title, slug) {
      const nextSort = this.pages.length
        ? Math.max(...this.pages.map(p => p.sort ?? 0)) + 1
        : 1

      const created = await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'insert',
          table: 'pages',
          single: true,
          values: { title, slug, sort: nextSort },
        },
      })

      await this.getPages()
      return created
    },

    async updatePage(id, fields) {
      const updated = await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'update',
          table: 'pages',
          single: true,
          values: fields,
          filters: [{ column: 'id', operator: 'eq', value: id }],
        },
      })

      await this.getPages()
      return updated
    },

    async deletePage(id) {
      await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'delete',
          table: 'components',
          filters: [{ column: 'page', operator: 'eq', value: id }],
        },
      })

      await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'delete',
          table: 'pages',
          single: true,
          filters: [{ column: 'id', operator: 'eq', value: id }],
        },
      })

      await this.getPages()
    },

    async reorderPages(items) {
      await Promise.all(items.map(({ id, sort }) =>
        $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'update',
            table: 'pages',
            single: true,
            values: { sort },
            filters: [{ column: 'id', operator: 'eq', value: id }],
          },
        })
      ))

      await this.getPages()
    },

    async addDataItem({ title, slug, image, text }) {
      const nextSort = this.images.length
        ? Math.max(...this.images.map(d => d.sort ?? 0)) + 1
        : 1

      const created = await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'insert',
          table: 'data',
          single: true,
          values: {
            title,
            slug,
            sort: nextSort,
            content: { image: image ?? '', text: text ?? '' },
          },
        },
      })

      await this.getImages()
      return created
    },

    async updateDataItem(id, { title, slug, image, text }) {
      const updated = await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'update',
          table: 'data',
          single: true,
          values: {
            title,
            slug,
            content: { image: image ?? '', text: text ?? '' },
          },
          filters: [{ column: 'id', operator: 'eq', value: id }],
        },
      })

      await this.getImages()
      return updated
    },

    async deleteDataItem(id) {
      await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'delete',
          table: 'data',
          single: true,
          filters: [{ column: 'id', operator: 'eq', value: id }],
        },
      })

      await this.getImages()
    },

    async reorderData(items) {
      await Promise.all(items.map(({ id, sort }) =>
        $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'update',
            table: 'data',
            single: true,
            values: { sort },
            filters: [{ column: 'id', operator: 'eq', value: id }],
          },
        })
      ))

      await this.getImages()
    },

    async setAsHome(id) {
      await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'update',
          table: 'pages',
          values: { is_home: false },
          filters: [{ column: 'is_home', operator: 'eq', value: true }],
        },
      })

      await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'update',
          table: 'pages',
          single: true,
          values: { is_home: true },
          filters: [{ column: 'id', operator: 'eq', value: id }],
        },
      })

      await this.getPages()
    },

    async addComponent(pageId, typeId, typeName) {
      const page = this.getPageById(pageId)
      const nextSort = page?.components?.length
        ? Math.max(...page.components.map(c => c.sort ?? 0)) + 1
        : 1

      const created = await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'insert',
          table: 'components',
          single: true,
          values: {
            page: pageId,
            type: typeId,
            sort: nextSort,
            content: initialContentFor(typeName),
          },
        },
      })

      await this.getPages()
      return created
    },

    async updateComponent(id, content) {
      const updated = await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'update',
          table: 'components',
          single: true,
          values: { content },
          filters: [{ column: 'id', operator: 'eq', value: id }],
        },
      })

      const page = this.pages.find(p => p.components?.some(c => c.id === id))
      if (page) {
        const block = page.components.find(c => c.id === id)
        if (block) block.content = content
      }

      return updated
    },

    async deleteComponent(id) {
      await $fetch('/api/data', {
        method: 'POST',
        body: {
          action: 'delete',
          table: 'components',
          single: true,
          filters: [{ column: 'id', operator: 'eq', value: id }],
        },
      })

      await this.getPages()
    },

    async reorderComponents(items) {
      await Promise.all(items.map(({ id, sort }) =>
        $fetch('/api/data', {
          method: 'POST',
          body: {
            action: 'update',
            table: 'components',
            single: true,
            values: { sort },
            filters: [{ column: 'id', operator: 'eq', value: id }],
          },
        })
      ))

      await this.getPages()
    },
  }
});

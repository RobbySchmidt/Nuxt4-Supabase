export const blockSchemas = {
  herobanner: {
    label: 'Hero Banner',
    fields: [
      { key: 'title', type: 'text', label: 'Title', hint: 'Use <br> for line breaks' },
    ],
    initial: { title: '' },
  },
  title: {
    label: 'Title',
    fields: [
      { key: 'title', type: 'text', label: 'Title' },
    ],
    initial: { title: '' },
  },
  text: {
    label: 'Text',
    fields: [
      { key: 'text', type: 'textarea', label: 'Text', hint: 'HTML allowed' },
    ],
    initial: { text: '' },
  },
  imageText: {
    label: 'Image + Text',
    fields: [
      { key: 'image', type: 'image', label: 'Image' },
      { key: 'text', type: 'textarea', label: 'Text', hint: 'HTML allowed' },
    ],
    initial: { image: '', text: '' },
  },
  card: {
    label: 'Card Grid',
    repeater: true,
    item: {
      fields: [
        { key: 'image', type: 'image', label: 'Image' },
        { key: 'title', type: 'text', label: 'Title' },
        { key: 'text', type: 'textarea', label: 'Text', hint: 'Shown on the detail page. HTML allowed.' },
        { key: 'slug', type: 'text', label: 'Detail URL slug', hint: 'Letters, numbers, dashes only' },
      ],
      initial: { image: '', title: '', text: '', slug: '' },
    },
    initial: [],
  },
  imageSlider: {
    label: 'Image Slider',
    repeater: true,
    item: {
      fields: [
        { key: 'image', type: 'image', label: 'Image' },
        { key: 'title', type: 'text', label: 'Title' },
      ],
      initial: { image: '', title: '' },
    },
    initial: [],
  },
  accordion: {
    label: 'Accordion',
    repeater: true,
    item: {
      fields: [
        { key: 'title', type: 'text', label: 'Title' },
        { key: 'text', type: 'textarea', label: 'Text', hint: 'HTML allowed' },
      ],
      initial: { title: '', text: '' },
    },
    initial: [],
  },
  categories: {
    label: 'Categories',
    fields: [],
    initial: null,
  },
  tasks: {
    label: 'Tasks',
    fields: [],
    initial: null,
  },
}

export function initialContentFor(typeName) {
  const schema = blockSchemas[typeName]
  if (!schema) return null
  return structuredClone(schema.initial)
}

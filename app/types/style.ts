export type Category = "nature" | "science" | "comedy"

export type Categories = {
  id: string,
  category: Category
}

export type Appointment = {
  id: string
  item: string
  categories: Categories[]
}
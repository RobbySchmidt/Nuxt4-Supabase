import type { Category } from "@/types/items"

export function categoryUi(c: Category) {
  if (c === "nature") return { cls: "bg-green-500 text-white" }
  if (c === "science") return { cls: "bg-yellow-500 text-white" }
  return { cls: "bg-blue-500 text-white" }
}
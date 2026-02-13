<script setup lang="ts">
import type { WithClassAsProps } from "./interface"
import type { ButtonVariants } from '@/components/ui/button'
import { MoveRight } from "lucide-vue-next"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { useCarousel } from "./useCarousel"

const props = withDefaults(defineProps<{
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
}
& WithClassAsProps>(), {
  variant: "empty",
  size: "empty",
})

const { orientation, canScrollNext, scrollNext } = useCarousel()
</script>

<template>
  <Button
    data-slot="carousel-next"
    :disabled="!canScrollNext"
    :class="cn(
      'absolute',
      orientation === 'horizontal'
        ? 'right-0 xl:right-1/3 pt-1'
        : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      props.class,
    )"
    :variant="variant"
    :size="size"
    @click="scrollNext"
  >
    <slot>
      <MoveRight class="size-7 text-primary"/>
      <span class="sr-only">Next Slide</span>
    </slot>
  </Button>
</template>

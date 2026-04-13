<script>
export default {
  props: {
    title: {
      type: String,
    },
  },
};
</script>

<template>
  <div
    v-if="title || social"
    class="bg-[#013645]/40 flex absolute w-full bottom-0 left-0 py-0.5 px-4 text-xs"
  >
    <div class="w-7/12 text-left flex items-center">
      {{ title }}
    </div>
    <div class="w-5/12 flex justify-end">
      <slot />
    </div>
  </div>
</template>

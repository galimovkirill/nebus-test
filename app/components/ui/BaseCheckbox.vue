<template>
  <label class="checkbox" :class="{ 'checkbox--disabled': disabled }">
    <input v-model="model" class="checkbox__control" type="checkbox" :disabled="disabled" />

    <span v-if="$slots.default" class="checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const model = defineModel<boolean>({ default: false })
</script>

<style lang="scss" scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  cursor: pointer;

  &__control {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: var(--c-accent);
    cursor: inherit;
  }

  &--disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}
</style>

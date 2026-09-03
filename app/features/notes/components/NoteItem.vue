<template>
  <li class="note-item" :class="{ 'note-item--done': done }">
    <BaseCheckbox v-model="done" :disabled="!editable" />

    <BaseInput
      v-model="text"
      class="note-item__text"
      :disabled="!editable"
      borderless
      :placeholder="placeholder"
    />
  </li>
</template>

<script lang="ts" setup>
import BaseCheckbox from '~/components/ui/BaseCheckbox.vue'
import BaseInput from '~/components/ui/BaseInput.vue'

withDefaults(
  defineProps<{
    editable?: boolean
    placeholder?: string
  }>(),
  {
    editable: false,
    placeholder: ''
  }
)

const done = defineModel<boolean>('done', { default: false })
const text = defineModel<string>('text', { default: '' })
</script>

<style lang="scss" scoped>
.note-item {
  display: flex;
  align-items: center;
  gap: $space-2;

  &__text {
    padding: 0;

    &,
    &:disabled {
      opacity: 1;
    }
  }

  &--done &__text {
    color: var(--c-text-muted);
    text-decoration: line-through;
  }
}
</style>

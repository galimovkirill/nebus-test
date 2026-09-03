<template>
  <input
    v-model="model"
    class="input"
    :class="{ 'input--borderless': borderless }"
    :type
    :placeholder
    :disabled
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'text' | 'email' | 'password' | 'search'
    placeholder?: string
    disabled?: boolean
    borderless?: boolean
  }>(),
  {
    type: 'text',
    placeholder: '',
    disabled: false,
    borderless: false
  }
)

const model = defineModel<string>({ default: '' })
</script>

<style lang="scss" scoped>
.input {
  width: 100%;
  min-height: 40px;
  padding: 0 $space-3;
  border: 1px solid var(--c-border-strong);
  border-radius: $radius-md;
  background: var(--c-surface);

  &::placeholder {
    color: var(--c-text-subtle);
  }

  &:focus {
    outline: none;
    border-color: var(--c-focus);
  }

  &--borderless {
    border-color: transparent;

    &:focus {
      border-color: transparent;
    }
  }
}
</style>

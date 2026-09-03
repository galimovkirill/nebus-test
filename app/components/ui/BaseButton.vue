<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['button', `button--${variant}`, `button--${size}`]"
  >
    <Icon v-if="icon" :name="icon" />

    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'text' | 'danger'
    size?: 'md' | 'sm'
    type?: 'button' | 'submit'
    disabled?: boolean
    icon?: string
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    type: 'button',
    disabled: false,
    icon: ''
  }
)
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  gap: $space-2;
  border-radius: $radius-md;
  font-weight: 500;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &--md {
    min-height: 40px;
    padding: 0 $space-4;
  }

  &--sm {
    min-height: 32px;
    padding: 0 $space-3;
    font-size: 14px;
  }

  &--primary {
    background: var(--c-accent);
    color: var(--c-text-inverse);

    &:hover:not(:disabled) {
      background: var(--c-accent-hover);
    }
  }

  &--secondary {
    background: var(--c-surface);
    border-color: var(--c-border-strong);
    color: var(--c-text);

    &:hover:not(:disabled) {
      background: var(--c-surface-muted);
    }
  }

  &--text,
  &--danger {
    background: transparent;
    padding: 0;
    min-height: auto;

    &:hover:not(:disabled) {
      background: inherit;
    }
  }

  &--text {
    color: var(--c-accent);

    &:hover:not(:disabled) {
      color: var(--c-accent-hover);
    }
  }

  &--danger {
    color: var(--c-danger);

    &:hover:not(:disabled) {
      color: var(--c-danger-hover);
    }
  }
}
</style>

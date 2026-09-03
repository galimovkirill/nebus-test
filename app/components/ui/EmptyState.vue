<template>
  <div class="empty-state">
    <h2 class="empty-state__title">
      <slot name="title"></slot>
    </h2>

    <p v-if="$slots.description" class="empty-state__description">
      <slot name="description"></slot>
    </p>

    <div v-if="$slots.actions" class="empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-7 $space-4;
  border: 1px dashed var(--c-border-strong);
  border-radius: $radius-lg;
  background: var(--c-surface);
  text-align: center;

  &__title {
    font-size: 20px;
    font-weight: 600;
  }

  &__description {
    max-width: 42ch;
    color: var(--c-text-muted);
  }

  &__actions {
    margin-top: $space-2;
  }
}
</style>

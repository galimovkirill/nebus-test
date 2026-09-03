<template>
  <Teleport to="body">
    <div v-if="open" class="modal" @click.self="close">
      <div class="modal__window">
        <header v-if="$slots.title" class="modal__header">
          <h2 class="modal__title">
            <slot name="title"></slot>
          </h2>
        </header>

        <div class="modal__body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const open = defineModel<boolean>('open', { required: true })

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

watch(open, (value) => {
  if (value) {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-4;
  background: rgba(16, 24, 40, 0.45);

  &__window {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    width: 100%;
    max-width: 480px;
    max-height: 100%;
    padding: $space-5;
    border-radius: $radius-lg;
    background: var(--c-surface);
    box-shadow: var(--shadow-lg);
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
  }

  &__body {
    overflow-y: auto;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: $space-2;
    border-top: 1px solid var(--c-border-strong);
    padding-top: $space-4;
  }
}
</style>

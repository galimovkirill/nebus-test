<template>
  <BaseModal v-model:open="open">
    <template #title>{{ title }}</template>

    <p class="confirm-modal__message">{{ message }}</p>

    <template #footer>
      <BaseButton variant="text" autofocus @click="open = false">{{ cancelText }}</BaseButton>

      <BaseButton :variant="danger ? 'danger' : 'primary'" @click="confirm">
        {{ confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

withDefaults(
  defineProps<{
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
  }>(),
  {
    confirmText: 'Подтвердить',
    cancelText: 'Отмена',
    danger: false
  }
)

const emit = defineEmits<{
  confirm: []
}>()

const open = defineModel<boolean>('open', { required: true })

const confirm = () => {
  emit('confirm')
  open.value = false
}
</script>

<style lang="scss" scoped>
.confirm-modal__message {
  color: var(--c-text-muted);
}
</style>

<template>
  <BaseModal v-model:open="open">
    <template #title>Создать новую заметку</template>

    <NoteForm @saved="open = false" @cancel="open = false" />
  </BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '~/components/ui/BaseModal.vue'
import NoteForm from '~/features/notes/components/NoteForm.vue'

const open = defineModel<boolean>('open', { required: true })
</script>

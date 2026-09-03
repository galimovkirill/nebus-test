<template>
  <BaseModal v-model:open="open" class="new-note">
    <template #title>Создать новую заметку</template>

    <div>
      <NoteItem text="Помыть посуду" editable />
    </div>

    <BaseButton variant="text" class="new-note__add">Добавить пункт</BaseButton>

    <template #footer>
      <BaseButton class="new-note__add" @click="open = false">Закрыть</BaseButton>
      <BaseButton class="new-note__add" variant="primary">Сохранить</BaseButton>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import NoteItem from '~/features/notes/components/NoteItem.vue'

const open = defineModel<boolean>('open', { required: true })
</script>

<style lang="scss">
.new-note {
  &__add {
    margin-top: 8px;
  }
}
</style>

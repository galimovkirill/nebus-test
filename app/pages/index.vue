<template>
  <div class="notes-page">
    <EmptyState>
      <template #title>Пока ни одной заметки</template>

      <template #description>
        Создайте первую — в ней можно вести список задач и отмечать выполненное.
      </template>

      <template #actions>
        <BaseButton variant="primary">Новая заметка</BaseButton>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
</script>

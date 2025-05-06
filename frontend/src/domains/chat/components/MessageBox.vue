<script setup lang="ts">
import { TheTextarea } from "@/components/ui/textarea";
import { TheButton } from "@/components/ui/button";
import { Send } from "lucide-vue-next";
</script>

<template>
  <div class="h-16 flex gap-2 items-stretch">
    <TheTextarea
      placeholder="Tapez votre message ici..."
      class="resize-none"
    />

    <TheButton
      class="h-full aspect-square"
    >
      <component
        :is="Send"
        class="size-5"
      />
    </TheButton>
  </div>
</template>

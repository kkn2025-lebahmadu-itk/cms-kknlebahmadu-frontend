<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const editor = ref(null)
const content = ref('') // hasil HTML dari editor

const { $quill } = useNuxtApp()

onMounted(() => {
  const quill = new $quill(editor.value, {
    theme: 'snow', // style bawaan
    placeholder: 'Tulis berita di sini...',
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'blockquote', 'code-block', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }]
      ]
    }
  })

  quill.on('text-change', () => {
    content.value = quill.root.innerHTML
  })
})

// Di luar nanti: kamu bisa emit content.value atau simpan langsung
</script>

<template>
  <div class="space-y-4">
    <!-- Editor -->
    <div ref="editor" class="bg-white rounded shadow min-h-[200px] p-4"></div>

    <!-- Preview hasil -->
    <h2 class="text-lg font-semibold">Preview</h2>
    <div class="border p-4 rounded" v-html="content"></div>
  </div>
</template>

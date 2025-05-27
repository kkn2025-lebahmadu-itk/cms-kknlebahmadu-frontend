<template>
  <div class="overflow-auto border rounded text-sm">
    <table class="table-auto border-collapse w-full min-w-[900px]">
      <thead class="bg-gray-100 text-center font-semibold">
        <tr>
          <th class="border px-2 py-1">NO</th>
          <th class="border px-2 py-1">TANGGAL</th>
          <th class="border px-2 py-1">KEGIATAN RT</th>
          <th class="border px-2 py-1">KEMASYARAKATAN</th>
          <th class="border px-2 py-1">EKONOMI</th>
          <th class="border px-2 py-1">SOSBUDAGAMA</th>
          <th class="border px-2 py-1">LINGKUNGAN</th>
          <th class="border px-2 py-1">KESEHATAN</th>
          <th class="border px-2 py-1">JUMLAH</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, i) in kegiatan" :key="i">
          <tr>
            <td class="border px-2 py-1 text-center">{{ i + 1 }}</td>
            <td class="border px-2 py-1 text-center">{{ new Date(item.tanggal).toLocaleDateString('id-ID') }}</td>
            <td class="border px-2 py-1">{{ item.kegiatan }}</td>
            <td class="border px-2 py-1 text-right">{{ format(item.bidang.kemasyarakatan) }}</td>
            <td class="border px-2 py-1 text-right">{{ format(item.bidang.ekonomi) }}</td>
            <td class="border px-2 py-1 text-right">{{ format(item.bidang.sosbudagama) }}</td>
            <td class="border px-2 py-1 text-right">{{ format(item.bidang.lingkungan) }}</td>
            <td class="border px-2 py-1 text-right">{{ format(item.bidang.kesehatan) }}</td>
            <td class="border px-2 py-1 text-right font-semibold">
              {{ format(total(item)) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  kegiatan: {
    type: Array,
    required: true
  }
})

const format = (val) => val ? 'Rp ' + Number(val).toLocaleString('id-ID') : ''
const total = (item) =>
  Object.values(item.bidang).reduce((acc, val) => acc + Number(val || 0), 0)
</script>

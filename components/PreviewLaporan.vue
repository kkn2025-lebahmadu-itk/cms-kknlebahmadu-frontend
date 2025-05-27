<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      rt: '',
      ketua: '',
      lurah: '',
      tanggal: '',
      kegiatan: []
    })
  }
})

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const tanggalFormatted = computed(() => {
  if (!props.data || !props.data.tanggal) return '(Tanggal belum diisi)'
  const [y, m, d] = props.data.tanggal.split('-')
  return `${parseInt(d)} ${bulanList[parseInt(m) - 1]} ${y}`
})

const safeData = computed(() => ({
  rt: props.data?.rt || '-',
  ketua: props.data?.ketua || '(Belum diisi)',
  lurah: props.data?.lurah || '(Belum diisi)',
  kegiatan: Array.isArray(props.data?.kegiatan) ? props.data.kegiatan : []
}))
</script>

<template>
  <div
    class="w-[297mm] h-[210mm] transform scale-[0.85] origin-top bg-white p-10 shadow text-black text-[11pt] leading-tight overflow-auto mt-10"
  >
    <h2 class="text-center font-bold uppercase">Laporan Bulanan</h2>
    <h3 class="text-center">Pelaksanaan Tugas RT {{ safeData.rt }}</h3>
    <h3 class="text-center mb-6">Kelurahan Telagasari</h3>

    <p class="font-bold mb-2">Bulan: {{ tanggalFormatted }}</p>

    <table class="w-full border border-black text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-black px-1 py-1 w-8">No</th>
          <th class="border border-black px-2 py-1 w-28">Tanggal</th>
          <th class="border border-black px-2 py-1">Uraian</th>
          <th class="border border-black px-2 py-1 w-40">Catatan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(k, i) in safeData.kegiatan" :key="i">
          <td class="border border-black text-center">{{ i + 1 }}</td>
          <td class="border border-black text-center">{{ k.tanggal || '-' }}</td>
          <td class="border border-black">{{ k.deskripsi || '-' }}</td>
          <td class="border border-black text-center">{{ k.catatan || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-between mt-10">
      <div>
        <p>Mengetahui,</p>
        <p class="mb-16">LURAH TELAGASARI</p>
        <p class="underline">{{ safeData.lurah }}</p>
      </div>
      <div class="text-right">
        <p>Balikpapan, {{ tanggalFormatted }}</p>
        <p class="mb-16">Ketua RT. {{ safeData.rt }}</p>
        <p class="underline">{{ safeData.ketua }}</p>
      </div>
    </div>
  </div>
</template>

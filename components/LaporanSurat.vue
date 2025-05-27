<template>
  <div
    ref="printable"
    style="background-color: white; color: black"
    class="w-[1122px] h-[793px] p-10 text-[11pt] leading-tight text-black"
  >
    <h2 class="text-center font-bold uppercase">Laporan Operasional Bulanan</h2>
    <h3 class="text-center">PELAKSANAAN TUGAS DAN FUNGSI RUKUN TETANGGA (RT) 45</h3>
    <h3 class="text-center mb-6">KELURAHAN TELAGASARI</h3>

    <p class="font-bold mb-2">Bulan : {{ bulan.toUpperCase() }} {{ tahun }}</p>

    <table class="w-full border border-black text-sm border-collapse">
      <thead style="background-color: #f3f4f6"> <!-- safe bg-gray-100 replacement -->
        <tr>
          <th class="border border-black px-1 py-1 w-8">NO</th>
          <th class="border border-black px-2 py-1 w-28">TANGGAL</th>
          <th class="border border-black px-2 py-1">URAIAN TUGAS DAN FUNGSI YANG DILAKSANAKAN</th>
          <th class="border border-black px-2 py-1 w-40">KETERANGAN</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in props.data.kegiatan || []" :key="i">
          <td class="border border-black text-center">{{ i + 1 }}</td>
          <td class="border border-black text-center">{{ item.tanggal.replaceAll("-", "/") }}</td>
          <td class="border border-black">{{ item.uraian }}</td>
          <!-- <td class="border border-black text-center">{{ item.keterangan }}</td> -->
          <td class="border border-black text-center break-words whitespace-normal w-40" style="word-break: break-word; max-width: 8rem;">
  {{ item.keterangan }}
</td>

        </tr>
      </tbody>
    </table>

    <div class="flex justify-between mt-10">
      <div>
        <p>Mengetahui,</p>
        <p class="mb-16">LURAH TELAGASARI</p>
        <p class="underline">{{ props.data.namaLurah || '(........................)' }}</p>
      </div>
      <div class="text-right">
        <p>Balikpapan, {{ tanggalLengkap }}</p>
        <p class="mb-16">Ketua RT. 45</p>
        <p class="underline">{{ props.data.namaKetuaRT || '(........................)' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      namaRT: '45',
      namaKetuaRT: '',
      namaLurah: '',
      tanggalSurat: '',
      kegiatan: []
    })
  }
})

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const bulan = computed(() => {
  if (!props.data.tanggalSurat) return ''
  return bulanList[parseInt(props.data.tanggalSurat.split('-')[1]) - 1]
})

const tahun = computed(() => props.data.tanggalSurat?.split('-')[0] || '')

const tanggalLengkap = computed(() => {
  if (!props.data.tanggalSurat) return ''
  const [y, m, d] = props.data.tanggalSurat.split('-')
  return `${parseInt(d)} ${bulanList[parseInt(m) - 1]} ${y}`
})
</script>

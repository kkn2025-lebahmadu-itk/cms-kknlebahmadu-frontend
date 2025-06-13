<template>
  <div
    class="bg-white text-black mx-auto min-h-[793px] p-8 text-[8pt] leading-tight border border-black"
    style="font-family: 'Times New Roman', Times, serif; width: 1122px; height: 793px;"
  >
    <h2 class="text-center font-bold uppercase mb-4">
      LAPORAN KEGIATAN SWADAYA MASYARAKAT RT. 45 KELURAHAN TELAGA SARI {{ computedTriwulan }} TAHUN {{ computedTahun }}
    </h2>

    <table class="border border-black text-[8pt] border-collapse mb-4 mx-auto w-[80%]">
      <thead>
        <tr>
          <th class="border border-black px-1 py-1 w-6" rowspan="2">No</th>
          <th class="border border-black px-1 py-1 w-24" rowspan="2">Tanggal</th>
          <th class="border border-black px-1 py-1 w-32 " rowspan="2" style="font-size:7pt;">Kegiatan RT</th>
          <th class="border border-black px-1 py-1 text-center" colspan="5">BIDANG</th>
          <th class="border border-black px-1 py-1 text-center w-32" rowspan="2">JUMLAH</th>
        </tr>
        <tr>
          <th v-for="b in bidangList" :key="b" class="border border-black px-1 py-1 w-28 text-center" style="font-size:6.5pt;">
            {{ b }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(group, monthIndex) in groupedKegiatan" :key="monthIndex">
          <!-- Month label row -->
          <tr>
            <td class="border border-black px-1 py-1"></td>
            <td class="border border-black px-1 py-1 font-bold uppercase">{{ monthIndex }}</td>
            <td class="border border-black px-1 py-1"></td>
            <td v-for="b in bidangList" :key="b" class="border border-black px-1 py-1"></td>
            <td class="border border-black px-1 py-1"></td>
          </tr>

          <!-- Kegiatan Rows -->
          <tr v-for="(item, i) in group" :key="i">
            <td class="border border-black px-1 py-1 text-center">{{ i + 1 }}</td>
            <td class="border border-black px-1 py-1 ">{{ formatTanggal(item.tanggal) }}</td>
            <td class="border border-black px-1 py-1" style="font-size:7pt;">{{ item.uraian }}</td>
            <td
              v-for="b in bidangList"
              :key="b"
              class="border border-black px-1 py-1 text-right"
            >
              {{ item.bidang === b ? formatRupiah(item.jumlah) : '' }}
            </td>
            <td class="border border-black px-1 py-1 text-right">
              {{ formatRupiah(item.jumlah) }}
            </td>
          </tr>
        </template>
      </tbody>

      <!-- TOTAL row per bidang + jumlah -->
      <tfoot>
        <tr class="font-bold">
          <td colspan="3" class="border border-black px-1 py-1 text-left">TOTAL</td>
          <td v-for="b in bidangList" :key="b" class="border border-black px-1 py-1 text-right">
            {{ formatRupiah(totalPerBidang[b]) }}
          </td>
          <td class="border border-black px-1 py-1 text-right">
            {{ formatRupiah(getGrandTotal()) }}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Signature -->
    <div class="flex justify-end mt-6">
      <div class="text-right">
        <p>Balikpapan, {{ computedTglSuratFormatted }}</p>
        <p class="mb-12">Ketua RT. 45</p>
        <p class="underline">{{ data.namaKetuaRT || '(........................)' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      namaKetuaRT: '',
      kegiatan: [],
      tanggalSurat: '' // format yyyy-mm-dd
    })
  }
})

const data = props.data

const bidangList = [
  'KEMASYARAKATAN',
  'EKONOMI',
  'SOSBUD & AGAMA',
  'LINGKUNGAN',
  'KESEHATAN'
]

const formatRupiah = (num) => {
  if (!num) return ''
  return 'Rp ' + parseInt(num).toLocaleString('id-ID')
}

const formatTanggal = (str) => {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  return `${parseInt(d)} ${bulanList[parseInt(m) - 1]}`
}

const bulanList = [
  'Januari', 'Februari', 'Maret',
  'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September',
  'Oktober', 'November', 'Desember'
]

const getMonthName = (dateStr) => {
  if (!dateStr) return ''
  const m = parseInt(dateStr.split('-')[1]) - 1
  return bulanList[m]?.toUpperCase()
}

const groupedKegiatan = computed(() => {
  const grouped = {}
  for (const item of data.kegiatan) {
    const month = getMonthName(item.tanggal)
    if (!grouped[month]) grouped[month] = []
    grouped[month].push(item)
  }
  return grouped
})

const getSubtotalPerMonth = (group) =>
  group.reduce((sum, k) => sum + (parseInt(k.jumlah) || 0), 0)

const getGrandTotal = () =>
  data.kegiatan.reduce((sum, k) => sum + (parseInt(k.jumlah) || 0), 0)

const totalPerBidang = computed(() => {
  const totals = {
    'KEMASYARAKATAN': 0,
    'EKONOMI': 0,
    'SOSBUD & AGAMA': 0,
    'LINGKUNGAN': 0,
    'KESEHATAN': 0
  }

  data.kegiatan.forEach((item) => {
    if (item.bidang && totals[item.bidang] !== undefined) {
      totals[item.bidang] += parseInt(item.jumlah) || 0
    }
  })

  return totals
})

const computedTriwulan = computed(() => {
  if (!data.tanggalSurat || !data.tanggalSurat.includes('-')) return ''
  const bulan = parseInt(data.tanggalSurat.split('-')[1])
  if (isNaN(bulan)) return ''
  if (bulan >= 1 && bulan <= 3) return 'TRI WULAN I'
  if (bulan >= 4 && bulan <= 6) return 'TRI WULAN II'
  if (bulan >= 7 && bulan <= 9) return 'TRI WULAN III'
  if (bulan >= 10 && bulan <= 12) return 'TRI WULAN IV'
  return ''
})

const computedTahun = computed(() => {
  if (!data.tanggalSurat || !data.tanggalSurat.includes('-')) return ''
  return data.tanggalSurat.split('-')[0]
})

const computedTglSuratFormatted = computed(() => {
  if (!data.tanggalSurat || !data.tanggalSurat.includes('-')) return ''
  const [y, m, d] = data.tanggalSurat.split('-')
  return `${parseInt(d)} ${bulanList[parseInt(m) - 1]} ${y}`
})
</script>

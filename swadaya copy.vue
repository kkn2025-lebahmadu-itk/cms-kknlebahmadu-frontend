<script setup>
import { ref, reactive, onMounted } from 'vue'
import jsPDF from 'jspdf'
import { useReport } from '~/composables/useReport'
import LaporanSwadaya from '~/components/LaporanSwadaya.vue'
import LaporanTriwulan from '~/components/LaporanTriwulan.vue'

const { fetchAllReport, createReport, deleteReport, response, pending, error } = useReport()
const showModal = ref(false)

const manualUpload = reactive({
  file: null,
  is_signed: false,
  kategori: ''
})

const formSwadaya = reactive({
  namaRT: '45',
  namaKetuaRT: '',
  tanggalSurat: '',
  kegiatan: []
})

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const getFormattedTanggal = () => {
  if (!formSwadaya.tanggalSurat) return ''
  const [y, m, d] = formSwadaya.tanggalSurat.split('-')
  return `${parseInt(d)} ${bulanList[parseInt(m) - 1]} ${y}`
}
const getBulan = () => formSwadaya.tanggalSurat ? bulanList[parseInt(formSwadaya.tanggalSurat.split('-')[1]) - 1] : ''
const getTahun = () => formSwadaya.tanggalSurat?.split('-')[0] || ''

const addKegiatan = () => formSwadaya.kegiatan.push({
  tanggal: '',
  uraian: '',
  bidang: '',
  jumlah: 0
})

const removeKegiatan = (i) => formSwadaya.kegiatan.splice(i, 1)

// const generatePDFBlob = () => {
//   const doc = new jsPDF('landscape', 'mm', 'a4')
//   const pageWidth = doc.internal.pageSize.getWidth()
//   const margin = 40
//   const usableWidth = pageWidth - margin * 2
//   const lineHeight = 5

//   doc.setFont('Times', 'bold').setFontSize(11)
//   doc.text('LAPORAN KEGIATAN SWADAYA MASYARAKAT', pageWidth / 2, 20, { align: 'center' })
//   doc.text('RT. 45 KELURAHAN TELAGA SARI', pageWidth / 2, 28, { align: 'center' })
//   doc.text('TRI WULAN II TAHUN 2024', pageWidth / 2, 36, { align: 'center' })

//   doc.setFont('Times', 'normal').setFontSize(11)
//   doc.text(`BULAN : ${getBulan().toUpperCase()} ${getTahun()}`, margin, 48)

//   const startX = margin, startY = 55
//   const colWidths = [10, 30, 130, 28, 28, 28, 28, 28, 32]
//   const headers = ['NO', 'TANGGAL', 'KEGIATAN RT', 'KEMASYARAKATAN', 'EKONOMI', 'SOSBUD & AGAMA', 'LINGKUNGAN', 'KESEHATAN', 'JUMLAH']
//   doc.setFont('Times', 'bold')
//   let currentX = startX
//   headers.forEach((header, i) => {
//     doc.text(header, currentX + colWidths[i] / 2, startY + 6, { align: 'center' })
//     doc.rect(currentX, startY, colWidths[i], 10)
//     currentX += colWidths[i]
//   })

//   let currentY = startY + 10
//   doc.setFont('Times', 'normal')
//   formSwadaya.kegiatan.forEach((k, idx) => {
//     currentX = startX
//     const bidangList = ['KEMASYARAKATAN', 'EKONOMI', 'SOSBUD & AGAMA', 'LINGKUNGAN', 'KESEHATAN']
//     const values = [
//       `${idx + 1}`,
//       k.tanggal.split('-').reverse().join('/'),
//       k.uraian,
//       ...bidangList.map(b => k.bidang === b ? formatRupiah(k.jumlah) : ''),
//       formatRupiah(k.jumlah)
//     ]

//     const textLines = values.map((val, i) => doc.splitTextToSize(val || '', colWidths[i] - 2))
//     const maxLines = Math.max(...textLines.map(l => l.length))
//     const cellHeight = maxLines * lineHeight

//     textLines.forEach((lines, i) => {
//       const centerX = currentX + colWidths[i] / 2
//       const offsetY = (cellHeight - lines.length * lineHeight) / 2
//       const align = i === 2 ? 'left' : 'center'
//       const textX = align === 'center' ? centerX : currentX + 1
//       doc.text(lines, textX, currentY + lineHeight + offsetY - 1, { align })
//       doc.rect(currentX, currentY, colWidths[i], cellHeight)
//       currentX += colWidths[i]
//     })

//     currentY += cellHeight
//   })

//   currentY += 15
//   doc.text(`Balikpapan, ${getFormattedTanggal()}`, pageWidth - margin, currentY, { align: 'right' })
//   doc.text('Mengetahui,', margin, currentY)
//   doc.text('LURAH TELAGASARI', margin, currentY + 6)
//   doc.text(formSwadaya.namaLurah || '(......................)', margin, currentY + 22)
//   doc.text(`Ketua RT. ${formSwadaya.namaRT}`, pageWidth - margin, currentY + 6, { align: 'right' })
//   doc.text(formSwadaya.namaKetuaRT || '(......................)', pageWidth - margin, currentY + 22, { align: 'right' })

//   return doc.output('blob')
// }

const computedTriwulan = () => {
  if (!formSwadaya.tanggalSurat || !formSwadaya.tanggalSurat.includes('-')) return ''
  const bulan = parseInt(formSwadaya.tanggalSurat.split('-')[1])
  if (isNaN(bulan)) return ''
  if (bulan >= 1 && bulan <= 3) return 'TRI WULAN I'
  if (bulan >= 4 && bulan <= 6) return 'TRI WULAN II'
  if (bulan >= 7 && bulan <= 9) return 'TRI WULAN III'
  if (bulan >= 10 && bulan <= 12) return 'TRI WULAN IV'
  return ''
}

const computedTahun = () => {
  if (!formSwadaya.tanggalSurat || !formSwadaya.tanggalSurat.includes('-')) return ''
  return formSwadaya.tanggalSurat.split('-')[0]
}

const getTotalPerBidang = () => {
  const bidangList = ['KEMASYARAKATAN', 'EKONOMI', 'SOSBUD & AGAMA', 'LINGKUNGAN', 'KESEHATAN']
  const totals = {
    'KEMASYARAKATAN': 0,
    'EKONOMI': 0,
    'SOSBUD & AGAMA': 0,
    'LINGKUNGAN': 0,
    'KESEHATAN': 0
  }
  formSwadaya.kegiatan.forEach(k => {
    if (k.bidang && totals[k.bidang] !== undefined) {
      totals[k.bidang] += parseInt(k.jumlah) || 0
    }
  })
  return bidangList.map(b => totals[b])
}



// const generatePDFBlob = () => {
//   const doc = new jsPDF('landscape', 'mm', 'a4')
//   const pageWidth = doc.internal.pageSize.getWidth()
//   const margin = 40
//   const usableWidth = pageWidth - margin * 2
//   const lineHeight = 5

//   doc.setFont('Times', 'bold').setFontSize(11)
//   doc.text('LAPORAN KEGIATAN SWADAYA MASYARAKAT', pageWidth / 2, 20, { align: 'center' })
//   doc.text('RT. 45 KELURAHAN TELAGA SARI', pageWidth / 2, 28, { align: 'center' })
//   doc.text(`${computedTriwulan()} TAHUN ${computedTahun()}`, pageWidth / 2, 36, { align: 'center' })

//   doc.setFont('Times', 'normal').setFontSize(11)
//   doc.text(`BULAN : ${getBulan().toUpperCase()} ${getTahun()}`, margin, 48)

//   const startX = margin, startY = 55
//   const colWidths = [10, 30, 130, 28, 28, 28, 28, 28, 32]
//   const headers = ['NO', 'TANGGAL', 'KEGIATAN RT', 'KEMASYARAKATAN', 'EKONOMI', 'SOSBUD & AGAMA', 'LINGKUNGAN', 'KESEHATAN', 'JUMLAH']
//   doc.setFont('Times', 'bold')
//   let currentX = startX
//   headers.forEach((header, i) => {
//     doc.text(header, currentX + colWidths[i] / 2, startY + 6, { align: 'center' })
//     doc.rect(currentX, startY, colWidths[i], 10)
//     currentX += colWidths[i]
//   })

//   let currentY = startY + 10
//   doc.setFont('Times', 'normal')
//   formSwadaya.kegiatan.forEach((k, idx) => {
//     currentX = startX
//     const bidangList = ['KEMASYARAKATAN', 'EKONOMI', 'SOSBUD & AGAMA', 'LINGKUNGAN', 'KESEHATAN']
//     const values = [
//       `${idx + 1}`,
//       k.tanggal.split('-').reverse().join('/'),
//       k.uraian,
//       ...bidangList.map(b => k.bidang === b ? formatRupiah(k.jumlah) : ''),
//       formatRupiah(k.jumlah)
//     ]

//     const textLines = values.map((val, i) => doc.splitTextToSize(val || '', colWidths[i] - 2))
//     const maxLines = Math.max(...textLines.map(l => l.length))
//     const cellHeight = maxLines * lineHeight

//     textLines.forEach((lines, i) => {
//       const centerX = currentX + colWidths[i] / 2
//       const offsetY = (cellHeight - lines.length * lineHeight) / 2
//       const align = i === 2 ? 'left' : 'center'
//       const textX = align === 'center' ? centerX : currentX + 1
//       doc.text(lines, textX, currentY + lineHeight + offsetY - 1, { align })
//       doc.rect(currentX, currentY, colWidths[i], cellHeight)
//       currentX += colWidths[i]
//     })

//     currentY += cellHeight
//   })

//   // === Tambahkan row TOTAL bidang ===
//   const totalBidang = getTotalPerBidang()
//   const grandTotal = formSwadaya.kegiatan.reduce((sum, k) => sum + (parseInt(k.jumlah) || 0), 0)

//   currentX = startX
//   const totalRowValues = ['', '', 'TOTAL', ...totalBidang.map(n => formatRupiah(n)), formatRupiah(grandTotal)]
//   doc.setFont('Times', 'bold')
//   totalRowValues.forEach((val, i) => {
//     doc.text(val || '', currentX + colWidths[i] / 2, currentY + 6, { align: 'center' })
//     doc.rect(currentX, currentY, colWidths[i], 10)
//     currentX += colWidths[i]
//   })

//   currentY += 25
//   doc.setFont('Times', 'normal').setFontSize(11)
//   doc.text(`Balikpapan, ${getFormattedTanggal()}`, pageWidth - margin, currentY, { align: 'right' })
//   doc.text('Mengetahui,', margin, currentY)
//   doc.text('LURAH TELAGASARI', margin, currentY + 6)
//   doc.text(formSwadaya.namaLurah || '(......................)', margin, currentY + 22)
//   doc.text(`Ketua RT. ${formSwadaya.namaRT}`, pageWidth - margin, currentY + 6, { align: 'right' })
//   doc.text(formSwadaya.namaKetuaRT || '(......................)', pageWidth - margin, currentY + 22, { align: 'right' })

//   return doc.output('blob')
// }


const generatePDFBlob = () => {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const startX = margin
  const lineHeight = 5

  // FIXED colWidths → biar PAS A4
  const colWidths = [10, 25, 80, 25, 25, 25, 25, 25, 25]

  const bidangList = ['KEMASYARAKATAN', 'EKONOMI', 'SOSBUD&AGAMA', 'LINGKUNGAN', 'KESEHATAN']

  // ==== Header ====
  doc.setFont('Times', 'bold').setFontSize(11)
  // doc.text('LAPORAN KEGIATAN SWADAYA MASYARAKAT', pageWidth / 2, 20, { align: 'center' })
  // doc.text('RT. 45 KELURAHAN TELAGA SARI', pageWidth / 2, 28, { align: 'center' })
  // doc.text(`${computedTriwulan()} TAHUN ${computedTahun()}`, pageWidth / 2, 36, { align: 'center' })
  doc.text(
  `LAPORAN KEGIATAN SWADAYA MASYARAKAT RT. 45 KELURAHAN TELAGA SARI ${computedTriwulan()} TAHUN ${computedTahun()}`,
  pageWidth / 2,
  24, // Y pos → kasih agak ke bawah biar proporsional
  { align: 'center' }
)



  doc.setFont('Times', 'normal').setFontSize(8)

  // ==== Header Table 2 row ====
  let currentX = startX
  let startY = 55

  const row1Headers = ['NO', 'TANGGAL', 'KEGIATAN RT', 'BIDANG', '', '', '', '', 'JUMLAH']
  const colSpans = [1, 1, 1, 5, 0, 0, 0, 0, 1]

  doc.setFont('Times', 'bold')
  row1Headers.forEach((header, i) => {
    const span = colSpans[i]
    const width = span > 1 ? colWidths.slice(i, i + span).reduce((a, b) => a + b, 0) : colWidths[i]

    if (header) {
      doc.text(header, currentX + width / 2, startY + 6, { align: 'center' })
    }
    doc.rect(currentX, startY, width, 10)
    currentX += width
  })

  // Row 2 → bidang header
  currentX = startX + colWidths[0] + colWidths[1] + colWidths[2] // skip NO, TANGGAL, KEGIATAN RT
  startY += 10

  bidangList.forEach((bidang, i) => {
    doc.text(bidang, currentX + colWidths[3 + i] / 2, startY + 6, { align: 'center' })
    doc.rect(currentX, startY, colWidths[3 + i], 10)
    currentX += colWidths[3 + i]
  })

  // JUMLAH header (PENTING JANGAN LUPA)
  currentX = startX + colWidths.slice(0, 8).reduce((a, b) => a + b, 0)
  doc.text('JUMLAH', currentX + colWidths[8] / 2, startY + 6, { align: 'center' })
  doc.rect(currentX, startY, colWidths[8], 10)

  // ==== Body ====
  let currentY = startY + 10
  doc.setFont('Times', 'normal')

  formSwadaya.kegiatan.forEach((k, idx) => {
    currentX = startX

    const values = [
      `${idx + 1}`,
      k.tanggal ? k.tanggal.split('-').reverse().join('/') : '',
      k.uraian,
      ...bidangList.map(b => k.bidang === b ? formatRupiah(k.jumlah) : ''),
      formatRupiah(k.jumlah)
    ]

    const textLines = values.map((val, i) => doc.splitTextToSize(val || '', colWidths[i] - 2))
    const maxLines = Math.max(...textLines.map(l => l.length))
    const cellHeight = maxLines * lineHeight

    textLines.forEach((lines, i) => {
      const centerX = currentX + colWidths[i] / 2
      const offsetY = (cellHeight - lines.length * lineHeight) / 2

      let align = 'center'
      if (i === 2) align = 'left' // Kegiatan RT → left
      else if (i >= 3 && i <= 7) align = 'right' // bidang → right
      else if (i === 8) align = 'right' // Jumlah → right

      const textX = align === 'center' ? centerX : (align === 'left' ? currentX + 1 : currentX + colWidths[i] - 2)
      doc.text(lines, textX, currentY + lineHeight + offsetY - 1, { align })
      doc.rect(currentX, currentY, colWidths[i], cellHeight)
      currentX += colWidths[i]
    })

    currentY += cellHeight
  })

  // ==== TOTAL row ====
  const totalBidang = getTotalPerBidang()
  const grandTotal = formSwadaya.kegiatan.reduce((sum, k) => sum + (parseInt(k.jumlah) || 0), 0)

  currentX = startX
  const totalRowValues = ['', '', 'TOTAL', ...totalBidang.map(n => formatRupiah(n)), formatRupiah(grandTotal)]
  doc.setFont('Times', 'bold')
  totalRowValues.forEach((val, i) => {
    const align = (i >= 3 && i <= 7) || i === 8 ? 'right' : 'center'
    const textX = align === 'center' ? currentX + colWidths[i] / 2 : currentX + colWidths[i] - 2
    doc.text(val || '', textX, currentY + 6, { align })
    doc.rect(currentX, currentY, colWidths[i], 10)
    currentX += colWidths[i]
  })

  // ==== Signature ====
  currentY += 25
  doc.setFont('Times', 'normal').setFontSize(11)
  doc.text(`Balikpapan, ${getFormattedTanggal()}`, pageWidth - margin, currentY, { align: 'right' })
  doc.text('Mengetahui,', margin, currentY)
  doc.text('LURAH TELAGASARI', margin, currentY + 6)
  doc.text(formSwadaya.namaLurah || '(......................)', margin, currentY + 22)
  doc.text(`Ketua RT. ${formSwadaya.namaRT}`, pageWidth - margin, currentY + 6, { align: 'right' })
  doc.text(formSwadaya.namaKetuaRT || '(......................)', pageWidth - margin, currentY + 22, { align: 'right' })

  return doc.output('blob')
}



const simpanDanUpload = async () => {
  const pdfBlob = generatePDFBlob()
  const filename = `Laporan_Swadaya_RT_${formSwadaya.namaRT}_${getBulan()}_${getTahun()}.pdf`
  const formData = new FormData()
  formData.append('pdf', pdfBlob, filename)
  formData.append('is_signed', false)
  formData.append('kategori', 'kegiatan_swadaya')

  try {
    await createReport(formData)
    fetchAllReport()
  } catch (err) {
    console.error('❌ Upload gagal:', err)
  }
}

const uploadManual = async () => {
  if (!manualUpload.file || !manualUpload.kategori) {
    alert('Lengkapi file dan kategori terlebih dahulu.')
    return
  }

  const formData = new FormData()
  formData.append('pdf', manualUpload.file)
  formData.append('is_signed', manualUpload.is_signed)
  formData.append('kategori', manualUpload.kategori)

  try {
    await createReport(formData)
    showModal.value = false
    fetchAllReport()
    manualUpload.file = null
    manualUpload.is_signed = false
    manualUpload.kategori = ''
  } catch (err) {
    console.error('❌ Upload manual gagal:', err)
  }
}

const hapusLaporan = async (id) => {
  try {
    await deleteReport(id)
    fetchAllReport()
  } catch (err) {
    console.error('❌ Gagal menghapus laporan:', err)
  }
}

const formatRupiah = (num) => {
  if (!num) return ''
  return 'Rp ' + parseInt(num).toLocaleString('id-ID')
}

onMounted(() => {
  fetchAllReport()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <!-- Modal Upload Manual -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4">
        <h3 class="text-lg font-bold">Upload Manual Laporan PDF</h3>
        <div class="border-4 rounded-sm p-2 border-KKNBlack">
          <input type="file" accept="application/pdf" @change="e => manualUpload.file = e.target.files[0]" />
        </div>
        <label class="flex items-center space-x-2 text-lg">
          <input type="checkbox" v-model="manualUpload.is_signed" />
          <span>Sudah Ditandatangani</span>
        </label>
        <label class="block">
          <span class="text-sm font-medium">Kategori</span>
          <select v-model="manualUpload.kategori" class="w-full border rounded px-3 py-2 mt-1">
            <option disabled value="">-- Pilih Kategori --</option>
            <option value="kegiatan_swadaya">Laporan Kegiatan Swadaya</option>
            <option value="dana_operasional">Laporan Dana Operasional</option>
          </select>
        </label>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showModal = false" class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
          <button @click="uploadManual" class="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">Upload</button>
        </div>
      </div>
    </div>

    <!-- Daftar Laporan -->
    <section class="bg-white dark:bg-KKNBlack p-6 rounded shadow border">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Daftar Laporan</h2>
        <button @click="showModal = true" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">+ Upload Manual</button>
      </div>
      <div v-if="pending" class="text-gray-500">🔄 Memuat data laporan...</div>
      <div v-else-if="error" class="text-red-500">❌ {{ error }}</div>
      <div v-else-if="!response?.reports?.length" class="text-gray-600">Belum ada laporan.</div>
      <div class="overflow-x-auto">
        <table class="min-w-[700px] w-full table-auto border border-collapse border-gray-300 text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="border px-2 py-1">ID</th>
              <th class="border px-2 py-1">File</th>
              <th class="border px-2 py-1">Kategori</th>
              <th class="border px-2 py-1">TTD</th>
              <th class="border px-2 py-1">PDF</th>
              <th class="border px-2 py-1">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in response.reports" :key="report.id">
              <td class="border px-2 py-1 text-center">{{ report.id }}</td>
              <td class="border px-2 py-1">{{ report.pdf?.split('/').pop() || "Tidak Ada File" }}</td>
              <td class="border px-2 py-1 text-center">{{ report.kategori?.replace("_"," ").toUpperCase() || '-' }}</td>
              <td class="border px-2 py-1 text-center">
                <span :class="report.is_signed ? 'text-green-600' : 'text-yellow-600'">
                  {{ report.is_signed ? 'Sudah' : 'Belum' }}
                </span>
              </td>
              <td class="border px-2 py-1">
                <a v-if="report.pdf" :href="report.pdf" target="_blank" class="text-blue-600 underline hover:text-blue-800">Lihat</a>
                <span v-else class="text-gray-400 italic">Tidak Ada</span>
              </td>
              <td class="border px-2 py-1 text-center">
                <button @click="hapusLaporan(report.id)" class="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Generator Laporan Swadaya -->
    <section class="bg-white dark:bg-KKNBlack p-6 rounded shadow border space-y-4">
      <h2 class="text-2xl font-bold text-center">Generator Laporan Swadaya RT 45</h2>
      <div class="grid md:grid-cols-3 gap-4">
        
        <input v-model="formSwadaya.namaKetuaRT" placeholder="Nama Ketua RT" class="border px-3 py-2 rounded w-full" />
        <input v-model="formSwadaya.tanggalSurat" type="date" class="border px-3 py-2 rounded w-full" />


      </div>

      <h3 class="text-lg font-semibold">Daftar Kegiatan</h3>
      <div v-for="(item, i) in formSwadaya.kegiatan" :key="i" class="grid grid-cols-6 gap-2 items-center">
        <input v-model="item.tanggal" type="date" class="border px-3 py-2 rounded w-full" />
        <input v-model="item.uraian" placeholder="Uraian" class="border px-3 py-2 rounded w-full col-span-2" />
        <select v-model="item.bidang" class="border px-3 py-2 rounded w-full">
          <option disabled value="">Bidang</option>
          <option>KEMASYARAKATAN</option>
          <option>EKONOMI</option>
          <option>SOSBUD & AGAMA</option>
          <option>LINGKUNGAN</option>
          <option>KESEHATAN</option>
        </select>
        <input v-model.number="item.jumlah" type="number" placeholder="Jumlah (Rp)" class="border px-3 py-2 rounded w-full" />
        <button @click="removeKegiatan(i)" class="text-red-600 text-lg hover:text-red-800">✕</button>
      </div>
      <button @click="addKegiatan" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">+ Tambah Kegiatan</button>
    </section>

    <div class="flex justify-end">
      <button @click="simpanDanUpload" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm mt-2">
        ⬆️ Simpan & Upload PDF
      </button>
    </div>

    <!-- Preview -->
    <section class="bg-white p-6 rounded shadow border">
      <h2 class="text-xl font-semibold mb-4">Preview Laporan Swadaya</h2>
      <div class="flex justify-center">
        <LaporanTriwulan :data="formSwadaya" />
      </div>
    </section>
  </div>
</template>

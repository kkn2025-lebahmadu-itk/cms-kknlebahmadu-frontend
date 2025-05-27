<script setup>
import { ref, reactive, onMounted } from 'vue'
import jsPDF from 'jspdf'
import { useReport } from '~/composables/useReport'
import LaporanSurat from '~/components/LaporanSurat.vue'

const { fetchAllReport, createReport, deleteReport, response, pending, error } = useReport()
const showModal = ref(false)
const manualUpload = reactive({
  file: null,
  is_signed: false
})

onMounted(() => {
  fetchAllReport()
})

const form = reactive({
  namaRT: '45',
  namaKetuaRT: '',
  namaLurah: '',
  tanggalSurat: '',
  kegiatan: []
})

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const getFormattedTanggal = () => {
  if (!form.tanggalSurat) return ''
  const [y, m, d] = form.tanggalSurat.split('-')
  return `${parseInt(d)} ${bulanList[parseInt(m) - 1]} ${y}`
}
const getBulan = () => form.tanggalSurat ? bulanList[parseInt(form.tanggalSurat.split('-')[1]) - 1] : ''
const getTahun = () => form.tanggalSurat?.split('-')[0] || ''

const addKegiatan = () => form.kegiatan.push({ tanggal: '', uraian: '', keterangan: '' })
const removeKegiatan = (i) => form.kegiatan.splice(i, 1)

const generatePDFBlob = () => {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  const usableWidth = pageWidth - margin * 2
  const lineHeight = 5

  doc.setFont('Times', 'bold').setFontSize(11)
  doc.text('LAPORAN BULANAN', pageWidth / 2, 20, { align: 'center' })
  doc.text('PELAKSANAAN TUGAS DAN FUNGSI RUKUN TETANGGA (RT) 45', pageWidth / 2, 28, { align: 'center' })
  doc.text('KELURAHAN TELAGASARI', pageWidth / 2, 36, { align: 'center' })

  doc.setFont('Times', 'normal').setFontSize(11)
  doc.text(`BULAN : ${getBulan().toUpperCase()} ${getTahun()}`, margin, 48)

  const startX = margin, startY = 55
  const colWidths = [10, 30, 130, usableWidth - (10 + 30 + 130)]
  const headers = ['NO', 'TANGGAL', 'URAIAN TUGAS DAN FUNGSI YANG DILAKSANAKAN', 'KETERANGAN']
  doc.setFont('Times', 'bold')
  let currentX = startX
  headers.forEach((header, i) => {
    doc.text(header, currentX + colWidths[i] / 2, startY + 6, { align: 'center' })
    doc.rect(currentX, startY, colWidths[i], 10)
    currentX += colWidths[i]
  })

  let currentY = startY + 10
  doc.setFont('Times', 'normal')
  form.kegiatan.forEach((k, idx) => {
    currentX = startX
    const values = [`${idx + 1}`, k.tanggal.split('-').reverse().join('/'), k.uraian, k.keterangan]
    const textLines = values.map((val, i) => doc.splitTextToSize(val || '', colWidths[i] - 2))
    const maxLines = Math.max(...textLines.map(l => l.length))
    const cellHeight = maxLines * lineHeight

    textLines.forEach((lines, i) => {
      const centerX = currentX + colWidths[i] / 2
      const offsetY = (cellHeight - lines.length * lineHeight) / 2
      const align = i === 2 ? 'left' : 'center'
      const textX = align === 'center' ? centerX : currentX + 1
      doc.text(lines, textX, currentY + lineHeight + offsetY - 1, { align })
      doc.rect(currentX, currentY, colWidths[i], cellHeight)
      currentX += colWidths[i]
    })

    currentY += cellHeight
  })

  currentY += 15
  doc.text(`Balikpapan, ${getFormattedTanggal()}`, pageWidth - margin, currentY, { align: 'right' })
  doc.text('Mengetahui,', margin, currentY)
  doc.text('LURAH TELAGASARI', margin, currentY + 6)
  doc.text(form.namaLurah || '(......................)', margin, currentY + 22)
  doc.text(`Ketua RT. ${form.namaRT}`, pageWidth - margin, currentY + 6, { align: 'right' })
  doc.text(form.namaKetuaRT || '(......................)', pageWidth - margin, currentY + 22, { align: 'right' })

  return doc.output('blob')
}

const simpanDanUpload = async () => {
  const pdfBlob = generatePDFBlob()
  const filename = `Laporan_RT_${form.namaRT}_${getBulan()}_${getTahun()}.pdf`
  const formData = new FormData()
  formData.append('pdf', pdfBlob, filename)
  formData.append('is_signed', false)

  try {
    await createReport(formData)
    fetchAllReport()
  } catch (err) {
    console.error('❌ Upload gagal:', err)
  }
}

const uploadManual = async () => {
  if (!manualUpload.file) {
    alert('Pilih file terlebih dahulu.')
    return
  }

  const formData = new FormData()
  formData.append('pdf', manualUpload.file)
  formData.append('is_signed', manualUpload.is_signed)

  try {
    await createReport(formData)
    showModal.value = false
    fetchAllReport()
    manualUpload.file = null
    manualUpload.is_signed = false
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
</script>


<template>
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <!-- Modal -->
     <!--  -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4">
        <h3 class="text-lg font-bold">Upload Manual Laporan PDF</h3>
        <div class="border-4 rounded-sm p-2 border-KKNBlack " >
        <input type="file" accept="application/pdf" @change="e => manualUpload.file = e.target.files[0]" />
      </div>
        <label class="flex items-center space-x-2 text-lg">
          <input type="checkbox" v-model="manualUpload.is_signed" />
          <span>Sudah Ditandatangani</span>
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
        <th class="border px-2 py-1">TTD</th>
        <th class="border px-2 py-1">PDF</th>
        <th class="border px-2 py-1">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="report in response.reports" :key="report.id">
        <td class="border px-2 py-1 text-center">{{ report.id }}</td>
        <td class="border px-2 py-1">{{ report.pdf?.split('/').pop() || "Tidak Ada File" }}</td>
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

    <!-- Generator -->
    <section class="bg-white dark:bg-KKNBlack p-6 rounded shadow border space-y-4">
      <h2 class="text-2xl font-bold text-center">Generator Laporan RT 45</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <input v-model="form.namaKetuaRT" placeholder="Nama Ketua RT" class="border px-3 py-2 rounded w-full" />
        <input v-model="form.namaLurah" placeholder="Nama Lurah" class="border px-3 py-2 rounded w-full" />
        <input v-model="form.tanggalSurat" type="date" class="border px-3 py-2 rounded w-full" />
      </div>

      <h3 class="text-lg font-semibold">Daftar Kegiatan</h3>
      <div v-for="(item, i) in form.kegiatan" :key="i" class="grid grid-cols-6 gap-2 items-center">
        <input v-model="item.tanggal" type="date" class="border px-3 py-2 rounded w-full" />
        <input v-model="item.uraian" placeholder="Uraian" class="border px-3 py-2 rounded w-full col-span-3" />
        <input v-model="item.keterangan" placeholder="Keterangan" class="border px-3 py-2 rounded w-full col-span-1" />
        <button @click="removeKegiatan(i)" class="text-red-600 text-lg hover:text-red-800">✕</button>
      </div>
      <button @click="addKegiatan" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">+ Tambah Kegiatan</button>
    </section>

    <div class="flex justify-end">
      <button @click="simpanDanUpload" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
        ⬆️ Simpan & Upload PDF
      </button>
    </div>

    <section class="bg-white p-6 rounded shadow border">
      <h2 class="text-xl font-semibold mb-4">Preview Surat</h2>
      <div class="flex justify-center">
        <LaporanSurat :data="form" />
      </div>
    </section>
  </div>
</template>
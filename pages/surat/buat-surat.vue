<script setup>
import { reactive, computed } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import LaporanSurat from '~/components/LaporanSurat.vue'

const form = reactive({
  namaRT: '',
  namaKetuaRT: '',
  namaLurah: '',
  tanggalSurat: '',
  kegiatan: []
})

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const getFormattedTanggal = () => {
  if (!form.tanggalSurat) return ''
  const [year, month, day] = form.tanggalSurat.split('-')
  return `${parseInt(day)} ${bulanList[parseInt(month) - 1]} ${year}`
}

const getBulan = () => {
  if (!form.tanggalSurat) return ''
  return bulanList[parseInt(form.tanggalSurat.split('-')[1]) - 1]
}

const getTahun = () => form.tanggalSurat?.split('-')[0] || ''

const addKegiatan = () => {
  form.kegiatan.push({ tanggal: '', uraian: '', keterangan: '' })
}

const removeKegiatan = (i) => {
  form.kegiatan.splice(i, 1)
}

// const generatePDF = () => {
//   const doc = new jsPDF()
//   doc.setFontSize(16)
//   doc.text(`Laporan Bulanan RT ${form.namaRT}`, 105, 20, { align: 'center' })

//   doc.setFontSize(12)
//   doc.text(`Nama Ketua RT: ${form.namaKetuaRT}`, 14, 30)
//   doc.text(`Nama Lurah: ${form.namaLurah}`, 14, 37)
//   doc.text(`Bulan: ${getBulan()} ${getTahun()}`, 14, 44)

//   doc.text('Daftar Kegiatan:', 14, 54)

//   autoTable(doc, {
//     startY: 58,
//     head: [['Tanggal', 'Uraian', 'Keterangan']],
//     body: form.kegiatan.map(k => [k.tanggal, k.uraian, k.keterangan]),
//     styles: { fontSize: 10 },
//     headStyles: {
//       fillColor: [255, 255, 255],
//       textColor: 0,
//       fontStyle: 'bold'
//     },
//     margin: { left: 14, right: 14 }
//   })

//   const y = doc.lastAutoTable.finalY + 20
//   doc.text(`Balikpapan, ${getFormattedTanggal()}`, 170, y, { align: 'right' })
//   doc.text(`Ketua RT ${form.namaRT}`, 40, y + 20)
//   doc.text('Lurah', 170, y + 20, { align: 'right' })
//   doc.text(form.namaKetuaRT || '(........................)', 40, y + 40)
//   doc.text(form.namaLurah || '(........................)', 170, y + 40, { align: 'right' })

//   doc.save(`Laporan_RT_${form.namaRT}_${getBulan()}_${getTahun()}.pdf`)
// }


const generatePDF = () => {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  const usableWidth = pageWidth - margin * 2

  // Header surat
  doc.setFont('Times', 'bold')
  doc.setFontSize(11)
  doc.text('LAPORAN BULANAN', pageWidth / 2, 20, { align: 'center' })
  doc.text('PELAKSANAAN TUGAS DAN FUNGSI RUKUN TETANGGA (RT) 45', pageWidth / 2, 28, { align: 'center' })
  doc.text('KELURAHAN TELAGASARI', pageWidth / 2, 36, { align: 'center' })

  doc.setFont('Times', 'normal')
  doc.setFontSize(11)
  doc.text(`BULAN : ${getBulan().toUpperCase()} ${getTahun()}`, margin, 48)

  // Tabel setup
  const startX = margin
  const startY = 55
  const colWidths = [10, 30, 130, usableWidth - (10 + 30 + 130)]
  const headers = ['NO', 'TANGGAL', 'URAIAN TUGAS DAN FUNGSI YANG DILAKSANAKAN', 'KETERANGAN']
  const lineHeight = 5

  // Header tabel
  doc.setFont('Times', 'bold')
  let currentX = startX
  headers.forEach((header, i) => {
    const centerX = currentX + colWidths[i] / 2
    doc.text(header, centerX, startY + 6, { align: 'center' })
    doc.rect(currentX, startY, colWidths[i], 10)
    currentX += colWidths[i]
  })

  // Isi tabel dinamis
  let currentY = startY + 10
  doc.setFont('Times', 'normal')

  form.kegiatan.forEach((k, idx) => {
    currentX = startX
    const values = [
      `${idx + 1}`,
      k.tanggal.split('-').reverse().join('/'),
      k.uraian,
      k.keterangan
    ]

    // Bagi teks jadi beberapa baris berdasarkan lebar kolom
    const textLines = values.map((val, i) =>
      doc.splitTextToSize(val || '', colWidths[i] - 2)
    )

    // Hitung tinggi maksimum baris
    const maxLines = Math.max(...textLines.map(lines => lines.length))
    const cellHeight = maxLines * lineHeight

    // Gambar tiap kolom
    textLines.forEach((lines, i) => {
      const centerX = currentX + colWidths[i] / 2
      const offsetY = (cellHeight - lines.length * lineHeight) / 2

      // Atur align untuk kolom 2 (uraian) kiri, lainnya center
      const align = i === 2 ? 'left' : 'center'
      const textX = align === 'center' ? centerX : currentX + 1

      doc.text(lines, textX, currentY + lineHeight + offsetY - 1, { align })
      doc.rect(currentX, currentY, colWidths[i], cellHeight)
      currentX += colWidths[i]
    })

    currentY += cellHeight
  })

  // TTD
  currentY += 15
  doc.text(`Balikpapan, ${getFormattedTanggal()}`, pageWidth - margin, currentY, { align: 'right' })
  doc.text('Mengetahui,', margin, currentY)
  doc.text('LURAH TELAGASARI', margin, currentY + 6)
  doc.text(form.namaLurah || '(......................)', margin, currentY + 22)

  doc.text(`Ketua RT. ${form.namaRT}`, pageWidth - margin, currentY + 6, { align: 'right' })
  doc.text(form.namaKetuaRT || '(......................)', pageWidth - margin, currentY + 22, { align: 'right' })

  doc.save(`Laporan_RT_${form.namaRT}_${getBulan()}_${getTahun()}.pdf`)
}




</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold text-center">Generator Laporan Bulanan RT</h1>

    <!-- Form Input -->
    <section class="space-y-6 bg-white p-6 rounded shadow border">
      <h2 class="text-xl font-semibold border-b pb-2">Informasi Umum</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <!-- <input v-model="form.namaRT" placeholder="Nomor RT" class="border px-3 py-2 rounded w-full" /> -->
        <input v-model="form.namaKetuaRT" placeholder="Nama Ketua RT" class="border px-3 py-2 rounded w-full" />
        <input v-model="form.namaLurah" placeholder="Nama Lurah" class="border px-3 py-2 rounded w-full" />
        <input v-model="form.tanggalSurat" type="date" class="border px-3 py-2 rounded w-full" />
      </div>

      <h2 class="text-xl font-semibold mb-2 border-b pb-2">Daftar Kegiatan</h2>
      <div v-for="(item, i) in form.kegiatan" :key="i" class="grid grid-cols-6 gap-2 items-center mb-2">
        <input v-model="item.tanggal" type="date" class="border px-3 py-2 rounded w-full" />
     
        <!-- <input v-model="item.tanggal" placeholder="Tanggal" class="border px-3 py-2 rounded w-full col-span-1" /> -->
        <input v-model="item.uraian" placeholder="Uraian" class="border px-3 py-2 rounded w-full col-span-3" />
        <input v-model="item.keterangan" placeholder="Keterangan" class="border px-3 py-2 rounded w-full col-span-1" />
        <button @click="removeKegiatan(i)" class="text-red-600 text-lg hover:text-red-800">✕</button>
      </div>
      <button @click="addKegiatan" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
        + Tambah Kegiatan
      </button>
    </section>

    <div class="flex justify-end">
      <button @click="generatePDF" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
        ⬇️ Simpan sebagai PDF
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

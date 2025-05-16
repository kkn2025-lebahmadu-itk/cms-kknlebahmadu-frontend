<template>
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold text-center">Generator Laporan Bulanan RT</h1>

    <!-- Form Input -->
    <section class="space-y-6 bg-white p-6 rounded shadow border">
      <h2 class="text-xl font-semibold border-b pb-2">Informasi Umum</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <input v-model="form.namaRT" placeholder="Nomor RT" class="border px-3 py-2 rounded w-full" />
        <input v-model="form.namaKetuaRT" placeholder="Nama Ketua RT" class="border px-3 py-2 rounded w-full" />
        <input v-model="form.namaLurah" placeholder="Nama Lurah" class="border px-3 py-2 rounded w-full" />
        <input v-model="form.bulan" placeholder="Bulan" class="border px-3 py-2 rounded w-full" />
        <input v-model="form.tahun" placeholder="Tahun" class="border px-3 py-2 rounded w-full" />
      </div>

      <!-- Kegiatan -->
      <div>
        <h2 class="text-xl font-semibold mb-2 border-b pb-2">Daftar Kegiatan</h2>
        <div v-for="(item, i) in form.kegiatan" :key="i" class="grid grid-cols-6 gap-2 items-center mb-2">
          <input v-model="item.tanggal" placeholder="Tanggal" class="border px-3 py-2 rounded w-full col-span-1" />
          <input v-model="item.uraian" placeholder="Uraian" class="border px-3 py-2 rounded w-full col-span-3" />
          <input v-model="item.keterangan" placeholder="Keterangan" class="border px-3 py-2 rounded w-full col-span-1" />
          <button @click="removeKegiatan(i)" class="text-red-600 text-lg hover:text-red-800">✕</button>
        </div>
        <button @click="addKegiatan" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
          + Tambah Kegiatan
        </button>
      </div>
    </section>

    <!-- Preview & PDF -->
    <section class="bg-white p-6 rounded shadow border">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Export Surat</h2>
        <button @click="generatePDF" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
          ⬇️ Simpan ke PDF
        </button>
      </div>
      <!-- Kamu masih bisa tampilkan LaporanSurat di sini jika hanya untuk preview -->
      <LaporanSurat :data="form" />
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import LaporanSurat from '~/components/LaporanSurat.vue'

const form = reactive({
  bulan: '',
  tahun: '',
  namaRT: '',
  namaKetuaRT: '',
  namaLurah: '',
  kegiatan: []
})

const addKegiatan = () => {
  form.kegiatan.push({ tanggal: '', uraian: '', keterangan: '' })
}

const removeKegiatan = (index) => {
  form.kegiatan.splice(index, 1)
}

const generatePDF = () => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(16)
  doc.text(`Laporan Bulanan RT ${form.namaRT}`, 105, 20, { align: 'center' })

  doc.setFontSize(12)
  doc.text(`Nama Ketua RT: ${form.namaKetuaRT}`, 14, 35)
  doc.text(`Nama Lurah: ${form.namaLurah}`, 14, 42)
  doc.text(`Bulan: ${form.bulan} ${form.tahun}`, 14, 49)

  // Kegiatan table
  const rows = form.kegiatan.map(k => [k.tanggal, k.uraian, k.keterangan])

  doc.autoTable({
    startY: 60,
    head: [['Tanggal', 'Uraian', 'Keterangan']],
    body: rows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [100, 100, 100] },
    margin: { left: 14, right: 14 }
  })

  // Tanda tangan
  const y = doc.lastAutoTable.finalY + 20
  doc.text('Balikpapan, ......................', 140, y, { align: 'right' })
  doc.text(`Ketua RT ${form.namaRT}`, 40, y + 20)
  doc.text('Lurah', 140, y + 20, { align: 'right' })

  doc.text(form.namaKetuaRT, 40, y + 40)
  doc.text(form.namaLurah, 140, y + 40, { align: 'right' })

  doc.save(`Laporan_RT_${form.namaRT}_${form.bulan}_${form.tahun}.pdf`)
}
</script>

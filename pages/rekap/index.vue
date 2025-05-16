<template>
	<div class="p-4">
		<h1 class="text-2xl font-bold mb-4">Rekap Surat</h1>

		<!-- Form Tambah Surat -->
		<form @submit.prevent="tambahSurat" class="mb-6 space-y-4">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<!-- Tipe Surat (Dropdown) -->
				<div>
					<label class="block font-medium mb-1">Tipe</label>
					<select v-model="form.tipe" class="w-full border border-black px-3 py-2 rounded bg-gray-50" required>
						<option disabled value="">-- Pilih Tipe Surat --</option>
						<option value="internal">Internal</option>
						<option value="external">External</option>
						<option value="surat pengantar">Surat Pengantar</option>
					</select>
				</div>

				<!-- Nomor Surat -->
				<div>
					<label class="block font-medium mb-1">Nomor Surat</label>
					<input v-model="form.nomor" type="text" class="w-full border border-black px-3 py-2 rounded bg-gray-50" required />
				</div>

				<!-- Tanggal Surat -->
				<div>
					<label class="block font-medium mb-1">Tanggal Surat</label>
					<input v-model="form.tanggal" type="date" class="w-full border border-black px-3 py-2 rounded bg-gray-50" required />
				</div>

				<!-- Keperluan -->
				<div>
					<label class="block font-medium mb-1">Keperluan</label>
					<input v-model="form.keperluan" type="text" class="w-full border border-black px-3 py-2 rounded bg-gray-50" required />
				</div>
			</div>

			<button type="submit" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" :disabled="pending">
				{{ pending ? 'Sedang Menyimpan...' : 'Tambah Surat' }}
			</button>

			<p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
		</form>

		<!-- Tabel Rekap Surat -->
		<div class="overflow-x-auto">
			<table class="min-w-full border border-gray-300">
				<thead class="bg-gray-100">
					<tr>
						<th class="border px-4 py-2 text-left">ID</th>
						<th class="border px-4 py-2 text-left">Tipe</th>
						<th class="border px-4 py-2 text-left">Nomor Surat</th>
						<th class="border px-4 py-2 text-left">Tanggal Surat</th>
						<th class="border px-4 py-2 text-left">Keperluan</th>
						<th class="border px-4 py-2 text-left">Aksi</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(surat, index) in suratList" :key="surat.id" class="bg-gray-50">
						<td class="border px-4 py-2">{{ index+1 }}</td>
						<td class="border px-4 py-2 capitalize">{{ surat.tipe_surat }}</td>
						<td class="border px-4 py-2">{{ surat.nomor_surat }}</td>
						<td class="border px-4 py-2">{{ surat.tanggal_surat }}</td>
						<td class="border px-4 py-2">{{ surat.keperluan }}</td>
						<td class="border px-4 py-2">
							<button @click="hapusSurat(surat.id)" 
								class="text-red-600 hover:text-red-800 font-semibold">
								Hapus
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRecap } from '~/composables/useRecap'

const { response, pending, error, fetchAllRecap, createRecap, deleteRecap } = useRecap()

const form = ref({
	tipe: '',
	nomor: '',
	tanggal: '',
	keperluan: ''
})

// response dari API berisi array recap, mapping ke suratList
const suratList = computed(() => response.value)

// fetch data saat halaman dimuat
onMounted(() => {
	fetchAllRecap()
})

async function tambahSurat() {
	// bentuk data sesuai ekspektasi API
	const payload = {
		tipe_surat: form.value.tipe,
		nomor_surat: form.value.nomor,
		tanggal_surat: form.value.tanggal,
		keperluan: form.value.keperluan
	}

	await createRecap(payload)

	// reset form kalau berhasil dan tidak error
	if (!error.value) {
		form.value = {
			tipe: '',
			nomor: '',
			tanggal: '',
			keperluan: ''
		}
	}
}

async function hapusSurat(id) {
	if (!confirm('Yakin ingin menghapus surat ini?')) return

	await deleteRecap(id)

	if (!error.value) {
		fetchAllRecap()
	}
}
</script>

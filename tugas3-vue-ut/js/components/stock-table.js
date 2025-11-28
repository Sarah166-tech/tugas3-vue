Vue.component('ba-stock-table', function(resolve) {
  // load template file then resolve component
  fetch('templates/stock-table.html')
    .then(r=>r.text())
    .then(tpl=>{
      resolve({
        template: tpl,
        data() {
          return {
            allData: [],
            stok: [],
            upbjjList: [],
            kategoriList: [],
            filterUPBJJ: '',
            filterKategori: '',
            filterWarning: false,
            sortBy: '',
            sortDir: 'asc',
            // tooltip
            tooltipHtml: '',
            tooltipX: 0,
            tooltipY: 0,
            showTooltip: false,
            // modal add/edit
            modalShow: false,
            modalTitle: '',
            isEdit: false,
            form: { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:0, qty:0, safety:0, catatanHTML:'' },
            // delete
            deleteShow: false,
            toDelete: null
          };
        },
        async created() {
          const data = await Api.loadData();
          this.allData = (data.stok || []).slice();
          this.stok = this.allData.slice();
          this.upbjjList = data.upbjjList || [];
          this.kategoriList = data.kategoriList || [];
        },
        watch: {
          filterUPBJJ() { this.applyFilters(); },
          filterKategori() { this.applyFilters(); },
          filterWarning() { this.applyFilters(); }
        },
        computed: {
          kategoriListForUPBJJ() {
            // per soal: kategori berasal dari kategoriList (not filtered by UPBJJ in JSON),
            // but we keep dependent option: kategori dropdown active only when UPBJJ chosen.
            return this.kategoriList;
          }
        },
        methods: {
          formatCurrency(v){ return 'Rp ' + Number(v).toLocaleString('id-ID'); },

          applyFilters() {
            let items = this.allData.slice();
            if (this.filterUPBJJ) items = items.filter(x => x.upbjj === this.filterUPBJJ);
            if (this.filterKategori) items = items.filter(x => x.kategori === this.filterKategori);
            if (this.filterWarning) items = items.filter(x => x.qty < x.safety || x.qty === 0);
            this.stok = items;
            this.applySort();
          },

          setSort(key) {
            if (this.sortBy === key) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
            else { this.sortBy = key; this.sortDir = 'asc'; }
            this.applySort();
          },

          applySort() {
            if (!this.sortBy) return;
            this.stok.sort((a,b)=>{
              let A = a[this.sortBy], B = b[this.sortBy];
              if (typeof A === 'string') { A = A.toLowerCase(); B = B.toLowerCase(); }
              if (this.sortDir === 'asc') return A > B ? 1 : (A < B ? -1 : 0);
              return A < B ? 1 : (A > B ? -1 : 0);
            });
          },

          resetFilters() {
            this.filterUPBJJ=''; this.filterKategori=''; this.filterWarning=false; this.sortBy=''; this.stok = this.allData.slice();
          },

          // tooltip
          showCatatan(evt, html) {
            this.tooltipHtml = html || '<em>Tidak ada catatan</em>';
            // page coords
            this.tooltipX = evt.pageX + 12;
            this.tooltipY = evt.pageY + 12;
            this.showTooltip = true;
          },
          hideCatatan(){ this.showTooltip=false; },

          // add / edit
          openAdd() {
            this.isEdit = false;
            this.modalTitle = 'Tambah Bahan Ajar';
            this.form = { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:0, qty:0, safety:0, catatanHTML:'' };
            this.modalShow = true;
          },
          openEdit(item) {
            this.isEdit = true;
            this.modalTitle = 'Edit Bahan Ajar';
            this.form = Object.assign({}, item);
            this.modalShow = true;
          },
          modalClose(){ this.modalShow = false; },
          modalOk() {
            // basic validation
            if (!this.form.kode || !this.form.judul || !this.form.kategori || !this.form.upbjj) {
              alert('Isi kode, judul, kategori, dan UPBJJ minimal.');
              return;
            }
            if (this.isEdit) {
              const idx = this.allData.findIndex(x => x.kode === this.form.kode);
              if (idx !== -1) this.allData.splice(idx,1, Object.assign({}, this.form));
            } else {
              if (this.allData.some(x=>x.kode === this.form.kode)) { alert('Kode sudah ada'); return; }
              this.allData.unshift(Object.assign({}, this.form));
            }
            this.applyFilters();
            this.modalShow = false;
          },

          // delete
          confirmDelete(item) { this.toDelete = item; this.deleteShow = true; },
          doDelete() {
            if (!this.toDelete) return;
            this.allData = this.allData.filter(x => x.kode !== this.toDelete.kode);
            this.applyFilters();
            this.deleteShow = false;
            this.toDelete = null;
          }
        }
      });
    });
});
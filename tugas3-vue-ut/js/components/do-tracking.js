Vue.component('do-tracking', function(resolve){
  fetch('templates/do-tracking.html')
    .then(r=>r.text())
    .then(tpl=>{
      resolve({
        template: tpl,
        data() {
          return {
            trackingMap: {},
            allKeys: [],
            paket: [],
            pengirimanList: [],
            keyword: '',
            searchResult: null,
            form: { paket:'', ekspedisi:'', tanggalKirim:'', nim:'', nama:'' },
            progressKeterangan: ''
          };
        },
        async created() {
          const data = await Api.loadData();
          (data.tracking || []).forEach(obj => {
            const key = Object.keys(obj)[0];
            this.trackingMap[key] = obj[key];
          });
          this.allKeys = Object.keys(this.trackingMap);
          this.paket = data.paket || [];
          this.pengirimanList = data.pengirimanList || [];
        },
        computed: {
          selectedPaket() { return this.paket.find(p=>p.kode===this.form.paket); }
        },
        methods: {
          formatCurrency(v){ return 'Rp ' + Number(v).toLocaleString('id-ID'); },
          formatDate(d){ if(!d) return '-'; return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}); },

          searchDo(){
            const k = (this.keyword||'').trim();
            if(!k) { alert('Masukkan Nomor DO atau NIM'); return; }
            let found = null;
            for(const key of Object.keys(this.trackingMap)){
              if (key.includes(k) || (this.trackingMap[key].nim||'').includes(k)){
                found = Object.assign({ no:key }, this.trackingMap[key]);
                break;
              }
            }
            if(!found){ alert('Tidak ditemukan'); this.searchResult = null; return; }
            this.searchResult = found;
          },

          clearSearch(){ this.keyword=''; this.searchResult=null; },

          createDo(){
            if (!this.form.paket || !this.form.ekspedisi || !this.form.nim || !this.form.nama) {
              alert('Lengkapi paket, ekspedisi, NIM, dan Nama');
              return;
            }
            const year = new Date().getFullYear();
            const prefix = 'DO' + year + '-';
            // find existing sequences
            const seqs = Object.keys(this.trackingMap)
              .filter(k => k.startsWith(prefix))
              .map(k => parseInt(k.split('-')[1],10))
              .filter(n => !isNaN(n));
            const next = seqs.length ? Math.max(...seqs)+1 : 1;
            const seqStr = String(next).padStart(3,'0');
            const doNo = prefix + seqStr;
            const paketObj = this.paket.find(p=>p.kode===this.form.paket);
            const total = paketObj ? paketObj.harga : 0;
            const tanggalKirim = this.form.tanggalKirim || new Date().toISOString().slice(0,10);

            this.trackingMap[doNo] = {
              nim: this.form.nim,
              nama: this.form.nama,
              status: 'Baru Dibuat',
              ekspedisi: this.form.ekspedisi,
              tanggalKirim: tanggalKirim,
              paket: this.form.paket,
              total: total,
              perjalanan: []
            };
            this.allKeys = Object.keys(this.trackingMap);
            alert('DO dibuat: ' + doNo);
            // reset
            this.form = { paket:'', ekspedisi:'', tanggalKirim:'', nim:'', nama:'' };
          },

          addProgress(){
            if(!this.searchResult){ alert('Cari DO dulu'); return; }
            if(!this.progressKeterangan.trim()){ alert('Isi keterangan'); return; }
            const now = new Date();
            const waktu = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' +
                          String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
            const entry = { waktu: waktu, keterangan: this.progressKeterangan };
            if(!this.searchResult.perjalanan) this.searchResult.perjalanan = [];
            this.searchResult.perjalanan.push(entry);
            // also push to master map
            this.trackingMap[this.searchResult.no].perjalanan.push(entry);
            this.progressKeterangan = '';
          }
        }
      });
    });
});
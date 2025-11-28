Vue.component('order-form', function(resolve){
  fetch('templates/order-form.html')
    .then(r=>r.text())
    .then(tpl=>{
      resolve({
        template: tpl,
        data() {
          return {
            paketList: [],
            ekspedisiList: [],
            nim: '',
            nama: '',
            paketKode: '',
            ekspedisi: '',
            tanggalKirim: ''
          };
        },
        async created() {
          const data = await Api.loadData();
          this.paketList = data.paket || [];
          this.ekspedisiList = data.pengirimanList || [];
        },
        computed: {
          selectedPaket() { return this.paketList.find(p => p.kode === this.paketKode); }
        },
        methods: {
          formatCurrency(v){ return 'Rp ' + Number(v).toLocaleString('id-ID'); },
          submit() {
            if (!this.nim || !this.nama || !this.paketKode || !this.ekspedisi) {
              alert('Lengkapi semua field!');
              return;
            }
            // create DO logic: emit event or directly create into tracking (for simplicity, store in local memory)
            // We'll create simple DO in localStorage map "localTracking" (optional)
            // For this demo, show alert and clear form
            alert('DO dibuat (simpan ke memory): NIM ' + this.nim);
            this.nim=''; this.nama=''; this.paketKode=''; this.ekspedisi=''; this.tanggalKirim='';
          }
        }
      });
    });
});
// async component loads template from templates/status-badge.html
Vue.component('status-badge', function (resolve) {
  fetch('templates/status-badge.html')
    .then(r => r.text())
    .then(tpl => {
      resolve({
        template: tpl,
        props: ['qty','safety'],
        computed: {
          jenis() {
            if (this.qty === 0) return 'badge-kosong';
            if (this.qty < this.safety) return 'badge-menipis';
            return 'badge-aman';
          },
          teks() {
            if (this.qty === 0) return 'Kosong';
            if (this.qty < this.safety) return 'Menipis';
            return 'Aman';
          }
        }
      });
    });
});
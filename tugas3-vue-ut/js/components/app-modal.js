Vue.component('app-modal', function(resolve) {
  fetch('templates/app-modal.html')
    .then(r=>r.text())
    .then(tpl=>{
      resolve({
        template: tpl,
        props: { show:{type:Boolean,default:false}, title:{type:String,default:'Modal'} },
        methods: {
          close() { this.$emit('close'); },
          ok() { this.$emit('ok'); }
        }
      });
    });
});
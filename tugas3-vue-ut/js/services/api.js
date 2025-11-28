const Api = {
  async loadData() {
    const res = await fetch('data/dataBahanAjar.json');
    if (!res.ok) throw new Error('Gagal membaca data: ' + res.status);
    return await res.json();
  }
};
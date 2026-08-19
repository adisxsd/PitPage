describe('PitPage Admin Complete Publishing Flow', () => {
  it('berhasil login sebagai admin, navigasi ke tulis artikel, mengisi form lengkap, dan mempublikasikannya', () => {
    
    // 1. Kunjungi halaman utama dan buka modal login
    cy.visit('http://localhost:5173');
    cy.contains(/LOGIN|MASUK/i).click();

    // 2. Masukkan kredensial Admin
    cy.get('input[placeholder="driver99"]').type('admin'); 
    cy.get('input[placeholder="••••••••"]').first().type('1234'); 
    cy.contains(/➔ ENGAGE|MASUK/i).click();

    // 3. Pastikan berhasil masuk sebagai admin (muncul tombol LOGOUT)
    cy.contains(/LOGOUT|KELUAR/i).should('be.visible');

    // 4. Navigasi langsung ke rute penulisan artikel admin/author
    cy.visit('http://localhost:5173/dashboard/write');

    // 5. Pastikan berada di halaman write article
    cy.url().should('include', '/dashboard/write');
    cy.contains(/Write Article|Tulis Artikel/i).should('be.visible');

    // 6. Mengisi Form: Judul Artikel & Slug otomatis
    cy.get('input[placeholder*="Red Bull"]')
      .should('be.visible')
      .clear()
      .type('Admin Test: F1 Grand Prix Technical Analysis');

    // 7. Memilih Kategori dari Dropdown (Pilih opsi pertama selain default)
    cy.get('select').first().select(1);

    // 8. Memilih Pembalap Terkait dari Dropdown (Pilih opsi pertama selain default)
    cy.get('select').last().select(1);

    // 9. Mengisi Konten Artikel di Textarea Editor
    cy.get('textarea')
      .first()
      .type('<p>Artikel analisis mendalam ini diterbitkan langsung oleh <b>Administrator Paddock</b>.</p>');

    // 10. Klik tombol PUBLISH ARTICLE
    cy.contains(/PUBLISH ARTICLE|TERBITKAN ARTIKEL/i).click();

    // 11. Validasi Akhir: Memastikan notifikasi sukses muncul
    cy.contains(/berhasil|successfully/i, { timeout: 10000 }).should('be.visible');
  });
});
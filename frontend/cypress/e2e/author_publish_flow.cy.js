describe('PitPage Author Complete Publishing Flow', () => {
  it('berhasil login sebagai author, navigasi ke write article, mengisi form, dan mempublikasikan artikel', () => {
    
    // 1. Kunjungi halaman utama dan buka modal login
    cy.visit('http://localhost:5173');
    cy.contains(/LOGIN|MASUK/i).click();

    // 2. Masukkan kredensial Author (sesuaikan username & password akun authormu)
    cy.get('input[placeholder="driver99"]').type('GallanGanteng'); 
    cy.get('input[placeholder="••••••••"]').first().type('rahasia123'); 
    cy.contains(/➔ ENGAGE|MASUK/i).click();

    // 3. Pastikan berhasil masuk ke area user/author (muncul tombol LOGOUT)
    cy.contains(/LOGOUT|KELUAR/i).should('be.visible');

    // 4. Klik menu Profil untuk masuk ke area dashboard/profil
    // Bisa lewat tombol navigasi atau langsung mengunjungi rute profilnya
    cy.visit('http://localhost:5173/dashboard/profile');

    // 5. Di sidebar profil, klik menu "Tulis Artikel" (Write Article)
    cy.contains(/Write Article|Tulis Artikel/i).click();

    // 6. Pastikan sudah berada di halaman /dashboard/write
    cy.url().should('include', '/dashboard/write');
    cy.contains(/Write Article|Tulis Artikel/i).should('be.visible');

    // 7. Mengisi Form: Judul dan URL Slug (Otomatis terisi atau diketik manual)
    cy.get('input[placeholder*="Red Bull"]')
      .should('be.visible')
      .clear()
      .type('Cypress Automated F1 Test Article');

    // 8. Memilih Kategori (Dropdown Kategori pertama selain opsi default)
    cy.get('select').first().select(1);

    // 9. Memilih Pembalap Terkait (Dropdown Driver pertama selain opsi default)
    cy.get('select').last().select(1);

    // 10. Mengisi Konten Artikel di Textarea Editor
    cy.get('textarea')
      .first()
      .type('<p>Ini adalah artikel pengujian otomatis yang ditenagai oleh <b>Cypress Bot</b> untuk platform PitPage.</p>');

    // 11. Klik tombol PUBLISH ARTICLE
    cy.contains(/PUBLISH ARTICLE|TERBITKAN ARTIKEL/i).click();

    // 12. Validasi Akhir: Memastikan muncul notifikasi sukses atau terarah kembali ke halaman profil
    cy.contains(/berhasil|successfully/i, { timeout: 10000 }).should('be.visible');
  });
});
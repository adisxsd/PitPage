describe('PitPage Driver Search & Telemetry Flow', () => {
  it('berhasil login, mencari pembalap, klik kartu, dan melihat profil', () => {
    // 1. Kunjungi web dan buka modal login terlebih dahulu
    cy.visit('http://localhost:5173');
    cy.contains('LOGIN').click();

    // 2. Tembus gerbang autentikasi
    // ⚠️ Sesuaikan dengan username & password aslimu
    cy.get('input[placeholder="driver99"]').type('admin'); 
    cy.get('input[placeholder="••••••••"]').first().type('1234'); 
    cy.contains('➔ ENGAGE').click();

    // 3. Pastikan sudah berhasil login (tombol berubah jadi LOGOUT)
    cy.contains('LOGOUT').should('be.visible');

    // 4. SETELAH LOGIN: Baru buka halaman grid pembalap
    cy.visit('http://localhost:5173/drivers');

    // 5. Cari kolom pencarian Navbar dan PAKSA bot untuk mengetik
    cy.get('input[type="text"]').first().type('Hamilton', { force: true });

    // 6. Klik kartu pertama di grid secara paksa
    cy.get('.grid').children().first().click({ force: true });

    // 7. Pastikan URL berubah masuk ke detail ID pembalap
    cy.url().should('include', '/drivers/');

    // 8. Pastikan info profil pembalap (seperti kotak Car Number) muncul
    cy.contains(/Car Number/i).should('be.visible');
    
    // 9. Scroll ke bawah untuk melihat apakah area artikel termuat
    // Menggunakan regex untuk kebal multi-bahasa
    cy.contains(/Related|Terkait/i).scrollIntoView().should('be.visible');
  });
});
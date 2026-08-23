describe('PitPage CMS & Admin Flow', () => {
  it('berhasil login dan masuk ke area penulisan artikel', () => {
    // 1. Kunjungi web dan buka modal login
    cy.visit('http://localhost:5173');
    cy.contains('LOGIN').click();

    // 2. Tembus gerbang autentikasi
    cy.get('input[placeholder="driver99"]').type('admin'); // Sesuaikan username
    cy.get('input[placeholder="••••••••"]').first().type('1234'); // Sesuaikan password
    cy.contains('➔ ENGAGE').click();

    // 3. Validasi berhasil masuk
    cy.contains('LOGOUT').should('be.visible');

    // 4. Navigasi ke halaman pembuatan artikel
    cy.visit('http://localhost:5173/dashboard/write');

    // 5. Validasi form Write Article siap digunakan (Kebal Multi-Bahasa)
    cy.contains(/Write Article|Tulis Artikel/i).should('be.visible');
    
    // 6. TARGET BARU: Cari input berdasarkan placeholder terbarumu
    cy.get('input[placeholder="Contoh: Red Bull\'s Dominance"]').should('exist');
  });
});
describe('PitPage Public View Flow', () => {
  it('berhasil memuat beranda dan berpindah ke halaman arsip', () => {
    // 1. Kunjungi halaman utama
    cy.visit('http://localhost:5173');

    // 2. Pastikan artikel utama dimuat (Misal: Cari tombol "Read Full Analysis")
    cy.contains(/Read Full Analysis/i).should('be.visible');

    // 3. Pindah ke halaman Articles melalui Navbar
    // Pastikan teks "ARTICLES" sesuai dengan yang ada di Navbar-mu
    cy.contains(/News/i).click();

    // 4. Validasi perubahan URL
    cy.url().should('include', '/articles');
  });
});
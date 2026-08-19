describe('PitPage Reading Flow', () => {
  it('berhasil membuka halaman detail artikel secara dinamis', () => {
    // 1. Kunjungi daftar artikel
    cy.visit('http://localhost:5173/articles');

    // 2. Klik artikel pertama di dalam grid
    cy.get('.grid').children().first().click();

    // 3. Validasi URL berubah menjadi halaman detail
    cy.url().should('include', '/articles/');

    // 4. Validasi Detail Artikel Dimuat (Super Kebal Multi-Bahasa)
    // Kita langsung scroll dan cari elemen kotak komentar (textarea)
    // Karena tag HTML tidak mungkin berubah meski bahasanya diganti!
    cy.get('textarea').scrollIntoView().should('be.visible');
  });
});
describe('PitPage Admin CMS Flow', () => {
  it('berhasil menambah kategori baru melalui Modal', () => {
    // 1. Kunjungi halaman utama dan login
    cy.visit('http://localhost:5173');
    cy.contains('LOGIN').click();
    cy.get('input[placeholder="driver99"]').type('admin'); 
    cy.get('input[placeholder="••••••••"]').first().type('1234'); 
    cy.contains('➔ ENGAGE').click();

    // 2. Pastikan login sukses, lalu tangkap token atau pastikan token tersimpan
    cy.contains('LOGOUT').should('be.visible');

    // 3. Pergi ke halaman Manajemen Kategori
    cy.visit('http://localhost:5173/dashboard/admin/categories');

    // 4. Klik tombol "+ Add Category"
    cy.contains(/Add Category|Tambah Kategori/i).click();

    // 5. Ketik nama kategori baru di dalam Modal
    cy.get('.fixed.z-50')
      .find('input[placeholder*="Contoh"], input[placeholder*="Example"]')
      .type('Cypress Auto Test');

    // 6. Klik tombol Simpan Kategori secara eksplisit
    cy.get('.fixed.z-50')
      .contains(/Save Category|Simpan Kategori/i)
      .click();

    // 7. Pastikan modal pop-up tertutup sempurna
    cy.get('.fixed.z-50', { timeout: 10000 }).should('not.exist');

    // 8. Validasi Sukses: Cek apakah kategori baru muncul di dalam tabel
    cy.contains('Cypress Auto Test', { timeout: 10000 }).should('be.visible');
  });
});
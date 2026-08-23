describe('PitPage Authentication Flow', () => {
  it('berhasil melakukan login otomatis', () => {
    // 1. Kunjungi halaman utama PitPage
    cy.visit('http://localhost:5173');

    // 2. Klik tombol LOGIN di Navbar
    cy.contains('LOGIN').click();

    // 3. Isi form Paddock Access dengan target spesifik
    // ⚠️ Ganti teks di dalam .type() dengan username dan password aslimu
    cy.get('input[placeholder="driver99"]').type('GallanGanteng');
    
    // Kita tambahkan .first() untuk berjaga-jaga jika Cypress juga 
    // membaca form Register yang memiliki placeholder yang sama
    cy.get('input[placeholder="••••••••"]').first().type('rahasia123');

    // 4. Klik tombol submit
    cy.contains('➔ ENGAGE').click();

    // 5. Validasi Sukses
    cy.contains('LOGOUT').should('be.visible');
  });
});
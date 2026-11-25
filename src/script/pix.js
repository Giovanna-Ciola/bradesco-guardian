// ========== ÁREA PIX ==========
// Protótipo: todos os dados são fictícios e nada é enviado para servidor.


// ========== AÇÕES DOS CARDS ==========
// Cada ação será implementada nos próximos passos.
const acoesPix = {
    'transferir': function () {},
    'copia-cola': function () {},
    'qrcode': function () {},
    'cobrar': function () {},
    'chaves': function () {},
    'limites': function () {}
};


// ========== CARDS CLICÁVEIS ==========
const cardsPix = document.querySelectorAll('.pix-card');

cardsPix.forEach(function (card) {
    card.addEventListener('click', function () {
        // Remove o destaque de todos e aplica só no clicado
        cardsPix.forEach(function (c) {
            c.classList.remove('active');
        });
        card.classList.add('active');

        // Chama a ação correspondente ao card
        const acao = acoesPix[card.dataset.acao];
        if (acao) {
            acao();
        }
    });
});

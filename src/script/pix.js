const acoesPix = {
    'transferir': function () {},
    'copia-cola': function () {},
    'qrcode': function () {},
    'cobrar': function () {},
    'chaves': function () {},
    'limites': function () {}
};

const cardsPix = document.querySelectorAll('.pix-card');

cardsPix.forEach(function (card) {
    card.addEventListener('click', function () {
        cardsPix.forEach(function (c) {
            c.classList.remove('active');
        });
        card.classList.add('active');

        const acao = acoesPix[card.dataset.acao];
        if (acao) {
            acao();
        }
    });
});

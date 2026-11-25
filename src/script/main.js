// ========== DATA DE HOJE ==========
const today = new Date();
const diaSemana = today.toLocaleDateString('pt-BR', { weekday: 'long' });
const data = today.toLocaleDateString('pt-BR');
document.querySelector('#today-data').textContent = (diaSemana + ', ' + data).toUpperCase();


// ========== MOSTRAR / ESCONDER SALDO ==========
let seeBalance = false;
function changeBalance() {
    seeBalance = !seeBalance;
    const valor = document.querySelector('#balance-amount');
    if (seeBalance) {
        valor.textContent = 'R$ 3.482,15';
    } else {
        valor.textContent = 'R$ ••••••';
    }
}


// ========== DATA DE HOJE ==========
const today = new Date();
const diaSemana = today.toLocaleDateString('pt-BR', { weekday: 'long' });
const data = today.toLocaleDateString('pt-BR');
document.querySelector('#today-data').textContent = (diaSemana + ', ' + data).toUpperCase();


// ========== MOSTRAR / ESCONDER SALDO ==========
let seeBalance = false;
let saldo = 3482.15;

function formatarBRL(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarSaldo() {
    const valor = document.querySelector('#balance-amount');
    if (!valor) {
        return;
    }
    if (seeBalance) {
        valor.textContent = formatarBRL(saldo);
    } else {
        valor.textContent = 'R$ ••••••';
    }
}

function changeBalance() {
    seeBalance = !seeBalance;
    atualizarSaldo();
}


const modalPix = document.querySelector('#pix-modal');
const etapasModal = modalPix.querySelectorAll('.modal-step');
const formPix = document.querySelector('#step-form');
const campoChave = document.querySelector('#pix-chave');
const campoValor = document.querySelector('#pix-valor');
const campoDesc = document.querySelector('#pix-desc');
const btnConfirmar = document.querySelector('#btn-confirmar');

let pixAtual = null;

function mostrarEtapa(nome) {
    etapasModal.forEach(function (etapa) {
        etapa.hidden = etapa.id !== 'step-' + nome;
    });
    modalPix.hidden = false;
}

function fecharModal() {
    modalPix.hidden = true;
}

modalPix.querySelector('.modal-close').addEventListener('click', fecharModal);
document.querySelector('#btn-fechar').addEventListener('click', fecharModal);

modalPix.addEventListener('click', function (evento) {
    if (evento.target === modalPix) {
        fecharModal();
    }
});

document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && !modalPix.hidden) {
        fecharModal();
    }
});

function abrirFormulario(dados) {
    dados = dados || {};
    document.querySelector('#form-title').textContent = dados.titulo || 'Transferir com chave Pix';
    campoChave.value = dados.chave || '';
    campoValor.value = dados.valor !== undefined ? dados.valor : '';
    campoDesc.value = dados.desc || '';

    mostrarEtapa('form');

    const campos = [campoChave, campoValor, campoDesc];
    const vazio = campos.find(function (campo) {
        return campo.value === '';
    });
    (vazio || campoChave).focus();
}

function mostrarInfo(titulo, texto) {
    document.querySelector('#done-title').textContent = titulo;
    document.querySelector('#done-text').textContent = texto;
    mostrarEtapa('done');
}

function lerContatos() {
    const contatos = {};
    document.querySelectorAll('.contact').forEach(function (contato) {
        const nome = contato.querySelector('h3').textContent.trim();
        const texto = contato.querySelector('p').textContent;
        const antesDoPonto = texto.split('·')[0];
        const chave = antesDoPonto.slice(antesDoPonto.indexOf(':') + 1).trim();
        contatos[chave] = nome;
    });
    return contatos;
}

const contatosPix = lerContatos();

function analisarGuardian(pix) {
    const motivos = [];
    const hora = pix.hora !== undefined ? pix.hora : new Date().getHours();
    const textoAnalisado = (pix.chave + ' ' + pix.desc).toLowerCase();
    const termosGolpe = ['urgente', 'bloquei', 'desbloquei', 'sequestro', 'prêmio', 'suporte'];

    if (pix.valor > 1000) {
        motivos.push('Valor muito acima do seu padrão (média de R$ 180 por Pix)');
    }
    if (!contatosPix[pix.chave]) {
        motivos.push('Chave nunca usada antes por você');
    }
    if (hora >= 22 || hora < 6) {
        motivos.push('Pix em horário noturno');
    }
    if (termosGolpe.some(function (termo) { return textoAnalisado.includes(termo); })) {
        motivos.push('Termos comuns em golpes na chave ou descrição');
    }

    return motivos;
}

function mostrarAlertaGuardian(motivos) {
    const alerta = document.querySelector('#guardian-alert');
    alerta.replaceChildren();

    const titulo = document.createElement('strong');
    alerta.appendChild(titulo);

    if (motivos.length >= 2) {
        alerta.className = 'guardian-alert risco';
        titulo.textContent = '🛡 Guardian: possível golpe detectado';

        const lista = document.createElement('ul');
        motivos.forEach(function (motivo) {
            const item = document.createElement('li');
            item.textContent = motivo;
            lista.appendChild(item);
        });
        alerta.appendChild(lista);

        btnConfirmar.textContent = 'Enviar mesmo assim';
    } else {
        alerta.className = 'guardian-alert ok';
        titulo.textContent = '🛡 Guardian: Pix dentro do seu padrão';
        btnConfirmar.textContent = 'Confirmar Pix';
    }
}

function irParaRevisao() {
    const nome = contatosPix[pixAtual.chave];

    document.querySelector('#review-nome').textContent = nome || 'Recebedor não identificado';
    document.querySelector('#review-chave').textContent = pixAtual.chave;
    document.querySelector('#review-valor').textContent = formatarBRL(pixAtual.valor);
    document.querySelector('#review-desc').textContent = pixAtual.desc || '—';

    mostrarAlertaGuardian(analisarGuardian(pixAtual));
    mostrarEtapa('review');
}

formPix.addEventListener('submit', function (evento) {
    evento.preventDefault();
    pixAtual = {
        chave: campoChave.value.trim(),
        valor: Number(campoValor.value),
        desc: campoDesc.value.trim()
    };
    irParaRevisao();
});

document.querySelector('#btn-voltar').addEventListener('click', function () {
    abrirFormulario({
        titulo: document.querySelector('#form-title').textContent,
        chave: pixAtual.chave,
        valor: pixAtual.valor,
        desc: pixAtual.desc
    });
});

btnConfirmar.addEventListener('click', function () {
    if (pixAtual.valor > saldo) {
        mostrarInfo('Saldo insuficiente', 'Seu saldo atual é ' + formatarBRL(saldo) + '.\nO Pix de ' + formatarBRL(pixAtual.valor) + ' não foi enviado.');
        return;
    }

    saldo = Math.round((saldo - pixAtual.valor) * 100) / 100;
    atualizarSaldo();

    const recebedor = contatosPix[pixAtual.chave] || pixAtual.chave;
    mostrarInfo('Pix enviado ✅', formatarBRL(pixAtual.valor) + ' enviado para ' + recebedor + '.');
});

const acoesPix = {
    'transferir': function () {
        abrirFormulario();
    },
    'copia-cola': function () {
        abrirFormulario({ titulo: 'Pix Copia e Cola' });
    },
    'qrcode': function () {
        mostrarInfo('Ler QR Code', 'A câmera para ler QR Code só está disponível no app Bradesco.');
    },
    'cobrar': function () {
        mostrarInfo('Cobrar', 'QR Code gerado para a chave emilio@email.com.\nCompartilhe com quem vai pagar.');
    },
    'chaves': function () {
        mostrarInfo('Minhas chaves', 'E-mail: emilio@email.com\nCelular: 11 91234-5678\nChave aleatória: 7f3c9a2e-4b1d-4e8a-9c6f-2d5b8e1a0f47');
    },
    'limites': function () {
        mostrarInfo('Limites Pix', 'Diurno (6h–22h): R$ 5.000,00\nNoturno (22h–6h): R$ 1.000,00');
    }
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

document.querySelectorAll('.contact').forEach(function (contato) {
    contato.querySelector('.contact-pix').addEventListener('click', function () {
        const chave = Object.keys(contatosPix).find(function (k) {
            return contatosPix[k] === contato.querySelector('h3').textContent.trim();
        });
        abrirFormulario({ chave: chave });
    });
});

document.querySelector('.presentation-card .btn-normal').addEventListener('click', function () {
    pixAtual = { chave: 'maria.s@email.com', valor: 85.50, desc: 'Almoço', hora: 13 };
    irParaRevisao();
});

document.querySelector('.presentation-card .btn-warning').addEventListener('click', function () {
    pixAtual = { chave: 'suporte.conta24h@gmail.com', valor: 2890, desc: 'URGENTE - desbloqueio de conta', hora: 23 };
    irParaRevisao();
});

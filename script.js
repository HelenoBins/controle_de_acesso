document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('acessoForm');
  const tabela = document.querySelector('#tabelaRegistros tbody');

  function carregarRegistros() {
    tabela.innerHTML = '';
    const registros = JSON.parse(localStorage.getItem('registros')) || [];

    registros.forEach((registro, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${registro.dataHoraEntrada}</td>
        <td>${registro.nome}</td>
        <td>${registro.documento}</td>
        <td>${registro.tipo}</td>
        <td>${registro.motivo}</td>
        <td>${registro.horaSaida || '---'}</td>
        <td>
          ${
            !registro.horaSaida && registro.acao === 'Entrada'
              ? `<button onclick="registrarSaida(${index})">Registrar Saída</button>`
              : ''
          }
        </td>
      `;
      tabela.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const documento = document.getElementById('documento').value;
    const tipo = document.getElementById('tipo').value;
    const motivo = document.getElementById('motivo').value;
    const acao = document.getElementById('acao').value;
    const dataHoraEntrada = new Date().toLocaleString();

    const novoRegistro = {
      nome,
      documento,
      tipo,
      motivo,
      acao,
      dataHoraEntrada,
      horaSaida: acao === 'Saída' ? dataHoraEntrada : null
    };

    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    registros.push(novoRegistro);
    localStorage.setItem('registros', JSON.stringify(registros));

    form.reset();
    carregarRegistros();
  });

  window.registrarSaida = function (index) {
    const registros = JSON.parse(localStorage.getItem('registros'));
    registros[index].horaSaida = new Date().toLocaleString();
    registros[index].acao = 'Saída';
    localStorage.setItem('registros', JSON.stringify(registros));
    carregarRegistros();
  };

  window.gerarRelatorio = function () {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];

    if (registros.length === 0) {
      alert("Nenhum registro para exportar.");
      return;
    }

    let csv = "Nome;Documento;Tipo;Motivo;Entrada;Saída\n";
    registros.forEach(reg => {
      csv += `${reg.nome};${reg.documento};${reg.tipo};${reg.motivo};${reg.dataHoraEntrada};${reg.horaSaida || ''}\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio_acesso.csv";
    link.click();
  };

  carregarRegistros();
});

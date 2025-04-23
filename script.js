let ordens = [];
let ordemEditandoIndex = null; // Para rastrear se estamos editando uma ordem

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    adicionarOuAtualizarOrdem();
});

// Função para adicionar ou atualizar uma ordem
function adicionarOuAtualizarOrdem() {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const dataConclusao = document.getElementById("data-conclusao").value || "Não definida";
    const operador = document.getElementById("operador").value;
    const local = document.getElementById("local").value;
    const prioridade = document.getElementById("prioridade").value;
    let status = document.getElementById("status").value;
    const departamento = document.getElementById("departamento").value;

    if (!titulo || !descricao || !operador || !local) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

      // Verifica se a ordem está atrasada
      const hoje = new Date();
      const dataOrdem = new Date(dataConclusao);
      if (dataOrdem < hoje && status !== "concluída") {
          status = "Atrasada";
      }

    const novaOrdem = {
        titulo,
        descricao,
        dataConclusao,
        operador,
        local,
        prioridade,
        status,
        departamento,
    };

    if (ordemEditandoIndex !== null) {
        ordens[ordemEditandoIndex] = novaOrdem; // Atualiza a ordem existente
        ordemEditandoIndex = null;
    } else {
        ordens.push(novaOrdem); // Adiciona uma nova ordem

        // Enviar para o backend
fetch('http://localhost:3000/ordens', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(novaOrdem)
})
.then(response => {
    if (!response.ok) throw new Error("Erro ao salvar no banco");
    return response.json();
})
.then(data => {
    console.log(data.message); // Mensagem de sucesso
})
.catch(error => {
    console.error("Erro:", error);
});
    }

    limparCampos();
    atualizarLista();
}

// Função para editar uma ordem
function editarOrdem(index) {
    const ordem = ordens[index];

    document.getElementById("titulo").value = ordem.titulo;
    document.getElementById("descricao").value = ordem.descricao;
    document.getElementById("data-conclusao").value = ordem.dataConclusao !== "Não definida" ? ordem.dataConclusao : "";
    document.getElementById("operador").value = ordem.operador;
    document.getElementById("local").value = ordem.local;
    document.getElementById("prioridade").value = ordem.prioridade;
    document.getElementById("status").value = ordem.status;
    document.getElementById("departamento").value = ordem.departamento;

    ordemEditandoIndex = index;
}

// Função para excluir uma ordem
function excluirOrdem(index) {
    if (confirm("Tem certeza que deseja excluir esta ordem?")) {
        ordens.splice(index, 1);
        atualizarLista();
    }
}

// Função para filtrar ordens por status
function filtrarOrdens(tipo) {
    let listaFiltrada = [];

    if (tipo === "abertas") {
        listaFiltrada = ordens.filter(ordem => ordem.status === "Aberta");
    } else if (tipo === "fechadas") {
        listaFiltrada = ordens.filter(ordem => ordem.status === "concluída");
    } else if (tipo === "atrasadas") {
        listaFiltrada = ordens.filter(ordem => new Date(ordem.dataConclusao) < new Date() && ordem.status !== "concluída");
    } else if (tipo === "deletadas") {
        alert("Não há armazenamento de ordens deletadas.");
        return;
    }

    atualizarLista(listaFiltrada);
}

// Função para atualizar a lista de ordens na tela
function atualizarLista(lista = ordens) {
    const listaElement = document.getElementById("ordens-lista");
    listaElement.innerHTML = "";

    lista.forEach((ordem, index) => {
        const li = document.createElement("li");

        let statusCor = "black"; // Cor padrão
        if (ordem.status === "Atrasada") statusCor = "red";
        else if (ordem.status === "Aberta") statusCor = "blue";
        else if (ordem.status === "concluída") statusCor = "green";

        li.innerHTML = `
        <strong>${ordem.titulo}</strong> - ${ordem.descricao} <br>
        <strong>Operador:</strong> ${ordem.operador} | <strong>Local:</strong> ${ordem.local} <br>
        <strong>Prioridade:</strong> ${ordem.prioridade} | <strong>Status:</strong> <span style="color:${statusCor};">${ordem.status}</span> <br>
        <strong>Data de Conclusão:</strong> ${ordem.dataConclusao} | <strong>Departamento:</strong> ${ordem.departamento} <br>
        <button onclick="editarOrdem(${index})">Editar</button>
        <button onclick="excluirOrdem(${index})">Excluir</button>
    `;
        listaElement.appendChild(li);
    });
}

// Função para limpar os campos após adicionar ou editar
function limparCampos() {
    document.getElementById("form").reset();
    ordemEditandoIndex = null;
}

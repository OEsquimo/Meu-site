document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoSelect = document.getElementById("servico");
  const btusSelect = document.getElementById("btus");
  const defeitoTextarea = document.getElementById("defeito");
  const campoDefeito = document.getElementById("campo-defeito");

  const erroNome = document.getElementById("erro-nome");
  const erroEndereco = document.getElementById("erro-endereco");
  const erroWhatsapp = document.getElementById("erro-whatsapp");
  const erroServico = document.getElementById("erro-servico");
  const erroBtus = document.getElementById("erro-btus");

  const seuWhatsApp = "5581983259341";

  whatsappInput.addEventListener("input", function (e) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
      e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      e.target.value = `(${v}`;
    }
  });

  const precoInstalacao = {
    "9000": 500,
    "12000": 600,
    "18000": 700,
    "24000": 800,
    "30000": 900,
  };

  const precoLimpezaSplit = {
    "9000": 180,
    "12000": 230,
    "18000": 280,
    "24000": 330,
    "30000": 380,
  };

  const precoLimpezaJanela = 150;

  function validarWhatsApp(tel) {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(tel);
  }

  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    if (servico === "Manutenção") return "Orçamento sob análise";
    return "";
  }

  function exibirErro(elementoErro, mensagem) {
    elementoErro.innerText = mensagem;
  }

  function limparErro(elementoErro) {
    elementoErro.innerText = "";
  }

  servicoSelect.addEventListener("change", function () {
    const servicoSelecionado = servicoSelect.value;

    if (servicoSelecionado === "Manutenção") {
      campoDefeito.style.display = "block";
      btusSelect.parentElement.style.display = "none";
      btusSelect.value = "";
    } else {
      campoDefeito.style.display = "none";
      defeitoTextarea.value = "";
      btusSelect.parentElement.style.display = "block";
    }
  });

  function validarFormulario() {
    let isValid = true;

    if (nomeInput.value.trim() === "") {
      exibirErro(erroNome, "Informe seu nome.");
      isValid = false;
    } else limparErro(erroNome);

    if (enderecoInput.value.trim() === "") {
      exibirErro(erroEndereco, "Preencha seu endereço.");
      isValid = false;
    } else limparErro(erroEndereco);

    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErro(erroWhatsapp, "DDD e número do WhatsApp.");
      isValid = false;
    } else limparErro(erroWhatsapp);

    if (servicoSelect.value === "") {
      exibirErro(erroServico, "Selecione o tipo de serviço.");
      isValid = false;
    } else limparErro(erroServico);

    if (
      servicoSelect.value !== "Manutenção" &&
      btusSelect.value === ""
    ) {
      exibirErro(erroBtus, "Selecione a capacidade em BTUs.");
      isValid = false;
    } else limparErro(erroBtus);

    return isValid;
  }

  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsappCliente = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value.trim();
    const defeito = defeitoTextarea.value.trim();

    let valorOrcamento = calcularValor(servico, btus);

    const camposValidosParaRelatorio =
      nome.length > 0 &&
      endereco.length > 0 &&
      validarWhatsApp(whatsappCliente) &&
      servico.length > 0 &&
      (
        (servico === "Manutenção" && defeito.length > 0) ||
        (servico !== "Manutenção" && btus.length > 0)
      ) &&
      valorOrcamento !== "";

    if (camposValidosParaRelatorio) {
      const relatorioTexto =
`*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp: ${whatsappCliente}
🛠️ Serviço: ${servico}
❄️ BTUs: ${btus || "N/A"}
${servico === "Manutenção" ? `🛠️ Defeito: ${defeito}` : ""}
💰 Valor do Orçamento: ${valorOrcamento}

Obs: Mande esse orçamento para nossa conversa no WhatsApp.`;

      relatorioDiv.innerText = relatorioTexto;
      enviarBtn.disabled = false;
      return relatorioTexto;
    } else {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return null;
    }
  }

  form.addEventListener("input", gerarRelatorio);

  enviarBtn.addEventListener("click", function () {
    if (!validarFormulario()) return;

    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});

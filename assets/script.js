document.addEventListener("DOMContentLoaded", function () {
  const servicos = document.querySelectorAll(".servico");
  const servicoSelecionadoInput = document.getElementById("servicoSelecionado");

  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");

  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const btusSelect = document.getElementById("btus");
  const defeitoTextarea = document.getElementById("defeito");

  const campoBtusWrapper = document.getElementById("campo-btus-wrapper");
  const campoDefeitoWrapper = document.getElementById("campo-defeito-wrapper");

  const seuWhatsApp = "5581983259341";

  // --------------------------------------------
  // Campo WhatsApp com máscara, validação e erro
  // --------------------------------------------
  whatsappInput.addEventListener("input", function (e) {
    // Remove tudo que não for número para trabalhar só com dígitos
    let digits = this.value.replace(/\D/g, "");

    // Limita o máximo a 11 dígitos (DDD + número)
    if (digits.length > 11) {
      digits = digits.slice(0, 11);
    }

    // Monta a máscara conforme quantidade de dígitos
    if (digits.length > 6) {
      // Exemplo: (81) 98325-9341
      this.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 2) {
      // Exemplo: (81) 98325
      this.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length > 0) {
      // Exemplo: (8
      this.value = `(${digits}`;
    } else {
      // Campo vazio
      this.value = "";
    }

    // ✅ Remove erro visual assim que o usuário começa a digitar algo válido
    if (validarWhatsApp(this.value)) {
      this.classList.remove("input-error");
      document.getElementById("erro-whatsapp").textContent = "";
    } else {
      // ⚠️ Mostra erro se o número não estiver no formato correto
      this.classList.add("input-error");
      document.getElementById("erro-whatsapp").textContent =
        "DDD e número válidos (ex: (81) 91234-5678)";
    }

    // Atualiza o estado do botão Enviar conforme validação geral
    validarFormulario();
  });

  // --------------------------------------------
  // Seleção do serviço clicando na imagem
  // --------------------------------------------
  servicos.forEach((servico) => {
    servico.addEventListener("click", function () {
      servicos.forEach((s) => s.classList.remove("selecionado"));
      this.classList.add("selecionado");

      const servicoEscolhido = this.getAttribute("data-servico");
      servicoSelecionadoInput.value = servicoEscolhido;

      atualizarCamposPorServico(servicoEscolhido);

      // Scroll suave para campo nome + foco
      nomeInput.scrollIntoView({ behavior: "smooth", block: "center" });
      nomeInput.focus();

      validarFormulario();
    });
  });

  // --------------------------------------------
  // Mostrar ou esconder campos conforme serviço escolhido
  // --------------------------------------------
  function atualizarCamposPorServico(servico) {
    if (servico === "Instalação" || servico === "Limpeza Split") {
      campoBtusWrapper.style.display = "block";
      campoDefeitoWrapper.style.display = "none";
    } else if (servico === "Manutenção") {
      campoBtusWrapper.style.display = "none";
      campoDefeitoWrapper.style.display = "block";
    } else {
      campoBtusWrapper.style.display = "none";
      campoDefeitoWrapper.style.display = "none";
    }
  }

  // --------------------------------------------
  // Validação WhatsApp - regex para formato (xx) xxxxx-xxxx
  // --------------------------------------------
  function validarWhatsApp(tel) {
    const regex = /^\d{2} \d{5}-\d{4}$/;
    return regex.test(tel);
  }

  // --------------------------------------------
  // Mostrar erro (placeholder + borda vermelha)
  // --------------------------------------------
  function mostrarErroInput(input, mensagem) {
    input.classList.add("input-error");
    input.value = "";
    input.placeholder = mensagem;
  }

  // --------------------------------------------
  // Limpar erro e restaurar placeholder original
  // --------------------------------------------
  function limparErroInput(input, placeholder) {
    input.classList.remove("input-error");
    input.placeholder = placeholder;
  }

  // --------------------------------------------
  // Preço base dos serviços
  // --------------------------------------------
  const precoInstalacao = {
    9000: 500,
    12000: 600,
    18000: 700,
    24000: 800,
    30000: 900,
  };
  const precoLimpezaSplit = {
    9000: 180,
    12000: 230,
    18000: 280,
    24000: 330,
    30000: 380,
  };
  const precoLimpezaJanela = 150;

  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    return "";
  }

  // --------------------------------------------
  // Validação geral do formulário
  // --------------------------------------------
  function validarFormulario() {
    let isValid = true;

    // Nome
    if (nomeInput.value.trim() === "") {
      mostrarErroInput(nomeInput, "Informe seu nome");
      isValid = false;
    } else {
      limparErroInput(nomeInput, "Digite seu nome");
    }

    // Endereço
    if (enderecoInput.value.trim() === "") {
      mostrarErroInput(enderecoInput, "Informe seu endereço");
      isValid = false;
    } else {
      limparErroInput(enderecoInput, "Digite seu endereço");
    }

    // WhatsApp
    if (!validarWhatsApp(whatsappInput.value.trim())) {
      mostrarErroInput(whatsappInput, "(xx) xxxxx-xxxx");
      isValid = false;
    } else {
      limparErroInput(whatsappInput, "(xx) xxxxx-xxxx");
    }

    // Serviço selecionado
    if (servicoSelecionadoInput.value === "") {
      alert("Por favor, selecione um serviço clicando na imagem.");
      isValid = false;
    }

    // BTUs ou defeito conforme serviço
    if (
      servicoSelecionadoInput.value === "Instalação" ||
      servicoSelecionadoInput.value === "Limpeza Split"
    ) {
      if (btusSelect.value === "") {
        mostrarErroInput(btusSelect, "Selecione BTU");
        isValid = false;
      } else {
        limparErroInput(btusSelect, "");
      }
      limparErroInput(defeitoTextarea, "Descreva o defeito aqui...");
    } else if (servicoSelecionadoInput.value === "Manutenção") {
      if (defeitoTextarea.value.trim() === "") {
        mostrarErroInput(defeitoTextarea, "Descreva o defeito");
        isValid = false;
      } else {
        limparErroInput(defeitoTextarea, "Descreva o defeito aqui...");
      }
      limparErroInput(btusSelect, "");
    } else {
      limparErroInput(btusSelect, "");
      limparErroInput(defeitoTextarea, "Descreva o defeito aqui...");
    }

    enviarBtn.disabled = !isValid;
    return isValid;
  }

  // --------------------------------------------
  // Gera relatório e ativa botão
  // --------------------------------------------
  function gerarRelatorio() {
    if (!validarFormulario()) {
      relatorioDiv.innerText = "";
      return null;
    }

    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsappCliente = whatsappInput.value.trim();
    const servico = servicoSelecionadoInput.value;
    const btus = btusSelect.value.trim();
    const defeito = defeitoTextarea.value.trim();

    let valorOrcamento = calcularValor(servico, btus);

    if (servico === "Manutenção") {
      valorOrcamento = "Orçamento sob análise";
    }

    let textoRelatorio = `*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp: ${whatsappCliente}
🛠️ Serviço: ${servico}
❄️ BTUs: ${btus || "N/A"}
💰 Valor do Orçamento: R$ ${valorOrcamento}`;

    if (servico === "Manutenção") {
      textoRelatorio += `
🔧 Defeito: ${defeito}`;
    }

    textoRelatorio += `
Obs: Mande esse orçamento para nossa conversa no WhatsApp`;

    relatorioDiv.innerText = textoRelatorio;

    return textoRelatorio;
  }

  // --------------------------------------------
  // Atualiza relatório e botão ao digitar
  // --------------------------------------------
  form.addEventListener("input", () => {
    gerarRelatorio();
  });

  // --------------------------------------------
  // Clique botão enviar
  // --------------------------------------------
  enviarBtn.addEventListener("click", () => {
    if (!validarFormulario()) {
      // Foca no primeiro campo com

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

  const seuWhatsApp = "5581983259341"; // Seu WhatsApp fixo

  // Função para aplicar máscara simples no WhatsApp
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

  // Seleção do serviço clicando na imagem
  servicos.forEach(servico => {
    servico.addEventListener("click", function () {
      servicos.forEach(s => s.classList.remove("selecionado"));
      this.classList.add("selecionado");

      const servicoEscolhido = this.getAttribute("data-servico");
      servicoSelecionadoInput.value = servicoEscolhido;

      atualizarCamposPorServico(servicoEscolhido);

      // Rola para o campo nome e dá foco
      nomeInput.scrollIntoView({ behavior: "smooth", block: "center" });
      nomeInput.focus();

      validarFormulario(); // Atualiza botão e erros
    });
  });

  // Mostrar/ocultar campos BTU e defeito
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

  // Validação WhatsApp
  function validarWhatsApp(tel) {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(tel);
  }

  // Função para mostrar erro (borda vermelha + placeholder vermelho)
  function mostrarErroInput(input, mensagemErro, placeholderOriginal) {
    input.classList.add("input-error");
    input.value = "";
    input.placeholder = mensagemErro;
  }

  // Limpar erro do input
  function limparErroInput(input, placeholderOriginal) {
    input.classList.remove("input-error");
    input.placeholder = placeholderOriginal;
  }

  // Preços base
  const precoInstalacao = { "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900 };
  const precoLimpezaSplit = { "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380 };
  const precoLimpezaJanela = 150;

  // Calcula valor orçamento
  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    return "";
  }

  // Validação completa do formulário
  function validarFormulario() {
    let valido = true;

    // Nome
    if (nomeInput.value.trim() === "") {
      mostrarErroInput(nomeInput, "Preencha seu nome");
      valido = false;
    } else {
      limparErroInput(nomeInput, "Nome");
    }

    // Endereço
    if (enderecoInput.value.trim() === "") {
      mostrarErroInput(enderecoInput, "Preencha seu endereço");
      valido = false;
    } else {
      limparErroInput(enderecoInput, "Endereço");
    }

    // WhatsApp
    if (!validarWhatsApp(whatsappInput.value.trim())) {
      mostrarErroInput(whatsappInput, "DDD e número válidos");
      valido = false;
    } else {
      limparErroInput(whatsappInput, "(xx) xxxxx-xxxx");
    }

    // Serviço selecionado
    if (servicoSelecionadoInput.value === "") {
      alert("Selecione um serviço clicando na imagem acima.");
      valido = false;
    }

    // BTUs se for instalação ou limpeza split
    if ((servicoSelecionadoInput.value === "Instalação" || servicoSelecionadoInput.value === "Limpeza Split") && btusSelect.value === "") {
      mostrarErroInput(btusSelect, "Selecione a capacidade");
      valido = false;
    } else {
      limparErroInput(btusSelect, "");
    }

    // Defeito se for manutenção
    if (servicoSelecionadoInput.value === "Manutenção" && defeitoTextarea.value.trim() === "") {
      mostrarErroInput(defeitoTextarea, "Descreva o defeito");
      valido = false;
    } else {
      limparErroInput(defeitoTextarea, "Descreva o defeito aqui...");
    }

    enviarBtn.disabled = !valido;

    return valido;
  }

  // Função para gerar relatório
  function gerarRelatorio() {
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

    // Formata relatório com emojis e mini ícones
    let relatorioTexto =
`*ORÇAMENTO - O ESQUIMÓ*  
👤 Nome: ${nome}  
📍 Endereço: ${endereco}  
📱 WhatsApp: ${whatsappCliente}  
🛠️ Serviço: ${servico}  
❄️ BTUs: ${btus || "N/A"}`;

    if (servico === "Manutenção") {
      relatorioTexto += `  
⚠️ Defeito descrito: ${defeito}`;
    }

    relatorioTexto += `  
💰 Valor: R$ ${valorOrcamento}  

📩 Envie este orçamento para nosso WhatsApp.`;

    relatorioDiv.innerText = relatorioTexto;
  }

  // Atualiza relatório e valida formulário ao digitar
  form.addEventListener("input", function () {
    validarFormulario();
    gerarRelatorio();
  });

  // Enviar botão click
  enviarBtn.addEventListener("click", function () {
    if (!validarFormulario()) {
      // Foca no primeiro campo inválido
      if (nomeInput.classList.contains("input-error")) nomeInput.focus();
      else if (enderecoInput.classList.contains("input-error")) enderecoInput.focus();
      else if (whatsappInput.classList.contains("input-error")) whatsappInput.focus();
      else if (btusSelect.classList.contains("input-error")) btusSelect.focus();
      else if (defeitoTextarea.classList.contains("input-error")) defeitoTextarea.focus();
      else if (servicoSelecionadoInput.value === "") alert("Selecione um serviço clicando na imagem acima.");
      return;
    }

    const mensagem = relatorioDiv.innerText;
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });

  // Inicialmente botão desabilitado
  enviarBtn.disabled = true;
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoHidden = document.getElementById("servico");
  const servicosImgs = document.querySelectorAll(".servico");
  const btusSelect = document.getElementById("btus");
  const defeitoTextarea = document.getElementById("defeito");
  const campoBtus = document.getElementById("campo-btus");
  const campoDefeito = document.getElementById("campo-defeito");

  const seuWhatsApp = "5581983259341";

  // Máscara WhatsApp
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

  // Validação WhatsApp
  function validarWhatsApp(tel) {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(tel);
  }

  // Marcar e desmarcar erro no campo (borda e sombra vermelha)
  function exibirErroCampo(input) {
    input.classList.add("input-error");
  }

  function limparErroCampo(input) {
    input.classList.remove("input-error");
  }

  // Limpa erros de todos os campos
  function limparTodosErros() {
    [nomeInput, enderecoInput, whatsappInput, btusSelect, defeitoTextarea].forEach(limparErroCampo);
  }

  // Atualiza visibilidade de campos BTUs e defeito conforme serviço
  function atualizarCamposPorServico() {
    const servico = servicoHidden.value;

    if (servico === "Instalação" || servico === "Limpeza Split") {
      campoBtus.style.display = "block";
      campoDefeito.style.display = "none";
      defeitoTextarea.value = "";
    } else if (servico === "Manutenção") {
      campoBtus.style.display = "none";
      btusSelect.value = "";
      campoDefeito.style.display = "block";
    } else {
      campoBtus.style.display = "none";
      campoDefeito.style.display = "none";
      btusSelect.value = "";
      defeitoTextarea.value = "";
    }
  }

  // Selecionar serviço com clique nas imagens
  servicosImgs.forEach((div) => {
    div.addEventListener("click", () => {
      servicosImgs.forEach(d => d.classList.remove("selecionado"));
      div.classList.add("selecionado");
      servicoHidden.value = div.getAttribute("data-servico");
      atualizarCamposPorServico();
      nomeInput.focus();
      window.scrollTo({ top: nomeInput.offsetTop - 30, behavior: "smooth" });
      gerarRelatorio();
    });
    // Permite selecionar com Enter para acessibilidade
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        div.click();
      }
    });
  });

  // Função para calcular preço (mesmo do seu script original)
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

  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    return "";
  }

  // Validação completa dos campos com exibição de erro dentro do input
  function validarFormulario() {
    let valido = true;

    limparTodosErros();

    if (nomeInput.value.trim() === "") {
      exibirErroCampo(nomeInput);
      valido = false;
    }
    if (enderecoInput.value.trim() === "") {
      exibirErroCampo(enderecoInput);
      valido = false;
    }
    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErroCampo(whatsappInput);
      valido = false;
    }

    const servico = servicoHidden.value;

    if (servico === "") {
      // Se não selecionou serviço, nenhuma validação a mais, pois campo invisível
      valido = false;
    } else if (servico === "Instalação" || servico === "Limpeza Split") {
      if (btusSelect.value === "") {
        exibirErroCampo(btusSelect);
        valido = false;
      }
    } else if (servico === "Manutenção") {
      if (defeitoTextarea.value.trim() === "") {
        exibirErroCampo(defeitoTextarea);
        valido = false;
      }
    }

    return valido;
  }

  // Gera o relatório de orçamento no div e habilita botão se válido
  function gerarRelatorio() {
    if (!validarFormulario()) {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return;
    }

    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const servico = servicoHidden.value;
    const btus = btusSelect.value;
    const defeito = defeitoTextarea.value.trim();

    let valor = calcularValor(servico, btus);
    if (servico === "Manutenção") valor = "Orçamento sob análise";

    const textoRelatorio = `*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp: ${whatsapp}
🛠️ Serviço: ${servico}
${servico === "Manutenção" ? `🔧 Defeito: ${defeito}` : `❄️ BTUs: ${btus || "N/A"}`}
💰 Valor do Orçamento: R$ ${valor}
Obs: Mande esse orçamento para nossa conversa no WhatsApp`;

    relatorioDiv.innerText = textoRelatorio;
    enviarBtn.disabled = false;
  }

  // Atualiza relatório e validação quando campos mudam
  form.addEventListener("input", () => {
    limparTodosErros();
    gerarRelatorio();
  });

  // Botão enviar orçamento
  enviarBtn.addEventListener("click", () => {
    if (!validarFormulario()) {
      gerarRelatorio();
      // foco no primeiro campo com erro:
      if (nomeInput.classList.contains("input-error")) nomeInput.focus();
      else if (enderecoInput.classList.contains("input-error")) enderecoInput.focus();
      else if (whatsappInput.classList.contains("input-error")) whatsappInput.focus();
      else if (btusSelect.classList.contains("input-error")) btusSelect.focus();
      else if (defeitoTextarea.classList.contains("input-error")) defeitoTextarea.focus();
      return;
    }

    const msg = relatorioDiv.innerText;
    const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });

  // Inicializa campos (esconde btus e defeito)
  servicoHidden.value = "";
  atualizarCamposPorServico();
  enviarBtn.disabled = true;
});

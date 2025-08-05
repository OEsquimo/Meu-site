document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoHidden = document.getElementById("servico");
  const servicoCards = document.querySelectorAll(".servico");
  const btusSelect = document.getElementById("btus");
  const campoBtus = document.getElementById("campo-btus");
  const campoDefeito = document.getElementById("campo-defeito");
  const defeitoInput = document.getElementById("defeito");

  const erroNome = document.getElementById("erro-nome");
  const erroEndereco = document.getElementById("erro-endereco");
  const erroWhatsapp = document.getElementById("erro-whatsapp");
  const erroBtus = document.getElementById("erro-btus");

  const seuWhatsApp = "5581983259341";

  // Máscara do WhatsApp
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

  // Preços
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

  function validarFormulario() {
    let isValid = true;

    if (nomeInput.value.trim() === "") {
      exibirErro(erroNome, "Obrigatório");
      isValid = false;
    } else limparErro(erroNome);

    if (enderecoInput.value.trim() === "") {
      exibirErro(erroEndereco, "Obrigatório");
      isValid = false;
    } else limparErro(erroEndereco);

    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErro(erroWhatsapp, "Formato inválido");
      isValid = false;
    } else limparErro(erroWhatsapp);

    const servicoSelecionado = servicoHidden.value;

    if (servicoSelecionado === "Instalação" || servicoSelecionado === "Limpeza Split") {
      if (btusSelect.value === "") {
        exibirErro(erroBtus, "Obrigatório");
        isValid = false;
      } else limparErro(erroBtus);
    }

    return isValid;
  }

  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsappCliente = whatsappInput.value.trim();
    const servico = servicoHidden.value;
    const btus = btusSelect.value.trim();
    const defeito = defeitoInput.value.trim();

    let valorOrcamento = calcularValor(servico, btus);

    if (servico === "Manutenção") {
      valorOrcamento = "Orçamento sob análise";
    }

    const camposValidosParaRelatorio =
      nome &&
      endereco &&
      validarWhatsApp(whatsappCliente) &&
      servico &&
      (
        (servico === "Instalação" || servico === "Limpeza Split") && btus ||
        (servico === "Manutenção" && defeito.length > 3)
      );

    if (camposValidosParaRelatorio) {
      const relatorioTexto =
`*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp: ${whatsappCliente}
🛠️ Serviço: ${servico}
${servico === "Manutenção" ? `📝 Defeito: ${defeito}` : `❄️ BTUs: ${btus}`}
💰 Valor: ${valorOrcamento}

✅ Envie esse orçamento no WhatsApp!`;

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

  // Seleção de serviço por clique nas imagens
  servicoCards.forEach(card => {
    card.addEventListener("click", () => {
      servicoCards.forEach(c => c.classList.remove("selecionado"));
      card.classList.add("selecionado");

      const servicoSelecionado = card.dataset.servico;
      servicoHidden.value = servicoSelecionado;

      // Mostrar/ocultar campos
      campoBtus.style.display = (servicoSelecionado === "Instalação" || servicoSelecionado === "Limpeza Split") ? "block" : "none";
      campoDefeito.style.display = (servicoSelecionado === "Manutenção") ? "block" : "none";

      // Scroll automático para o campo Nome
      nomeInput.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => nomeInput.focus(), 600);

      gerarRelatorio();
    });
  });
});

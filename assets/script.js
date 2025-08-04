document.addEventListener("DOMContentLoaded", function () {
  // Seleciona os elementos do DOM
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoSelect = document.getElementById("servico");
  const btusSelect = document.getElementById("btus");

  // Elementos para mensagens de erro
  const erroNome = document.getElementById("erro-nome");
  const erroEndereco = document.getElementById("erro-endereco");
  const erroWhatsapp = document.getElementById("erro-whatsapp");
  const erroServico = document.getElementById("erro-servico");
  const erroBtus = document.getElementById("erro-btus");

  const seuWhatsApp = "5581983259341"; // Seu WhatsApp fixo

  // Máscara simples para WhatsApp
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

  // Preço base para cada serviço e BTU
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

  // Validação do formato WhatsApp
  function validarWhatsApp(tel) {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(tel);
  }

  // Calcula o valor do orçamento baseado no serviço e BTU
  function calcularValor(servico, btus) {
    if (servico === "Instalação") {
      return precoInstalacao[btus] ?? "";
    }
    if (servico === "Limpeza Split") {
      return precoLimpezaSplit[btus] ?? "";
    }
    if (servico === "Limpeza Janela") {
      return precoLimpezaJanela;
    }
    if (servico === "Manutenção") {
      return "Orçamento sob análise";
    }
    return "";
  }

  // Exibir mensagens de erro
  function exibirErro(elementoErro, mensagem) {
    elementoErro.innerText = mensagem;
  }

  // Limpar mensagens de erro
  function limparErro(elementoErro) {
    elementoErro.innerText = "";
  }

  // Validar formulário
  function validarFormulario() {
    let isValid = true;

    // Nome
    if (nomeInput.value.trim() === "") {
      exibirErro(erroNome, "Informe seu nome aqui.");
      isValid = false;
    } else {
      limparErro(erroNome);
    }

    // Endereço
    if (enderecoInput.value.trim() === "") {
      exibirErro(erroEndereco, "Preencha seu endereço.");
      isValid = false;
    } else {
      limparErro(erroEndereco);
    }

    // WhatsApp
    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErro(erroWhatsapp, "DDD e número do WhatsApp inválidos.");
      isValid = false;
    } else {
      limparErro(erroWhatsapp);
    }

    // Serviço
    if (servicoSelect.value === "") {
      exibirErro(erroServico, "Selecione o tipo de serviço.");
      isValid = false;
    } else {
      limparErro(erroServico);
    }

    // BTUs (se não for Limpeza Janela)
    if (servicoSelect.value !== "Limpeza Janela" && btusSelect.value === "") {
      exibirErro(erroBtus, "Selecione a capacidade em BTUs.");
      isValid = false;
    } else {
      limparErro(erroBtus);
    }

    return isValid;
  }

  // Gera o relatório de orçamento e controla o botão enviar
  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsappCliente = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value.trim();

    let valorOrcamento = calcularValor(servico, btus);

    // Só libera o botão se tudo válido e valor definido (exceto manutenção)
    const camposValidosParaRelatorio =
      nome.length > 0 &&
      endereco.length > 0 &&
      validarWhatsApp(whatsappCliente) &&
      servico.length > 0 &&
      (servico === "Limpeza Janela" || btus.length > 0) &&
      valorOrcamento !== "";

    if (camposValidosParaRelatorio) {
      const relatorioTexto = 
`*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp: ${whatsappCliente}
🛠️ Serviço: ${servico}
❄️ BTUs: ${btus || "N/A"}
💰 Valor do Orçamento: R$ ${valorOrcamento}
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

  // Atualiza o relatório sempre que o formulário muda
  form.addEventListener("input", gerarRelatorio);

  // Ação do botão enviar — abre o WhatsApp com mensagem
  enviarBtn.addEventListener("click", function () {
    if (!validarFormulario()) {
      // Foca no primeiro campo inválido
      if (nomeInput.value.trim() === "") {
        nomeInput.focus();
      } else if (enderecoInput.value.trim() === "") {
        enderecoInput.focus();
      } else if (!validarWhatsApp(whatsappInput.value.trim())) {
        whatsappInput.focus();
      } else if (servicoSelect.value === "") {
        servicoSelect.focus();
      } else if (servicoSelect.value !== "Limpeza Janela" && btusSelect.value === "") {
        btusSelect.focus();
      }
      return; // Não enviar se inválido
    }

    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });

  // Seleção do serviço via clique nas imagens
  const servicosImagens = document.querySelectorAll(".servico");

  servicosImagens.forEach((div) => {
    div.addEventListener("click", () => {
      const servicoSelecionado = div.getAttribute("data-servico");
      servicoSelect.value = servicoSelecionado;
      servicoSelect.dispatchEvent(new Event("input")); // Atualiza relatório e validação

      // Visual: marca seleção na imagem
      servicosImagens.forEach((el) => el.classList.remove("selected"));
      div.classList.add("selected");

      // Foca no nome e rola até o formulário
      nomeInput.focus();
      window.scrollTo({
        top: form.offsetTop - 20,
        behavior: "smooth",
      });
    });
  });
});

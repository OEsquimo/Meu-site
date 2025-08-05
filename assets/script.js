document.addEventListener("DOMContentLoaded", function () {
  const servicos = document.querySelectorAll(".servico");
  const servicoInput = document.getElementById("servico");

  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");

  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const btusSelect = document.getElementById("btus");
  const defeitoTextarea = document.getElementById("defeito");

  const erroNome = document.getElementById("erro-nome");
  const erroEndereco = document.getElementById("erro-endereco");
  const erroWhatsapp = document.getElementById("erro-whatsapp");
  const erroBtus = document.getElementById("erro-btus");
  const erroDefeito = document.getElementById("erro-defeito");

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

  // Validação WhatsApp
  function validarWhatsApp(tel) {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(tel);
  }

  // Calcula valor
  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    return "";
  }

  // Exibir erro dentro do input
  function exibirErro(elementoErro, mensagem) {
    elementoErro.innerText = mensagem;
  }

  function limparErro(elementoErro) {
    elementoErro.innerText = "";
  }

  // Validação geral
  function validarFormulario() {
    let valido = true;

    if (nomeInput.value.trim() === "") {
      exibirErro(erroNome, "Informe seu nome.");
      valido = false;
    } else limparErro(erroNome);

    if (enderecoInput.value.trim() === "") {
      exibirErro(erroEndereco, "Informe seu endereço.");
      valido = false;
    } else limparErro(erroEndereco);

    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErro(erroWhatsapp, "DDD e número válidos.");
      valido = false;
    } else limparErro(erroWhatsapp);

    if (servicoInput.value === "") {
      // não tem erro visual, pois o serviço é escolhido pelas imagens
      valido = false;
    }

    if (servicoInput.value === "Instalação" || servicoInput.value === "Limpeza Split") {
      if (btusSelect.value === "") {
        exibirErro(erroBtus, "Selecione o BTU.");
        valido = false;
      } else limparErro(erroBtus);

      // limpar defeito se estava visível antes
      limparErro(erroDefeito);
    } else if (servicoInput.value === "Manutenção") {
      if (defeitoTextarea.value.trim() === "") {
        exibirErro(erroDefeito, "Descreva o defeito.");
        valido = false;
      } else limparErro(erroDefeito);

      // limpar BTUs
      limparErro(erroBtus);
    } else {
      // Caso não selecionado
      limparErro(erroBtus);
      limparErro(erroDefeito);
      valido = false;
    }

    return valido;
  }

  // Gerar relatório
  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const servico = servicoInput.value;
    const btus = btusSelect.value;
    const defeito = defeitoTextarea.value.trim();

    let valor = calcularValor(servico, btus);
    if (servico === "Manutenção") valor = "Orçamento sob análise";

    const relatorioTexto = `*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp: ${whatsapp}
🛠️ Serviço: ${servico}
${servico !== "Manutenção" ? `❄️ BTUs: ${btus}` : ""}
${servico === "Manutenção" ? `⚠️ Defeito: ${defeito}` : ""}
💰 Valor do Orçamento: R$ ${valor}
Obs: Envie essa mensagem para nosso WhatsApp.`;

    relatorioDiv.innerText = relatorioTexto;
  }

  // Atualiza visibilidade dos campos BTU e defeito
  function atualizarCampos() {
    const servico = servicoInput.value;

    if (servico === "Instalação" || servico === "Limpeza Split") {
      campoBtus.style.display = "block";
      campoDefeito.style.display = "none";
    } else if (servico === "Manutenção") {
      campoBtus.style.display = "none";
      campoDefeito.style.display = "block";
    } else {
      campoBtus.style.display = "none";
      campoDefeito.style.display = "none";
    }
  }

  // Atualiza estado do botão e relatório
  function atualizarEstado() {
    if (validarFormulario()) {
      gerarRelatorio();
      enviarBtn.disabled = false;
    } else {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
    }
  }

  // Quando o usuário clicar numa imagem de serviço
  servicos.forEach((div) => {
    div.addEventListener("click", () => {
      // Remove a seleção antiga
      servicos.forEach(s => s.classList.remove("selecionado"));
      // Marca o clicado
      div.classList.add("selecionado");

      // Atualiza input escondido
      servicoInput.value = div.getAttribute("data-servico");

      // Atualiza campos
      atualizarCampos();

      // Limpa campos opcionais para evitar erros
      btusSelect.value = "";
      defeitoTextarea.value = "";

      // Atualiza estado geral do formulário
      atualizarEstado();

      // Rola suavemente para o nome e foca nele
      nomeInput.scrollIntoView({ behavior: "smooth", block: "center" });
      nomeInput.focus();
    });

    // Também habilitar seleção via teclado Enter/Space
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        div.click();
      }
    });
  });

  // Sempre que mudar inputs, atualizar
  form.addEventListener("input", atualizarEstado);

  // Botão enviar
  enviarBtn.addEventListener("click", () => {
    if (!validarFormulario()) {
      // Foca no primeiro campo com erro
      if (nomeInput.value.trim() === "") nomeInput.focus();
      else if (enderecoInput.value.trim() === "") enderecoInput.focus();
      else if (!validarWhatsApp(whatsappInput.value.trim())) whatsappInput.focus();
      else if ((servicoInput.value === "Instalação" || servicoInput.value === "Limpeza Split") && btusSelect.value === "") btusSelect.focus();
      else if (servicoInput.value === "Manutenção" && defeitoTextarea.value.trim() === "") defeitoTextarea.focus();
      return;
    }

    const mensagem = relatorioDiv.innerText;
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});

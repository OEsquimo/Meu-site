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
  const defeitoTextarea = document.getElementById("defeito");

  // Elementos para mensagens de erro
  const erroNome = document.getElementById("erro-nome");
  const erroEndereco = document.getElementById("erro-endereco");
  const erroWhatsapp = document.getElementById("erro-whatsapp");
  const erroServico = document.getElementById("erro-servico");
  const erroBtus = document.getElementById("erro-btus");
  const erroDefeito = document.getElementById("erro-defeito");

  const seuWhatsApp = "5581983259341"; // Seu WhatsApp fixo

  // Função para aplicar máscara simples no campo WhatsApp do cliente
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
    // Para manutenção não tem valor fixo
    return "";
  }

  // Função para exibir mensagens de erro dentro dos inputs (com borda vermelha)
  function exibirErroInput(input, mensagem, elementoErro) {
    elementoErro.innerText = mensagem;
    input.classList.add("input-error");
  }

  // Função para limpar mensagens de erro e borda
  function limparErroInput(input, elementoErro) {
    elementoErro.innerText = "";
    input.classList.remove("input-error");
  }

  // Função para validar todos os campos do formulário
  function validarFormulario() {
    let isValid = true;

    // Validação do campo Nome
    if (nomeInput.value.trim() === "") {
      exibirErroInput(nomeInput, "Informe seu nome aqui.", erroNome);
      isValid = false;
    } else {
      limparErroInput(nomeInput, erroNome);
    }

    // Validação do campo Endereço
    if (enderecoInput.value.trim() === "") {
      exibirErroInput(enderecoInput, "Preencha seu endereço.", erroEndereco);
      isValid = false;
    } else {
      limparErroInput(enderecoInput, erroEndereco);
    }

    // Validação do campo WhatsApp
    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErroInput(whatsappInput, "DDD e número do WhatsApp.", erroWhatsapp);
      isValid = false;
    } else {
      limparErroInput(whatsappInput, erroWhatsapp);
    }

    // Validação do campo Tipo de Serviço
    if (servicoSelect.value === "") {
      exibirErroInput(servicoSelect, "Selecione o tipo de serviço.", erroServico);
      isValid = false;
    } else {
      limparErroInput(servicoSelect, erroServico);
    }

    // Validação do campo BTUs (se não for Limpeza Janela ou Manutenção)
    if (servicoSelect.value !== "Limpeza Janela" && servicoSelect.value !== "Manutenção" && btusSelect.value === "") {
      exibirErroInput(btusSelect, "Selecione a capacidade em BTUs.", erroBtus);
      isValid = false;
    } else {
      limparErroInput(btusSelect, erroBtus);
    }

    // Validação do defeito para manutenção
    if (servicoSelect.value === "Manutenção" && defeitoTextarea.value.trim() === "") {
      exibirErroInput(defeitoTextarea, "Descreva o defeito.", erroDefeito);
      isValid = false;
    } else {
      limparErroInput(defeitoTextarea, erroDefeito);
    }

    return isValid;
  }

  // Função para gerar relatório e validar campos
  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsappCliente = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value.trim();
    const defeito = defeitoTextarea.value.trim();

    // Atualiza o valor do orçamento automaticamente
    let valorOrcamento = calcularValor(servico, btus);

    if (servico === "Manutenção") {
      valorOrcamento = "Orçamento sob análise";
    }

    // Verifica se todos os dados são válidos para habilitar o botão e exibir o relatório
    const camposValidosParaRelatorio =
      nome.length > 0 &&
      endereco.length > 0 &&
      validarWhatsApp(whatsappCliente) &&
      servico.length > 0 &&
      ((servico === "Limpeza Janela") || (servico === "Manutenção") || btus.length > 0) &&
      (valorOrcamento !== "" && valorOrcamento !== null);

    if (camposValidosParaRelatorio) {
      let relatorioTexto = `*ORÇAMENTO*\n👤 Nome: ${nome}\n📍 Endereço: ${endereco}\n📱 WhatsApp: ${whatsappCliente}\n🛠️ Serviço: ${servico}`;

      if (servico === "Manutenção") {
        relatorioTexto += `\n📝 Defeito: ${defeito}`;
      } else {
        relatorioTexto += `\n❄️ BTUs: ${btus || "N/A"}`;
      }

      relatorioTexto += `\n💰 Valor do Orçamento: R$ ${valorOrcamento}\n        Obs: Mande esse orçamento \n        para nossa conversa \n        no whatsapp`;

      relatorioDiv.innerText = relatorioTexto;
      enviarBtn.disabled = false;
      return relatorioTexto;
    } else {
      relatorioDiv.innerText = ""; // Limpa o relatório se os campos não forem válidos
      enviarBtn.disabled = true;
      return null;
    }
  }

  // Adiciona listeners para os eventos de input para gerar o relatório e habilitar/desabilitar o botão
  form.addEventListener("input", gerarRelatorio);

  // Listener para o clique do botão Enviar Relatório
  enviarBtn.addEventListener("click", function () {
    // Se o formulário não for válido, exibe erros e foca no primeiro campo inválido
    if (!validarFormulario()) {
      if (nomeInput.value.trim() === "") {
        nomeInput.focus();
      } else if (enderecoInput.value.trim() === "") {
        enderecoInput.focus();
      } else if (!validarWhatsApp(whatsappInput.value.trim())) {
        whatsappInput.focus();
      } else if (servicoSelect.value === "") {
        servicoSelect.focus();
      } else if ((servicoSelect.value !== "Limpeza Janela" && servicoSelect.value !== "Manutenção") && btusSelect.value === "") {
        btusSelect.focus();
      } else if (servicoSelect.value === "Manutenção" && defeitoTextarea.value.trim() === "") {
        defeitoTextarea.focus();
      }
      return; // Impede o envio se a validação falhar
    }

    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });

  // Para limpeza visual do input erro ao digitar
  [nomeInput, enderecoInput, whatsappInput, servicoSelect, btusSelect, defeitoTextarea].forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        limparErroInput(input, document.getElementById("erro-" + input.id));
      }
    });
  });

});

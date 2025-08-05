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

  const campoBtus = document.getElementById("campo-btus");
  const campoDefeito = document.getElementById("campo-defeito");

  const erroNome = document.getElementById("erro-nome");
  const erroEndereco = document.getElementById("erro-endereco");
  const erroWhatsapp = document.getElementById("erro-whatsapp");
  const erroServico = document.getElementById("erro-servico");
  const erroBtus = document.getElementById("erro-btus");

  const seuWhatsApp = "5581983259341";

  // Aplica máscara simples no WhatsApp
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

  // Lógica para mostrar/ocultar campos BTUs e defeito
  function atualizarCamposExtras() {
    const servico = servicoSelect.value;
    if (servico === "Instalação" || servico === "Limpeza Split" || servico === "Limpeza Janela") {
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

  servicoSelect.addEventListener("change", () => {
    atualizarCamposExtras();
    gerarRelatorio();
  });

  // Clique nas imagens para preencher o select e focar no nome
  document.querySelectorAll(".servico").forEach(item => {
    item.addEventListener("click", () => {
      const tipo = item.getAttribute("data-servico");
      servicoSelect.value = tipo;
      atualizarCamposExtras();
      gerarRelatorio();
      nomeInput.focus();
    });
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

  function exibirErro(el, msg) {
    el.textContent = msg;
  }

  function limparErro(el) {
    el.textContent = "";
  }

  function validarFormulario() {
    let valido = true;

    if (nomeInput.value.trim() === "") {
      exibirErro(erroNome, "Informe seu nome");
      valido = false;
    } else {
      limparErro(erroNome);
    }

    if (enderecoInput.value.trim() === "") {
      exibirErro(erroEndereco, "Preencha o endereço");
      valido = false;
    } else {
      limparErro(erroEndereco);
    }

    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErro(erroWhatsapp, "DDD e número válidos");
      valido = false;
    } else {
      limparErro(erroWhatsapp);
    }

    if (servicoSelect.value === "") {
      exibirErro(erroServico, "Escolha o serviço");
      valido = false;
    } else {
      limparErro(erroServico);
    }

    if ((servicoSelect.value === "Instalação" || servicoSelect.value === "Limpeza Split" || servicoSelect.value === "Limpeza Janela") && btusSelect.value === "") {
      exibirErro(erroBtus, "Selecione os BTUs");
      valido = false;
    } else {
      limparErro(erroBtus);
    }

    return valido;
  }

  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    return "";
  }

  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value;
    const defeito = defeitoTextarea.value.trim();

    let valor = calcularValor(servico, btus);
    if (servico === "Manutenção") valor = "Orçamento sob análise";

    const camposValidos =
      nome && endereco && validarWhatsApp(whatsapp) &&
      servico &&
      (
        (servico === "Manutenção" && defeito) ||
        ((servico === "Instalação" || servico === "Limpeza Split" || servico === "Limpeza Janela") && btus && valor)
      );

    if (camposValidos) {
      let relatorio = 
`*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp: ${whatsapp}
🛠️ Serviço: ${servico}`;

      if (servico !== "Manutenção") {
        relatorio += `\n❄️ BTUs: ${btus}\n💰 Valor: R$ ${valor}`;
      } else {
        relatorio += `\n💬 Defeito informado: ${defeito}\n💰 Valor: ${valor}`;
      }

      relatorio += `\n\n✅ Envie esse orçamento para o nosso WhatsApp`;

      relatorioDiv.textContent = relatorio;
      enviarBtn.disabled = false;
      return relatorio;
    } else {
      relatorioDiv.textContent = "";
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

  atualizarCamposExtras(); // Executa ao carregar
});

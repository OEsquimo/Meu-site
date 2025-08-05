document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");

  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoSelect = document.getElementById("servico");
  const btusSelect = document.getElementById("btus");
  const defeitoInput = document.getElementById("defeito");

  const campoBtus = document.getElementById("campo-btus");
  const campoDefeito = document.getElementById("campo-defeito");

  const erroNome = document.getElementById("erro-nome");
  const erroEndereco = document.getElementById("erro-endereco");
  const erroWhatsapp = document.getElementById("erro-whatsapp");
  const erroServico = document.getElementById("erro-servico");
  const erroBtus = document.getElementById("erro-btus");

  const seuWhatsApp = "5581983259341";

  // Preço base
  const precoInstalacao = {
    "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900
  };
  const precoLimpezaSplit = {
    "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380
  };
  const precoLimpezaJanela = 150;

  // Formato WhatsApp
  function validarWhatsApp(tel) {
    return /^\(\d{2}\) \d{5}-\d{4}$/.test(tel);
  }

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

  // Mostrar/ocultar campos conforme o serviço
  servicoSelect.addEventListener("change", function () {
    const servico = servicoSelect.value;
    campoBtus.style.display = (servico === "Instalação" || servico === "Limpeza Split") ? "block" : "none";
    campoDefeito.style.display = (servico === "Manutenção") ? "block" : "none";
    gerarRelatorio();
  });

  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] || "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] || "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    return "Orçamento sob análise";
  }

  function exibirErro(el, msg) {
    el.innerText = msg;
  }

  function limparErro(el) {
    el.innerText = "";
  }

  function validarFormulario() {
    let valido = true;

    if (!nomeInput.value.trim()) {
      exibirErro(erroNome, "Informe seu nome.");
      valido = false;
    } else limparErro(erroNome);

    if (!enderecoInput.value.trim()) {
      exibirErro(erroEndereco, "Preencha seu endereço.");
      valido = false;
    } else limparErro(erroEndereco);

    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErro(erroWhatsapp, "Informe WhatsApp corretamente.");
      valido = false;
    } else limparErro(erroWhatsapp);

    const servico = servicoSelect.value;
    if (!servico) {
      exibirErro(erroServico, "Escolha um serviço.");
      valido = false;
    } else limparErro(erroServico);

    if ((servico === "Instalação" || servico === "Limpeza Split") && !btusSelect.value) {
      exibirErro(erroBtus, "Informe a capacidade em BTUs.");
      valido = false;
    } else limparErro(erroBtus);

    return valido;
  }

  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value;
    const defeito = defeitoInput.value.trim();

    if (!nome || !endereco || !validarWhatsApp(whatsapp) || !servico) {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return;
    }

    let valor = calcularValor(servico, btus);
    if ((servico === "Instalação" || servico === "Limpeza Split") && !btus) {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return;
    }

    const texto = `*ORÇAMENTO*\n👤 Nome: ${nome}\n📍 Endereço: ${endereco}\n📱 WhatsApp: ${whatsapp}\n🛠️ Serviço: ${servico}` +
      (btus ? `\n❄️ BTUs: ${btus}` : "") +
      (servico === "Manutenção" ? `\n🔧 Defeito: ${defeito}` : "") +
      `\n💰 Valor: ${valor}`;

    relatorioDiv.innerText = texto;
    enviarBtn.disabled = false;
    return texto;
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

  // Clicar nas imagens seleciona o serviço
  document.querySelectorAll(".servico").forEach((div) => {
    div.addEventListener("click", () => {
      servicoSelect.value = div.dataset.servico;
      servicoSelect.dispatchEvent(new Event("change"));
    });
  });
});

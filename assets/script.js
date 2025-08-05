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

    if (campoBtus.style.display === "none") {
      btusSelect.value = "";
      limparErro(erroBtus);
    }
    if (campoDefeito.style.display === "none") {
      defeitoInput.value = "";
    }

    gerarRelatorio();
  });

  // Clique nas imagens para preencher serviço
  document.querySelectorAll(".servico").forEach((div) => {
    div.addEventListener("click", () => {
      servicoSelect.value = div.dataset.servico;
      servicoSelect.dispatchEvent(new Event("change"));
    });
    div.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        div.click();
      }
    });
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
    } else {
      limparErro(erroNome);
    }

    if (!enderecoInput.value.trim()) {
      exibirErro(erroEndereco, "Informe seu endereço.");
      valido = false;
    } else {
      limparErro(erroEndereco);
    }

    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErro(erroWhatsapp, "Informe WhatsApp válido (ex: (xx) xxxxx-xxxx).");
      valido = false;
    } else {
      limparErro(erroWhatsapp);
    }

    if (!servicoSelect.value) {
      exibirErro(erroServico, "Selecione um serviço.");
      valido = false;
    } else {
      limparErro(erroServico);
    }

    if ((servicoSelect.value === "Instalação" || servicoSelect.value === "Limpeza Split") && !btusSelect.value) {
      exibirErro(erroBtus, "Selecione a capacidade em BTUs.");
      valido = false;
    } else {
      limparErro(erroBtus);
    }

    // Para manutenção, defeito obrigatório
    if (servicoSelect.value === "Manutenção" && defeitoInput.value.trim() === "") {
      exibirErro(erroBtus, "Descreva o defeito do ar-condicionado.");
      valido = false;
    } else if (servicoSelect.value === "Manutenção") {
      limparErro(erroBtus);
    }

    return valido;
  }

  function gerarRelatorio() {
    if (!validarFormulario()) {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return;
    }

    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value;
    const defeito = defeitoInput.value.trim();

    const valor = calcularValor(servico, btus);

    let textoOrcamento = 
`*ORÇAMENTO*  
👤 Nome: ${nome}  
📍 Endereço: ${endereco}  
📱 WhatsApp: ${whatsapp}  
🛠 Serviço: ${servico}`;

    if (servico === "Manutenção") {
      textoOrcamento += `  
📝 Defeito: ${defeito}  
💰 Valor do Orçamento: Orçamento sob análise`;
    } else {
      textoOrcamento += `  
❄️ BTUs: ${btus}  
💰 Valor do Orçamento: R$ ${valor}`;
    }

    textoOrcamento += `  
Obs: Envie esta mensagem para nosso WhatsApp.`;

    relatorioDiv.innerText = textoOrcamento;
    enviarBtn.disabled = false;
    return textoOrcamento;
  }

  form.addEventListener("input", gerarRelatorio);

  enviarBtn.addEventListener("click", function () {
    if (!validarFormulario()) {
      return;
    }

    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});

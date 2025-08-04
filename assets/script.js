
document.addEventListener("DOMContentLoaded", function() {
  // Elementos
  const form = document.getElementById("form-orcamento");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoSelect = document.getElementById("servico");
  const btusSelect = document.getElementById("btus");

  // Configurações
  const seuWhatsApp = "SEU_NUMERO_AQUI"; // Ex: "5511987654321" (sem espaços ou caracteres especiais)
  const precos = {
    "Instalação": { "9000": 500, "12000": 600, "18000": 700 },
    "Limpeza Split": { "9000": 180, "12000": 230, "18000": 280 },
    "Manutenção": "Sob consulta"
  };

  // Máscara de WhatsApp
  whatsappInput.addEventListener("input", function(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      e.target.value = `(${value}`;
    }
  });

  // Validação em tempo real
  form.addEventListener("input", function() {
    const camposValidos = (
      nomeInput.value.trim() !== "" &&
      enderecoInput.value.trim() !== "" &&
      /^\(\d{2}\) \d{5}-\d{4}$/.test(whatsappInput.value) &&
      servicoSelect.value !== ""
    );
    
    enviarBtn.disabled = !camposValidos;
    atualizarRelatorio();
  });

  // Atualiza relatório
  function atualizarRelatorio() {
    if (nomeInput.value && enderecoInput.value && whatsappInput.value && servicoSelect.value) {
      const servico = servicoSelect.value;
      const btus = btusSelect.value;
      let valor = calcularValor();
      
      relatorioDiv.innerHTML = `
        *ORÇAMENTO DETALHADO*
        👤 Nome: ${nomeInput.value}
        📍 Endereço: ${enderecoInput.value}
        📱 WhatsApp: ${whatsappInput.value}
        🛠️ Serviço: ${servico}
        ❄️ BTUs: ${btus || "N/A"}
        💰 Valor: ${valor}
      `;
    } else {
      relatorioDiv.innerHTML = "Preencha todos os campos para ver o orçamento";
    }
  }

  // Envio para WhatsApp
  enviarBtn.addEventListener("click", function() {
    if (!validarFormulario()) return;
    
    const mensagem = gerarRelatorio();
    const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  });

  // Validação completa
  function validarFormulario() {
    let valido = true;
    
    if (nomeInput.value.trim() === "") {
      alert("Por favor, insira seu nome completo!");
      nomeInput.focus();
      valido = false;
    } else if (enderecoInput.value.trim() === "") {
      alert("Por favor, insira seu endereço!");
      enderecoInput.focus();
      valido = false;
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(whatsappInput.value)) {
      alert("WhatsApp inválido! Use o formato (DD) XXXXX-XXXX");
      whatsappInput.focus();
      valido = false;
    } else if (servicoSelect.value === "") {
      alert("Selecione um tipo de serviço!");
      servicoSelect.focus();
      valido = false;
    }
    
    return valido;
  }

  // Gera relatório para envio
  function gerarRelatorio() {
    return `
      *ORÇAMENTO SOLICITADO - O ESQUIMÓ*
      👤 Nome: ${nomeInput.value}
      📍 Endereço: ${enderecoInput.value}
      📱 WhatsApp: ${whatsappInput.value}
      🛠️ Serviço: ${servicoSelect.value}
      ❄️ BTUs: ${btusSelect.value || "N/A"}
      💰 Valor: ${calcularValor()}
      
      _*Este é um orçamento preliminar. Entraremos em contato para confirmar detalhes._
    `;
  }

  // Cálculo do valor
  function calcularValor() {
    const servico = servicoSelect.value;
    const btus = btusSelect.value;
    
    if (servico === "Manutenção") {
      return "Sob consulta (agendaremos visita técnica)";
    }
    
    if (precos[servico] && precos[servico][btus]) {
      return `R$ ${precos[servico][btus]}`;
    }
    
    return "A definir (necessário verificar modelo)";
  }

  // Seleção por card (global)
  window.selecionarServico = function(servico) {
    servicoSelect.value = servico;
    form.dispatchEvent(new Event("input"));
    document.getElementById("formulario").scrollIntoView({ 
      behavior: "smooth" 
    });
  };
});

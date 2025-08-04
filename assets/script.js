/**
 * SISTEMA DE ORÇAMENTOS - O ESQUIMÓ
 * Versão 2.0 (Correção e Otimização)
 * Funcionalidades originais mantidas:
 * 1. Máscara de WhatsApp automática
 * 2. Cálculo de valores por serviço/BTU
 * 3. Validação de formulário
 * 4. Geração de relatório
 * 5. Integração com WhatsApp
 */

document.addEventListener("DOMContentLoaded", function() {
  // ========== CONSTANTES ========== //
  const SEU_WHATSAPP = "5581983259341"; // Substitua pelo seu número
  const PRECOS = {
    "Instalação": { "9000": 500, "12000": 600, "18000": 700 },
    "Limpeza Split": { "9000": 180, "12000": 230, "18000": 280 },
    "Manutenção": "Sob consulta"
  };

  // ========== SELEÇÃO DE ELEMENTOS ========== //
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoSelect = document.getElementById("servico");
  const btusSelect = document.getElementById("btus");

  // ========== MÁSCARA DE WHATSAPP ========== //
  whatsappInput.addEventListener("input", function(e) {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.slice(0, 11);
    
    // Formatação: (XX) XXXXX-XXXX
    if (valor.length > 6) {
      e.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      e.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else if (valor.length > 0) {
      e.target.value = `(${valor}`;
    }
  });

  // ========== VALIDAÇÃO EM TEMPO REAL ========== //
  form.addEventListener("input", function() {
    const camposValidos = validarCampos();
    enviarBtn.disabled = !camposValidos;
    atualizarRelatorio();
  });

  // ========== VALIDAÇÃO COMPLETA ========== //
  function validarCampos() {
    return (
      nomeInput.value.trim() !== "" &&
      enderecoInput.value.trim() !== "" &&
      /^\(\d{2}\) \d{5}-\d{4}$/.test(whatsappInput.value) &&
      servicoSelect.value !== "" &&
      (servicoSelect.value !== "Limpeza Split" || btusSelect.value !== "")
    );
  }

  // ========== ATUALIZA RELATÓRIO ========== //
  function atualizarRelatorio() {
    if (!validarCampos()) {
      relatorioDiv.innerHTML = "Preencha todos os campos para ver o orçamento";
      return;
    }

    const servico = servicoSelect.value;
    const btus = btusSelect.value;
    const valor = calcularValor(servico, btus);

    relatorioDiv.innerHTML = `
      *ORÇAMENTO DETALHADO*
      👤 Nome: ${nomeInput.value}
      📍 Endereço: ${enderecoInput.value}
      📱 WhatsApp: ${whatsappInput.value}
      🛠️ Serviço: ${servico}
      ❄️ BTUs: ${btus || "N/A"}
      💰 Valor: ${valor}
    `;
  }

  // ========== CÁLCULO DO VALOR ========== //
  function calcularValor(servico, btus) {
    if (servico === "Manutenção") return PRECOS[servico];
    if (!btus || !PRECOS[servico] || !PRECOS[servico][btus]) return "A definir";
    return `R$ ${PRECOS[servico][btus]}`;
  }

  // ========== ENVIO PARA WHATSAPP ========== //
  enviarBtn.addEventListener("click", function() {
    if (!validarCampos()) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    const mensagem = `
      *ORÇAMENTO SOLICITADO - O ESQUIMÓ*
      👤 Nome: ${nomeInput.value}
      📍 Endereço: ${enderecoInput.value}
      📱 WhatsApp: ${whatsappInput.value}
      🛠️ Serviço: ${servicoSelect.value}
      ❄️ BTUs: ${btusSelect.value || "N/A"}
      💰 Valor: ${calcularValor(servicoSelect.value, btusSelect.value)}

      _*Entraremos em contato para confirmar._
    `;

    const url = `https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  });

  // ========== SELEÇÃO POR IMAGEM ========== //
  window.selecionarServico = function(servico) {
    servicoSelect.value = servico;
    const event = new Event("change");
    servicoSelect.dispatchEvent(event);
    document.getElementById("formulario").scrollIntoView({ behavior: "smooth" });
  };
});

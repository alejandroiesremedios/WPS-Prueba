document.addEventListener('DOMContentLoaded', () => {
  // Elementos UI
  const btnEvaluar = document.getElementById('btnEvaluar');
  const wpsForm = document.getElementById('wpsForm');
  const modal = document.getElementById('resultadosModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const scoreCircle = document.getElementById('scoreCircle');
  const modalTitle = document.getElementById('modalTitle');
  const modalSummary = document.getElementById('modalSummary');

  // Elementos Custom Select
  const customSelectBox = document.getElementById('customSelectBox');
  const dropdownList = document.getElementById('dropdownList');
  const selectedTagsContainer = document.getElementById('selectedTags');
  const hiddenSelect = document.getElementById('practica');

  const MAX_PRACTICAS = 4;
  let selectedPractices = [];
  let reportedDefects = [];
  const sections = {
    generales: { max: 2.0, achieved: 0 },
    raiz:      { max: 1.5, achieved: 0 },
    refuerzo:  { max: 1.5, achieved: 0 },
    relleno:   { max: 1.5, achieved: 0 },
    peinado:   { max: 1.5, achieved: 0 },
    defecto:   { max: 2.0, achieved: 0 }
  };

  // Pestañas de prácticas TIG y MAG
  const practicasConfig = [
    { label: 'Prácticas TIG', prefix: 'P', suffix: 'TIG', count: 20 },
    { label: 'Prácticas MAG', prefix: 'P', suffix: 'MAG', count: 20 }
  ];

  // CONFIGURACIÓN DE RESPUESTAS POR DOCUMENTO
  const wpsConfigs = {
    '1': {
      practicas: ['P2 TIG', 'P2 MAG'],
      material: 'S235JR',
      dimensiones: { dL: 240, dA: [60, 80], dE: [4, 10] },
      preparacion: { bordes: 'Rectos', union: 'Angulo' },
      posicion: { aws: '2F', iso: 'PB' },
      capas: {
        raiz: {
          proceso: { comun: 'TIG', iso: '141', aws: 'GTAW' },
          consumible: { diam: ['2.0', '2.4'], iso: 'W3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'Ar_100', iso: 'I1', aws: 'SG-A', caudal: ['6', '7', '8'] },
          tungsteno: { tipo: 'Lantano15', iso: 'WL15 (Oro)', aws: 'EWLa-1.5 (Oro)', diam: '2.4' },
          parametros: { amp: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'any' }
        },
        refuerzo: {
          proceso: { comun: 'TIG', iso: '141', aws: 'GTAW' },
          consumible: { diam: ['2.0', '2.4'], iso: 'W3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'Ar_100', iso: 'I1', aws: 'SG-A', caudal: ['6', '7', '8'] },
          tungsteno: { tipo: 'Lantano15', iso: 'WL15 (Oro)', aws: 'EWLa-1.5 (Oro)', diam: '2.4' },
          parametros: { amp: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'any' }
        },
        relleno: {
          proceso: { comun: 'Semiautomática macizo', iso: '135', aws: 'GMAW MAG' },
          consumible: { diam: ['1.0', '1.2'], iso: 'G3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'ArCO2_8218', iso: 'M21-ArC-18', aws: 'SG-AC-18', caudal: ['8', '9', '10', '11', '12', '13', '14'] },
          parametros: { amp: 'any', vol: 'any', vHi: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'Empuje' }
        },
        peinado: {
          proceso: { comun: 'Semiautomática macizo', iso: '135', aws: 'GMAW MAG' },
          consumible: { diam: ['1.0', '1.2'], iso: 'G3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'ArCO2_8218', iso: 'M21-ArC-18', aws: 'SG-AC-18', caudal: ['8', '9', '10', '11', '12', '13', '14'] },
          parametros: { amp: 'any', vol: 'any', vHi: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'Empuje' }
        }
      },
      defectos: {
        tipos: ['100','201','2017','501','602'],
        causas: ['Contaminación','Gas','Limpieza deficiente','Protección de gas insuficiente','Parámetros inadecuados','Técnica incorrecta'],
        acciones: ['Limpieza','Caudal','Aumentar caudal de gas','Ajustar parámetros','Limpiar soldadura','Cambiar técnica de soldadura']
      }
    },
    '2': {
      practicas: ['P3 TIG', 'P3 MAG', 'P4 TIG', 'P4 MAG'],
      material: 'S235JR',
      dimensiones: { dL: 240, dA: [172, 172], dE: [10, 10] },
      preparacion: { bordes: 'Chaflán en V', union: 'Tope' },
      posicion: { aws: '1G', iso: 'PA' },
      capas: {
        raiz: {
          proceso: { comun: 'TIG', iso: '141', aws: 'GTAW' },
          consumible: { diam: ['2.0', '2.4'], iso: 'W3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'Ar_100', iso: 'I1', aws: 'SG-A', caudal: ['6', '7', '8'] },
          tungsteno: { tipo: 'Lantano15', iso: 'WL15 (Oro)', aws: 'EWLa-1.5 (Oro)', diam: '2.4' },
          parametros: { amp: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'any' }
        },
        refuerzo: {
          proceso: { comun: 'TIG', iso: '141', aws: 'GTAW' },
          consumible: { diam: ['2.0', '2.4'], iso: 'W3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'Ar_100', iso: 'I1', aws: 'SG-A', caudal: ['6', '7', '8'] },
          tungsteno: { tipo: 'Lantano15', iso: 'WL15 (Oro)', aws: 'EWLa-1.5 (Oro)', diam: '2.4' },
          parametros: { amp: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'any' }
        },
        relleno: {
          proceso: { comun: 'Semiautomática macizo', iso: '135', aws: 'GMAW MAG' },
          consumible: { diam: ['1.0', '1.2'], iso: 'G3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'ArCO2_8218', iso: 'M21-ArC-18', aws: 'SG-AC-18', caudal: ['8', '9', '10', '11', '12', '13', '14'] },
          parametros: { amp: 'any', vol: 'any', vHi: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'Empuje' }
        },
        peinado: {
          proceso: { comun: 'Semiautomática macizo', iso: '135', aws: 'GMAW MAG' },
          consumible: { diam: ['1.0', '1.2'], iso: 'G3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'ArCO2_8218', iso: 'M21-ArC-18', aws: 'SG-AC-18', caudal: ['8', '9', '10', '11', '12', '13', '14'] },
          parametros: { amp: 'any', vol: 'any', vHi: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'Empuje' }
        }
      },
      defectos: {
        tipos: ['201','2017','602','501'], 
        causas: ['Falta limpieza','Exceso voltaje','Distancia boquilla-pieza excesiva'],
        acciones: ['Limpiar','Reducir voltaje','Mantener stick-out adecuado']
      }
    },
    '3': {
      practicas: ['P5 TIG', 'P5 MAG', 'P6 TIG', 'P6 MAG'],
      material: 'S235JR',
      dimensiones: { dL: 240, dA: [172, 172], dE: [10, 10] },
      preparacion: { bordes: 'Chaflán en V', union: 'Tope' },
      posicion: { aws: '2G', iso: 'PC' },
      capas: {
        raiz: {
          proceso: { comun: 'TIG', iso: '141', aws: 'GTAW' },
          consumible: { diam: ['2.0', '2.4'], iso: 'W3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'Ar_100', iso: 'I1', aws: 'SG-A', caudal: ['6', '7', '8'] },
          tungsteno: { tipo: 'Lantano15', iso: 'WL15 (Oro)', aws: 'EWLa-1.5 (Oro)', diam: '2.4' },
          parametros: { amp: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'any' }
        },
        refuerzo: {
          proceso: { comun: 'TIG', iso: '141', aws: 'GTAW' },
          consumible: { diam: ['2.0', '2.4'], iso: 'W3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'Ar_100', iso: 'I1', aws: 'SG-A', caudal: ['6', '7', '8'] },
          tungsteno: { tipo: 'Lantano15', iso: 'WL15 (Oro)', aws: 'EWLa-1.5 (Oro)', diam: '2.4' },
          parametros: { amp: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'any' }
        },
        relleno: {
          proceso: { comun: 'Semiautomática macizo', iso: '135', aws: 'GMAW MAG' },
          consumible: { diam: ['1.0', '1.2'], iso: 'G3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'ArCO2_8218', iso: 'M21-ArC-18', aws: 'SG-AC-18', caudal: ['8', '9', '10', '11', '12', '13', '14'] },
          parametros: { amp: 'any', vol: 'any', vHi: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'Empuje' }
        },
        peinado: {
          proceso: { comun: 'Semiautomática macizo', iso: '135', aws: 'GMAW MAG' },
          consumible: { diam: ['1.0', '1.2'], iso: 'G3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'ArCO2_8218', iso: 'M21-ArC-18', aws: 'SG-AC-18', caudal: ['8', '9', '10', '11', '12', '13', '14'] },
          parametros: { amp: 'any', vol: 'any', vHi: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'Empuje' }
        }
      },
      defectos: {
        tipos: ['501','201','2017'],
        causas: ['Exceso amperaje','Falta gas','Intensidad demasiado alta','Protección de gas insuficiente'],
        acciones: ['Reducir amperaje','Abrir caudal','Bajar intensidad','Aumentar caudal de gas']
      }
    },
    '4': {
      practicas: ['P8 TIG', 'P8 MAG', 'P9 TIG', 'P9 MAG'],
      material: 'S235JR',
      dimensiones: { dL: 240, dA: [172, 172], dE: [10, 10] },
      preparacion: { bordes: 'Chaflán en V', union: 'Tope' },
      posicion: { aws: '3G', iso: 'PF' },
      capas: {
        raiz: {
          proceso: { comun: 'TIG', iso: '141', aws: 'GTAW' },
          consumible: { diam: ['2.0', '2.4'], iso: 'W3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'Ar_100', iso: 'I1', aws: 'SG-A', caudal: ['6', '7', '8'] },
          tungsteno: { tipo: 'Lantano15', iso: 'WL15 (Oro)', aws: 'EWLa-1.5 (Oro)', diam: '2.4' },
          parametros: { amp: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'any' }
        },
        refuerzo: {
          proceso: { comun: 'TIG', iso: '141', aws: 'GTAW' },
          consumible: { diam: ['2.0', '2.4'], iso: 'W3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'Ar_100', iso: 'I1', aws: 'SG-A', caudal: ['6', '7', '8'] },
          tungsteno: { tipo: 'Lantano15', iso: 'WL15 (Oro)', aws: 'EWLa-1.5 (Oro)', diam: '2.4' },
          parametros: { amp: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'any' }
        },
        relleno: {
          proceso: { comun: 'Semiautomática macizo', iso: '135', aws: 'GMAW MAG' },
          consumible: { diam: ['1.0', '1.2'], iso: 'G3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'ArCO2_8218', iso: 'M21-ArC-18', aws: 'SG-AC-18', caudal: ['8', '9', '10', '11', '12', '13', '14'] },
          parametros: { amp: 'any', vol: 'any', vHi: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'Empuje' }
        },
        peinado: {
          proceso: { comun: 'Semiautomática macizo', iso: '135', aws: 'GMAW MAG' },
          consumible: { diam: ['1.0', '1.2'], iso: 'G3Si1', aws: 'ER70S-6' },
          gas: { tipo: 'ArCO2_8218', iso: 'M21-ArC-18', aws: 'SG-AC-18', caudal: ['8', '9', '10', '11', '12', '13', '14'] },
          parametros: { amp: 'any', vol: 'any', vHi: 'any' },
          ejecucion: { balanceo: 'any', velocidadAvance: 'any', empuje: 'Empuje' }
        }
      },
      defectos: {
        tipos: ['201','2017','602'],
        causas: ['Falta gas','Mala técnica','Arco demasiado largo'],
        acciones: ['Abrir gas','Corregir técnica','Acortar arco']
      }
    }
  };

  // 1. Inicializar Selector Personalizado
  function initCustomSelect() {
    // Resetear formulario para evitar caché de navegador
    if (wpsForm) wpsForm.reset();
    
    // Limpiar selects y listas
    hiddenSelect.innerHTML = '';
    dropdownList.innerHTML = '';

    practicasConfig.forEach(group => {
      const groupHeader = document.createElement('div');
      groupHeader.className = 'dropdown-group';
      groupHeader.textContent = group.label;
      dropdownList.appendChild(groupHeader);

      for (let i = 1; i <= group.count; i++) {
        const val = `${group.prefix}${i} ${group.suffix}`;
        
        // Añadir al select oculto
        const option = document.createElement('option');
        option.value = val;
        option.textContent = val;
        hiddenSelect.appendChild(option);

        // Añadir a la lista visual
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.dataset.value = val;
        item.textContent = val;
        item.addEventListener('click', (e) => togglePractice(val, item));
        dropdownList.appendChild(item);
      }
    });
  }

  function togglePractice(val, itemElement) {
    const index = selectedPractices.indexOf(val);
    
    if (index > -1) {
      // Quitar si ya está
      selectedPractices.splice(index, 1);
      itemElement.classList.remove('selected');
    } else {
      // Añadir si hay espacio
      if (selectedPractices.length < MAX_PRACTICAS) {
        selectedPractices.push(val);
        itemElement.classList.add('selected');
      } else {
        // Alerta de límite
        const feedback = document.querySelector('.custom-multiselect-container .feedback-msg');
        feedback.textContent = '¡Máximo 4 prácticas alcanzado!';
        feedback.style.color = 'var(--error)';
        setTimeout(() => {
          feedback.textContent = 'Despliega para elegir prácticas.';
          feedback.style.color = 'var(--text-muted)';
        }, 2000);
      }
    }
    renderTags();
    syncHiddenSelect();
  }

  function renderTags() {
    selectedTagsContainer.innerHTML = '';
    
    if (selectedPractices.length === 0) {
      selectedTagsContainer.innerHTML = '<span class="placeholder-text">Selecciona TIG o MAG...</span>';
      return;
    }

    selectedPractices.forEach(val => {
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `${val} <span class="tag-close">×</span>`;
      tag.querySelector('.tag-close').addEventListener('click', (e) => {
        e.stopPropagation();
        const item = Array.from(document.querySelectorAll('.dropdown-item')).find(i => i.dataset.value === val);
        togglePractice(val, item);
      });
      selectedTagsContainer.appendChild(tag);
    });
  }

  function syncHiddenSelect() {
    Array.from(hiddenSelect.options).forEach(opt => {
      opt.selected = selectedPractices.includes(opt.value);
    });
  }

  // Eventos de apertura/cierre dropdown
  customSelectBox.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownList.classList.toggle('show');
    customSelectBox.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    dropdownList.classList.remove('show');
    customSelectBox.classList.remove('active');
  });

  dropdownList.addEventListener('click', (e) => {
    e.stopPropagation();
  });


  function initPositionValidation() {
    const posicionAws = document.getElementById('posicionAws');
    const posicionUne = document.getElementById('posicionUne');
    if (!posicionAws || !posicionUne) return;

    // Mapa de equivalencias: AWS -> ISO equivalentes (pueden ser varios)
    const awsToIso = {
      '1G':  ['PA'],
      '2G':  ['PC'],
      '3G':  ['PF', 'PG'],
      '4G':  ['PE'],
      '5G':  ['PH', 'PJ'],
      '6G':  ['H-L045', 'J-L045'],
      '1F':  ['PA'],
      '2F':  ['PB'],
      '3F':  ['PF', 'PG'],
      '4F':  ['PD'],
      '5F':  ['PH', 'PJ']
    };

    // Mapa inverso ISO -> AWS equivalentes
    const isoToAws = {};
    for (const [aws, isoList] of Object.entries(awsToIso)) {
      isoList.forEach(iso => {
        if (!isoToAws[iso]) isoToAws[iso] = [];
        isoToAws[iso].push(aws);
      });
    }

    const feedbackAws = posicionAws.nextElementSibling;
    const feedbackUne = posicionUne.nextElementSibling;

    function clearFeedback() {
      [posicionAws, posicionUne].forEach(el => el.classList.remove('is-invalid', 'is-valid'));
      if (feedbackAws) { feedbackAws.textContent = ''; feedbackAws.className = 'feedback-msg'; }
      if (feedbackUne) { feedbackUne.textContent = ''; feedbackUne.className = 'feedback-msg'; }
    }

    function validate() {
      clearFeedback();
      const aws = posicionAws.value;
      const iso = posicionUne.value;
      if (!aws || !iso) return; // no validar hasta que ambos estén seleccionados

      const validIsos = awsToIso[aws] || [];
      if (!validIsos.includes(iso)) {
        posicionAws.classList.add('is-invalid');
        posicionUne.classList.add('is-invalid');
        const validList = validIsos.join(', ') || '—';
        if (feedbackUne) {
          feedbackUne.textContent = `Incompatible con "${aws}" (AWS). Opciones válidas: ${validList}.`;
          feedbackUne.className = 'feedback-msg error';
          feedbackUne.style.display = 'block';
        }
      } else {
        posicionAws.classList.add('is-valid');
        posicionUne.classList.add('is-valid');
      }
    }

    posicionAws.addEventListener('change', validate);
    posicionUne.addEventListener('change', validate);
  }

  function initDimensionSelects() {
    const dimLargo = document.getElementById('dimLargo');
    const dimAncho = document.getElementById('dimAncho');
    const dimEspesor = document.getElementById('dimEspesor');

    if (dimLargo && dimAncho && dimEspesor) {
      // Limpiar y añadir placeholder
      dimLargo.innerHTML = '<option value="">----</option>';
      dimAncho.innerHTML = '<option value="">----</option>';
      dimEspesor.innerHTML = '<option value="">----</option>';

      // Largo 100-400 (intervalos de 10)
      for (let i = 100; i <= 400; i += 10) {
        dimLargo.add(new Option(i, i));
      }

      // Ancho 20-150 (intervalos de 10)
      for (let i = 20; i <= 150; i += 10) {
        dimAncho.add(new Option(i, i));
      }

      // Espesor 1-12 (intervalos de 1)
      for (let i = 1; i <= 12; i++) {
        dimEspesor.add(new Option(i, i));
      }
    }
  }

  // Catálogo de Defectología (ISO 6520-1)
  const defectsCatalog = [
    { id: "100", label: "100 - Grietas (Cracks)" },
    { id: "201", label: "201 - Porosidad gaseosa" },
    { id: "2017", label: "2017 - Poros superficiales" },
    { id: "301", label: "301 - Inclusiones de escoria" },
    { id: "304", label: "304 - Inclusiones metálicas (Tungsteno)" },
    { id: "401", label: "401 - Falta de fusión" },
    { id: "402", label: "402 - Falta de penetración" },
    { id: "501", label: "501 - Socavación (Undercut)" },
    { id: "502", label: "502 - Exceso de metal (Solape)" },
    { id: "511", label: "511 - Descolgamiento" },
    { id: "601", label: "601 - Cebado de arco accidental" },
    { id: "602", label: "602 - Salpicaduras" }
  ];

  // Mapa de Causas y Acciones por Defecto
  const defectAnalysisMap = {
    "100": {
      causes: ["Enfriamiento demasiado rápido", "Electrodo húmedo", "Material base contaminado", "Diseño de junta demasiado rígido"],
      actions: ["Precalentar material base", "Usar electrodos secos/estufa", "Limpieza exhaustiva de la junta", "Ajustar secuencia de soldadura"]
    },
    "201": {
      causes: ["Protección de gas insuficiente", "Corrientes de aire en zona de soldadura", "Metal base con grasa u óxido", "Mala regulación del caudal"],
      actions: ["Aumentar caudal de gas", "Usar mamparas o pantallas", "Limpiar con disolvente/cepillo", "Verificar estanqueidad de antorcha"]
    },
    "2017": {
      causes: ["Distancia boquilla-pieza excesiva", "Contaminación superficial", "Gas de mala calidad", "Humedad en el gas"],
      actions: ["Mantener stick-out adecuado", "Limpiar zona de solape", "Cambiar botella de gas", "Purgar sistema de gas"]
    },
    "301": {
      causes: ["Limpieza insuficiente entre pasadas", "Intensidad demasiado baja", "Ángulo de inclinación incorrecto", "Arco demasiado largo"],
      actions: ["Aumentar limpieza mecánica/cepillo", "Subir amperaje", "Corregir ángulo de antorcha", "Acortar la longitud del arco"]
    },
    "304": {
      causes: ["Contacto del tungsteno con el baño", "Afilado de tungsteno incorrecto", "Intensidad excesiva para el diámetro", "Cebado por contacto (sin HF)"],
      actions: ["Mayor control del pulso/distancia", "Afilar longitudinalmente", "Reducir amperaje o usar ø mayor", "Verificar generador de alta frecuencia"]
    },
    "401": {
      causes: ["Velocidad de avance excesiva", "Intensidad de corriente baja", "Ángulo de ataque incorrecto", "Baño de fusión por delante del arco"],
      actions: ["Reducir velocidad de avance", "Aumentar intensidad", "Dirigir arco a las caras de la raíz", "Mejorar técnica de oscilación"]
    },
    "402": {
      causes: ["Talón de raíz excesivo", "Separación de raíz insuficiente", "Intensidad demasiado baja", "Diámetro de electrodo muy grande"],
      actions: ["Reducir talón en preparación", "Aumentar separación de raíz", "Subir amperaje", "Usar electrodo de menor diámetro"]
    },
    "501": {
      causes: ["Intensidad demasiado alta", "Velocidad de avance excesiva", "Ángulo de antorcha inadecuado", "Longitud de arco excesiva"],
      actions: ["Bajar intensidad", "Reducir velocidad", "Ajustar ángulo hacia el borde", "Acortar arco"]
    },
    "502": {
      causes: ["Velocidad de avance muy lenta", "Intensidad demasiado baja", "Mala manipulación del electrodo", "Preparación de bordes estrecha"],
      actions: ["Aumentar velocidad", "Subir amperaje", "Mejorar técnica de balanceo", "Abrir ángulo de preparación"]
    },
    "511": {
      causes: ["Exceso de calor acumulado", "Baño de fusión muy grande", "Mala posición de la pieza", "Intensidad excesiva"],
      actions: ["Permitir enfriamiento entre pasadas", "Reducir diámetro de aporte", "Ajustar inclinación de pieza", "Bajar amperaje"]
    },
    "601": {
      causes: ["Falta de cuidado al cebar", "Conexión de masa defectuosa", "Cable de antorcha pelado", "Zona de cebado fuera de junta"],
      actions: ["Cebar siempre dentro de la junta", "Revisar pinza de masa", "Aislar/cambiar cables", "Usar placa de cebado externa"]
    },
    "602": {
      causes: ["Arco demasiado largo", "Polaridad incorrecta", "Gas de protección inadecuado", "Soplado magnético"],
      actions: ["Acortar arco", "Verificar polaridad (+/-)", "Cambiar mezcla de gas", "Cambiar posición de masa"]
    }
  };

  function initProcessLogic() {
    const layers = ['raiz', 'refuerzo', 'relleno', 'peinado'];
    
    // Matriz de validación: Nombre Común -> { ISO, AWS }
    const validMap = {
      'Electrodo': { iso: '111', aws: 'SMAW' },
      'TIG':       { iso: '141', aws: 'GTAW' },
      'Semiautomática macizo': [
        { iso: '135', aws: 'GMAW MAG' },
        { iso: '131', aws: 'GMAW MIG' }
      ],
      'Semiautomática tubular': [
        { iso: '114', aws: 'FCAW' },
        { iso: '136', aws: 'FCAW' },
        { iso: '137', aws: 'FCAW' }
      ]
    };

    // Catálogos de Consumibles
    const tigFillerMap = {
      iso: [
        { id: "W3Si1", label: "W 3Si1 (Carbono Estándar)" },
        { id: "W2Ti", label: "W 2Ti (Raíz Tubería - Alta Tenacidad)" },
        { id: "W464W3Si1", label: "W 46 4 W3Si1 (Estructural S355)" },
        { id: "W199L", label: "W 19 9 L (Inox 304L)" },
        { id: "W19123L", label: "W 19 12 3 L (Inox 316L)" },
        { id: "WCrMo1", label: "W CrMo1 (Aleado Cr-Mo / Calderería)" }
      ],
      aws: [
        { id: "ER70S-6", label: "ER70S-6 (Carbono)" },
        { id: "ER70S-2", label: "ER70S-2 (Raíz Tubería)" },
        { id: "ER308L", label: "ER308L (AISI 304L)" },
        { id: "ER316L", label: "ER316L (AISI 316L)" },
        { id: "ER80S-B2", label: "ER80S-B2 (Cr-Mo)" }
      ],
      validPairs: { "W3Si1": "ER70S-6", "W2Ti": "ER70S-2", "W464W3Si1": "ER70S-6", "W199L": "ER308L", "W19123L": "ER316L", "WCrMo1": "ER80S-B2" }
    };

    const gmawFillerMap = {
      iso: [
        { id: "G424M213Si1", label: "G 42 4 M21 3Si1 (Carbono Estándar)" },
        { id: "G3Si1", label: "G 3Si1 (Carbono Industrial)" },
        { id: "G4Si1", label: "G 4Si1 (Carbono Alta Tenacidad)" },
        { id: "G199LSi", label: "G 19 9 L Si (Inox 304L)" },
        { id: "G19123LSi", label: "G 19 12 3 L Si (Inox 316L)" },
        { id: "SAl4043", label: "S Al 4043 (Aluminio-Silicio)" },
        { id: "SAl5356", label: "S Al 5356 (Aluminio-Magnesio)" }
      ],
      aws: [
        { id: "ER70S-6", label: "ER70S-6 (Carbono)" },
        { id: "ER308LSi", label: "ER308LSi (Inox 304L)" },
        { id: "ER316LSi", label: "ER316LSi (Inox 316L)" },
        { id: "ER4043", label: "ER4043 (Aluminio)" },
        { id: "ER5356", label: "ER5356 (Aluminio)" }
      ],
      validPairs: { "G424M213Si1": "ER70S-6", "G3Si1": "ER70S-6", "G4Si1": "ER70S-6", "G199LSi": "ER308LSi", "G19123LSi": "ER316LSi", "SAl4043": "ER4043", "SAl5356": "ER5356" }
    };

    const fcawFillerMap = {
      iso: [
        { id: "T422PC1", label: "T 42 2 P C 1 (Tubular Básico CO2)" },
        { id: "T464PM2", label: "T 46 4 P M 2 (Tubular Rutilo Mezcla)" },
        { id: "T42ZZN3", label: "T 42 Z Z N 3 (Tubular Autoprotegido)" },
        { id: "T199LPC1", label: "T 19 9 L P C 1 (Inox Tubular 304L)" },
        { id: "T19123LPC1", label: "T 19 12 3 L P C 1 (Inox Tubular 316L)" }
      ],
      aws: [
        { id: "E71T-1C", label: "E71T-1C (Rutilo/CO2)" },
        { id: "E71T-1M", label: "E71T-1M (Rutilo/Mezcla)" },
        { id: "E71T-8", label: "E71T-8 (Autoprotegido)" },
        { id: "E308LT1-1", label: "E308LT1-1 (Inox 304L)" },
        { id: "E316LT1-1", label: "E316LT1-1 (Inox 316L)" }
      ],
      validPairs: { "T422PC1": "E71T-1C", "T464PM2": "E71T-1M", "T42ZZN3": "E71T-8", "T199LPC1": "E308LT1-1", "T19123LPC1": "E316LT1-1" }
    };

    const smawFillerMap = {
      iso: [
        { id: "E424B42H5", label: "E 42 4 B 42 H5 (Básico Estándar)", type: "Básico" },
        { id: "E383B12", label: "E 38 3 B 1 2 H10 (Básico Especial)", type: "Básico" },
        { id: "E380RC11", label: "E 38 0 RC 11 (Rutilo Industrial)", type: "Rutilo" },
        { id: "E383C21", label: "E 38 3 C 21 (Celulósico Raíz)", type: "Celulósico" },
        { id: "E199LR12", label: "E 19 9 L R 12 (Inoxidable 304L)", type: "Rutilo" },
        { id: "E19123LR12", label: "E 19 12 3 L R 12 (Inoxidable 316L)", type: "Rutilo" }
      ],
      aws: [
        { id: "E7018", label: "E7018", type: "Básico" },
        { id: "E7016", label: "E7016", type: "Básico" },
        { id: "E6013", label: "E6013", type: "Rutilo" },
        { id: "E6010", label: "E6010", type: "Celulósico" },
        { id: "E308L-16", label: "E308L-16", type: "Rutilo" },
        { id: "E316L-16", label: "E316L-16", type: "Rutilo" }
      ],
      validPairs: { "E424B42H5": "E7018", "E383B12": "E7016", "E380RC11": "E6013", "E383C21": "E6010", "E199LR12": "E308L-16", "E19123LR12": "E316L-16" }
    };

    const gasMap = {
      'Ar_100':    { iso: 'I1', aws: 'SG-A' },
      'CO2_100':   { iso: 'C1', aws: 'SG-C' },
      'ArCO2_8218': { iso: 'M21-ArC-18', aws: 'SG-AC-18' },
      'ArCO2_9208': { iso: 'M20-ArC-8', aws: 'SG-AC-8' },
      'He_Ar':     { iso: 'I3', aws: 'SG-He' }
    };

    const tungstenMap = {
      'Puro':      { iso: 'W (Verde)',        aws: 'EWP (Verde)' },
      'Torio':     { iso: 'WT20 (Rojo)',      aws: 'EWTh-2 (Rojo)' },
      'Cerio':     { iso: 'WC20 (Gris)',      aws: 'EWCe-2 (Gris)' },
      'Lantano15': { iso: 'WL15 (Oro)',       aws: 'EWLa-1.5 (Oro)' },
      'Lantano20': { iso: 'WL20 (Azul)',      aws: 'EWLa-2 (Azul)' },
      'Circonio':  { iso: 'WZ8 (Blanco)',     aws: 'EWZr-1 (Blanco)' }
    };

    const tungstenOptions = {
      tipo: [{ id: 'Puro', label: 'Puro' }, { id: 'Torio', label: 'Torio' }, { id: 'Cerio', label: 'Cerio' }, { id: 'Lantano15', label: 'Lantano 1,5%' }, { id: 'Lantano20', label: 'Lantano 2%' }, { id: 'Circonio', label: 'Circonio' }],
      iso: [{ id: 'W (Verde)', label: 'W (Verde)' }, { id: 'WT20 (Rojo)', label: 'WT20 (Rojo)' }, { id: 'WC20 (Gris)', label: 'WC20 (Gris)' }, { id: 'WL15 (Oro)', label: 'WL15 (Oro)' }, { id: 'WL20 (Azul)', label: 'WL20 (Azul)' }, { id: 'WZ8 (Blanco)', label: 'WZ8 (Blanco)' }],
      aws: [{ id: 'EWP (Verde)', label: 'EWP (Verde)' }, { id: 'EWTh-2 (Rojo)', label: 'EWTh-2 (Rojo)' }, { id: 'EWCe-2 (Gris)', label: 'EWCe-2 (Gris)' }, { id: 'EWLa-1.5 (Oro)', label: 'EWLa-1.5 (Oro)' }, { id: 'EWLa-2 (Azul)', label: 'EWLa-2 (Azul)' }, { id: 'EWZr-1 (Blanco)', label: 'EWZr-1 (Blanco)' }]
    };

    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const gasOptions = {
      iso: [{ id: 'I1', label: 'I1' }, { id: 'C1', label: 'C1' }, { id: 'M21-ArC-18', label: 'M21-ArC-18' }, { id: 'M20-ArC-8', label: 'M20-ArC-8' }, { id: 'I3', label: 'I3' }],
      aws: [{ id: 'SG-A', label: 'SG-A' }, { id: 'SG-C', label: 'SG-C' }, { id: 'SG-AC-18', label: 'SG-AC-18' }, { id: 'SG-AC-8', label: 'SG-AC-8' }]
    };

    layers.forEach(layerId => {
      // Referencias DOM
      const comunSelect = document.getElementById(`${layerId}ProcesoComun`);
      const isoSelect = document.getElementById(`${layerId}ProcesoIso`);
      const awsSelect = document.getElementById(`${layerId}ProcesoAws`);
      const isoContainer = document.getElementById(`${layerId}ProcesoIsoContainer`);
      const awsContainer = document.getElementById(`${layerId}ProcesoAwsContainer`);
      const detallesDiv = document.getElementById(`${layerId}Detalles`);

      const fillerDiam = document.getElementById(`${layerId}AportacionDiam`);
      const fillerIso = document.getElementById(`${layerId}AportacionIso`);
      const fillerAws = document.getElementById(`${layerId}AportacionAws`);
      const fillerRevest = document.getElementById(`${layerId}AportacionRevestimiento`);

      const gasTipo = document.getElementById(`${layerId}GasTipo`);
      const gasIso = document.getElementById(`${layerId}GasIso`);
      const gasAws = document.getElementById(`${layerId}GasAws`);
      const gasIsoContainer = document.getElementById(`${layerId}GasIsoContainer`);
      const gasAwsContainer = document.getElementById(`${layerId}GasAwsContainer`);

      const tungTipo = document.getElementById(`${layerId}TungstenoTipo`);
      const tungAws  = document.getElementById(`${layerId}TungstenoAws`);
      const tungIso  = document.getElementById(`${layerId}TungstenoIso`);
      const tungAwsContainer = document.getElementById(`${layerId}TungstenoAwsContainer`);
      const tungIsoContainer = document.getElementById(`${layerId}TungstenoIsoContainer`);

      const diameterMap = {
        'SMAW': ['1.6', '2.0', '2.5', '3.2', '4.0', '5.0', '6.0'],
        'GTAW': ['1.0', '1.2', '1.6', '2.0', '2.4', '3.2', '4.0'],
        'GMAW MIG': ['0.6', '0.8', '0.9', '1.0', '1.2', '1.4', '1.6'],
        'GMAW MAG': ['0.6', '0.8', '0.9', '1.0', '1.2', '1.4', '1.6'],
        'FCAW': ['0.9', '1.0', '1.2', '1.4', '1.6', '2.0', '2.4']
      };

      const updateAdaptiveFields = (awsProc) => {
        if (!detallesDiv) return;
        const titleEl = detallesDiv.querySelector('.filler-section-title');
        const diamLabel = detallesDiv.querySelector(`label[for="${layerId}AportacionDiam"]`);
        const isoLabel = detallesDiv.querySelector(`label[for="${layerId}AportacionIso"]`);
        const awsLabel = detallesDiv.querySelector(`label[for="${layerId}AportacionAws"]`);
        
        if (awsProc === 'SMAW') {
          if (titleEl) titleEl.textContent = 'Electrodo';
          if (diamLabel) diamLabel.textContent = 'Diámetro (mm)';
          if (isoLabel) isoLabel.textContent = 'Designación (ISO)';
          if (awsLabel) awsLabel.textContent = 'Designación (AWS)';
        } else if (awsProc === 'GTAW') {
          if (titleEl) titleEl.textContent = 'Varilla de Aportación';
          if (diamLabel) diamLabel.textContent = 'Ø Varilla (mm)';
          if (isoLabel) isoLabel.textContent = 'Designación (ISO)';
          if (awsLabel) awsLabel.textContent = 'Designación (AWS)';
        } else {
          if (titleEl) titleEl.textContent = 'Hilo consumible';
          if (diamLabel) diamLabel.textContent = 'Ø Hilo (mm)';
          if (isoLabel) isoLabel.textContent = 'Designación (ISO)';
          if (awsLabel) awsLabel.textContent = 'Designación (AWS)';
        }

        detallesDiv.querySelectorAll('.gtaw-only').forEach(el => el.style.display = (awsProc === 'GTAW') ? 'flex' : 'none');
        detallesDiv.querySelectorAll('.mag-only').forEach(el => el.style.display = (awsProc === 'GMAW MIG' || awsProc === 'GMAW MAG' || awsProc === 'FCAW') ? 'flex' : 'none');
        detallesDiv.querySelectorAll('.smaw-only').forEach(el => el.style.display = (awsProc === 'SMAW') ? 'flex' : 'none');
        detallesDiv.querySelectorAll('.no-gtaw').forEach(el => el.style.display = (awsProc === 'GTAW' || awsProc === 'SMAW') ? 'none' : 'flex');
        detallesDiv.querySelectorAll('.gas-section').forEach(el => el.style.display = (awsProc === 'SMAW') ? 'none' : 'flex');
      };

      const populateFillers = (awsProc) => {
        if (!fillerDiam || !fillerAws || !fillerIso) return;
        fillerDiam.innerHTML = '<option value="">-- Ø --</option>';
        if (diameterMap[awsProc]) diameterMap[awsProc].forEach(d => fillerDiam.add(new Option(d, d)));

        let currentMap = null;
        if (awsProc === 'GTAW') currentMap = tigFillerMap;
        else if (awsProc === 'GMAW MIG' || awsProc === 'GMAW MAG') currentMap = gmawFillerMap;
        else if (awsProc === 'FCAW') currentMap = fcawFillerMap;
        else if (awsProc === 'SMAW') currentMap = smawFillerMap;

        fillerIso.innerHTML = '<option value="">-- Designación ISO --</option>';
        fillerAws.innerHTML = '<option value="">-- Seleccionar AWS --</option>';
        if (currentMap) {
          shuffleArray(currentMap.iso).forEach(f => fillerIso.add(new Option(f.label, f.id)));
          shuffleArray(currentMap.aws).forEach(f => fillerAws.add(new Option(f.label, f.id)));
        }

        if (awsProc === 'GTAW' && tungTipo) {
          tungTipo.innerHTML = '<option value="">-- Tipo --</option>';
          tungAws.innerHTML = '<option value="">-- AWS --</option>';
          tungIso.innerHTML = '<option value="">-- ISO --</option>';
          shuffleArray(tungstenOptions.tipo).forEach(t => tungTipo.add(new Option(t.label, t.id)));
          shuffleArray(tungstenOptions.aws).forEach(a => tungAws.add(new Option(a.label, a.id)));
          shuffleArray(tungstenOptions.iso).forEach(i => tungIso.add(new Option(i.label, i.id)));
        }
      };

      const validateFiller = () => {
        const isoV = fillerIso.value; const awsV = fillerAws.value; const awsProc = awsSelect.value;
        const revV = fillerRevest ? fillerRevest.value : null;
        fillerIso.classList.remove('is-valid', 'is-invalid'); fillerAws.classList.remove('is-valid', 'is-invalid');
        if (fillerRevest) fillerRevest.classList.remove('is-valid', 'is-invalid');
        if (!isoV || !awsV || !awsProc) return;

        let currentMap = (awsProc === 'GTAW') ? tigFillerMap : (awsProc === 'GMAW MIG' || awsProc === 'GMAW MAG') ? gmawFillerMap : (awsProc === 'FCAW') ? fcawFillerMap : smawFillerMap;
        if (currentMap.validPairs[isoV] === awsV) {
          fillerIso.classList.add('is-valid'); fillerAws.classList.add('is-valid');
        } else {
          fillerIso.classList.add('is-invalid'); fillerAws.classList.add('is-invalid'); return;
        }

        if (awsProc === 'SMAW' && fillerRevest && revV) {
          const eISO = currentMap.iso.find(e => e.id === isoV);
          const eAWS = currentMap.aws.find(e => e.id === awsV);
          const match = (eISO.type === revV || (eISO.type === "Rutilo" && (revV.includes("Rutilo")))) && (eAWS.type === revV || (eAWS.type === "Rutilo" && (revV.includes("Rutilo"))));
          if (match) fillerRevest.classList.add('is-valid'); else fillerRevest.classList.add('is-invalid');
        }
      };

      // Event Listeners Proceso
      comunSelect.addEventListener('change', () => {
        isoSelect.value = ""; awsSelect.value = "";
        isoSelect.classList.remove('is-valid', 'is-invalid'); awsSelect.classList.remove('is-valid', 'is-invalid');
        isoContainer.style.display = comunSelect.value ? 'flex' : 'none';
        awsContainer.style.display = 'none'; detallesDiv.style.display = 'none';
      });

      isoSelect.addEventListener('change', () => {
        awsSelect.value = ""; awsSelect.classList.remove('is-valid', 'is-invalid');
        const match = validMap[comunSelect.value];
        const isValid = Array.isArray(match) ? match.some(m => m.iso === isoSelect.value) : (match && match.iso === isoSelect.value);
        if (isValid) {
          isoSelect.classList.add('is-valid'); isoSelect.classList.remove('is-invalid');
          awsContainer.style.display = 'flex';
        } else {
          isoSelect.classList.add('is-invalid'); isoSelect.classList.remove('is-valid');
          awsContainer.style.display = 'none';
        }
        detallesDiv.style.display = 'none';
      });

      awsSelect.addEventListener('change', () => {
        const match = validMap[comunSelect.value];
        const isValid = Array.isArray(match) ? match.some(m => m.iso === isoSelect.value && m.aws === awsSelect.value) : (match && match.iso === isoSelect.value && match.aws === awsSelect.value);
        if (isValid) {
          awsSelect.classList.add('is-valid'); awsSelect.classList.remove('is-invalid');
          detallesDiv.style.display = 'block';
          populateFillers(awsSelect.value);
          updateAdaptiveFields(awsSelect.value);
        } else {
          awsSelect.classList.add('is-invalid'); awsSelect.classList.remove('is-valid');
          detallesDiv.style.display = 'none';
        }
      });

      // Event Listeners Consumibles
      if (fillerIso) fillerIso.addEventListener('change', validateFiller);
      if (fillerAws) fillerAws.addEventListener('change', validateFiller);
      if (fillerRevest) fillerRevest.addEventListener('change', validateFiller);

      // Gas
      if (gasTipo) gasTipo.addEventListener('change', () => {
        gasIso.innerHTML = '<option value="">-- ISO --</option>';
        shuffleArray(gasOptions.iso).forEach(o => gasIso.add(new Option(o.label, o.id)));
        gasAws.innerHTML = '<option value="">-- AWS --</option>';
        shuffleArray(gasOptions.aws).forEach(o => gasAws.add(new Option(o.label, o.id)));
        gasIsoContainer.style.display = gasTipo.value ? 'flex' : 'none';
        gasAwsContainer.style.display = 'none';
      });
      if (gasIso) gasIso.addEventListener('change', () => {
        const match = gasMap[gasTipo.value];
        if (match && match.iso === gasIso.value) {
          gasIso.classList.add('is-valid'); gasIso.classList.remove('is-invalid');
          gasAwsContainer.style.display = 'flex';
        } else {
          gasIso.classList.add('is-invalid'); gasIso.classList.remove('is-valid');
          gasAwsContainer.style.display = 'none';
        }
      });
      if (gasAws) gasAws.addEventListener('change', () => {
        const match = gasMap[gasTipo.value];
        if (match && match.aws === gasAws.value) gasAws.classList.add('is-valid'); else gasAws.classList.add('is-invalid');
      });

      // Tungsteno
      if (tungTipo) tungTipo.addEventListener('change', () => {
        tungIsoContainer.style.display = tungTipo.value ? 'flex' : 'none';
        tungAwsContainer.style.display = 'none';
      });
      if (tungIso) tungIso.addEventListener('change', () => {
        const match = tungstenMap[tungTipo.value];
        if (match && match.iso === tungIso.value) {
          tungIso.classList.add('is-valid'); tungIso.classList.remove('is-invalid');
          tungAwsContainer.style.display = 'flex';
        } else {
          tungIso.classList.add('is-invalid'); tungIso.classList.remove('is-valid');
          tungAwsContainer.style.display = 'none';
        }
      });
      if (tungAws) tungAws.addEventListener('change', () => {
        const match = tungstenMap[tungTipo.value];
        if (match && match.aws === tungAws.value) tungAws.classList.add('is-valid'); else tungAws.classList.add('is-invalid');
      });
    });
  }

  function initParameterSelects() {
    const layers = ['raiz', 'refuerzo', 'relleno', 'peinado'];
    
    layers.forEach(l => {
      // Amperaje 30-200
      const amp = document.getElementById(l + 'Amperaje');
      if (amp) {
        for (let i = 30; i <= 200; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = i;
          amp.appendChild(opt);
        }
      }

      // Vel. Avance 3-50
      const velAv = document.getElementById(l + 'VelocidadAvance');
      if (velAv) {
        for (let i = 3; i <= 50; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = i;
          velAv.appendChild(opt);
        }
      }

      // Vel. Hilo 1-50
      const velHi = document.getElementById(l + 'VelocidadHilo');
      if (velHi) {
        for (let i = 1; i <= 50; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = i;
          velHi.appendChild(opt);
        }
      }

      // Caudal de Gas 4-16
      const caudal = document.getElementById(l + 'GasCaudal');
      if (caudal) {
        for (let i = 4; i <= 16; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = i;
          caudal.appendChild(opt);
        }
      }

      // Voltaje 13-30
      const volt = document.getElementById(l + 'Voltaje');
      if (volt) {
        for (let i = 13; i <= 30; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = i;
          volt.appendChild(opt);
        }
      }
    });
  }

  function initDefectology() {
    const defectoCapa = document.getElementById('defectoCapa');
    const defectoTipo = document.getElementById('defectoTipo');
    const defectoCausa = document.getElementById('defectoCausa');
    const defectoAccion = document.getElementById('defectoAccion');

    if (defectoCapa && defectoTipo && defectoCausa && defectoAccion) {
      // 1. Poblar Defectos
      defectsCatalog.forEach(d => {
        const opt = new Option(d.label, d.id);
        defectoTipo.add(opt);
      });

      // 2. Lógica para poblar causas y acciones según el defecto
      defectoTipo.addEventListener('change', () => {
        const defectId = defectoTipo.value;
        
        // Limpiar selectores
        defectoCausa.innerHTML = '<option value="">-- Seleccionar Causa --</option>';
        defectoAccion.innerHTML = '<option value="">-- Seleccionar Acción --</option>';
        
        const analysis = defectAnalysisMap[defectId];
        if (analysis) {
          analysis.causes.forEach(c => defectoCausa.add(new Option(c, c)));
          analysis.actions.forEach(a => defectoAccion.add(new Option(a, a)));
        }
      });

      // 3. Lógica dinámica para capas rellenadas
      defectoCapa.addEventListener('focus', () => {
        const layers = [
          { id: 'raiz', label: 'Raíz' },
          { id: 'refuerzo', label: 'Refuerzo' },
          { id: 'relleno', label: 'Relleno' },
          { id: 'peinado', label: 'Peinado' }
        ];
        const currentVal = defectoCapa.value;
        defectoCapa.innerHTML = '<option value="">-- Seleccionar Capa --</option>';
        layers.forEach(l => {
          const detallesDiv = document.getElementById(l.id + 'Detalles');
          if (detallesDiv && (detallesDiv.style.display === 'block' || window.getComputedStyle(detallesDiv).display === 'block')) {
            const opt = new Option(l.label, l.id);
            defectoCapa.add(opt);
          }
        });
        const optNinguna = new Option('Ninguna / Sin defectos', 'ninguna');
        defectoCapa.add(optNinguna);
        if ([...defectoCapa.options].some(o => o.value === currentVal)) {
          defectoCapa.value = currentVal;
        }
      });
    }
  }

  initCustomSelect();
  initDimensionSelects();
  initParameterSelects();
  initPositionValidation();
  initDefectology();
  initProcessLogic();
  const correctAnswerRules = {
    prepBordes: { value: 'Chaflán en V', feedback: 'Para este espesor, un chaflán en V es lo más adecuado.' },
    posicionAws: { value: '3G', feedback: 'La configuración requiere posición 3G (Vertical).' },
    raizProceso: { value: '135', feedback: 'El proceso adecuado es MAG (135).' },
    // Añadir más reglas según sea necesario
  };

  btnEvaluar.addEventListener('click', () => {
    // 1. Validar que los campos obligatorios estén rellenos
    const mandatoryFields = [
      'nombre', 'fecha', 'curso', 'materialBase',
      'dimLargo', 'dimAncho', 'dimEspesor',
      'prepBordes', 'tipoUnion', 'posicionAws', 'posicionUne'
    ];
    
    let incomplete = false;
    
    // Resetear estilos previos de validación visual
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    // Validar Datos Generales
    mandatoryFields.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value) {
        el.classList.add('is-invalid');
        incomplete = true;
      }
    });

    // Validar Prácticas
    if (selectedPractices.length === 0) {
      customSelectBox.classList.add('is-invalid');
      incomplete = true;
    }

    // Validar Capas Visibles
    const layers = ['raiz', 'refuerzo', 'relleno', 'peinado'];
    layers.forEach(l => {
      const detalles = document.getElementById(l + 'Detalles');
      if (detalles && (detalles.style.display === 'block' || window.getComputedStyle(detalles).display === 'block')) {
        // Buscar todos los selects e inputs dentro de esta capa
        detalles.querySelectorAll('select, input').forEach(input => {
          if (!input.value && !input.readOnly && input.type !== 'button' && input.offsetParent !== null) {
            input.classList.add('is-invalid');
            incomplete = true;
          }
        });
      }
    });

    // Validar Defectología
    if (reportedDefects.length === 0) {
      const defectoCapa = document.getElementById('defectoCapa');
      if (defectoCapa) defectoCapa.classList.add('is-invalid');
      incomplete = true;
    }

    // 3. Evaluar (confirm() eliminado por bloqueo de Google Sites)
    recalculateAll();

    let totalAchieved = 0;
    Object.values(sections).forEach(s => totalAchieved += s.achieved);
    const notaFinal = Math.min(totalAchieved, 10).toFixed(1);
    
    scoreCircle.textContent = notaFinal;
    
    // Si hay campos incompletos, cambiar el mensaje de la pantalla final sin bloquearlo
    const driveBtn = document.getElementById('btnEnviarDrive');
    if (incomplete) {
      modalTitle.textContent = 'Faltan cosas por rellenar';
      modalSummary.textContent = `Tu nota actual es ${notaFinal} de 10. ¡Tu nota puede ser mejor si cierras esto y rellenando las casillas rojas!`;
      if (driveBtn) {
        driveBtn.textContent = 'Entregar bajo mi responsabilidad';
        driveBtn.style.backgroundColor = '#d97706'; // Naranja para advertir
      }
    } else {
      modalTitle.textContent = notaFinal >= 5 ? '¡Buen trabajo!' : 'Necesitas mejorar';
      modalSummary.textContent = `Tu puntuación final es de ${notaFinal} sobre 10. Revisa los detalles en el panel lateral para ver en qué has fallado.`;
      if (driveBtn) {
        driveBtn.textContent = 'Enviar a Google Drive';
        driveBtn.style.backgroundColor = '#0f9d58'; // Verde normal
      }
    }
    
    modal.classList.add('active');
  });

  btnCloseModal.addEventListener('click', () => modal.classList.remove('active'));

  // =============================================
  // ENVÍO A GOOGLE DRIVE (GOOGLE APPS SCRIPT)
  // =============================================
  const btnEnviarDrive = document.getElementById('btnEnviarDrive');
  const enviarDriveStatus = document.getElementById('enviarDriveStatus');

  if (btnEnviarDrive) {
    btnEnviarDrive.addEventListener('click', async () => {
      // ¡ATENCIÓN! Reemplazar esta URL por la proporcionada al desplegar tu Google Apps Script
      const GAS_URL = "https://script.google.com/a/macros/iesremedios.es/s/AKfycbxkAcI4NpM1m1rH9YUhNUHUNmt5x9WhPN7q51WeAecqGG4-QkY6_isCqROfoWQjbo3E/exec"; 
      
      if (GAS_URL === "URL_DE_TU_SCRIPT_AQUI") {
        enviarDriveStatus.style.display = 'block';
        enviarDriveStatus.style.color = '#dc2626';
        enviarDriveStatus.textContent = '❌ Falta configurar la URL del script en script.js';
        return;
      }

      const payload = {
        fecha: document.getElementById('fecha').value,
        nombre: document.getElementById('nombre').value,
        ejercicio: "WPS " + document.getElementById('wpsNumber').value + " (" + selectedPractices.join(', ') + ")",
        nota: scoreCircle.textContent
      };

      btnEnviarDrive.disabled = true;
      btnEnviarDrive.textContent = 'Enviando...';
      enviarDriveStatus.style.display = 'block';
      enviarDriveStatus.style.color = '#555';
      enviarDriveStatus.textContent = 'Conectando con Google Drive...';

      try {
        // Usar POST con mode: \'no-cors\' es común en GAS gratuito,
        // pero hace que la respuesta sea opaca (response.ok siempre es false)
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        btnEnviarDrive.textContent = '¡Enviado!';
        enviarDriveStatus.style.color = '#16a34a'; // Verde
        enviarDriveStatus.textContent = '✅ Puntuación guardada correctamente.';
      } catch (error) {
        console.error("Error enviando a GAS:", error);
        btnEnviarDrive.disabled = false;
        btnEnviarDrive.textContent = 'Enviar a Google Drive';
        enviarDriveStatus.style.color = '#dc2626';
        enviarDriveStatus.textContent = '❌ Hubo un error de conexión.';
      }
    });
  }

  // =============================================
  // MOTOR DE EVALUACIÓN EN TIEMPO REAL
  // =============================================
  // --- BLOQUEO DE FORMULARIO ---
  function updateFormLock() {
    const nombre = document.getElementById('nombre').value;
    const fecha  = document.getElementById('fecha').value;
    const curso  = document.getElementById('curso').value;
    const wpsNum = document.getElementById('wpsNumber').value;
    const isUnlocked = nombre.trim() !== '' && fecha !== '' && curso !== '' && wpsNum !== '';

    const allSections = document.querySelectorAll('.section, #sectionDefectologia');
    allSections.forEach((sec, idx) => {
      if (idx === 0) {
        const inputs = sec.querySelectorAll('select, input');
        inputs.forEach(input => {
          if (input.id !== 'nombre' && input.id !== 'fecha' && input.id !== 'curso' && input.id !== 'wpsNumber') {
            input.disabled = !isUnlocked;
            input.style.opacity = isUnlocked ? '1' : '0.5';
          }
        });
      } else {
        sec.classList.toggle('section-locked', !isUnlocked);
        const inputs = sec.querySelectorAll('select, input, button');
        inputs.forEach(input => input.disabled = !isUnlocked);
      }
    });
    btnEvaluar.disabled = !isUnlocked;
    btnEvaluar.style.opacity = isUnlocked ? '1' : '0.5';
  }

  function initRealTimeScoring() {
    // Inicialización vacía — lógica movida al scope principal
  }

  // (reportedDefects ya está definido arriba)

  // --- EVALUADORES (Movidos a scope principal) ---

  function renderDefectoList() {
    const container = document.getElementById('defectoListContainer');
    const list = document.getElementById('defectoList');
    if (!container || !list) return;

    if (reportedDefects.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    list.innerHTML = '';
    reportedDefects.forEach((d, index) => {
      const item = document.createElement('div');
      item.className = 'defecto-item';
      item.innerHTML = `
        <div class="defecto-info">
          <strong>${d.capa}</strong>: ${d.tipo} <br>
          <small>Causa: ${d.causa} | Acción: ${d.accion}</small>
        </div>
        <button type="button" class="btn-remove" data-index="${index}" title="Eliminar">&times;</button>
      `;
      list.appendChild(item);
    });

    // Auditor de borrado
    list.querySelectorAll('.btn-remove').forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(e.target.dataset.index);
        reportedDefects.splice(idx, 1);
        renderDefectoList();
        recalculateAll();
      };
    });
  }

  document.getElementById('btnAddDefecto').addEventListener('click', () => {
    const capa = document.getElementById('defectoCapa').value;
    const tipo = document.getElementById('defectoTipo').value;
    const causa = document.getElementById('defectoCausa').value;
    const accion = document.getElementById('defectoAccion').value;

    if (!capa || !tipo || !causa || !accion) {
      const originalText = document.getElementById('btnAddDefecto').textContent;
      document.getElementById('btnAddDefecto').textContent = '❌ Faltan datos';
      setTimeout(() => document.getElementById('btnAddDefecto').textContent = originalText, 2000);
      return;
    }

    // Evitar duplicados por capa
    if (reportedDefects.some(d => d.capa === capa)) {
      const originalText = document.getElementById('btnAddDefecto').textContent;
      document.getElementById('btnAddDefecto').textContent = '⚠️ Capa repetida';
      setTimeout(() => document.getElementById('btnAddDefecto').textContent = originalText, 2000);
      return;
    }

    reportedDefects.push({ capa, tipo, causa, accion });
    renderDefectoList();
    recalculateAll();
    
    // Limpiar campos para el siguiente
    document.getElementById('defectoCapa').value = '';
    document.getElementById('defectoTipo').value = '';
    document.getElementById('defectoCausa').value = '';
    document.getElementById('defectoAccion').value = '';
  });

  function evalGenerales() {
    const wpsId = document.getElementById('wpsNumber').value;
    const PF = 0.2; // pts por campo (2.0 / 10 campos)
    let pts = 0;
    const check = (cond) => { if (cond) pts += PF; };
    const dimMatch = (val, target) => Array.isArray(target) ? (val >= target[0] && val <= target[1]) : val === target;

    // 1. Nº de Documento
    check(!!wpsId);

    const config = wpsConfigs[wpsId];
    if (!config) { sections.generales.achieved = pts; return; }

    // 2. Prácticas
    const correctPractices = config.practicas.every(p => selectedPractices.includes(p)) && config.practicas.length === selectedPractices.length;
    check(correctPractices);

    // 3. Material base
    check(document.getElementById('materialBase').value === config.material);

    // 4. Largo
    check(dimMatch(parseFloat(document.getElementById('dimLargo').value), config.dimensiones.dL));

    // 5. Ancho
    check(dimMatch(parseFloat(document.getElementById('dimAncho').value), config.dimensiones.dA));

    // 6. Espesor
    check(dimMatch(parseFloat(document.getElementById('dimEspesor').value), config.dimensiones.dE));

    // 7. Preparación de bordes
    check(document.getElementById('prepBordes').value === config.preparacion.bordes);

    // 8. Tipo de unión
    check(document.getElementById('tipoUnion').value === config.preparacion.union);

    // 9. Posición AWS
    check(document.getElementById('posicionAws').value === config.posicion.aws);

    // 10. Posición ISO
    check(document.getElementById('posicionUne').value === config.posicion.iso);

    sections.generales.achieved = pts;
  }

  function evalOneLayer(layerId) {
    const wpsId = document.getElementById('wpsNumber').value;
    const config = wpsConfigs[wpsId];
    if (!config || !config.capas || !config.capas[layerId]) return 0;

    const layerConfig = config.capas[layerId];
    const isGTAW = layerConfig.proceso.aws === 'GTAW';
    const fieldCount = isGTAW ? 17 : 16;
    const PF = 1.5 / fieldCount;
    let pts = 0;
    const check = (cond) => { if (cond) pts += PF; };
    const inArr = (val, arr) => Array.isArray(arr) ? arr.includes(val) : val === arr;

    // — Proceso (siempre evaluable, están fuera del div detalles) —
    check(document.getElementById(`${layerId}ProcesoComun`)?.value === layerConfig.proceso.comun);
    check(document.getElementById(`${layerId}ProcesoIso`)?.value === layerConfig.proceso.iso);
    check(document.getElementById(`${layerId}ProcesoAws`)?.value === layerConfig.proceso.aws);

    // — Resto de campos: solo si el div de detalles es visible —
    const detalles = document.getElementById(layerId + 'Detalles');
    const visible = detalles && (detalles.style.display === 'block' || window.getComputedStyle(detalles).display === 'block');
    if (!visible) return pts;

    // Consumible
    check(inArr(document.getElementById(`${layerId}AportacionDiam`)?.value, layerConfig.consumible.diam));
    check(document.getElementById(`${layerId}AportacionIso`)?.value === layerConfig.consumible.iso);
    check(document.getElementById(`${layerId}AportacionAws`)?.value === layerConfig.consumible.aws);

    // Gas
    check(document.getElementById(`${layerId}GasTipo`)?.value === layerConfig.gas.tipo);
    check(document.getElementById(`${layerId}GasIso`)?.value === layerConfig.gas.iso);
    check(document.getElementById(`${layerId}GasAws`)?.value === layerConfig.gas.aws);
    check(inArr(document.getElementById(`${layerId}GasCaudal`)?.value, layerConfig.gas.caudal));

    if (isGTAW) {
      check(document.getElementById(`${layerId}TungstenoTipo`)?.value === layerConfig.tungsteno.tipo);
      check(document.getElementById(`${layerId}TungstenoDiam`)?.value === layerConfig.tungsteno.diam);
      check(document.getElementById(`${layerId}TungstenoIso`)?.value === layerConfig.tungsteno.iso);
      check(document.getElementById(`${layerId}TungstenoAws`)?.value === layerConfig.tungsteno.aws);
      check(!!document.getElementById(`${layerId}Amperaje`)?.value);
      check(!!document.getElementById(`${layerId}Balanceo`)?.value);
      check(!!document.getElementById(`${layerId}VelocidadAvance`)?.value);
    } else {
      check(!!document.getElementById(`${layerId}Amperaje`)?.value);
      check(!!document.getElementById(`${layerId}Balanceo`)?.value);
      check(!!document.getElementById(`${layerId}VelocidadAvance`)?.value);
      check(document.getElementById(`${layerId}EmpujeArrastre`)?.value === layerConfig.ejecucion.empuje);
      check(!!document.getElementById(`${layerId}Voltaje`)?.value);
      check(!!document.getElementById(`${layerId}VelocidadHilo`)?.value);
    }

    return Math.min(pts, 1.5);
  }

  function evalDefecto() {
    const wpsId = document.getElementById('wpsNumber').value;
    const config = wpsConfigs[wpsId];
    if (!config || !config.defectos) { sections.defecto.achieved = 0; return; }

    let validCount = 0;
    reportedDefects.forEach(d => {
      const typeOk = config.defectos.tipos.includes(d.tipo);
      if (!typeOk) return;
      const analysis = defectAnalysisMap[d.tipo];
      const causeOk  = analysis ? analysis.causes.includes(d.causa)  : false;
      const actionOk = analysis ? analysis.actions.includes(d.accion) : false;
      if (causeOk && actionOk) validCount++;
    });

    let pts = 0;
    if (validCount === 1) {
      pts = 0.66; // ~33% of 2.0
    } else if (validCount === 2) {
      pts = 1.33; // ~66% of 2.0
    } else if (validCount >= 3) {
      pts = 2.0;  // 100% of 2.0
    }
    
    sections.defecto.achieved = pts;
  }

  function updateWidgetUI() {
    const sectionKeys = ['generales', 'raiz', 'refuerzo', 'relleno', 'peinado', 'defecto'];
    sectionKeys.forEach(key => {
      const s = sections[key];
      const pct = s.max > 0 ? Math.min(100, (s.achieved / s.max) * 100) : 0;
      const fillEl = document.getElementById('battery-' + key + '-fill');
      const ptsEl  = document.getElementById('battery-' + key + '-pts');
      if (fillEl) {
        fillEl.style.width = pct + '%';
        // background-size: 300% — at pct=0 shows red section, at pct=100 shows green section
        fillEl.style.backgroundPosition = pct + '% 0';
      }
      if (ptsEl) {
        const achieved = parseFloat(s.achieved.toFixed(2));
        ptsEl.textContent = achieved + ' / ' + s.max;
      }
    });

    // Actualizar contador de puntuación total
    let total = 0;
    Object.values(sections).forEach(s => total += s.achieved);
    total = Math.min(total, 10);
    const wpsSelected = document.getElementById('wpsNumber')?.value;
    const livebar = document.getElementById('livescoreBar');
    const liveVal = document.getElementById('livescoreValue');
    const liveFill = document.getElementById('livescoreFill');
    if (livebar && wpsSelected) {
      livebar.style.display = 'flex';
      liveVal.textContent = total.toFixed(1);
      liveFill.style.width = (total * 10) + '%';
      liveFill.style.background = total >= 5 ? '#16a34a' : total >= 3 ? '#d97706' : '#dc2626';
    } else if (livebar) {
      livebar.style.display = 'none';
    }
  }

  function recalculateAll() {
    updateFormLock();
    evalGenerales();
    sections.raiz.achieved     = evalOneLayer('raiz');
    sections.refuerzo.achieved = evalOneLayer('refuerzo');
    sections.relleno.achieved  = evalOneLayer('relleno');
    sections.peinado.achieved  = evalOneLayer('peinado');
    evalDefecto();
    updateWidgetUI();
  }

    // Listeners
    const ids = ['nombre','fecha','curso','wpsNumber','materialBase','dimLargo','dimAncho','dimEspesor','prepBordes','tipoUnion','posicionAws','posicionUne','defectoCapa','defectoTipo','defectoCausa','defectoAccion'];
    ['raiz','refuerzo','relleno','peinado'].forEach(l => {
      ['ProcesoComun','ProcesoIso','ProcesoAws','AportacionDiam','AportacionIso','AportacionAws','AportacionRevestimiento','GasTipo','GasIso','GasAws','GasCaudal','TungstenoTipo','TungstenoIso','TungstenoAws','TungstenoDiam','Amperaje','Voltaje','VelocidadHilo','VelocidadAvance','Balanceo','EmpujeArrastre'].forEach(f => ids.push(l + f));
    });

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', recalculateAll);
    });

    // Observer para prácticas
    const tagsContainer = document.getElementById('selectedTags');
    if (tagsContainer) {
      new MutationObserver(() => recalculateAll()).observe(tagsContainer, { childList: true, subtree: true });
    }

    recalculateAll();

  initRealTimeScoring();

  // ── Iconos de norma ──────────────────────────────────────────
  const normDescriptions = {
    'ISO 4063':   'UNE-EN ISO 4063: Soldadura y técnicas conexas — Nomenclatura de procesos y números de referencia. Define los números de proceso: 111=Electrodo revestido, 141=TIG, 135=MAG, 131=MIG, 136/114=Tubular',
    'AWS A3.0':   'AWS A3.0: Standard Welding Terms and Definitions. Define nomenclatura de procesos (SMAW, GTAW, GMAW, FCAW) y posiciones de soldadura (1G/1F=Plana, 2G/2F=Horizontal, 3G/3F=Vertical, 4G/4F=Bajo techo)',
    'ISO 14175':  'UNE-EN ISO 14175: Gases y mezclas de gases para soldadura por fusión y procesos afines. Clasificación: I1=Ar 100%, C1=CO2 100%, M21=Ar+18%CO2 (MAG acero), I3=He/Ar (aluminio)',
    'A5.32':      'AWS A5.32: Specification for Welding Shielding Gases. Clasificación AWS de gases de protección: SG-A=Argón, SG-C=CO2, SG-AC=Ar+CO2, SG-He=Helio/Ar',
    'ISO 636':    'UNE-EN ISO 636: Materiales de aportación — Varillas y alambres para soldadura TIG de aceros no aleados y de grano fino. Ej.: W 3Si1 (acero carbono), W 19 9 L (inox 304L)',
    'ISO 14341':  'UNE-EN ISO 14341: Materiales de aportación — Alambres para soldadura GMAW (MAG/MIG) de aceros no aleados y de grano fino. Ej.: G 3Si1, G 4Si1',
    'AWS A5.18':  'AWS A5.18: Specification for Carbon Steel Electrodes and Rods for Gas Shielded Arc Welding. Clasifica materiales de aportación para TIG y MAG. Ej.: ER70S-6 (acero carbono estándar)',
    'ISO 6848':   'UNE-EN ISO 6848: Electrodos de tungsteno no consumibles para soldadura TIG y procesos afines. Clasifica por composición y color de banda: WL15=Oro, WC20=Gris, WT20=Rojo, WZ8=Blanco',
    'AWS A5.12':  'AWS A5.12: Specification for Tungsten and Tungsten Alloy Electrodes for Arc Welding. Clasifica los tungstenos: EWLa-1.5=Oro, EWCe-2=Gris, EWTh-2=Rojo, EWZr-1=Blanco',
    'ISO 6947':   'UNE-EN ISO 6947: Posiciones de soldadura. Define los ángulos de inclinación y rotación. Posiciones principales: PA=Plana, PB=Horizontal, PC=Cornisa, PD=Bajo techo angular, PE=Bajo techo, PF=Vertical ascendente, PG=Vertical descendente',
    'ISO 9692-1': 'UNE-EN ISO 9692-1: Recomendaciones para la preparación de juntas en soldadura manual por arco con electrodo revestido, MIG/MAG, TIG y por haz de aceros. Define geometrías de chanfle, ángulos y separaciones de raíz',
    'ISO 17659':  'UNE-EN ISO 17659: Terminología multilingüe para uniones soldadas con ilustraciones. Define los tipos de unión: a tope, en ángulo (T), a solape, de esquina y de borde',
    'ISO 6520-1': 'UNE-EN ISO 6520-1: Clasificación de imperfecciones geométricas en materiales metálicos — Parte 1: Soldadura por fusión. Asigna códigos numéricos: 100=Grietas, 200=Porosidad, 300=Inclusiones, 400=Falta de fusión/penetración, 500=Imperfecciones de forma, 600=Otras',
    'ISO 5817':   'UNE-EN ISO 5817: Soldadura — Uniones soldadas por fusión en acero, níquel, titanio y sus aleaciones. Establece los niveles de calidad (B=Severo, C=Intermedio, D=Moderado) y los límites de aceptación para cada imperfección del 6520-1',
  };

  function injectNormIcons() {
    document.querySelectorAll('label').forEach(label => {
      const text = label.textContent;
      for (const [key, desc] of Object.entries(normDescriptions)) {
        if (text.includes(key) && !label.querySelector(`.norm-tip[data-key="${key}"]`)) {
          const icon = document.createElement('span');
          icon.className = 'norm-tip';
          icon.setAttribute('data-tip', desc);
          icon.setAttribute('data-key', key);
          icon.textContent = 'i';
          label.appendChild(icon);
        }
      }
    });
  }

  injectNormIcons();

  // Soporte clic para iconos de norma (móvil / táctil)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('norm-tip')) {
      const isActive = e.target.classList.contains('active');
      document.querySelectorAll('.norm-tip.active').forEach(el => el.classList.remove('active'));
      if (!isActive) e.target.classList.add('active');
    } else {
      document.querySelectorAll('.norm-tip.active').forEach(el => el.classList.remove('active'));
    }
  });
});

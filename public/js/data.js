/*
 * Datos de la web. Cada cifra lleva el identificador de su fuente (src),
 * que se resuelve en la lista FUENTES del final. Todas las cifras están en
 * millones de euros (M€) salvo que se indique otra unidad.
 *
 * Si actualizas un dato, actualiza también su fuente y la fecha.
 */

window.DATA = {
  actualizado: "14 de octubre de 2026",

  // --- Pensiones: nómina mensual (Seguridad Social, septiembre 2026) ---
  nomina: {
    mensualMEUR: 14498.2,           // nómina contributiva de septiembre 2026
    pensiones: 10547417,            // nº de pensiones contributivas
    pensionistas: 9.5,              // millones de personas (redondeado en la nota)
    pensionMediaJubilacion: 1576.1, // €/mes, 14 pagas
    pensionMediaSistema: 1374.6,    // €/mes
    variacionAnual: 6.3,            // % sobre septiembre 2025
    src: "segsoc-nomina"
  },

  // Afiliados medios a la Seguridad Social (julio 2026)
  afiliados: { valor: 22508065, mes: "julio de 2026", src: "afiliacion" },

  // Revalorizaciones generales de las pensiones contributivas (IPC medio dic-nov)
  revalorizaciones: [
    { anio: 2022, pct: 2.5, src: "pge2023" },
    { anio: 2023, pct: 8.5, src: "pge2023" },
    { anio: 2024, pct: 3.8, src: "igae-4t2025" },
    { anio: 2025, pct: 2.8, src: "igae-4t2025" },
    { anio: 2026, pct: 2.7, src: "segsoc-nomina" }
  ],

  // --- Recaudación tributaria de la AEAT (M€) ---
  recaudacion: [
    { anio: 2019, v: 212808, src: "aeat-2021" },
    { anio: 2020, v: 193951, src: "aeat-2021" },
    { anio: 2021, v: 223385, src: "aeat-2021" },
    { anio: 2022, v: 255463, src: "aeat-2022" },
    { anio: 2023, v: 271935, src: "aeat-2023" },
    { anio: 2024, v: 294734, src: "aeat-2024" },
    { anio: 2025, v: 325356, src: "aeat-2025" }
  ],

  // --- Cuentas de las Administraciones Públicas 2025 (IGAE) ---
  aapp2025: {
    ingresosNoFinancieros: 724554,
    ingresosPctPIB: 42.95,
    deficit: 36780,          // con la DANA: 40.330
    deficitPctPIB: 2.18,
    intereses: 40314,
    transferenciasEstadoASS: 47764, // transferencias del Estado a los Fondos de la Seguridad Social
    pensionesSS: 183906,            // gasto en pensiones de los Fondos de la SS (contabilidad nacional)
    deficitFondosSS: 5580,
    src: "igae-4t2025"
  },
  // PIB nominal 2025 implícito en la IGAE: 724.554 / 0,4295
  pib2025: 1686971,

  deuda: { total: 1763000, pctPIB: 101.4, fecha: "junio de 2026", crecimiento: 4.3, src: "bde-deuda" },
  poblacion2026: 49.59, // millones, INE proyección a 1 de enero de 2026

  // Seguridad Social: financiación en los PGE 2023 (prorrogados)
  ss2023: {
    cotizaciones: 152075,
    aportacionesEstado: 38904,
    transferenciaPactoToledo: 19888,
    complementosMinimos: 7261,
    pnc: 3003,
    prestamoEstado: 10004,
    src: "pge2023"
  },
  prestamosEstadoSS2023: { v: 116166, src: "tcu-ss" },

  // --- PGE 2023 consolidados (vigentes por prórroga en 2026). Cuadro III.2.3 ---
  pge2023: {
    nombre: "Presupuestos Generales del Estado 2023 (prorrogados en 2024, 2025 y 2026)",
    total: 485986,
    src: "pge2023",
    grupos: [
      { id: "basicos", nombre: "Servicios públicos básicos", hijos: [
        { nombre: "Justicia", v: 2291 },
        { nombre: "Defensa", v: 12317 },
        { nombre: "Seguridad ciudadana e Instituciones penitenciarias", v: 10719 },
        { nombre: "Política exterior y cooperación al desarrollo", v: 2426 }
      ]},
      { id: "social", nombre: "Protección y promoción social", hijos: [
        { nombre: "Pensiones", v: 190687, pension: true },
        { nombre: "Otras prestaciones económicas", v: 22300 },
        { nombre: "Servicios sociales y promoción social", v: 7117 },
        { nombre: "Fomento del empleo", v: 8029 },
        { nombre: "Desempleo", v: 21278 },
        { nombre: "Acceso a la vivienda", v: 3472 },
        { nombre: "Gestión de Trabajo y Economía Social", v: 193 },
        { nombre: "Gestión de Inclusión, Seguridad Social y Migraciones", v: 7162 }
      ]},
      { id: "preferentes", nombre: "Sanidad, educación y cultura", hijos: [
        { nombre: "Sanidad", v: 7049 },
        { nombre: "Educación", v: 5354 },
        { nombre: "Cultura", v: 1804 }
      ]},
      { id: "economicas", nombre: "Actuaciones económicas", hijos: [
        { nombre: "Agricultura, pesca y alimentación", v: 8868 },
        { nombre: "Industria y energía", v: 11606 },
        { nombre: "Comercio, turismo y pyme", v: 3092 },
        { nombre: "Subvenciones al transporte", v: 3419 },
        { nombre: "Infraestructuras y ecosistemas", v: 12635 },
        { nombre: "I+D+i y digitalización", v: 16328 },
        { nombre: "Otras actuaciones económicas", v: 1451 }
      ]},
      { id: "generales", nombre: "Actuaciones de carácter general", hijos: [
        { nombre: "Órganos constitucionales, Gobierno y otros", v: 933 },
        { nombre: "Servicios de carácter general", v: 25970 },
        { nombre: "Administración financiera y tributaria", v: 1753 },
        { nombre: "Transferencias a CCAA y ayuntamientos", v: 66457 },
        { nombre: "Intereses de la deuda", v: 31275, deuda: true }
      ]}
    ]
  },

  // --- Gasto de TODAS las administraciones por funciones (COFOG), 2024 ---
  cofog2024: {
    nombre: "Gasto de todas las Administraciones Públicas por funciones (COFOG), 2024",
    total: 725001,
    src: "eurostat-cofog",
    grupos: [
      { id: "proteccion", nombre: "Protección social", hijos: [
        { nombre: "Vejez (pensiones de jubilación y cuidados)", v: 165050, pension: true },
        { nombre: "Supervivencia (viudedad, orfandad)", v: 35425, pension: true },
        { nombre: "Enfermedad e incapacidad", v: 44019 },
        { nombre: "Desempleo", v: 24077 },
        { nombre: "Familia e hijos", v: 15294 },
        { nombre: "Exclusión social", v: 10878 },
        { nombre: "Vivienda y otros", v: 2789 }
      ]},
      { id: "sanidad", nombre: "Sanidad", hijos: [{ nombre: "Sanidad", v: 102942 }] },
      { id: "educacion", nombre: "Educación", hijos: [{ nombre: "Educación", v: 65862 }] },
      { id: "economia", nombre: "Asuntos económicos", hijos: [{ nombre: "Asuntos económicos (transporte, energía, industria, agricultura…)", v: 80908 }] },
      { id: "general", nombre: "Servicios públicos generales", hijos: [
        { nombre: "Intereses de la deuda", v: 39644, deuda: true },
        { nombre: "Resto de servicios generales", v: 52907 }
      ]},
      { id: "orden", nombre: "Orden público y seguridad", hijos: [{ nombre: "Orden público y seguridad", v: 28628 }] },
      { id: "ocio", nombre: "Cultura, ocio y religión", hijos: [{ nombre: "Cultura, ocio y religión", v: 19193 }] },
      { id: "medioambiente", nombre: "Medio ambiente", hijos: [{ nombre: "Medio ambiente", v: 15539 }] },
      { id: "defensa", nombre: "Defensa", hijos: [{ nombre: "Defensa", v: 14233 }] },
      { id: "viviendaurb", nombre: "Vivienda y urbanismo", hijos: [{ nombre: "Vivienda y servicios comunitarios", v: 7613 }] }
    ]
  },

  // Serie COFOG 2000-2024 (M€, todas las AAPP)
  cofogSerie: {
    anios: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
    pensiones: [53000,55661,59902,63712,68348,73571,79636,85327,90758,97132,102644,107245,111702,116703,120329,124169,128125,132499,139377,146982,151513,159378,168359,186684,200475],
    sanidad: [33324,35370,38354,41512,46914,52462,56708,61270,67347,72993,71145,69312,64721,63338,63499,66484,67713,69298,72146,75917,85545,88541,93327,98630,102942],
    educacion: [26387,27964,30285,32276,35087,36725,39812,43316,47026,49666,48493,47120,43291,42106,42556,44390,45328,46442,47764,50052,52003,55885,58669,62532,65862],
    intereses: [20843,21506,20532,19252,17852,16946,16974,18219,18894,19913,21622,28145,34156,39253,39199,35660,32926,31053,30924,29300,26092,26976,32610,36726,39644],
    defensa: [7141,7459,8139,8335,9230,9975,10255,10817,11243,10946,11283,11155,9698,9878,8950,10416,10889,10373,10287,10537,10549,11716,15347,14008,14233],
    src: "eurostat-cofog"
  },

  // Gasto en pensiones (vejez + supervivencia) en % del PIB, 2024, UE
  ue2024: [
    ["Italia",16.3],["Finlandia",16.2],["Austria",15.7],["Francia",14.8],["Grecia",13.9],
    ["España",12.6],["Portugal",12.5],["Polonia",12.4],["UE-27",12.2],["Alemania",11.8],
    ["Bélgica",11.6],["Eslovenia",11.4],["Suecia",11.1],["Bulgaria",10.6],["Luxemburgo",10.4],
    ["Eslovaquia",10.0],["Rumanía",9.9],["Croacia",9.5],["Chipre",9.0],["Chequia",8.5],
    ["Letonia",8.3],["Estonia",8.2],["Hungría",7.6],["Dinamarca",7.2],["Lituania",7.2],
    ["Malta",6.8],["Países Bajos",6.1],["Irlanda",3.3]
  ],

  // Proyección de gasto bruto en pensiones públicas, % del PIB (Ageing Report 2024, tabla I.1.6)
  ageing: {
    anios: [2022, 2045, 2070],
    espana: [13.1, 16.9, 16.7],
    ue: [11.4, 12.1, 11.8],
    saldoEspana: [-0.2, -2.5, -2.7],  // saldo del sistema (cotizaciones - gasto), tabla I.1.9
    peorSaldo: { v: -3.1, anio: 2053 },
    src: "ageing-2024"
  },

  // INE: proyección 2026-2076. Personas de 16 a 66 años por cada persona de 67 o más
  // (cálculo propio sobre la tabla 36643) y % de población con 65 o más.
  demografia: {
    anioInicial: 2026,
    ratio: [3.66,3.6,3.54,3.48,3.42,3.35,3.27,3.2,3.13,3.05,2.98,2.9,2.83,2.76,2.69,2.63,2.56,2.49,2.43,2.38,2.32,2.28,2.25,2.22,2.2,2.19,2.18,2.17,2.17,2.17,2.17,2.17,2.18,2.19,2.19,2.2,2.21,2.22,2.23,2.23,2.24,2.25,2.25,2.25,2.24,2.24,2.23,2.21,2.2,2.18,2.16],
    pct65: [21.1,21.4,21.7,22.0,22.5,22.9,23.3,23.7,24.1,24.5,25.0,25.4,25.9,26.4,26.8,27.3,27.8,28.2,28.6,29.0,29.3,29.6,29.8,29.9,30.0,30.1,30.2,30.2,30.2,30.2,30.2,30.2,30.2,30.2,30.1,30.1,30.0,30.0,29.9,29.9,29.9,29.9,30.0,30.0,30.1,30.2,30.3,30.4,30.6,30.7,30.9],
    src: "ine-proyecciones"
  },

  // INE, Encuesta Anual de Estructura Salarial 2024: salario medio bruto anual por edad
  salarios2024: [
    ["20-24", 15636], ["25-29", 22723], ["30-34", 26944], ["35-39", 28705],
    ["40-44", 30215], ["45-49", 32051], ["50-54", 32358], ["55-59", 32248], ["60-64", 31814]
  ],
  salarioMedio2024: 29540,
  salarioJoven: { tramo: "25-29", 2021: 19089, 2024: 22723 },

  // Eurostat
  paroJuvenil: { es: 24.9, ue: 15.2, anio: 2025, src: "eurostat-paro" },
  emancipacion: { es: 30.2, ue: 26.3, anio: 2025, src: "eurostat-emancipacion" },

  // --- Partidas "pequeñas" para comparar (M€/año) ---
  // grupo: "chiringuito" = lo que se suele proponer recortar
  partidas: [
    { id: "casareal", nombre: "Casa de S.M. el Rey", v: 8.4, nota: "Sección 01 de los PGE 2023", src: "pge2023", recortable: true },
    { id: "partidos", nombre: "Subvenciones a partidos políticos", v: 55.4, nota: "Funcionamiento ordinario (52,7) + seguridad (2,7)", src: "boe-pge2023", recortable: true },
    { id: "consumo", nombre: "Ministerio de Consumo", v: 65, nota: "Sección 31, PGE 2023", src: "pge2023", recortable: true },
    { id: "cortes", nombre: "Cortes Generales (Congreso y Senado)", v: 268, nota: "Sección 02, PGE 2023", src: "pge2023", recortable: true },
    { id: "rtve", nombre: "Aportación del Estado a RTVE", v: 490, nota: "Incluye Orquesta y Coro. PGE 2023", src: "pge2023", recortable: true },
    { id: "igualdad", nombre: "Ministerio de Igualdad", v: 564, nota: "Sección 30, total con fondos europeos. PGE 2023", src: "pge2023", recortable: true },
    { id: "tvauto", nombre: "Televisiones autonómicas", v: 923.4, nota: "Aportaciones públicas de las CCAA (2022)", src: "cnmc-tv", recortable: true },
    { id: "aod", nombre: "Ayuda Oficial al Desarrollo (todas las AAPP)", v: 4419, nota: "Previsión 2023 (0,34 % de la RNB)", src: "pge2023", recortable: true },
    { id: "cora", nombre: "Duplicidades: una CORA al año", v: 7737, nota: "La CORA (2012-2016) acumuló 30.948 M€ de ahorro; aquí, su media anual", src: "moncloa-cora", recortable: true },
    { id: "defensa", nombre: "Defensa (gasto 2025, criterio OTAN)", v: 33123, nota: "PGE 2023: 12.317 M€; con el plan de 2025, 2 % del PIB", src: "otan-defensa", recortable: true },
    { id: "intereses", nombre: "Intereses de la deuda (todas las AAPP)", v: 40314, nota: "No se puede recortar: es un pago obligatorio", src: "igae-4t2025", recortable: false },
    { id: "transfss", nombre: "Transferencias del Estado a la Seguridad Social", v: 47764, nota: "2025, contabilidad nacional", src: "igae-4t2025", recortable: false }
  ],

  entesAutonomicos: { v: 1766, fecha: "1 de enero de 2026", pctFundacionesSociedades: 56.6, src: "hacienda-ispa" },

  ocde: { espanaMin: 85, ocde: 63.2, src: "ocde-pag2025" },

  airef: { umbral: 13.3, gastoNeto: 13.0, gastoBrutoMedio: 14.6, deuda2050: 123, src: "airef-2026" }
};

window.FUENTES = {
  "pge2023": {
    titulo: "Presentación del Proyecto de PGE 2023 («Libro Amarillo»). Ministerio de Hacienda",
    detalle: "Cuadro III.2.3 (políticas de gasto consolidadas, p. 137); Cuadro IV.3.4 (secciones: Casa Real, Cortes, Igualdad, Consumo, p. 309-310); cap. VI (Seguridad Social, p. 363-367); AOD p. 160; RTVE en el Cuadro IV.3.2 (p. 301).",
    url: "https://www.sepg.pap.hacienda.gob.es/sitios/sepg/es-ES/Presupuestos/PGE/ProyectoPGE2023/Documents/LIBROAMARILLO2023.pdf"
  },
  "pge-prorroga": {
    titulo: "Presupuestos Generales del Estado prorrogados para 2026. Secretaría de Estado de Presupuestos y Gastos",
    detalle: "España no ha aprobado presupuestos desde 2023: los de 2023 siguen vigentes por el art. 134.4 de la Constitución.",
    url: "https://www.sepg.pap.hacienda.gob.es/sitios/sepg/es-ES/Presupuestos/PGE/PGE2025Prorroga/Paginas/PGE2025Prorroga.aspx"
  },
  "boe-pge2023": {
    titulo: "Ley 31/2022, de Presupuestos Generales del Estado para 2023 (BOE)",
    detalle: "Disposición adicional: subvenciones a partidos políticos, 52.704,14 miles € (funcionamiento, 16.01.924M.485.01) y 2.706,20 miles € (seguridad, 16.01.924M.484).",
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-2022-22128"
  },
  "segsoc-nomina": {
    titulo: "Ministerio de Inclusión, Seguridad Social y Migraciones: nómina de pensiones de septiembre de 2026",
    detalle: "14.498,2 M€; 10.547.417 pensiones; pensión media de jubilación 1.576,1 €; revalorización 2026 del 2,7 %.",
    url: "https://www.inclusion.gob.es/en/w/la-pension-media-del-sistema-de-la-seguridad-social-alcanza-los-1.374-6-euros-en-septiembre-un-4-6-mas-alta-que-hace-un-ano"
  },
  "afiliacion": {
    titulo: "Afiliación media a la Seguridad Social, julio de 2026 (boletín de la Comunidad de Madrid con datos del Ministerio)",
    detalle: "22.508.065 afiliados medios.",
    url: "https://gestiona3.madrid.org/bvirtual/BVCM007956-2026-07.pdf"
  },
  "aeat-2025": {
    titulo: "Agencia Tributaria: Informe anual de recaudación tributaria 2025",
    detalle: "325.356 M€, un 10,4 % más que en 2024.",
    url: "https://sede.agenciatributaria.gob.es/static_files/AEAT/Estudios/Estadisticas/Informes_Estadisticos/Informes_Anuales_de_Recaudacion_Tributaria/Ejercicio_2025/Infografia_2025_va_es.pdf"
  },
  "aeat-2024": {
    titulo: "Agencia Tributaria: Informe anual de recaudación tributaria 2024",
    detalle: "294.734 M€.",
    url: "https://sede.agenciatributaria.gob.es/static_files/AEAT/Estudios/Estadisticas/Informes_Estadisticos/Informes_Anuales_de_Recaudacion_Tributaria/Ejercicio_2024/IART24_ca_es.pdf"
  },
  "aeat-2023": {
    titulo: "Agencia Tributaria: Informe anual de recaudación tributaria 2023",
    detalle: "271.935 M€.",
    url: "https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2023/1-ingresos-tributarios-2023/introduccion.html"
  },
  "aeat-2022": {
    titulo: "Agencia Tributaria: Informe anual de recaudación tributaria 2022",
    detalle: "255.463 M€.",
    url: "https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2022/1-ingresos-tributarios-2022/introduccion.html"
  },
  "aeat-2021": {
    titulo: "Agencia Tributaria: Informe anual de recaudación tributaria 2021 (incluye comparación con 2019 y 2020)",
    detalle: "223.385 M€ en 2021; 2020: 193.951 M€; 2019: 212.808 M€.",
    url: "https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2021/1-ingresos-tributarios-2021/introduccion.html"
  },
  "igae-4t2025": {
    titulo: "IGAE: Operaciones no financieras de las Administraciones Públicas, cuarto trimestre de 2025",
    detalle: "Déficit 36.780 M€ (2,18 % PIB); intereses 40.314 M€; transferencias del Estado a la Seguridad Social 47.764 M€; pensiones 183.906 M€ (+6,1 %); revalorizaciones de 3,8 % (2024) y 2,8 % (2025).",
    url: "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/Cap_Trim/IT_4T_2025.pdf"
  },
  "bde-deuda": {
    titulo: "Banco de España: deuda de las AAPP según el PDE, junio de 2026 (nota de 30-9-2026)",
    detalle: "1.763 mm€, 101,4 % del PIB, +4,3 % interanual.",
    url: "https://www.bde.es/f/webbe/GAP/Secciones/SalaPrensa/NotasInformativas/26/presbe2026-86.pdf"
  },
  "tcu-ss": {
    titulo: "Tribunal de Cuentas: préstamos del Estado a la Seguridad Social (vía Europa Press)",
    detalle: "116.166,4 M€ a cierre de 2023 (7,75 % del PIB).",
    url: "https://www.bolsamania.com/noticias_amp/economia/economia--la-seguridad-social-acumulaba-un-deficit-de-casi-100000-millones-en-2024-segun-el-tribunal-de-cuentas--19553564.html"
  },
  "eurostat-cofog": {
    titulo: "Eurostat: gasto de las Administraciones Públicas por funciones (COFOG), tabla gov_10a_exp",
    detalle: "España, sector S13, gasto total. Pensiones = vejez (GF1002) + supervivencia (GF1003). Datos 2024.",
    url: "https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table"
  },
  "ageing-2024": {
    titulo: "Comisión Europea: 2024 Ageing Report (Institutional Paper 279)",
    detalle: "Tabla I.1.6: España 13,1 % (2022), 16,9 % (2045), 16,7 % (2070). Tabla I.1.9: saldo del sistema −0,2 / −2,5 / −2,7 % del PIB; mínimo −3,1 % en 2053.",
    url: "https://economy-finance.ec.europa.eu/publications/2024-ageing-report-economic-and-budgetary-projections-eu-member-states-2022-2070_en"
  },
  "ine-proyecciones": {
    titulo: "INE: Proyecciones de Población 2026-2076 (nota de prensa y tabla 36643)",
    detalle: "Población de 65 y más: 21,1 % (2026) → 30,9 % (2076). Ratio 16-66 / 67+ calculado sobre la tabla 36643.",
    url: "https://www.ine.es/dyngs/Prensa/PROP20262076.htm"
  },
  "ine-salarios": {
    titulo: "INE: Encuesta Anual de Estructura Salarial 2024 (tabla 28189, salario medio bruto por edad)",
    detalle: "Media 29.540 €; 20-24 años: 15.636 €; 25-29 años: 22.723 €.",
    url: "https://www.ine.es/jaxiT3/Tabla.htm?t=28189"
  },
  "eurostat-paro": {
    titulo: "Eurostat: tasa de paro 15-24 años (une_rt_a)",
    detalle: "España 24,9 %, UE-27 15,2 % (2025).",
    url: "https://ec.europa.eu/eurostat/databrowser/view/une_rt_a/default/table"
  },
  "eurostat-emancipacion": {
    titulo: "Eurostat: edad media de emancipación (yth_demo_030)",
    detalle: "España 30,2 años, UE-27 26,3 (2025).",
    url: "https://ec.europa.eu/eurostat/databrowser/view/yth_demo_030/default/table"
  },
  "cnmc-tv": {
    titulo: "CNMC: financiación pública de las radiotelevisiones autonómicas (recogido por Vozpópuli, 15-8-2023)",
    detalle: "923,4 M€ en el último ejercicio cerrado (2022), frente a 902,6 M€ en 2021. Fuente secundaria: verificar en el informe de la CNMC.",
    url: "https://www.vozpopuli.com/medios/ruina-televisiones-autonomicas-factura-dispara-acerca-1-000-millones.html"
  },
  "moncloa-cora": {
    titulo: "La Moncloa: referencia del Consejo de Ministros de 3-6-2016, informe de seguimiento de la CORA",
    detalle: "Ahorro acumulado de 30.947.624.397 € para el conjunto de las AAPP (2012-2016). Media anual en esta web: 30.948 / 4 ≈ 7.737 M€ (cálculo propio).",
    url: "https://www.lamoncloa.gob.es/consejodeministros/referencias/documents/2016/refc20160603e_3.pdf"
  },
  "otan-defensa": {
    titulo: "OTAN: gasto en defensa de los aliados 2014-2025 (vía Público, 28-8-2025)",
    detalle: "España: 22.693 M€ en 2024 y 33.123 M€ estimados en 2025 (2 % del PIB).",
    url: "https://www.publico.es/internacional/europa/otan-estima-espana-llegado-2-gasto-pib-defensa.html"
  },
  "hacienda-ispa": {
    titulo: "Ministerio de Hacienda: Informe sobre el sector público autonómico, situación a 1-1-2026",
    detalle: "1.766 entes dependientes de las CCAA; el 56,6 % son fundaciones o sociedades mercantiles.",
    url: "https://serviciostelematicosext.hacienda.gob.es/SGCIEF/Ispanet/index.aspx?ejercicio=2026&periodo=01"
  },
  "ocde-pag2025": {
    titulo: "OCDE: Pensions at a Glance 2025, tasas de sustitución netas",
    detalle: "Media OCDE 63,2 %; España entre los países con 85 % o más para un salario medio.",
    url: "https://www.oecd.org/en/publications/pensions-at-a-glance-2025_e40274c1-en/full-report/net-pension-replacement-rates_a7a9e376"
  },
  "airef-2026": {
    titulo: "AIReF: evaluación de la regla de gasto en pensiones (mayo 2026, vía Europa Press)",
    detalle: "Gasto neto medio 2022-2050 del 13,0 % del PIB frente al umbral del 13,3 %; gasto bruto medio del 14,6 %; deuda pública hacia el 123 % del PIB en 2050 con políticas constantes.",
    url: "https://www.bolsamania.com/noticias_amp/economia/economia--airef-ratifica-el-cumplimiento-de-la-regla-de-gasto-de-pensiones-pero-dice-que-no-garantiza-la-sostenibilidad--22574898.html"
  }
};

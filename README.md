# Las cuentas de las pensiones

Web divulgativa e interactiva sobre el gasto en pensiones en España, su sostenibilidad y lo que supone para los jóvenes. Todo con datos oficiales y enlazados a su fuente.

**En línea:** https://presupuestos.nephei.org (cuando el dominio esté conectado)

## Qué incluye

1. **Recaudación récord y déficit.** Ingresos de la AEAT entre 2019 y 2025, déficit, intereses y transferencias del Estado a la Seguridad Social.
2. **Explorador del presupuesto.** Un *treemap* navegable con dos vistas: los PGE 2023 consolidados, que siguen prorrogados en 2026, y el gasto de todas las administraciones por funciones (COFOG 2024).
3. **El reloj de las pensiones.** Cuánto tiempo de pensiones se pagaría con el presupuesto de la Casa Real, Igualdad, partidos, RTVE, televisiones autonómicas, AOD, defensa…
4. **Simulador.** Recortes en partidas y revalorización por debajo del IPC, comparados con dos objetivos: las transferencias del Estado a la Seguridad Social y la subida del gasto que prevé la Comisión Europea hasta 2045.
5. **Revalorización con el IPC.** Lo que cuesta cada punto de subida y lo que siguen costando las de años anteriores.
6. **Tendencia y demografía.** COFOG de 2000 a 2024, ratio de población en edad de trabajar por persona mayor (INE 2026-2076) y proyección del Ageing Report 2024.
7. **Jóvenes.** Salarios por edad frente a la pensión media, paro juvenil, edad de emancipación, tasa de sustitución y deuda.
8. **Comparativa con la UE** y una sección de **matices** para no simplificar de más.

## Estructura

```
public/            ← lo que se publica (sitio estático, sin build)
  index.html
  css/styles.css
  js/data.js       ← TODAS las cifras y sus fuentes (editar aquí)
  js/app.js        ← gráficos e interacción (SVG sin dependencias)
  404.html, _headers, favicon.svg
wrangler.jsonc     ← configuración de Cloudflare Workers (solo archivos estáticos)
```

No hace falta compilar nada. Para verlo en local:

```bash
cd public && python -m http.server 8000
# y abre http://localhost:8000
```

## Metodología y cálculos propios

| Cálculo | Cómo se hace |
|---|---|
| Gasto anual en pensiones contributivas | Nómina de septiembre de 2026 (14.498,2 M€) × 14 pagas ≈ 202.975 M€. Es una aproximación: no incluye clases pasivas ni pensiones no contributivas. |
| «Reloj» | Importe anual de la partida ÷ gasto anual anterior × 365 días. |
| Coste de un punto de revalorización | 1 % del gasto anual ≈ 2.030 M€/año. |
| Coste actual de la subida de un año (p %) | Gasto anual × p / (100 + p). Para el 8,5 % de 2023 ≈ 15.900 M€/año. |
| Revalorizaciones acumuladas 2022-2026 | 1,025 × 1,085 × 1,038 × 1,028 × 1,027 − 1 = 21,9 %. |
| Simulador: revalorizar *g* puntos bajo el IPC *n* años | Ahorro anual al final ≈ gasto anual × (1 − (1 − g/100)ⁿ), en euros de hoy. |
| Objetivo 2 del simulador | +3,8 puntos del PIB (Ageing Report 2024, España 2022→2045) × PIB 2025 (724.554 / 0,4295 = 1.686.971 M€) ≈ 64.105 M€. |
| CORA anual | 30.948 M€ de ahorro acumulado (2012-2016) ÷ 4 ≈ 7.737 M€/año. |
| Ratio trabajadores/mayores | Población de 16 a 66 años ÷ población de 67 o más, por año (INE, tabla 36643). |
| Pensiones en COFOG | Vejez (GF1002) + supervivencia (GF1003). «Vejez» incluye también servicios de atención a mayores. |

## Fuentes principales

- **PGE 2023** (prorrogados en 2024, 2025 y 2026): [Libro Amarillo](https://www.sepg.pap.hacienda.gob.es/sitios/sepg/es-ES/Presupuestos/PGE/ProyectoPGE2023/Documents/LIBROAMARILLO2023.pdf). Cuadro III.2.3 para las políticas de gasto, Cuadro IV.3.4 para las secciones y capítulo VI para la Seguridad Social. [Prórroga 2026](https://www.sepg.pap.hacienda.gob.es/sitios/sepg/es-ES/Presupuestos/PGE/PGE2025Prorroga/Paginas/PGE2025Prorroga.aspx).
- **IGAE**: [Operaciones no financieras de las AAPP, 4T 2025](https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/Cap_Trim/IT_4T_2025.pdf).
- **Agencia Tributaria**: informes anuales de recaudación ([2025](https://sede.agenciatributaria.gob.es/static_files/AEAT/Estudios/Estadisticas/Informes_Estadisticos/Informes_Anuales_de_Recaudacion_Tributaria/Ejercicio_2025/Infografia_2025_va_es.pdf)).
- **Seguridad Social**: [nómina de septiembre de 2026](https://www.inclusion.gob.es/en/w/la-pension-media-del-sistema-de-la-seguridad-social-alcanza-los-1.374-6-euros-en-septiembre-un-4-6-mas-alta-que-hace-un-ano).
- **Banco de España**: [deuda de las AAPP, junio de 2026](https://www.bde.es/f/webbe/GAP/Secciones/SalaPrensa/NotasInformativas/26/presbe2026-86.pdf).
- **Eurostat**: [gov_10a_exp](https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table) (COFOG), [une_rt_a](https://ec.europa.eu/eurostat/databrowser/view/une_rt_a/default/table), [yth_demo_030](https://ec.europa.eu/eurostat/databrowser/view/yth_demo_030/default/table).
- **INE**: [Proyecciones de Población 2026-2076](https://www.ine.es/dyngs/Prensa/PROP20262076.htm) y [Encuesta Anual de Estructura Salarial 2024](https://www.ine.es/jaxiT3/Tabla.htm?t=28189).
- **Comisión Europea**: [2024 Ageing Report](https://economy-finance.ec.europa.eu/publications/2024-ageing-report-economic-and-budgetary-projections-eu-member-states-2022-2070_en), tablas I.1.6 e I.1.9.
- **Ministerio de Hacienda**: [Informe sobre el sector público autonómico a 1-1-2026](https://serviciostelematicosext.hacienda.gob.es/SGCIEF/Ispanet/index.aspx?ejercicio=2026&periodo=01).
- **La Moncloa**: [seguimiento de la CORA (3-6-2016)](https://www.lamoncloa.gob.es/consejodeministros/referencias/documents/2016/refc20160603e_3.pdf).

La lista completa, con el detalle de cada cifra, está en `public/js/data.js` y al pie de la web. Algunos datos llegan a través de prensa que cita al organismo oficial: la financiación de las televisiones autonómicas (CNMC), el gasto en defensa de 2025 (OTAN), los préstamos a la Seguridad Social (Tribunal de Cuentas) y la evaluación de la AIReF. En esos casos se indica.

## Despliegue en Cloudflare

El repositorio es un sitio estático, así que el Worker no necesita código propio. Basta con `wrangler.jsonc`, que publica la carpeta `public/`.

- **Si el proyecto es un Worker conectado a Git (Workers Builds):** el comando de despliegue por defecto (`npx wrangler deploy`) lee `wrangler.jsonc`. El campo `name` tiene que coincidir con el nombre del Worker en el panel de Cloudflare; aquí es `calculadora-presupuestos`.
- **Si es un proyecto de Pages:** en *Settings → Build*, deja vacío el comando de build y pon `public` como directorio de salida.

**Dominio `presupuestos.nephei.org`:** si `nephei.org` está gestionado en la misma cuenta de Cloudflare, ve a *Workers & Pages → (el proyecto) → Settings → Domains & Routes → Add → Custom domain* y escribe `presupuestos.nephei.org`. Cloudflare crea el registro DNS y el certificado. También se puede declarar en `wrangler.jsonc`:

```jsonc
"routes": [{ "pattern": "presupuestos.nephei.org", "custom_domain": true }]
```

## Contribuir

¿Un dato mal o desactualizado? Abre una *issue* con el enlace a la fuente oficial.

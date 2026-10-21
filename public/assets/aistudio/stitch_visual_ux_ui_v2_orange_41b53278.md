**MARKETPLACE LOCAL**

**Sistema Visual + UX/UI + Arquitectura de Pantallas**

Revisión V2 — nueva identidad visual naranja, inspirada en la referencia
entregada

<img src="media/image1.jpg" style="width:3.3in;height:4.95in" />

*La imagen es referencia de dirección visual, no un diseño para copiar
literalmente.*

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>MARCA<br />
Naranja cálido</strong></th>
<th><strong>MODO CLARO<br />
Blanco + crema + naranja</strong></th>
<th><strong>MODO OSCURO<br />
Carbón cálido + naranja</strong></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 1. Objetivo del brief V2

Este documento reemplaza la dirección visual anterior basada en
azul/cian. La nueva dirección toma como referencia la interfaz
entregada: fondos blancos y cálidos, tipografía negra de alto contraste,
acentos naranjas, cards limpias, fotografías de producto/comercio,
navegación inferior y una estética de marketplace moderna y accesible.

Se entrega junto con la Especificación Integral de Frontend anterior. El
documento anterior define comportamiento, roles y requisitos; este
documento define la capa visual y la arquitectura de pantallas que
Google Stitch debe diseñar.

# 2. Dirección visual

> **•** Identidad: naranja como color de marca. El logo debe tener un
> símbolo/icono naranja y, según el modo, wordmark negro o blanco.
>
> **•** Sensación: moderna, comercial, cercana, rápida y confiable. Debe
> parecer un marketplace local amplio, no una app limitada a
> restaurantes.
>
> **•** Referencia: usar la composición de la imagen como inspiración:
> jerarquía clara, cards blancas, fotografías grandes, chips
> redondeados, CTA naranja, barra inferior y estados visibles.
>
> **•** Evitar: azul como color de marca, exceso de gradientes,
> glassmorphism pesado, fondos completamente anaranjados y saturación
> visual.
>
> **•** Fotografía: las imágenes de comercios/productos son parte
> importante de la experiencia. Deben tener protagonismo en Home,
> listado y detalle.

# 3. Paleta oficial — modo claro

Los HEX fueron definidos a partir de la dirección cromática visible en
la referencia proporcionada y normalizados para construir un sistema
coherente. No se pretende afirmar que sean los valores exactos de la
imagen original.

## 3.1 Tokens Light

| Token          | HEX      | Uso                                                 | Muestra |
|----------------|----------|-----------------------------------------------------|---------|
| Brand          | \#FF6500 | Identidad, CTA primario, selección, progreso activo |         |
| Brand hover    | \#E85A00 | Hover/focus fuerte de CTA                           |         |
| Brand pressed  | \#CC4F00 | Pressed / tap feedback                              |         |
| Brand soft     | \#FFF1E8 | Fondos suaves de chips, badges y highlights         |         |
| Background     | \#FFFDFB | Fondo general                                       |         |
| Surface        | \#FFFFFF | Cards, sheets y contenedores principales            |         |
| Surface soft   | \#FFF7F2 | Secciones suaves y contenedores secundarios         |         |
| Surface alt    | \#F6F0EA | Inputs, filtros y elementos de contraste leve       |         |
| Text           | \#111111 | Texto principal / títulos                           |         |
| Text secondary | \#6B625B | Texto auxiliar / metadatos                          |         |
| Border         | \#E9E2DC | Separadores y bordes                                |         |
| Success        | \#22A35A | Entregado / disponible / éxito                      |         |
| Warning        | \#D97706 | Atención / demora / stock bajo                      |         |
| Error          | \#D92D20 | Error / cancelación / problema                      |         |
| Info           | \#3B82F6 | Información neutral / ayuda                         |         |

## 3.2 Reglas de uso Light

> **•** Naranja = marca, CTA, selección, promociones y acciones
> importantes. No usar naranja para párrafos completos ni para
> superficies grandes de manera constante.
>
> **•** Blanco = superficie principal de cards, sheets y contenidos.
> Crema = fondo general y secciones de baja intensidad.
>
> **•** Negro = títulos y datos primarios. Gris cálido = metadata,
> descripciones y texto auxiliar.
>
> **•** Verde/rojo/amber quedan reservados a semántica de estado y no
> compiten con la identidad.

# 4. Paleta oficial — modo oscuro

El modo oscuro no invierte colores mecánicamente. Conserva el naranja
como identidad y utiliza una escala de carbón cálido para evitar un
aspecto azulado.

## 4.1 Tokens Dark

| Token          | HEX      | Uso                                                 | Muestra |
|----------------|----------|-----------------------------------------------------|---------|
| Brand          | \#FF7600 | Identidad, CTA primario, selección, progreso activo |         |
| Brand hover    | \#FF8A26 | Hover/focus fuerte de CTA                           |         |
| Brand pressed  | \#D95E00 | Pressed / tap feedback                              |         |
| Brand soft     | \#3A2112 | Fondos suaves de chips, badges y highlights         |         |
| Background     | \#121110 | Fondo general                                       |         |
| Surface        | \#191817 | Cards, sheets y contenedores principales            |         |
| Surface soft   | \#211E1B | Secciones suaves y contenedores secundarios         |         |
| Surface alt    | \#28231F | Inputs, filtros y elementos de contraste leve       |         |
| Text           | \#FAF8F5 | Texto principal / títulos                           |         |
| Text secondary | \#B9B0A8 | Texto auxiliar / metadatos                          |         |
| Border         | \#3A342F | Separadores y bordes                                |         |
| Success        | \#2BBE6C | Entregado / disponible / éxito                      |         |
| Warning        | \#F59E0B | Atención / demora / stock bajo                      |         |
| Error          | \#F04438 | Error / cancelación / problema                      |         |
| Info           | \#60A5FA | Información neutral / ayuda                         |         |

## 4.2 Reglas de uso Dark

> **•** Background y surfaces deben diferenciarse por nivel de
> elevación, no por bordes brillantes.
>
> **•** El naranja debe mantener suficiente contraste sobre superficies
> oscuras, pero no llenar la pantalla.
>
> **•** Las imágenes pueden conservar sus colores reales; usar overlays
> oscuros únicamente cuando sea necesario para legibilidad.

# 5. Mapeo de color por componente

| Componente           | Light    | Dark     | Regla                                                                      |
|----------------------|----------|----------|----------------------------------------------------------------------------|
| CTA primario         | \#FF6500 | \#FF7600 | Acción principal por pantalla; máximo uno visualmente dominante.           |
| CTA secundario       | \#111111 | \#28231F | Outline o secondary; evitar competir con el CTA naranja.                   |
| Chip seleccionado    | \#FFF1E8 | \#3A2112 | Texto/borde naranja; fondo suave.                                          |
| Ubicación / tracking | \#FF6500 | \#FF7600 | Naranja de marca + mapa neutral; no volver todo el mapa naranja.           |
| Pedido entregado     | \#22A35A | \#2BBE6C | Estado semántico, no branding.                                             |
| Error                | \#D92D20 | \#F04438 | Solo mensajes de error y acciones de recuperación.                         |
| Oferta / descuento   | \#FF6500 | \#FF7600 | Badge, porcentaje, banner o precio promocional.                            |
| Publicidad           | \#6B625B | \#B9B0A8 | Siempre etiquetada como PUBLICIDAD; no simular una recomendación orgánica. |
| Pozo / ranking       | \#FF6500 | \#FF7600 | Naranja + neutros; no crear una segunda identidad dorada completa.         |

# 6. Branding y logo

> **•** Logo principal: icono/símbolo naranja + nombre de la marca en
> negro en Light y en blanco en Dark.
>
> **•** El naranja del logo debe ser exactamente el token --brand en
> cada tema, salvo que el diseñador documente una excepción accesible.
>
> **•** No colocar el logo grande en cada pantalla. En navegación móvil
> debe aparecer pequeño y limpio; la Home puede usar una versión
> ligeramente mayor.
>
> **•** No usar el logo sobre fondos fotográficos sin una
> superficie/overlay que garantice contraste.
>
> **•** Crear variantes: full logo, icon-only, monochrome claro y
> monochrome oscuro.

# 7. Layout general y principios UX

## 7.1 Mobile-first

> **•** Diseño base de 390 px de ancho; debe funcionar desde 360 px sin
> pérdida de información.
>
> **•** Bottom navigation fija de 5 destinos en Customer/Courier cuando
> aplique. Merchant/Admin usarán navegación adaptada a sus tareas.
>
> **•** Touch targets mínimos recomendados: 44 px. CTA principal visible
> sin depender de gestos ocultos.
>
> **•** Cards con esquinas suaves, fotografías con relación de aspecto
> consistente y texto de máximo 2–3 líneas donde corresponda.

## 7.2 Jerarquía visual

> **•** Objetivo de la pantalla.
>
> **•** Información crítica.
>
> **•** Acción principal.
>
> **•** Acciones secundarias.
>
> **•** Información auxiliar.

## 7.3 Espaciado y forma

> **•** Base 8 px: 8 / 16 / 24 / 32 / 40 / 48.
>
> **•** Radio de card: 16 px. Inputs: 12–14 px. Chips: 999 px. Bottom
> sheets: 24 px superiores.
>
> **•** Sombras suaves y cortas. En Dark, priorizar diferencia tonal de
> superficie antes que sombra visible.
>
> **•** Separadores finos y poco contrastados; no encerrar toda la
> interfaz en bordes.

# 8. Arquitectura de navegación — Customer

La referencia sugiere una Home muy visual, con búsqueda, categorías y
contenido comercial. Para el marketplace local se mantiene esa lógica,
pero ampliada a cualquier categoría de comercio.

| Destino  | Contenido                                        | Objetivo                                         |
|----------|--------------------------------------------------|--------------------------------------------------|
| Inicio   | Home / discovery / promos / categories           | Home / discovery / promos / categories           |
| Explorar | Search / categories / merchant listing / filters | Search / categories / merchant listing / filters |
| Pedidos  | Active order / history / tracking entry          | Active order / history / tracking entry          |
| Ofertas  | Promotions / coupons / sponsored promotions      | Promotions / coupons / sponsored promotions      |
| Perfil   | Account / addresses / payment / settings / help  | Account / addresses / payment / settings / help  |

## 8.1 Home — estructura

> **•** Header: logo pequeño + ubicación de entrega + acceso a
> notificaciones.
>
> **•** Search bar prominente: “¿Qué estás buscando?” o equivalente.
> Debe permitir productos, comercios y categorías.
>
> **•** Hero/promo carousel: campañas, ofertas o comercios destacados.
> Máximo 1 foco principal por slide.
>
> **•** Categorías horizontales: comida, supermercado, farmacia,
> tiendas, etc.; icono + nombre.
>
> **•** Comercios populares: cards con imagen, nombre, rating,
> tiempo/estado y delivery fee cuando aplique.
>
> **•** Secciones contextuales: “Cerca tuyo”, “Entrega rápida”,
> “Ofertas” y “Volver a comprar”.
>
> **•** Bottom navigation.

## 8.2 Explorar / listado

> **•** Header con back/search y filtros. Filtros como chips: categoría,
> abierto ahora, entrega, rating, precio.
>
> **•** Lista vertical de cards. En mobile priorizar escaneabilidad; en
> desktop permitir 2–4 columnas según ancho.
>
> **•** Cada card debe mostrar: imagen, nombre, categoría, rating,
> estimación de entrega y costo de delivery cuando corresponda.

## 8.3 Detalle de comercio

> **•** Imagen/cover + logo/avatar del comercio + nombre + rating +
> horario + tiempo estimado + delivery.
>
> **•** Categorías internas del comercio y búsqueda de productos.
>
> **•** Cards de producto con imagen, nombre, descripción breve, precio
> y CTA claro.

## 8.4 Producto

> **•** Imagen grande, nombre, descripción, precio,
> variantes/adicionales, cantidad y CTA “Agregar al carrito”.
>
> **•** Mostrar disponibilidad y mensajes de stock sin convertirlos en
> alertas invasivas.

## 8.5 Carrito y checkout

> **•** Carrito: items, cantidades, subtotal, delivery fee, tip,
> descuentos y total.
>
> **•** Checkout: dirección, método de pago, propina, instrucciones y
> CTA final.
>
> **•** Antes de confirmar, el total debe ser inequívoco.

# 9. Arquitectura de pantallas — Customer MVP

> **•** Splash / bootstrap
>
> **•** Login
>
> **•** Registro
>
> **•** Home
>
> **•** Buscar / Explorar
>
> **•** Listado de comercios
>
> **•** Detalle de comercio
>
> **•** Detalle de producto
>
> **•** Carrito
>
> **•** Checkout
>
> **•** Pedido creado
>
> **•** Estado del pedido
>
> **•** Historial de pedidos
>
> **•** Perfil
>
> **•** Direcciones
>
> **•** Ayuda / soporte

# 10. Arquitectura de pantallas — Merchant MVP

> **•** Login
>
> **•** Dashboard
>
> **•** Pedidos
>
> **•** Detalle de pedido
>
> **•** Productos
>
> **•** Crear/editar producto
>
> **•** Configuración del comercio
>
> **•** Horarios / disponibilidad

# 11. Arquitectura de pantallas — Courier MVP

> **•** Login
>
> **•** Dashboard Disponible/No disponible
>
> **•** Oferta de entrega con timer 60 s
>
> **•** Detalle de entrega
>
> **•** Entrega asignada
>
> **•** Confirmar retiro
>
> **•** En camino
>
> **•** Entrega completada
>
> **•** Historial / ganancias básicas

# 12. Arquitectura de pantallas — Admin MVP

> **•** Login
>
> **•** Dashboard
>
> **•** Pedidos
>
> **•** Detalle de pedido
>
> **•** Comercios
>
> **•** Clientes
>
> **•** Cadetes
>
> **•** Configuración
>
> **•** Auditoría básica

# 13. Full — Tracking en tiempo real

La pantalla de tracking debe inspirarse en la referencia: mapa como
elemento principal, tarjeta inferior con estado y ETA, y una jerarquía
muy clara de progreso. El objetivo es permitir que el cliente entienda
“dónde está” y “cuándo llega” en pocos segundos.

## 13.1 Composición visual

> **•** Mapa ocupa aproximadamente 60–70% de la altura disponible en
> mobile cuando el pedido está en camino.
>
> **•** Pin de comercio, pin de cliente y marcador del repartidor. El
> marcador del repartidor debe usar el naranja de marca.
>
> **•** Bottom sheet/card: estado actual, ETA en rango, distancia
> aproximada, nombre del repartidor y acciones permitidas.
>
> **•** Stepper: confirmado → preparando → listo → retirado → en camino
> → entregado.
>
> **•** ETA mostrado como rango (“12:35–12:42”) en lugar de una falsa
> precisión.

## 13.2 Dos tramos

> **•** Tramo A: repartidor → comercio, mientras retira el pedido.
>
> **•** Tramo B: repartidor → cliente, una vez retirado.
>
> **•** La UI cambia de fase automáticamente según el estado del
> backend; no inventar tiempos en el cliente.

## 13.3 Privacidad

> **•** Mostrar ubicación del repartidor únicamente mientras existe una
> entrega activa vinculada al usuario.
>
> **•** Al completar/cancelar, detener el tracking visible.

# 14. Full — Reputación, ranking y pozo

## 14.1 Courier

> **•** Pantalla “Mi reputación”: rating, cantidad de valoraciones y
> resumen de tendencia sin exponer clientes individuales.
>
> **•** Pantalla “Ranking”: posición del mes, métricas relevantes,
> elegibilidad y pozo actual.
>
> **•** Pozo: mostrar monto actual, incremento del día, objetivo
> siguiente y tope. No prometer premio definitivo antes del cierre.
>
> **•** Visualmente el ranking debe usar naranja + neutros y no depender
> de oro/amarillo como identidad aparte.

## 14.2 Merchant

> **•** Rating y señales de satisfacción separados de posición orgánica
> y publicidad.
>
> **•** Cualquier “PUBLICIDAD” debe tener etiqueta inequívoca y no
> parecer un resultado orgánico.

# 15. Pantalla de oferta para courier — UX crítica

Esta pantalla debe ser extremadamente rápida de interpretar. El courier
debe poder decidir dentro del plazo configurado sin recorrer varias
pantallas.

> **•** Comercio, zona/dirección aproximada, distancia y ETA relevante.
>
> **•** Monto que recibirá por delivery y propina si ya aplica; nunca
> ocultar información necesaria para decidir.
>
> **•** Cuenta regresiva visual de 60 segundos.
>
> **•** Botón primario: Aceptar. Botón secundario: Rechazar. No usar
> colores que hagan parecer obligatorio aceptar.
>
> **•** Timeout: mensaje claro de “La oferta venció” y retorno al estado
> Disponible.
>
> **•** Rechazar o dejar vencer no debe mostrar mensajes de castigo
> reputacional.

# 16. Full — Cola, proximidad y skipPriority

La UI no debe mostrar la lógica interna de skipPriority como un ranking
secreto. El usuario final solo necesita información clara sobre la
asignación y, cuando sea relevante, una explicación general del
criterio.

> **•** Texto informativo sugerido para courier: “Las ofertas se
> distribuyen considerando la posición en la cola, proximidad y
> oportunidades recientes.”
>
> **•** No mostrar “skipPriority = 1” al courier salvo que luego se
> defina una UX explícita para ello.
>
> **•** Cuando un courier completa una entrega, el frontend debe
> reflejar el retorno a Disponible y la posibilidad de nuevas ofertas,
> según backend.

# 17. Estados globales obligatorios

| Estado      | Representación                               | Regla                                                     |
|-------------|----------------------------------------------|-----------------------------------------------------------|
| Loading     | Skeleton / shimmer discreto                  | No usar spinner a pantalla completa salvo bootstrap.      |
| Empty       | Ilustración/simple icono + explicación + CTA | Siempre incluir siguiente acción.                         |
| Error       | Mensaje breve + reintentar                   | No esconder el motivo esencial.                           |
| Offline     | Banner pequeño persistente                   | La app sigue mostrando datos cacheados cuando sea seguro. |
| Success     | Confirmación breve                           | Evitar modales innecesarios.                              |
| Closed      | Estado comercio cerrado                      | Mostrar horario/alternativa.                              |
| Unavailable | Producto no disponible                       | Deshabilitar CTA o sugerir sustituto.                     |
| No courier  | Esperando repartidor                         | Explicar que la búsqueda continúa y evitar falsa certeza. |

# 18. Responsive / Desktop

> **•** Mobile: flujo principal con navegación inferior y una columna.
>
> **•** Tablet: dos columnas cuando beneficie comparación; mantener
> jerarquía móvil.
>
> **•** Desktop: ancho máximo de contenido ~1200–1320 px;
> sidebar/context navigation para Merchant/Admin; Customer puede usar
> top navigation o sidebar ligera.
>
> **•** No estirar cards de producto hasta ocupar todo el ancho
> disponible; preservar ritmo visual de marketplace.

# 19. Componentes reutilizables que Stitch debe diseñar

> **•** Logo / wordmark / icon
>
> **•** AppBar
>
> **•** BottomNavigation
>
> **•** SearchBar
>
> **•** CategoryChip
>
> **•** CategoryTile
>
> **•** MerchantCard
>
> **•** ProductCard
>
> **•** PromoBanner
>
> **•** FilterChip
>
> **•** Rating
>
> **•** Price
>
> **•** DeliveryStatus
>
> **•** OrderStepper
>
> **•** OrderCard
>
> **•** CartItem
>
> **•** QuantityControl
>
> **•** AddressCard
>
> **•** PaymentMethodCard
>
> **•** CourierOfferCard
>
> **•** Timer
>
> **•** MapOverlay
>
> **•** TrackingBottomSheet
>
> **•** RankingRow
>
> **•** RewardPoolCard
>
> **•** EmptyState
>
> **•** ErrorState
>
> **•** Skeleton
>
> **•** Toast
>
> **•** BottomSheet
>
> **•** Dialog
>
> **•** FormField

# 20. Accesibilidad y contraste

> **•** Texto normal con contraste suficiente contra el fondo. No
> colocar texto naranja fino sobre blanco como texto largo.
>
> **•** No comunicar estado solamente con color: usar icono + texto +
> color.
>
> **•** Focus visible y navegación de teclado en desktop.
>
> **•** Tamaño de toque mínimo recomendado 44×44 px.
>
> **•** Reducción de movimiento: respetar prefers-reduced-motion para
> mapas, carruseles y timers.

# 21. Qué debe y qué no debe hacer Google Stitch

Debe

> **•** Usar esta paleta como fuente de verdad visual.
>
> **•** Diseñar Light y Dark para cada pantalla, no solo para Home.
>
> **•** Mantener consistencia de componentes y spacing.
>
> **•** Dar protagonismo a fotos, precios y acciones.
>
> **•** Mantener una UI parecida en lenguaje visual a la referencia,
> adaptada al marketplace local multi-categoría.

No debe

> **•** Volver a usar azul/cian como identidad principal.
>
> **•** Copiar literalmente el diseño de la imagen o asumir que solo
> existen restaurantes.
>
> **•** Inventar pantallas o flujos que contradigan el documento
> funcional.
>
> **•** Crear estados de negocio calculados solamente en frontend.
>
> **•** Usar publicidad sin etiqueta o mezclarla visualmente con
> reputación orgánica.

# 22. Prompt maestro para Google Stitch

Diseña una app marketplace local de delivery mobile-first, con soporte
Light y Dark, inspirada en la referencia visual proporcionada: estética
blanca/crema, tipografía negra, tarjetas limpias, fotografías
protagonistas, esquinas suaves, navegación inferior y CTAs naranjas. La
marca usa un logo naranja.  
  
IDENTIDAD: el color de marca es naranja cálido. Usa los tokens definidos
en este documento. NO uses azul/cian como colores de marca. En Light usa
fondo \#FFFDFB, superficies blancas y texto \#111111. En Dark usa fondo
\#121110, superficies carbón cálido y texto \#FAF8F5.  
  
ARQUITECTURA: Customer con Inicio, Explorar, Pedidos, Ofertas y Perfil;
Merchant, Courier y Admin con navegación adaptada a sus tareas. Respeta
las pantallas y estados definidos en la especificación integral de
frontend.  
  
UX: prioriza claridad \> decoración. Search prominente. Home con
promociones, categorías y comercios. Cards visuales. CTA único dominante
por pantalla. Diseña estados loading, empty, error, offline, closed y
unavailable.  
  
FULL: incluye tracking en tiempo real con mapa, marcador de repartidor,
dos tramos, ETA en rango y bottom sheet. Incluye reputación, ranking y
pozo con la jerarquía visual naranja.  
  
RESPONSIVE: mobile-first 360–430 px; tablet y desktop con contenido
centrado y layouts adaptativos. Usa grid base de 8 px y touch targets de
44 px.  
  
No inventes lógica de negocio. El frontend consume estados y datos del
backend como fuente de verdad.

# 23. Checklist de handoff

> **•** Paleta Light aplicada a todos los componentes.
>
> **•** Paleta Dark aplicada a todos los componentes.
>
> **•** Logo naranja en sus variantes.
>
> **•** Home, explorar, detalle, producto, carrito y checkout.
>
> **•** Tracking Full y estados del pedido.
>
> **•** Oferta Courier de 60 segundos.
>
> **•** Reputación, ranking y pozo.
>
> **•** Merchant / Courier / Admin.
>
> **•** Loading, empty, error, offline y unavailable.
>
> **•** Responsive mobile/tablet/desktop.
>
> **•** Componentes reutilizables y variantes documentadas.
>
> **•** Estados interactivos: hover, focus, pressed, disabled.
>
> **•** Contraste y accesibilidad revisados.

# 24. Relación con la especificación de frontend

Este documento es el contrato visual y de arquitectura de pantallas. La
Especificación Integral de Frontend sigue siendo la fuente para
comportamiento, permisos, estados de negocio, modelos de vista, API y
criterios funcionales. Cuando exista una diferencia, la implementación
debe preservar el comportamiento funcional y adaptar únicamente la
presentación para seguir este nuevo lenguaje visual.

# 25. Tokens rápidos para implementación

Light  
--brand: \#FF6500; --brand-hover: \#E85A00; --brand-pressed: \#CC4F00;  
--brand-soft: \#FFF1E8; --bg: \#FFFDFB; --surface: \#FFFFFF;  
--surface-soft: \#FFF7F2; --surface-alt: \#F6F0EA;  
--text: \#111111; --text-secondary: \#6B625B; --border: \#E9E2DC;  
--success: \#22A35A; --warning: \#D97706; --error: \#D92D20; --info:
\#3B82F6;  
  
Dark  
--brand: \#FF7600; --brand-hover: \#FF8A26; --brand-pressed: \#D95E00;  
--brand-soft: \#3A2112; --bg: \#121110; --surface: \#191817;  
--surface-soft: \#211E1B; --surface-alt: \#28231F;  
--text: \#FAF8F5; --text-secondary: \#B9B0A8; --border: \#3A342F;  
--success: \#2BBE6C; --warning: \#F59E0B; --error: \#F04438; --info:
\#60A5FA;

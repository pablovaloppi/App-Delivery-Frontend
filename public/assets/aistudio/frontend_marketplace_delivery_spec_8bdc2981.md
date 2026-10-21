**MARKETPLACE LOCAL DE DELIVERY**

**Especificación de Frontend**

SRS + UX/UI + Arquitectura + API Contract + Casos de Uso\
Versiones MVP y Full

**\
Documento técnico para implementación con React + TypeScript +
Firebase\**
Última consolidación: 27 de septiembre de 2026

*\
Principio del proyecto: una experiencia simple para el usuario, una
operación transparente para comercios y cadetes, y una única fuente de
verdad en backend.*

# Índice

- 1\. Propósito y alcance del documento

- 2\. Visión de producto y principios UX

- 3\. Roles, actores y permisos

- 4\. Alcance funcional: MVP vs Full

- 5\. Arquitectura frontend

- 6\. Navegación e Information Architecture

- 7\. Design System y reglas visuales

- 8\. Requisitos funcionales de frontend --- MVP

- 9\. Requisitos funcionales de frontend --- Full

- 10\. Especificación de pantallas --- Customer

- 11\. Especificación de pantallas --- Merchant

- 12\. Especificación de pantallas --- Courier

- 13\. Especificación de pantallas --- Admin

- 14\. Estados, errores, loading y resiliencia

- 15\. API Contract consumido por el frontend

- 16\. Realtime, notificaciones y sincronización

- 17\. Tracking Full: mapa y ETA dinámico

- 18\. UX del sistema de despacho

- 19\. Reputación, ranking y pozo de recompensas

- 20\. Publicidad y posicionamiento de comercios

- 21\. Modelo de datos frontend / view models

- 22\. Casos de uso frontend

- 23\. Seguridad, privacidad y accesibilidad

- 24\. Analítica de producto y eventos

- 25\. Criterios de aceptación y Definition of Done

- 26\. Roadmap de implementación

- 27\. Reglas para Google Stitch y Google AI Studio

- 28\. Decisiones de arquitectura y temas pendientes

- 29\. Glosario

# 1. Propósito y alcance del documento

Este documento define qué debe hacer el frontend, cómo debe comportarse,
cómo debe comunicarse con el backend y cómo debe presentarse al usuario
para el marketplace local de delivery. Consolidará las decisiones de
producto tomadas durante este proyecto y servirá como contrato de
trabajo entre UX/UI, frontend, backend y las herramientas de generación
de interfaces/código.

## 1.1 Objetivo del frontend

El frontend debe convertir la lógica de negocio del backend en una
experiencia clara, rápida y predecible para cuatro actores: cliente,
comercio, cadete y administrador. El cliente debe poder comprar sin
fricción; el comercio debe operar pedidos y catálogo; el cadete debe
decidir libremente cuándo estar disponible y qué oferta aceptar; el
administrador debe controlar la operación.

## 1.2 Regla de arquitectura

Frontend = presentación + interacción + estado local + validación UX\
Backend = autoridad de identidad, permisos, precios, dinero, estados,
despacho, ranking y reglas críticas

Las validaciones del frontend mejoran la experiencia pero nunca
sustituyen las validaciones server-side. El frontend no debe permitir
editar visualmente un importe sensible y luego asumir que ese valor será
aceptado por el backend.

# 2. Visión de producto y principios UX

- Local-first: lenguaje, moneda, horarios, direcciones y soporte
  adaptados a la ciudad y al contexto argentino.

- PWA/web-first en MVP: minimizar fricción de descarga y permitir una
  experiencia instalable posteriormente.

- Mobile-first: el flujo principal se diseña primero para teléfonos;
  desktop se adapta para comercio/admin.

- Una acción primaria por pantalla: el usuario debe entender qué puede
  hacer sin buscar.

- Transparencia: precio final, tarifa de envío, propina, estado del
  pedido y criterios operativos relevantes deben ser visibles.

- Feedback inmediato: cada acción importante debe producir confirmación,
  progreso, error recuperable o cambio de estado.

- No sobrecargar: el MVP evita funciones avanzadas que no sean
  necesarias para completar un pedido real.

- Accesibilidad: contraste adecuado, tamaño táctil suficiente, labels
  explícitos y no depender solo del color.

- Consistencia: mismos estados, iconos, nombres y patrones en cliente,
  comercio, cadete y admin.

## 2.1 Propuesta de valor que la UI debe comunicar

- Para comercios: alta sin mensualidad obligatoria; pagan por vender
  según la comisión configurada.

- Para clientes: variedad local, compra simple, seguimiento claro y
  costos visibles antes de confirmar.

- Para cadetes: control de disponibilidad, libertad para aceptar o
  rechazar ofertas, 100% de propinas y reglas de asignación
  transparentes.

- Para la plataforma: eficiencia operativa, distribución equilibrada de
  oportunidades y crecimiento sostenible.

# 3. Roles, actores y permisos

  -----------------------------------------------------------------------
  **Rol**                 **Objetivo principal**  **Acciones frontend
                                                  críticas**
  ----------------------- ----------------------- -----------------------
  Customer                Descubrir, comprar y    Buscar
                          seguir pedidos          comercio/productos,
                                                  carrito, checkout,
                                                  seguimiento, historial,
                                                  valoración, perfil.

  Merchant                Vender y operar el      Gestionar pedidos,
                          catálogo                aceptar, preparar,
                                                  marcar listo,
                                                  productos, horarios,
                                                  datos del negocio.

  Courier                 Realizar entregas       Disponible/no
                                                  disponible, recibir
                                                  oferta,
                                                  aceptar/rechazar,
                                                  navegación operativa,
                                                  cambiar estados, ver
                                                  ganancias.

  Admin                   Controlar plataforma    Ver operación,
                                                  usuarios, comercios,
                                                  cadetes,
                                                  configuraciones,
                                                  incidencias y métricas.
  -----------------------------------------------------------------------

El frontend debe usar el rol provisto por la sesión/claims y mostrar
únicamente la experiencia correspondiente. Aun así, la autorización real
debe permanecer en backend/security rules.

# 4. Alcance funcional: MVP vs Full

## 4.1 MVP

- Autenticación y perfiles.

- Descubrimiento de comercios y productos.

- Carrito y checkout.

- Creación y consulta de pedidos.

- Operación de pedidos para comercio.

- Disponibilidad y despacho para cadetes.

- Cola rotativa + proximidad + skipPriority.

- Oferta de 60 segundos.

- Notificaciones básicas.

- Historial de pedidos.

- Valoraciones básicas cuando el backend habilite elegibilidad.

- Administración operativa básica.

## 4.2 Full

- Tracking GPS del cadete en tiempo real.

- Mapa y ETA dinámico con Google Maps.

- Reputación avanzada y ventana estadística.

- Ranking mensual de cadetes.

- Pozo de recompensas actualizado diariamente.

- Ranking/posicionamiento de comercios.

- Publicidad patrocinada identificada como PUBLICIDAD.

- Cupones, promociones y campañas.

- Estadísticas avanzadas.

- Soporte/disputas y señales antiabuso.

- Historial de tracking/eventos cuando corresponda.

- Arquitectura preparada para evolución multi-ciudad y algoritmos de
  distribución más sofisticados.

# 5. Arquitectura frontend

## 5.1 Stack

  -----------------------------------------------------------------------
  **Capa**                            **Tecnología/decisión**
  ----------------------------------- -----------------------------------
  UI                                  React + TypeScript + Tailwind CSS

  Build                               Vite

  Auth                                Firebase Authentication

  Datos                               Firestore / listeners realtime
                                      según caso

  Storage                             Firebase Storage

  Backend                             API REST / Cloud Functions / Cloud
                                      Run según contrato

  Push                                Firebase Cloud Messaging

  Maps Full                           Google Maps Platform

  Estado                              Estado local + server state/query
                                      cache según necesidad; evitar
                                      estado global innecesario

  PWA                                 Manifest + Service Worker +
                                      estrategia offline definida por
                                      dominio

  Testing                             Unit + integration + E2E; cubrir
                                      especialmente checkout, estados y
                                      despacho.
  -----------------------------------------------------------------------

## 5.2 Estructura recomendada

src/\
app/\
routes/\
providers/\
guards/\
components/\
ui/\
layout/\
order/\
merchant/\
courier/\
features/\
auth/\
customer/\
merchant/\
courier/\
admin/\
tracking/\
reputation/\
rewards/\
services/\
api/\
firebase/\
orders/\
merchants/\
products/\
dispatch/\
tracking/\
hooks/\
stores/\
types/\
utils/\
config/\
analytics/

## 5.3 Capas frontend

- Presentation: componentes puros y composición de pantallas.

- Feature layer: casos de uso de UI, formularios, hooks y view models.

- Services/API: llamadas al contrato backend; nunca mezclar fetch/SDK
  directamente por toda la UI.

- State: distinguir server state, sesión, estado temporal del formulario
  y estado UI.

- Guards: protección de rutas por autenticación, rol y estado del
  perfil.

- Analytics: eventos de producto definidos en un módulo central.

# 6. Navegación e Information Architecture

## 6.1 Customer --- MVP

1.  Splash/Bootstrap

2.  Login / Registro

3.  Home

4.  Categorías

5.  Listado de comercios

6.  Detalle del comercio

7.  Detalle del producto

8.  Carrito

9.  Checkout

10. Pedido creado

11. Seguimiento por estado

12. Historial

13. Detalle histórico

14. Perfil

15. Direcciones

## 6.2 Customer --- Full

- Tracking con mapa en tiempo real.

- ETA/rango de llegada.

- Valoración de comercio/producto y cadete según elegibilidad.

- Promociones/cupones.

- Banners/publicidad patrocinada.

- Favoritos y funciones de fidelización si se habilitan posteriormente.

## 6.3 Merchant

16. Login

17. Dashboard

18. Pedidos

19. Detalle de pedido

20. Productos

21. Crear/editar producto

22. Configuración de comercio

23. Horarios

24. Promociones/publicidad (Full)

25. Métricas (Full)

## 6.4 Courier

26. Login/registro

27. Dashboard de disponibilidad

28. Oferta de entrega

29. Detalle de entrega

30. Pedido en ruta

31. Historial

32. Ganancias

33. Ranking/reputación (Full)

34. Pozo de recompensas (Full)

35. Perfil/vehículo

## 6.5 Admin

36. Login

37. Dashboard

38. Pedidos

39. Detalle de pedido

40. Comercios

41. Clientes

42. Cadetes

43. Zonas

44. Configuración

45. Incidencias

46. Reputación/rankings (Full)

47. Recompensas (Full)

48. Publicidad (Full)

49. Analítica (Full)

# 7. Design System y reglas visuales

- La interfaz debe sentirse moderna, local y utilitaria; evitar
  apariencia de sistema administrativo en la experiencia del cliente.

- Customer/courier: navegación táctil, tarjetas, CTA claros, información
  compacta.

- Merchant/admin: mayor densidad de información, tablas/listas y
  filtros.

- Usar un sistema de tokens: spacing, radius, typography, shadows,
  breakpoints, iconography y semantic colors.

- Los estados semánticos deben ser consistentes: pendiente, acción
  requerida, éxito, advertencia, error, cancelado, activo/inactivo.

- No usar color como único canal para distinguir estados.

- Botones de acción destructiva o irreversible requieren confirmación
  explícita.

## 7.1 Componentes base

  -----------------------------------------------------------------------
  **Componente**                      **Uso**
  ----------------------------------- -----------------------------------
  AppShell                            Layout por rol, header, navegación
                                      y contenido.

  StatusBadge                         Estados de pedido, disponibilidad y
                                      estados secundarios.

  Money                               Formato uniforme de ARS y
                                      separación de
                                      subtotal/envío/propina/total.

  OrderTimeline                       Línea de estados y timestamps.

  OrderCard                           Resumen de pedido reutilizable.

  MerchantCard                        Descubrimiento y listado.

  ProductCard                         Catálogo.

  CartBar / CartSummary               Acceso rápido al carrito y
                                      desglose.

  CourierOfferCard                    Oferta de entrega con contador de
                                      expiración.

  AvailabilityToggle                  Disponible / No disponible.

  LocationPermissionPrompt            Permisos de ubicación del courier.

  MapView                             Tracking Full.

  ETAChip                             ETA/rango de llegada.

  RatingStars / RatingReasonTags      Reputación Full.

  RewardPoolCard                      Pozo actual, incremento y tope.

  AdLabel                             Identificación de publicidad
                                      patrocinada.

  EmptyState / ErrorState / Skeleton  Estados de carga y ausencia de
                                      datos.
  -----------------------------------------------------------------------

# 8. Requisitos funcionales de frontend --- MVP

  -------------------------------------------------------------------------------
  **ID**            **Área**          **Requisito**             **Prioridad**
  ----------------- ----------------- ------------------------- -----------------
  FR-FE-MVP-001     Bootstrap         Detectar sesión y rol     MUST
                                      antes de renderizar rutas 
                                      privadas.                 

  FR-FE-MVP-002     Auth              Mostrar errores de        MUST
                                      credenciales, sesión      
                                      expirada y cuenta         
                                      inactiva de forma         
                                      comprensible.             

  FR-FE-MVP-003     Home              Mostrar                   MUST
                                      comercios/categorías      
                                      disponibles y estado      
                                      abierto/cerrado.          

  FR-FE-MVP-004     Catalog           Mostrar precio,           MUST
                                      disponibilidad y datos    
                                      del comercio.             

  FR-FE-MVP-005     Cart              Permitir agregar/quitar   MUST
                                      cantidades y visualizar   
                                      subtotal.                 

  FR-FE-MVP-006     Checkout          Mostrar dirección, método MUST
                                      de pago, delivery,        
                                      propina y total antes de  
                                      confirmar.                

  FR-FE-MVP-007     Checkout          Enviar al backend solo    MUST
                                      productId + quantity +    
                                      datos necesarios; nunca   
                                      confiar en precios        
                                      calculados localmente.    

  FR-FE-MVP-008     Order             Mostrar número de pedido  MUST
                                      y estados actualizados.   

  FR-FE-MVP-009     Merchant          Permitir                  MUST
                                      aceptar/preparar/marcar   
                                      listo según transición    
                                      válida.                   

  FR-FE-MVP-010     Courier           Mostrar toggle            MUST
                                      Disponible/No disponible  
                                      y estado ocupado cuando   
                                      corresponda.              

  FR-FE-MVP-011     Courier           Mostrar oferta con        MUST
                                      información suficiente    
                                      para decidir.             

  FR-FE-MVP-012     Courier           Mostrar contador de 60    MUST
                                      segundos y cerrar la      
                                      oferta al expirar.        

  FR-FE-MVP-013     Courier           Permitir aceptar/rechazar MUST
                                      sin presentar el rechazo  
                                      como falta.               

  FR-FE-MVP-014     Courier           Mostrar la posición/turno SHOULD
                                      o indicación equivalente  
                                      si el producto decide     
                                      exponer la cola.          

  FR-FE-MVP-015     Customer          Mostrar confirmación,     MUST
                                      preparación, asignación y 
                                      entrega de forma          
                                      comprensible.             

  FR-FE-MVP-016     History           Permitir consultar        MUST
                                      pedidos anteriores.       

  FR-FE-MVP-017     Notifications     Mostrar notificaciones    MUST
                                      operativas y abrir el     
                                      contexto asociado.        

  FR-FE-MVP-018     Resilience        No perder carrito/estado  SHOULD
                                      temporal ante refresh     
                                      inesperado cuando sea     
                                      técnicamente viable.      
  -------------------------------------------------------------------------------

# 9. Requisitos funcionales de frontend --- Full

  ----------------------------------------------------------------------------------
  **ID**            **Área**          **Requisito**                **Prioridad**
  ----------------- ----------------- ---------------------------- -----------------
  FR-FE-FULL-001    Tracking          Mostrar mapa con ubicación   MUST
                                      activa del repartidor        
                                      vinculada al pedido.         

  FR-FE-FULL-002    Tracking          Mostrar etapa actual: hacia  MUST
                                      comercio / en comercio /     
                                      hacia cliente.               

  FR-FE-FULL-003    ETA               Mostrar ETA como rango y     MUST
                                      actualizarlo con datos       
                                      recientes.                   

  FR-FE-FULL-004    ETA               Antes del retiro, estimar    MUST
                                      tramo cadete→comercio y      
                                      preparación/espera; después  
                                      del retiro, recalcular       
                                      comercio/cadete→cliente.     

  FR-FE-FULL-005    Tracking          Detener tracking en vivo     MUST
                                      cuando la entrega finaliza o 
                                      deja de ser elegible.        

  FR-FE-FULL-006    Reputation        Permitir valoración después  MUST
                                      de que el backend marque el  
                                      pedido elegible.             

  FR-FE-FULL-007    Reputation        Mostrar tags de motivos de   SHOULD
                                      valoración cuando estén      
                                      disponibles.                 

  FR-FE-FULL-008    Ranking           Mostrar ranking mensual de   MUST
                                      cadetes y reglas visibles.   

  FR-FE-FULL-009    Rewards           Mostrar pozo actual, aumento MUST
                                      diario, objetivo y tope.     

  FR-FE-FULL-010    Rewards           No prometer importes         MUST
                                      definitivos antes del cierre 
                                      mensual cuando el backend    
                                      los marque como estimados.   

  FR-FE-FULL-011    Merchant ranking  Mostrar señales de           MUST
                                      reputación/posicionamiento   
                                      cuando corresponda, sin      
                                      mezclar publicidad con       
                                      reputación.                  

  FR-FE-FULL-012    Advertising       Mostrar placements           MUST
                                      patrocinados con etiqueta    
                                      PUBLICIDAD.                  

  FR-FE-FULL-013    Promotions        Aplicar cupones/promociones  MUST
                                      a través de respuestas       
                                      backend; evitar recalcular   
                                      reglas en cliente.           

  FR-FE-FULL-014    Support           Permitir reportar un         MUST
                                      incidente y consultar su     
                                      estado.                      

  FR-FE-FULL-015    Analytics         Registrar eventos de funnel, SHOULD
                                      despacho, tracking y         
                                      recompensas sin datos        
                                      personales innecesarios.     
  ----------------------------------------------------------------------------------

# 10. Especificación de pantallas --- Customer

## 10.1 Home

- Header con ubicación/dirección activa.

- Búsqueda.

- Categorías.

- Comercios abiertos.

- Promociones/ads Full claramente etiquetados.

- Cards con nombre, categoría, disponibilidad y señales relevantes.

## 10.2 Merchant Detail

- Nombre/logo/cover.

- Estado abierto/cerrado.

- Tiempo estimado de preparación si está disponible.

- Categorías internas.

- Productos.

- Información de delivery según zona.

- CTA para agregar producto.

## 10.3 Product Detail

- Imagen, nombre, descripción, precio vigente.

- Disponibilidad.

- Cantidad.

- CTA agregar.

## 10.4 Cart

- Resumen de items.

- Editar cantidades.

- Subtotal.

- Avisos de producto no disponible o cambio de precio detectado al
  confirmar.

## 10.5 Checkout

- Dirección elegida.

- Tipo de entrega disponible: platform / merchant / pickup.

- Método de pago.

- Propina al 100% para el cadete cuando exista servicio de delivery.

- Delivery fee.

- Total final.

- Botón confirmar pedido.

- Estado de procesamiento y prevención de doble submit.

## 10.6 Order Tracking MVP

Pedido #1042\
\
✓ Pedido recibido\
✓ Comercio preparando\
✓ Pedido listo\
● Repartidor asignado\
○ En camino\
○ Entregado\
\
\[Estado actual + timestamp + próxima acción\]

# 11. Especificación de pantallas --- Merchant

## 11.1 Dashboard

- Pedidos pendientes de acción.

- Pedidos en preparación.

- Pedidos listos.

- Resumen del día.

- Estado del comercio.

- Alertas de productos/horarios.

## 11.2 Order Detail

- Items y cantidades.

- Notas del cliente.

- Importes.

- Tipo de entrega.

- CTA de transición válida.

- Indicador de cadete cuando esté asignado.

- Historial/eventos resumidos cuando sea útil.

## 11.3 Catalog

- Listado por categoría.

- Disponibilidad toggle.

- Precio.

- Crear/editar.

- Subida de imagen.

- Confirmación antes de acciones destructivas.

## 11.4 Full

- Métricas.

- Promociones.

- Publicidad.

- Reputación y comentarios elegibles.

- Posicionamiento orgánico vs placement patrocinado claramente
  diferenciado.

# 12. Especificación de pantallas --- Courier

## 12.1 Dashboard

- Toggle principal Disponible / No disponible.

- Estado actual: disponible, ocupado, fuera de servicio.

- Pedido activo si existe.

- Ganancias resumidas.

- En Full: ranking y pozo.

## 12.2 Oferta de entrega

La oferta es una pantalla/overlay prioritaria. Debe mostrar la
información suficiente para que el cadete decida aceptar o rechazar sin
abrir múltiples pantallas.

  -----------------------------------------------------------------------
  **Dato**                            **Mostrar**
  ----------------------------------- -----------------------------------
  Comercio                            Nombre y punto de retiro

  Cliente                             Zona/dirección necesaria para
                                      decidir, respetando privacidad

  Distancia                           Distancia relevante

  ETA                                 Estimación de viaje cuando esté
                                      disponible

  Pago                                Pago al cadete

  Propina                             Solo si existe y el backend permite
                                      mostrarla antes según la regla de
                                      negocio

  Temporizador                        Cuenta regresiva de 60 s

  Acciones                            Aceptar / Rechazar
  -----------------------------------------------------------------------

## 12.3 Flujo después de aceptar

ASSIGNED\
↓\
PICKUP / llegar al comercio\
↓\
PICKED_UP\
↓\
ON_THE_WAY\
↓\
DELIVERED\
↓\
Queue position → final\
skipPriority → 0 si correspondía

## 12.4 Reglas UX de libertad

- No mostrar "tenés que aceptar".

- No usar mensajes culpabilizantes por rechazar.

- El toggle de disponibilidad debe ser reversible y visible.

- Explicar en lenguaje simple cómo funciona la asignación si se publica
  la ayuda de cadetes.

- La reputación no debe mostrar que un rechazo/timeout fue una falta,
  porque no lo es según la regla de producto.

# 13. Especificación de pantallas --- Admin

- Dashboard operativo con pedidos activos.

- Filtros por estado/ciudad/comercio/cadete.

- Detalle de pedido con timeline.

- Gestión de usuarios/comercios/cadetes.

- Zonas y configuraciones.

- Incidencias.

- Full: reputación, ranking, pozo, publicidad, métricas y auditoría.

# 14. Estados, errores, loading y resiliencia

## 14.1 Estados globales

  -----------------------------------------------------------------------
  **Estado**                          **UX requerida**
  ----------------------------------- -----------------------------------
  Loading                             Skeleton o indicador contextual; no
                                      bloquear toda la app
                                      innecesariamente.

  Empty                               Explicar por qué está vacío y cuál
                                      es la siguiente acción.

  Error                               Mensaje humano + acción de
                                      reintento; conservar contexto si es
                                      posible.

  Offline                             Banner persistente; evitar acciones
                                      críticas cuando no hay confirmación
                                      backend.

  Session expired                     Renovar sesión o llevar a login
                                      preservando intención cuando sea
                                      seguro.

  Permission denied                   Explicar que la acción no está
                                      autorizada sin filtrar detalles
                                      internos.

  Conflict                            Indicar que el estado cambió y
                                      refrescar desde servidor.

  Timeout                             No asumir éxito;
                                      consultar/confirmar estado real.
  -----------------------------------------------------------------------

## 14.2 Pedidos --- máquina de estados

PENDING → ACCEPTED → PREPARING → READY_FOR_PICKUP → ASSIGNED → PICKED_UP
→ ON_THE_WAY → DELIVERED\
\
Alternativas: REJECTED / CANCELLED

El frontend debe habilitar únicamente acciones que el backend pueda
aceptar para el estado/rol actual. Si el backend devuelve un conflicto,
la UI debe sincronizar el pedido en lugar de intentar forzar la
transición.

# 15. API Contract consumido por el frontend

El contrato siguiente es una representación de interfaz. Los nombres
exactos pueden ajustarse en el OpenAPI definitivo, pero el frontend debe
consumir operaciones separadas por dominio y respuestas versionadas.

## 15.1 Auth / User

  --------------------------------------------------------------------------
  **Método**              **Endpoint**               **Frontend usage**
  ----------------------- -------------------------- -----------------------
  GET                     /api/v1/me                 Bootstrap de sesión,
                                                     rol y perfil

  PATCH                   /api/v1/me                 Editar perfil

  GET                     /api/v1/me/addresses       Listar direcciones

  POST                    /api/v1/me/addresses       Crear dirección

  PATCH                   /api/v1/me/addresses/:id   Editar dirección

  DELETE                  /api/v1/me/addresses/:id   Eliminar dirección
  --------------------------------------------------------------------------

## 15.2 Merchant / Catalog

  --------------------------------------------------------------------------------------------
  **Método**              **Endpoint**                                 **Frontend usage**
  ----------------------- -------------------------------------------- -----------------------
  GET                     /api/v1/merchants                            Home/listados

  GET                     /api/v1/merchants/:id                        Detalle comercio

  GET                     /api/v1/merchants/:id/products               Catálogo

  GET                     /api/v1/products/:id                         Producto

  POST                    /api/v1/merchant/products                    Crear producto

  PATCH                   /api/v1/merchant/products/:id                Editar producto

  PATCH                   /api/v1/merchant/products/:id/availability   Disponibilidad
  --------------------------------------------------------------------------------------------

## 15.3 Orders

  ---------------------------------------------------------------------------------------
  **Método**              **Endpoint**                            **Frontend usage**
  ----------------------- --------------------------------------- -----------------------
  POST                    /api/v1/orders                          Crear pedido

  GET                     /api/v1/orders/:id                      Detalle

  GET                     /api/v1/orders/:id/events               Timeline

  GET                     /api/v1/customer/orders                 Historial cliente

  GET                     /api/v1/merchant/orders                 Bandeja comercio

  GET                     /api/v1/courier/orders                  Pedidos del cadete

  POST                    /api/v1/orders/:id/actions/accept       Acción de comercio
                                                                  cuando corresponda

  POST                    /api/v1/orders/:id/actions/prepare      Cambiar a preparación

  POST                    /api/v1/orders/:id/actions/ready        Marcar listo

  POST                    /api/v1/orders/:id/actions/pickup       Retirar

  POST                    /api/v1/orders/:id/actions/on-the-way   Iniciar viaje al
                                                                  cliente

  POST                    /api/v1/orders/:id/actions/deliver      Completar entrega

  POST                    /api/v1/orders/:id/cancel               Cancelar si permitido
  ---------------------------------------------------------------------------------------

## 15.4 Courier / Dispatch

  -----------------------------------------------------------------------------------
  **Método**              **Endpoint**                        **Frontend usage**
  ----------------------- ----------------------------------- -----------------------
  PATCH                   /api/v1/courier/availability        Toggle disponible/no
                                                              disponible

  GET                     /api/v1/courier/dashboard           Resumen del cadete

  GET                     /api/v1/courier/offers/current      Oferta activa

  POST                    /api/v1/courier/offers/:id/accept   Aceptar

  POST                    /api/v1/courier/offers/:id/reject   Rechazar

  POST                    /api/v1/courier/location            Actualizar ubicación;
                                                              Full

  GET                     /api/v1/courier/earnings            Ganancias

  GET                     /api/v1/courier/ranking             Ranking; Full

  GET                     /api/v1/courier/rewards/pool        Pozo; Full
  -----------------------------------------------------------------------------------

## 15.5 Response envelope

{\
\"data\": { \... },\
\"meta\": {\
\"requestId\": \"\...\",\
\"serverTime\": \"\...\"\
},\
\"error\": null\
}

## 15.6 Error contract

{\
\"data\": null,\
\"meta\": { \"requestId\": \"\...\", \"serverTime\": \"\...\" },\
\"error\": {\
\"code\": \"ORDER_STATE_CONFLICT\",\
\"message\": \"El pedido cambió de estado.\",\
\"details\": { \"currentStatus\": \"READY_FOR_PICKUP\" }\
}\
}

Los códigos son estables para el frontend; los mensajes pueden cambiar y
deben ser amigables. El frontend debe mapear códigos conocidos a UX
específica y mantener un fallback genérico.

# 16. Realtime, notificaciones y sincronización

## 16.1 Principio

La UI de operación y tracking debe actualizarse por eventos del backend,
no por suposiciones locales. Cuando una acción se envía, el frontend
puede mostrar estado optimista solo donde no exista riesgo de
interpretar como confirmada una operación crítica.

## 16.2 Fuentes de actualización

- Firestore listeners para entidades apropiadas.

- FCM para despertar/avisar al dispositivo.

- Refresh controlado de API cuando una notificación indique un cambio.

- Polling solo como fallback cuando realtime no sea viable.

## 16.3 Pedidos

order.updated\
order.offer.created\
order.offer.expired\
order.assigned\
order.status_changed\
order.cancelled\
order.delivered

# 17. Tracking Full: mapa y ETA dinámico

Esta funcionalidad toma inspiración del patrón de seguimiento de grandes
marketplaces: el comprador puede observar en cada momento el progreso
del pedido y la ubicación del repartidor durante una entrega activa.

## 17.1 Dos tramos

TRAMO A: Repartidor → Comercio\
TRAMO B: Comercio/Repartidor → Cliente\
\
Antes de retirar:\
ETA total ≈ ETA tramo A + preparación/espera + ETA tramo B\
\
Después de retirar:\
ETA total ≈ ETA repartidor → Cliente

## 17.2 UI

- Mapa centrado automáticamente en repartidor y destino, con opción de
  recentrar manualmente.

- Marcadores claros para comercio, repartidor y cliente.

- Línea de ruta cuando la API de mapas la provea.

- Banner "Tu pedido está en camino".

- ETA mostrado como rango; no falsa precisión de minuto exacto.

- Distancia restante y última actualización cuando aporte valor.

- Timeline sincronizado con el mapa.

- Indicador de GPS desactualizado si el último update supera el umbral.

- Fallback a estado textual si mapas/GPS fallan.

## 17.3 Datos frontend

tracking: {\
courierId: string\
phase: \"TO_MERCHANT\" \| \"AT_MERCHANT\" \| \"TO_CUSTOMER\"\
etaSeconds: number \| null\
etaMinSeconds: number \| null\
etaMaxSeconds: number \| null\
distanceMeters: number \| null\
lastUpdatedAt: Timestamp\
}\
\
location: {\
latitude: number\
longitude: number\
heading: number \| null\
accuracy: number \| null\
updatedAt: Timestamp\
}

## 17.4 Cadencia

La aplicación del cadete puede emitir ubicación periódicamente mientras
exista una entrega activa. El backend decide la frecuencia efectiva,
persistencia y cuándo solicitar nuevas estimaciones a Maps. El cliente
comprador no debe asumir una precisión superior a la que indiquen
timestamp y accuracy.

## 17.5 Privacidad

- Solo mostrar ubicación durante un pedido activo y elegible.

- No exponer tracking histórico del cadete al cliente.

- Al completar/cancelar la entrega, detener el tracking en vivo.

- No mostrar coordenadas crudas si una representación de mapa basta.

# 18. UX del sistema de despacho

## 18.1 Regla de negocio visible

Conceptualmente: "La cola organiza las oportunidades; la proximidad
reduce la demora; skipPriority compensa saltos repetidos por
proximidad". El texto exacto debe ser simple y no revelar detalles
internos innecesarios.

## 18.2 Flujo del cadete

Disponible\
↓\
Nueva oferta\
↓ 60 segundos\
┌──────────┬──────────┐\
│ Aceptar │ Rechazar │\
└────┬─────┴──────────┘\
│\
↓\
Asignado\
↓\
Completa\
↓\
Final de cola\
↓\
skipPriority = 0 si correspondía

## 18.3 UX ante timeout

- Cerrar automáticamente la oferta.

- Mostrar "Oferta vencida".

- No mostrar penalización de reputación.

- No impedir volver a recibir una oferta elegible según las reglas de
  disponibilidad/cola.

- Actualizar dashboard desde backend.

## 18.4 UX ante conflicto de aceptación

Si dos procesos intentan asignar el mismo pedido, solo el backend
determina el ganador. El frontend debe mostrar "La oferta ya no está
disponible" y recuperar el estado actual sin presentar un error técnico.

# 19. Reputación, ranking y pozo de recompensas

## 19.1 Reputación

- El cliente puede valorar el cadete después de una entrega elegible.

- Una mala valoración aislada no debe aparecer en la UI como una condena
  automática.

- La reputación Full puede mostrar promedio, cantidad de valoraciones y
  distribución si el backend lo habilita.

- La ventana estadística debe ser definida por backend; una referencia
  inicial discutida es una ventana móvil de las últimas 100 entregas
  calificadas.

- Los tags de motivo ayudan a identificar patrones.

## 19.2 Ranking mensual

- Mostrar período vigente.

- Mostrar posición individual y métricas relevantes.

- Mostrar reglas y requisitos mínimos de actividad.

- No diseñar el ranking como "más pedidos = ganador".

- No presentar una predicción de premio como definitivo hasta el cierre
  backend.

## 19.3 Pozo diario

🏆 Pozo actual: \$51.500\
📈 +\$5.200 hoy\
🎯 Próximo objetivo: \$100.000\
💰 Tope: \$175.000

El monto definitivo se liquida al cierre mensual. Durante el mes la UI
lo debe marcar como actual/estimado según el campo del backend. La
distribución máxima de referencia discutida es: 1° ARS 100.000, 2° ARS
50.000, 3° ARS 25.000, total ARS 175.000, siempre sujeto a la fórmula
definitiva y al backend.

## 19.4 Estados de premio

- Acumulando.

- Cierre pendiente.

- Liquidación confirmada.

- Pagado.

- Ajustado/anulado cuando exista una corrección legítima.

# 20. Publicidad y posicionamiento de comercios

Full separa estrictamente reputación, relevancia orgánica y publicidad.
La publicidad comprada no debe fingir ser reputación ni recomendación
orgánica.

- Placement patrocinado con etiqueta visible "PUBLICIDAD".

- No alterar la puntuación de reputación por pagar anuncios.

- La UI puede mostrar una mezcla de resultados orgánicos y patrocinados
  si el backend lo determina, pero debe hacer el sponsorship
  identificable.

- Merchant puede ver impresiones/clics/campañas en Full.

- Customer no necesita conocer la fórmula interna del ranking, pero debe
  entender cuando un resultado es patrocinado.

# 21. Modelo de datos frontend / View Models

El frontend puede utilizar modelos propios para no acoplar componentes
directamente al documento Firestore o al payload crudo de API.

type OrderViewModel = {\
id: string;\
orderNumber: number;\
merchantName: string;\
items: OrderItemVM\[\];\
subtotal: Money;\
deliveryFee: Money;\
tip: Money;\
total: Money;\
status: OrderStatus;\
deliveryType: DeliveryType;\
timestamps: OrderTimeline;\
tracking?: TrackingViewModel;\
};\
\
type CourierOfferVM = {\
id: string;\
expiresAt: string;\
secondsRemaining: number;\
merchantName: string;\
distanceMeters?: number;\
etaSeconds?: number;\
courierPayment: Money;\
};

## 21.1 Money

type Money = { amount: number; currency: \"ARS\" };

El componente Money debe centralizar formato, separadores, símbolo y
reglas de presentación. Nunca concatenar importes manualmente por toda
la aplicación.

# 22. Casos de uso frontend

  ------------------------------------------------------------------------------------
  **ID**            **Caso**          **Flujo**                 **Resultado**
  ----------------- ----------------- ------------------------- ----------------------
  UC-01             Cliente crea un   Login → comercio →        Pedido visible con
                    pedido            producto → carrito →      número y estado.
                                      checkout → confirmar →    
                                      pedido PENDING/estado     
                                      siguiente devuelto por    
                                      backend.                  

  UC-02             Comercio procesa  Dashboard → abrir pedido  Timeline actualizado.
                    pedido            → aceptar/preparar/listo. 

  UC-03             Cadete se conecta Dashboard → toggle        Estado available
                                      Disponible.               confirmado por
                                                                backend.

  UC-04             Cadete recibe     Push/realtime → modal     Oferta cerrada y
                    oferta            oferta → contador 60s →   estado sincronizado.
                                      aceptar/rechazar.         

  UC-05             Cadete completa   Pedido activo → retiro →  Pedido DELIVERED y
                    entrega           en camino → entregar.     rotación de cola
                                                                backend.

  UC-06             Cliente sigue     Abrir pedido activo →     Estado/ubicación/ETA
                    pedido            timeline; Full            sincronizados.
                                      mapa+GPS+ETA.             

  UC-07             Cliente valora    Pedido elegible →         Rating aceptado y
                                      pantalla valoración →     estado de review
                                      enviar.                   confirmado.

  UC-08             Cadete consulta   Dashboard Full → ranking. Posición, período y
                    ranking                                     métricas visibles.

  UC-09             Cadete consulta   Dashboard Full → rewards. Pozo actual, +hoy,
                    pozo                                        objetivo y tope.

  UC-10             Merchant crea     Productos → nuevo →       Producto creado por
                    producto          formulario → guardar.     backend y aparece en
                                                                catálogo.

  UC-11             Admin investiga   Incidencias → detalle →   Caso actualizado.
                    incidente         timeline/eventos →        
                                      acción.                   
  ------------------------------------------------------------------------------------

# 23. Seguridad, privacidad y accesibilidad

## 23.1 Seguridad

- No colocar secretos/API keys de servidor en repositorio ni bundle
  frontend.

- Respetar Firebase Auth/claims y expiración de sesión.

- No confiar en IDs enviados desde componentes para definir
  autorización.

- Sanitizar contenido mostrado cuando provenga de usuarios.

- No almacenar datos sensibles innecesarios en localStorage.

- Evitar logs con teléfonos, direcciones completas o tokens.

- Usar HTTPS y configuración segura de CORS/headers donde aplique.

## 23.2 Privacidad del tracking

- Solicitar permiso de ubicación solo al cadete cuando sea necesario.

- Explicar por qué se utiliza la ubicación durante la entrega.

- Cortar sharing al finalizar la entrega.

- No reutilizar la ubicación para fines no definidos sin una regla de
  producto/privacidad correspondiente.

## 23.3 Accesibilidad

- Targets táctiles cómodos.

- Focus visible en navegación teclado.

- Labels accesibles para inputs y botones.

- ARIA solo cuando sea necesario.

- Mensajes de error asociados al campo.

- No depender únicamente de color.

- Compatibilidad razonable con lectores de pantalla en flujos críticos.

# 24. Analítica de producto y eventos

  -----------------------------------------------------------------------
  **Evento**              **Rol**                 **Propósito**
  ----------------------- ----------------------- -----------------------
  signup_completed        Todos                   Conversión

  merchant_viewed         Customer                Descubrimiento

  product_added_to_cart   Customer                Funnel

  checkout_started        Customer                Funnel

  order_create_clicked    Customer                Intento de compra

  order_created           Customer                Conversión

  offer_received          Courier                 Despacho

  offer_accepted          Courier                 Aceptación

  offer_rejected          Courier                 Decisión

  offer_expired           Courier                 Timeout

  delivery_completed      Courier                 Operación

  tracking_viewed         Customer                Uso Full

  rating_submitted        Customer                Reputación

  reward_pool_viewed      Courier                 Engagement Full

  ad_clicked              Customer                Publicidad Full
  -----------------------------------------------------------------------

Los eventos deben evitar incluir PII innecesaria. El identificador de
pedido puede ser un ID técnico no reversible para analítica, si el
diseño de privacidad así lo define.

# 25. Criterios de aceptación y Definition of Done

## 25.1 Criterios transversales

- La pantalla funciona en viewport móvil y desktop correspondiente.

- Cada estado relevante tiene loading/empty/error/success.

- No hay doble submit en acciones críticas.

- Los errores de backend tienen mapping a UX.

- El refresh no deja al usuario en un estado falso.

- El frontend refleja el estado del backend después de una acción.

- Las rutas privadas están protegidas.

- Eventos analytics críticos están instrumentados donde corresponda.

- Accesibilidad básica validada en flujos principales.

## 25.2 Acceptance criteria --- checkout

- El cliente puede revisar subtotal, delivery, propina y total.

- Al confirmar, el botón se bloquea mientras se procesa.

- Si cambia un precio o producto en backend, se informa y no se crea un
  pedido inconsistente.

- Tras éxito, navega a pedido creado.

- Tras timeout/conflicto, consulta estado real y no muestra éxito falso.

## 25.3 Acceptance criteria --- oferta courier

- Aparece solo para cadete elegible.

- Muestra countdown basado en servidor tanto como sea posible.

- Aceptar y rechazar son acciones distintas y explícitas.

- Tras expirar, no se puede aceptar.

- Un segundo intento recibe conflicto manejable.

- El rechazo no se presenta como penalización de reputación.

## 25.4 Acceptance criteria --- tracking Full

- Mapa muestra ubicación reciente durante entrega activa.

- ETA cambia cuando backend lo recalcula.

- Se distinguen tramo hacia comercio y tramo hacia cliente.

- Cuando el GPS está desactualizado se informa.

- Cuando Maps falla, queda disponible el estado textual.

- Al entregar, la ubicación deja de mostrarse en vivo.

# 26. Roadmap de implementación

  ----------------------------------------------------------------------------------
  **Fase**                **Objetivo**            **Entregables**
  ----------------------- ----------------------- ----------------------------------
  F0                      Foundations             Repo, TypeScript, Tailwind,
                                                  routing, Auth bootstrap, design
                                                  tokens, error boundaries, API
                                                  client.

  F1                      Customer MVP            Home, merchant list/detail,
                                                  product, cart, checkout, order
                                                  creation, history.

  F2                      Merchant MVP            Dashboard, orders, state
                                                  transitions, catalog, settings.

  F3                      Courier MVP             Availability, offer UI, 60s timer,
                                                  delivery state flow, earnings
                                                  basic.

  F4                      Realtime MVP            Order listeners, notifications,
                                                  conflict handling, operational
                                                  polish.

  F5                      Admin MVP               Orders/users/merchants/couriers,
                                                  basic configuration and incident
                                                  view.

  F6                      Full Tracking           GPS, map, route, ETA, location
                                                  privacy, realtime tracking.

  F7                      Full Reputation         Ratings, reasons, rolling
                                                  reputation, ranking.

  F8                      Full Rewards            Daily pool, targets, monthly
                                                  close, payout states.

  F9                      Full Growth             Ads, promotions, advanced
                                                  analytics, support/disputes,
                                                  anti-abuse UX.
  ----------------------------------------------------------------------------------

# 27. Reglas para Google Stitch y Google AI Studio

## 27.1 Para Stitch

- Generar primero mobile-first para Customer y Courier.

- No generar todas las pantallas como una sola pieza; trabajar por
  módulo y rol.

- Mantener componentes y tokens consistentes.

- Diseñar explícitamente estados loading/empty/error/success.

- Diseñar tamaños de texto y touch targets reales.

- Separar componentes reutilizables de pantallas específicas.

- Los datos deben representarse como contenido dinámico, no como textos
  hardcodeados.

## 27.2 Para Google AI Studio

- Implementar por fases del roadmap, no pedir la aplicación completa de
  una vez.

- Entregar primero tipos y API client antes de construir flujos que
  dependan del contrato.

- No cambiar contratos backend sin registrar el cambio.

- No poner reglas económicas o de despacho en componentes React.

- No inventar respuestas del backend para ocultar errores.

- Agregar tests cuando se implemente una regla crítica.

- Usar feature flags/configuración para funciones Full en desarrollo.

## 27.3 Artefactos de trabajo recomendados

DESIGN.md → contrato visual\
API.md / openapi → contrato API\
FRONTEND_SRS.md → este documento\
backend spec → reglas de negocio\
ADR/ → decisiones arquitectónicas\
.env.example → variables de entorno\
README.md → setup y ejecución

# 28. Decisiones de arquitectura y temas pendientes

## 28.1 Decisiones consolidadas

- MVP web/PWA y mobile-first.

- Backend autoritativo para dinero y estados.

- Cola de oportunidades para cadetes.

- Proximidad como optimizador de demora.

- skipPriority como compensación binaria para saltos por proximidad.

- Cadete que completa vuelve al final de la cola.

- Oferta inicial de 60 segundos.

- Rechazo/timeout no reduce reputación.

- Full agrega tracking GPS + Maps + ETA dinámico.

- Pozo se actualiza diariamente y se liquida al cierre del mes.

- Publicidad separada de reputación.

## 28.2 Temas que deben definirse antes de producción

- Fórmula exacta del pozo: porcentaje, base elegible, límites y ajustes.

- Umbrales concretos de distancia/radio de despacho.

- Cómo tratar cadetes demasiado lejos sin alterar injustamente la cola.

- Cadencia definitiva de GPS y presupuesto de Maps.

- Proveedor y UX de pagos online si se incorpora.

- Política definitiva de cancelaciones/refunds.

- Ventana exacta de valoración y reglas antiabuso.

- Copy/legal final de privacidad, tracking y términos.

- Definición final de ranking de comercios y criterios de sponsored
  placement.

# 29. Glosario

  -----------------------------------------------------------------------
  **Término**                         **Definición**
  ----------------------------------- -----------------------------------
  MVP                                 Versión mínima operable para
                                      validar pedidos reales.

  Full                                Versión ampliada con tracking,
                                      reputación, recompensas y funciones
                                      de crecimiento.

  Dispatch                            Motor que determina a quién ofrecer
                                      una entrega.

  Queue                               Orden rotativo de oportunidad entre
                                      cadetes disponibles.

  skipPriority                        Marca binaria que compensa a un
                                      cadete saltado por proximidad.

  Courier offer                       Oferta temporal de una entrega a un
                                      cadete.

  ETA                                 Estimated Time of Arrival / tiempo
                                      estimado de llegada.

  Tracking                            Seguimiento de ubicación/progreso
                                      de una entrega.

  View Model                          Modelo específico de frontend para
                                      presentar datos.

  Server authoritative                Regla según la cual backend es la
                                      fuente de verdad.

  Pozo                                Fondo económico acumulado para
                                      recompensas del ranking mensual.

  Sponsored placement                 Ubicación comercial paga, marcada
                                      como PUBLICIDAD.

  Order Event                         Evento auditable asociado a un
                                      pedido.
  -----------------------------------------------------------------------

# Apéndice A --- Contrato conceptual de estado por rol

  --------------------------------------------------------------------------------------
  **Estado pedido**  **Customer**        **Merchant**   **Courier**       **Admin**
  ------------------ ------------------- -------------- ----------------- --------------
  PENDING            Ver                 Acción         ---               Ver
                                         requerida                        

  ACCEPTED           Ver                 Preparar       ---               Ver

  PREPARING          Ver                 Preparar       ---               Ver

  READY_FOR_PICKUP   Ver                 Ver            Oferta/espera     Ver

  ASSIGNED           Ver                 Ver            Aceptar/activo    Ver

  PICKED_UP          Ver                 Ver            Activo            Ver

  ON_THE_WAY         Tracking            Ver            Activo            Tracking

  DELIVERED          Valorar/Historial   Historial      Cierre/ganancia   Historial

  CANCELLED          Ver motivo          Ver motivo     Ver motivo        Gestionar
  --------------------------------------------------------------------------------------

# Apéndice B --- Diagrama conceptual de la experiencia

CUSTOMER\
Home → Merchant → Product → Cart → Checkout → Order → Tracking → Rating\
│\
└── Full: Map + GPS + ETA\
\
MERCHANT\
Dashboard → Orders → Accept → Prepare → Ready → \[handoff\] →
Metrics/Ads (Full)\
\
COURIER\
Dashboard → Disponible → Offer(60s) → Accept/Reject → Pickup → On the
way → Deliver → Queue End\
│\
├── skipPriority=1 si fue saltado previamente\
└── al completar con prioridad: skipPriority=0\
\
ADMIN\
Dashboard → Orders / Merchants / Couriers / Users / Zones / Incidents /
Full Analytics

**FIN DEL DOCUMENTO**

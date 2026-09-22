export const locales = ['es', 'en', 'pt'] as const;
export type Locale = typeof locales[number];
export const catalog = [
 {id:'sim-swap',name:'SIM Swap',operations:['Check','Retrieve Date'],copy:{
 es:['Detectá cambios de SIM asociados a una línea y consultá cuándo ocurrió el último cambio.','Evaluar una señal de riesgo antes de autorizar una recuperación de cuenta.'],
 en:['Check for SIM changes associated with a line and retrieve the date of the latest change.','Assess a risk signal before authorizing account recovery.'],
 pt:['Verifique alterações de SIM associadas a uma linha e consulte a data da última alteração.','Avaliar um sinal de risco antes de autorizar a recuperação de uma conta.']}},
 {id:'number-verification',name:'Number Verification',operations:['Verify','Device Phone Number'],copy:{
 es:['Verificá la relación entre un número de teléfono y el dispositivo conectado, o consultá el número del dispositivo.','Reducir fricción al comprobar el número de un usuario durante el registro.'],
 en:['Verify the relationship between a phone number and the connected device, or retrieve the device phone number.','Reduce friction when checking a user’s phone number during registration.'],
 pt:['Verifique a relação entre um número de telefone e o dispositivo conectado, ou consulte o número do dispositivo.','Reduzir etapas ao verificar o número de um usuário durante o cadastro.']}},
 {id:'device-swap',name:'Device Swap',operations:['Check','Retrieve Date'],copy:{
 es:['Consultá si una línea cambió de dispositivo y la fecha del último cambio.','Incorporar un cambio reciente de dispositivo a la evaluación de una operación sensible.'],
 en:['Check whether a line has changed devices and retrieve the date of the latest change.','Include a recent device change in the assessment of a sensitive transaction.'],
 pt:['Verifique se uma linha mudou de dispositivo e consulte a data da última alteração.','Considerar uma troca recente de dispositivo na avaliação de uma operação sensível.']}},
 {id:'location-verification',name:'Location Verification',operations:['Location Verification'],copy:{
 es:['Comprobá si la ubicación de un dispositivo coincide con un área indicada.','Contrastar la ubicación esperada de una entrega con una señal de la red.'],
 en:['Check whether a device’s location matches a specified area.','Compare an expected delivery location with a network signal.'],
 pt:['Verifique se a localização de um dispositivo corresponde a uma área indicada.','Comparar a localização esperada de uma entrega com um sinal da rede.']}},
 {id:'location-retrieval',name:'Location Retrieval',operations:['Location Retrieval'],copy:{
 es:['Consultá información de ubicación de un dispositivo a través de la red móvil.','Aportar contexto de ubicación a un flujo de asistencia autorizado.'],
 en:['Retrieve device location information through the mobile network.','Add location context to an authorized assistance workflow.'],
 pt:['Consulte informações de localização de um dispositivo por meio da rede móvel.','Adicionar contexto de localização a um fluxo de assistência autorizado.']}},
 {id:'device-status',name:'Device Status',operations:['Connectivity','Roaming'],copy:{
 es:['Consultá el estado de conectividad de un dispositivo y si se encuentra en roaming.','Adaptar un flujo de comunicación al estado de conexión del usuario.'],
 en:['Check a device’s connectivity status and whether it is roaming.','Adapt a communication workflow to the user’s connection status.'],
 pt:['Consulte o estado de conectividade de um dispositivo e se ele está em roaming.','Adaptar um fluxo de comunicação ao estado de conexão do usuário.']}},
 {id:'know-your-customer',name:'Know Your Customer',operations:['Match','Tenure','Fill-In'],copy:{
 es:['Contrastá datos del cliente, consultá la antigüedad de su relación con la línea y facilitá el completado de datos.','Apoyar un proceso de alta con comprobaciones de identidad y datos autorizados.'],
 en:['Match customer details, check the tenure of their relationship with a line and support filling in customer data.','Support onboarding with identity checks and authorized data.'],
 pt:['Compare dados do cliente, consulte o tempo de vínculo com a linha e facilite o preenchimento de dados.','Apoiar um processo de cadastro com verificações de identidade e dados autorizados.']}},
 {id:'quality-on-demand',name:'Quality on Demand',operations:['Quality on Demand'],copy:{
 es:['Solicitá un perfil de calidad de conectividad para una sesión de aplicación.','Explorar una experiencia de videocomunicación que requiera condiciones de red específicas.'],
 en:['Request a connectivity quality profile for an application session.','Explore a video communication experience that requires specific network conditions.'],
 pt:['Solicite um perfil de qualidade de conectividade para uma sessão de aplicação.','Explorar uma experiência de comunicação por vídeo que exija condições específicas de rede.']}},
 {id:'one-time-password-sms',name:'One-Time Password SMS',operations:['One-Time Password SMS'],copy:{
 es:['Incorporá la entrega y comprobación de códigos de un solo uso por SMS en un flujo de verificación.','Validar el acceso a un número durante una acción de verificación.'],
 en:['Use delivery and checking of one-time codes by SMS in a verification workflow.','Validate access to a phone number during a verification step.'],
 pt:['Inclua a entrega e verificação de códigos de uso único por SMS em um fluxo de verificação.','Validar o acesso a um número durante uma etapa de verificação.']}},
 {id:'sms',name:'SMS',operations:['SMS'],copy:{
 es:['Integrá el envío de mensajes de texto en las comunicaciones de tu aplicación.','Enviar una notificación transaccional solicitada por el usuario.'],
 en:['Integrate text messaging into your application’s communications.','Send a transactional notification requested by the user.'],
 pt:['Integre o envio de mensagens de texto às comunicações da sua aplicação.','Enviar uma notificação transacional solicitada pelo usuário.']}}
] as const;
export type ApiId = typeof catalog[number]['id'];
export type Intent = 'apis' | 'demo';
export const paths = ['', 'developers/', 'operators/', 'apis/', ...catalog.map(a=>`apis/${a.id}/`), 'contact/apis/', 'contact/demo/', 'privacy/', '404/'];

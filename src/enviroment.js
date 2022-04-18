(function(window) {
  window.__env = window.__env || {};

  // API url
  // window.__env.urlBaseServicios = 'http://sigcomt-dc.novaltek.pe:8003/FNB_Servicios/api/';
  // window.__env.urlNotificacion = 'http://sigcomt-dc.novaltek.pe:8003/FNB_Servicios/notificacion';
 // window.__env.urlBaseServicios = 'http://localhost:8090/api/';
 // window.__env.urlNotificacion = 'http://localhost:8090/notificacion';

 window.__env.urlBaseServicios = 'http://localhost:8090/api/';

 
 window.__env.urlNotificacion = 'http://localhost:8090/notificacion';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
  window.__env.timeOutNotifications = 5000;
})(this);



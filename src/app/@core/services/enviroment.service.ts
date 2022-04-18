import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnviromentService {
  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url
  //  public urlBaseServicios = 'http://localhost:50374/test/';
  //  public urlNotificacion = 'http://localhost:50374/test/';

  public urlBaseServicios = 'http://localhost:8090/api/';
  public urlNotificacion = 'http://localhost:8090/notificacion';
  // Whether or not to enable debug mode
  public enableDebug = true;
  public timeOutNotifications = 5000;

  constructor() {}
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../services/backend.service.index';
import { UsuarioEdicionService } from '../../services/feature.service.index';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { SignalRService } from '../../services/backend/signal-r.service';
import { NotificationService } from '../../services/feature/Administracion/Notifications/toastr-notification.service';
import { HttpClient } from '@angular/common/http';
import { EnviromentService } from '../../@core/services/enviroment.service';
import { CambioClaveComponent } from 'src/app/pages/administracion/mantenimientos/usuario/cambio-clave/cambio-clave.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  public NombreCompleto;
  public RolUsuario;
  constructor(
    public dialog: MatDialog,
    public _authenticationService: AuthenticationService,
    public _usuarioEdicionServicio: UsuarioEdicionService,
    public _activatedRoute: ActivatedRoute,
    public _global: GlobalService,
    public signalRService: SignalRService,
    public _notificationservice: NotificationService,
    public http: HttpClient,
    public _enviromentService: EnviromentService
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CambioClaveComponent, { width: '400px' });
    this._global.ocultar = false;
    dialogRef.afterClosed().subscribe(result => {
			
    });
  }

  onGetdatos() {
    this._usuarioEdicionServicio.getUsuario(this._activatedRoute, 'l').subscribe(res => {
      let nombreCompleto = res.usuario.nombres.toString() + ' ' + res.usuario.apellidos.toString();
      let rol: string;

      if (res.usuario.rolId == 1) rol = 'Administrador Web';
      if (res.usuario.rolId == 2) rol = 'Administrador Aliado Comercial';
      if (res.usuario.rolId == 3) rol = 'Administrador Sede Aliado';
      if (res.usuario.rolId == 4) rol = 'Vendedor';
      if (res.usuario.rolId == 5) rol = 'Call Center';
      if (res.usuario.rolId == 6) rol = 'CSC';

      localStorage.setItem('NombreyApellidos', nombreCompleto);
      localStorage.setItem('RolUsuario', rol);
      localStorage.setItem('IdRolUsuario', res.usuario.rolId);
      localStorage.setItem('IdAliado', res.usuario.aliadoComercialId);
      localStorage.setItem('IdSede', res.usuario.sedeId);

      this.NombreCompleto = localStorage.getItem('NombreyApellidos');

      this.RolUsuario = localStorage.getItem('RolUsuario');
    });
  }

  cerrarSesion() {
    localStorage.clear();
    this._global.ocultar = false;
    this._authenticationService.cerrarSesion();
    this.signalRService.closeConnection();
  }

  ngOnInit() {
    this.onGetdatos();
    this.startHttpRequest();
  }
  private startHttpRequest = () => {
    if (
      localStorage.getItem('IdRolUsuario').toString() == '2' ||
      localStorage.getItem('IdRolUsuario').toString() == '3'
    ) {
      this.http.get(`${this._enviromentService.urlBaseServicios}notificacion/grupo`).subscribe(res => {
        this.signalRService.setNotificationService(this._notificationservice);
        this.signalRService.startConnection(res);
        this.signalRService.showNotifationGroupListener();
        this.signalRService.deleteNotificationListener();
      });
    }
  };
}

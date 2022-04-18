import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Usuario } from '../../models/usuario.model';
import { GlobalService } from '../../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  usuarioId: any;
  usuarioActual: Usuario;

  constructor(
    public _enviromentService: EnviromentService,
    public http: HttpClient,
    public router: Router,
    public _global: GlobalService
  ) {}

  login(usuario: any, recordar: boolean = false) {
    const url = this._enviromentService.urlBaseServicios + 'Seguridad/autenticar';
    return this.http.post(url, usuario).pipe(
      map((resp: JsonResult<any>) => {
        if (resp.valid) {
          this.guardarStorage(resp.data.id, resp.data.authToken, usuario.usuario, recordar);
        }
        return resp;
      })
    );
  }

  guardarStorage(id: string, token: string, userName: string, recordar: boolean) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);

    if (recordar) {
      localStorage.setItem('usuario', userName);
    } else {
      localStorage.removeItem('usuario');
    }
  }

  getAuthorizationToken() {
    return localStorage.getItem('token');
  }

  getStoredUser(): string {
    return localStorage.getItem('usuario');
  }

  getIdUser(): string {
    return localStorage.getItem('id');
  }

  removeAuthorizationToken() {
    localStorage.removeItem('id');
    localStorage.removeItem('NombreyApellidos');
    localStorage.removeItem('IdAliado');
    localStorage.removeItem('RolUsuario');
    localStorage.removeItem('token');
    localStorage.removeItem('EsProveedor');
  }

  cerrarSesion() {
    this.removeAuthorizationToken();
    this.router.navigate(['/login']);
  }
}

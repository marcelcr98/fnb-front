import { Injectable } from '@angular/core';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  ocultar: boolean = false;
  permisos: any;

  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {}
 
  validarPermiso(id: string) {
    if (this.isAdministradorWeb()) {
      return true;
    } else {
      if (this.permisos == undefined || this.permisos == null) {
        return false;
      } else {
        var obj = this.permisos.find(p => p.codigo == id);
        return obj != undefined;
      }
    }
  }

  permisosUsuario() {
    this.getPermisos().subscribe(res => {
      if (res.valid) {
        this.permisos = res.data;
      } else {
        swal({
          title: res.message,
          type: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });
      }
    });
  }

  getPermisos(): Observable<any> {
    const url = this._enviromentService.urlBaseServicios + 'Seguridad/ObtenerPermisosxUsuario';
    return this.http.get(url);
  }

  isAdministradorWeb(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');
    return rolUser == '1';
  }

  isAdministradorAliado(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');
    return rolUser == '2';
  }
}

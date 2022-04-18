import { Injectable } from '@angular/core';
import { PrimeTable, Column } from '../../../../@core/models/prime-table.model';
import { UsuarioService } from '../../../backend.service.index';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';
import { UsuarioEdicionService } from './usuario-edicion.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioListadoService {
  constructor(public _usuarioService: UsuarioService, public _router: Router, public _global: GlobalService,
    public _usuarioEdicionService: UsuarioEdicionService,) {
    // super(new FeatureListConfig('Usuario', '/usuario'), _usuarioService, _router);
  }

   callbackInitAsync(): Observable<any> {

    return this._usuarioService.initList().pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }

  getConfigTable(): PrimeTable {
    return {
      customOperations: [
        {
          title: 'Editar',
          icon: 'edit',
          type: 'Material',
          visibilidity: p => this._global.validarPermiso('EDIUSU'),
          click: p => this.goEditMode(p.id)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: this._global.validarPermiso('ACTDESUSU'),
        showIndex: true,
        showEdit: this._global.validarPermiso('EDIUSU'),
        accionesWidth: 7
      },
      columnas: [
        {
          field: 'id',
          header: 'Nº',
          search: false,
          visible: false
        },
        {
          field: 'aliadoComercial',
          header: 'Aliado Comercial',
          order: false
        },
        {
          field: 'sede',
          header: 'Sede',
          order: false
        },
        {
          field: 'usuario',
          header: 'Usuario',
          order: false
        },
        {
          field: 'nombreCompleto',
          header: 'Nombre Completo',
          order: false
        },
        {
          field: 'rol',
          header: 'Rol',
          order: false
        }
      ]
    };
  }

  goEditMode(motivoId: number) {
    this._router.navigate(['usuario', motivoId]);
  }

  exportarUsuario(usuario: any) {
    this._usuarioEdicionService.exportarDocumento(usuario);
  }
}

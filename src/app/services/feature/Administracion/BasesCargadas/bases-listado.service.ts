import { Injectable } from '@angular/core';
import { PrimeTable, Column } from '../../../../@core/models/prime-table.model';
import { UsuarioService } from '../../../backend.service.index';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';
import { BasesService } from 'src/app/services/backend/bases.service';


@Injectable({
  providedIn: 'root'
})
export class BasesListadoService {
  constructor(public _usuarioService: UsuarioService, public _basesService: BasesService, public _router: Router, public _global: GlobalService) {
    // super(new FeatureListConfig('Usuario', '/usuario'), _usuarioService, _router);
  }

   callbackInitAsync(): Observable<any> {

    return this._basesService.initList().pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }

  getConfigTable(): PrimeTable {
    return {
        /*
      customOperations: [
        {
          title: 'Editar',
          icon: 'edit',
          type: 'Material',
          visibilidity: p => this._global.validarPermiso('EDIUSU'),
          click: p => this.goEditMode(p.id)
        }
      ],*/
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
          field: 'idBaseCargada',
          header: 'Nº',
          search: false,
          visible: false
        },
        {
          field: 'nombreBaseCargada',
          header: 'Bases Cargadas de Precios',
          order: false
        },
        {
          field: 'fechaVencimiento',
          header: 'Fecha de Vencimiento',
          order: false
        },
        {
          field: 'cantidadSkus',
          header: 'Cantidad de SKUs',
          order: false
        }
      ]
    };
  }

  /*
  goEditMode(motivoId: number) {
    this._router.navigate(['usuario', motivoId]);
  }*/

  /*
  exportarUsuario(usuario: any) {
    this._usuarioEdicionService.exportarDocumento(usuario);
  }*/
}

import { Injectable } from '@angular/core';
import { FeatureListService } from 'src/app/@core/services/feature-list.service';
import { FinanciamientoPagination } from 'src/app/models/financiamiento.model';
import { Table } from 'primeng/table';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { Router } from '@angular/router';
import { FeatureListConfig } from 'src/app/@core/models/feature-list.model';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Option } from '../../../../@core/models/option.model';
import { FinanciamientoService } from 'src/app/services/backend.service.index';
import { FinanciamientoEdicionService } from './financiamiento-edicion.service';
import { GlobalService } from 'src/app/services/global.service';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class FinanciamientoListadoService extends FeatureListService<FinanciamientoPagination> {
  dataTable: Table;
  dataUsuario: PrimeTable;
  protected dataEntidad: PrimeTable;


  constructor(
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public _financiamientoService: FinanciamientoService,
    public _global: GlobalService,
    public dialog: MatDialog,
    public _router: Router
    
  ) {
    super(new FeatureListConfig('Financiamientos', '/financiamientos'), _financiamientoService, _router);
  }

  callbackInitAsync(): Observable<any> {
   
    return this._financiamientoService.initList().pipe(
      filter(p => p.valid),
      map(p => p.data)
    );

  }

  getConfigTable(): PrimeTable {
    return {
      customOperations: [
        {
          title: 'Editar',
          icon: 'edit',
          type: 'Material',
          visibilidity: p => p.estado == '1' && this._global.validarPermiso('EDIFIN'),
          click: p => this.goEditMode(p.id, true)
        },
        {
          title: 'Ver',
          icon: 'remove_red_eye',
          type: 'Material',
          visibilidity: p => p.estado != '1' && this._global.validarPermiso('VERFIN'),
          click: p => this.goEditMode(p.id, false)
        },
        {
          title: 'Anular',
          icon: 'block',
          type: 'Material',
          visibilidity: p => p.estado !== '4' && this._global.validarPermiso('ANUFIN'),
          click: p => this.anularFinanciamiento(p)
        },
        {
          title: 'PDF',
          icon: 'cloud_download',
          type: 'Material',
          visibilidity: p => this._global.validarPermiso('DESCFIN') && p.estado != '0',
          click: p => this.imprimirFinanciamiento(p.id)
        },
        {
          title: 'Correo',
          icon: 'email',
          type: 'Material',
          visibilidity: p => true,
          click: p => this.OpenMailModal(p.id, p.clientEmail)
        },
        {
          title: 'Adjuntar archivos',
          icon: 'cloud_upload',
          type: 'Material',
          visibilidity: p => true,
          click: p => this.OpenArchivoModal(p.id, p.nroPedido)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: false,
        showIndex: false,
        showEdit: false,
        accionesWidth: 12
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
          header: 'Responsable de Venta',
          visible: localStorage.getItem('IdAliado') == 'null',
          order: false,
          width: 10
        },
        {//Inicio => Cristhian Lopez.
          field: 'proveedorNombre',
          header: 'Aliado Comercial',
          visible: true,
          order: false,
          width: 10
        },
        //FIN
        {
          field: 'sede',
          header: 'Sede',
          visible: localStorage.getItem('IdSede') == 'null',
          order: false,
          width: 10
        },
        {
          field: 'cuentaContrato',
          header: 'Cuenta Contrato',
          order: false,
          width: 9
        },
        {
          field: 'cliente',
          header: 'Cliente',
          order: false,
          width: 15
        },
        {
          field: 'nroPedido',
          header: 'Nº Pedido Venta',
          order: false,
          width: 9
        },
        {
          field: 'importe',
          header: 'Importe',
          order: false,
          width: 10
        },
        {
          field: 'fechaVenta',
          header: 'Fecha Venta',
          order: false,
          width: 9
        },
        {
          field: 'fechaEntrega',
          header: 'Fecha Entrega',
          order: false,
          width: 9
        },
        {
          field: 'nroContrato',
          header: 'Nº Contrato',
          order: false,
          width: 8
        },
        {
          field: 'nroBoleta',
          header: 'Nº Boleta',
          order: false,
          visible: false,
          width: 9
        },
        {
          field: 'tipoDespacho',
          header: 'Tipo despacho',
          order: false,
          width: 9
        },
        {
          field: 'estadoNombre',
          header: 'Estado',
          order: false,
          width: 9
        }
      ]
    };
  }

  goEditMode(financiamientoId: number, readOnly: boolean) {
    this._router.navigate(['financiamientos', financiamientoId], {
      queryParams: { state: readOnly ? 'edit' : 'read' }
    });
  }

  imprimirFinanciamiento(financiamientoId: number) {
    this._financiamientoEdicionService.imprimirDocumento(`Financiamiento_${financiamientoId}.pdf`);
  }

  exportarFinanciamiento(financiamiento: any) {
    this._financiamientoEdicionService.exportarDocumento(financiamiento);
  }

  obtenerSedesAliado(aliadoId: number): Observable<Option[]> {
    return this._financiamientoEdicionService.obtenerSedesAliado(aliadoId);
  }

  anularFinanciamiento(financiamiento: any) {
    let dateArray = financiamiento.fechaVenta.split('/');
    let date = new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]).getTime();
    let today = new Date().getTime();
    let days = (today - date) / (1000 * 60 * 60 * 24);
    let daysLimit = 30;
    
    if (days <= daysLimit) {
      if (this._global.isAdministradorWeb() || this._global.isAdministradorAliado()) {
        this._financiamientoEdicionService.anularFinanciamiento(financiamiento);
      } else {
        swal(
          'No cuenta con permiso para realizar la anulación. Comuniquese con el Administrador Aliado para realizar está operación.',
          'warning'
        );
      }
    } else if (days > daysLimit) {
      if (this._global.isAdministradorWeb()) {
        this._financiamientoEdicionService.anularFinanciamiento(financiamiento);
      } else {
        swal(
          'Ya superó la fecha límite de anulación. Comuniquese con el Administrador Web para realizar la anulación.',
          'warning'
        );
      }
    }
  }

  OpenMailModal(Id:number,clientEmail:string){
    this._financiamientoEdicionService.openEmailSender(Id,clientEmail);
  }

  OpenArchivoModal(Id:number,nroPedido:string){
    this._financiamientoEdicionService.openAdjuntarArchivo(Id,nroPedido);
  }
}

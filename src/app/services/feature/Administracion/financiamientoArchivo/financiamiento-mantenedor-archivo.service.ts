import { Injectable } from '@angular/core';
import { FinanciamientoArchivoService } from 'src/app/services/backend.service.index';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PrimeTable, PrimeTableResponse } from 'src/app/@core/models/prime-table.model';
import { GlobalService } from 'src/app/services/global.service';
import { Observable, Subject } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';

@Injectable({
  providedIn: 'root',
})
export class FinanciamientoMantenedorArchivoService {
  grillaLoad: Subject<any> = new Subject();
  constructor(public _financiamientoArchivoService: FinanciamientoArchivoService, public _global: GlobalService) {}

  getForm() {
    return new FormGroup({
      financiamientoId: new FormControl(0, null),
      descripcion: new FormControl('', Validators.required),
      base64Logo: new FormControl('', [Validators.required]),
      imagePath: new FormControl('', null),
      nombreArchivo: new FormControl('', null),
    });
  }

  saveChange(financiamientoArchivo: any): Observable<JsonResult<any>> {
    return this._financiamientoArchivoService.add(financiamientoArchivo);
  }

  getConfigTable(): PrimeTable {
    return {
      customOperations: [
        {
          title: 'Eliminar',
          icon: 'delete',
          type: 'Material',
          visibilidity: (p) => true, //this._global.validarPermiso('EDIMOT'),
          click: (p) => this.deleteAdjuntarArchivo(p.id),
        },
        {
          title: 'Descargar',
          icon: 'cloud_download',
          type: 'Material',
          visibilidity: (p) => true, //this._global.validarPermiso('EDIMOT'),
          click: (p) => this.download(p.id, p.nombreArchivo),
        },
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: false,
        showIndex: false,
        showEdit: false,
        accionesWidth: 12,
      },
      columnas: [
        {
          field: 'id',
          header: 'Nº',
          search: false,
          visible: false,
        },
        {
          field: 'descripcion',
          header: 'Descripción',
          order: false,
        },
        {
          field: 'nombreArchivo',
          header: 'Nombre Archivo',
          order: false,
        },
        {
          field: 'fechaAdjunta',
          header: 'Fecha Adjunta',
          order: false,
        },
      ],
    };
  }

  deleteAdjuntarArchivo(id: number) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        const resultadoServicio = this._financiamientoArchivoService.delete(id);
        resultadoServicio.subscribe((response) => {
          if (response.valid) {
            swal('La operación se realizó satisfactoriamente', '', 'success');
            this.grillaLoad.next();
          }
        });
      }
    });
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    return this._financiamientoArchivoService.loadLazyFilter(paginator, filtros);
  }
  download(id: number, nombreArchivo: string) {
    this._financiamientoArchivoService.download(id).subscribe((blobFile) => {
      var binaryString = window.atob(blobFile);
      var binaryLen = binaryString.length;
      var ArrayByte = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        ArrayByte[i] = ascii;
      }
      var blob = new Blob([ArrayByte]);
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = nombreArchivo;
      link.click();
    });
  }
}

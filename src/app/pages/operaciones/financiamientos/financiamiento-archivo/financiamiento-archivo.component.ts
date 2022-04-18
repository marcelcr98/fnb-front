import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FinanciamientoMantenedorArchivoService } from 'src/app/services/feature.service.index';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/api';
import swal from 'sweetalert2';
@Component({
  selector: 'app-financiamiento-archivo',
  templateUrl: './financiamiento-archivo.component.html',
  styleUrls: ['./financiamiento-archivo.component.scss'],
})
export class FinanciamientoArchivoComponent implements OnInit {
  forma: FormGroup;
  dataTable: PagingGridComponent;
  dataEntity: PrimeTable;
  allowedExtensions: string;
  constructor(
    public modalReference: MatDialogRef<FinanciamientoArchivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _financiamientoMantenedorArchivoServicio: FinanciamientoMantenedorArchivoService
  ) {}

  ngOnInit() {
    this.forma = this._financiamientoMantenedorArchivoServicio.getForm();
    this.dataEntity = this.init(this.dataTable);
    this.allowedExtensions = 'audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/oga,audio/m4a,video/mp4,image/jpg,image/jpeg,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf';
    this._financiamientoMantenedorArchivoServicio.grillaLoad.subscribe(() => {
      this.refreshGrid();
    });
  }
  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._financiamientoMantenedorArchivoServicio.getConfigTable());
  }
  send() {
    let maxTotal = 5;
    if (this.dataEntity.totalRegistros >= maxTotal) {
      swal(`Solo se puede adjuntar ${maxTotal} archivos como máximo`, '', 'warning');
    } else {
      this.forma.get('financiamientoId').setValue(this.data.financiamientoId);
      swal({
        text: '¿Estás seguro de realizar esta operación?',
        type: 'question',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          const resultadoServicio = this._financiamientoMantenedorArchivoServicio.saveChange(this.forma.value);
          resultadoServicio.subscribe((response) => {
            if (response.valid) {
              swal('La operación se realizó satisfactoriamente', '', 'success');
              this.refreshGrid();
              this.forma.get('descripcion').setValue(null);
              this.forma.get('base64Logo').setValue(null);
              this.forma.get('imagePath').setValue(null);
              this.forma.get('nombreArchivo').setValue(null);
              document.getElementById('archivo').innerText = 'Ningún archivo seleccionado';
            }
          });
        }
      });
    }
  }

  loadLazy(event: LazyLoadEvent) {
    event.filters = { financiamientoId: { value: this.data.financiamientoId, matchMode: 'equals' } };
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);
    this._financiamientoMantenedorArchivoServicio.loadLazyFilter(primerNgFilter, '').subscribe((response) => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  loadArchivo(event) {
    let files = event.target.files;
    if (files.length === 0) return;

    if(!this.allowedExtensions.includes(files[0].type))
    {
      swal('Tipo de archivo no válido', '', 'warning');
      return false;
    }

    let mb = 20;
    let bytes = mb * 1024 * 1024;
    if (files[0].size >= bytes) {
      swal(`Solo se puede adjuntar ${mb} MB como capacidad máxima`, '', 'warning');
      return false;
    }

    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.forma.get('base64Logo').setValue(reader.result);
      this.forma.get('nombreArchivo').setValue(files[0].name);
      document.getElementById('archivo').innerText = files[0].name;
    };
  }

  refreshGrid() {
    this.loadLazy({
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: 10,
      sortField: 'Id',
      sortOrder: 1,
    });
  }
}

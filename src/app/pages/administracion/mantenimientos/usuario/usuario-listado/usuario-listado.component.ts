import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Option, State } from 'src/app/@core/models/option.model';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { UsuarioService } from 'src/app/services/backend.service.index';
import { UsuarioListadoService, UsuarioEdicionService } from 'src/app/services/feature.service.index';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-listado-usuario',
  templateUrl: './usuario-listado.component.html',
  styles: []
})
export class UsuarioListadoComponent implements OnInit, AfterViewInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  rolId: number;
  aliadoComercialId: number;
  sedeId: number;

  usuarioGroup = new FormGroup({
    idUsuario: new FormControl(""),
    idAliado: new FormControl(""),
    idEstado: new FormControl(""),
    idSede: new FormControl(""),
    
  });

  getItemForm: any;

  aliados: Option[];
  roles: Option[];
  sedes: Option[];
  estado: number = 1;
  constructor(
    public _activatedRoute: ActivatedRoute,
    public _usuarioListadoService: UsuarioListadoService,
    public _usuarioEdicionService: UsuarioEdicionService,
    public _usuarioServicio: UsuarioService,
    public _global: GlobalService,
    public _rutaActiva: ActivatedRoute

  ) { }

  ngAfterViewInit() {
 

    
    this._usuarioListadoService.callbackInitAsync().subscribe(response => {
      this.aliados = response.aliados;
      this.roles = response.roles;
      this.sedes = response.sedes;


 

      if (response.aliadoComercialId) {
        this.aliadoComercialId = response.aliadoComercialId.toString();
 
        this.dataTable.filter(response.aliadoComercialId, 'aliadoComercialId', 'equals')

      }

      if (response.sedeId) {
        this.sedeId = response.sedeId.toString();

        this.dataTable.filter(response.sedeId, 'sedeId', 'equals');
      }

      if (response.rolId) {
        this.rolId = response.rolId.toString();

        this.dataTable.filter(response.rolId, 'rolId', 'equals');
      }

      this.dataTable.filter(this.estado.toString(), 'estado', 'equals');
    });
    this.dataEntity = this.init(this.dataTable);
  }

  setearDatos() {
    if (!this._rutaActiva.snapshot.paramMap.get('id')) {
      localStorage.removeItem('getItemForm');
    }
    this.getItemForm = JSON.parse(localStorage.getItem('getItemForm'));
    if (this.getItemForm) {
      for (let key in this.getItemForm) {

      }
    }
  }

  
  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._usuarioListadoService.getConfigTable());
  }


  ngOnInit() {
    this.dataEntity = this.init(this.dataTable);
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);





    this._usuarioServicio.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }




  exportar() {
    var user = this.usuarioGroup.get("idUsuario").value;
    var aliado = this.usuarioGroup.get("idAliado").value;
    var estado = this.usuarioGroup.get("idEstado").value;
    var sede = this.usuarioGroup.get("idSede").value;
    var archivoNom = 'Usuarios.xlsx'
    console.log(user);
    console.log(aliado);
    console.log(estado);
    console.log(sede);

    
    var objeto={
      userName:user,
      idAliado:aliado = "" ? 0 : aliado,
      idSede:sede = "" ? 0 : sede,
      idEstado:estado = "" ? 0 : estado,
      archivo: archivoNom
      
    }
    this._usuarioServicio.exportarUsuario(objeto).subscribe(blobFile => {
      const url = window.URL.createObjectURL(blobFile);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'Usuarios.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
   /* let obj = this.formGroup.getRawValue();*/
    /*this._usuarioListadoService.exportarUsuario(obj);*/
  }

  updateState(stateModel: State) {
    this._usuarioServicio.updateState(stateModel.id, stateModel.state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }

  refreshGrid(dataTable: PagingGridComponent) {
    const options = dataTable.getDataTableOption();

    this.loadLazy({
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: options.rows,
      sortField: options.sortField,
      sortOrder: options.sortOrder
    });
  }

  change(event, dataTable: any) {
    if (event.value != null) {
      this._usuarioEdicionService.initSede(event.value).subscribe(res => {
        this.sedes = res.optionSede;
      });
    } else {
      this.sedes = null;
    }
    dataTable.filter(event.value, 'aliadoComercialId', 'equals');
  }
}

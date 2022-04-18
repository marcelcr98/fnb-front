import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FinanciamientoForm, FinanciamientoListas } from 'src/app/models/financiamiento.model';
import { GlobalService } from 'src/app/services/global.service';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { MatDialog } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { formatDate } from '@angular/common';
import { ComboProducto } from '../../../../models/financiamiento.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-financiamiento-edit',
  templateUrl: './financiamiento-edit.component.html',
  styleUrls: [],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class FinanciamientoEditComponent implements OnInit {
  @Input() financiamiento: FinanciamientoForm;
  @Input() listas: FinanciamientoListas;
  @Input() lineaCredito: 0;

  forma: FormGroup;

  vendedor: any;

  tipoValidacion: string;
  lenghtValidacion: number;
  visibilidad: string;

  fecMinRecojo: Date;
  fecMaxRecojo: Date;
  fechaVenta: Date;
  fechaEntrega: Date;
  fechaActual: Date;

  ngGuardarFinanciamiento: boolean;

  ngFechaEntregaPerm: boolean;

  totalMonto: number = 0;
  hayExceso: boolean = false;
  estadoFinanciamiento: string = '';

  rol: string;
  NombreCompleto: string;

  constructor(
    public _global: GlobalService,
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.estadoFinanciamiento = this._financiamientoEdicionService.state == 'read' ? 'Ver' : 'Editar';
    this.forma = this._financiamientoEdicionService.setForm(this.financiamiento);

    this.rol = localStorage.getItem('RolUsuario');
    this.fechaActual = new Date(Date.now());

    this._financiamientoEdicionService.hayExcesoLinea.subscribe(estado => {
      this.forma.get('excesoLinea').setValue(estado);
    });

    this.fechaVenta = this.financiamiento.fechaVenta;
    this.vendedor = this.financiamiento.vendedor;

    this.NombreCompleto = this.financiamiento.vendedorS;
    this.vendedor = this.financiamiento.vendedor;

    this.activarControles();

    this.notify();

    if (this.financiamiento.pagoenTienda > 0 && this.financiamiento.pagoenTienda != this.financiamiento.montoPagado) {
      this.alerta(
        2,
        'El cliente tiene una deuda de S/. ' +
          this.financiamiento.pagoenTienda.toFixed(2) +
          ' , no se olvide de realizar el cobro.'
      );
    }
  }

  activarControles() {
    if (
      this._global.validarPermiso('GUARFIN') ||
      this._global.validarPermiso('GUARFINTI') ||
      this._global.validarPermiso('GUARFINDE')
    ) {
      this.ngGuardarFinanciamiento = true;
    }

    if (
      this._global.validarPermiso('GUARFINDI') &&
      this._global.validarPermiso('GUARFINTI') &&
      this._global.validarPermiso('GUARFINDE')
    ) {
      this.ngFechaEntregaPerm = true;
    } else if (this._global.validarPermiso('GUARFINDE') || this._global.validarPermiso('GUARFINTI')) {
      this.ngFechaEntregaPerm = true;
    } else if (this._global.validarPermiso('GUARFINDI')) {
      this.ngFechaEntregaPerm = true;
    }

    if (this.fechaVenta) {
      if (this.financiamiento.tipoDespacho == 2) {
        this.fecMinRecojo = new Date(this.fechaVenta);
        this.fecMaxRecojo = new Date(this.fechaVenta);
        this.fecMinRecojo.setDate(this.fecMinRecojo.getDate());
        this.fecMaxRecojo.setDate(this.fecMaxRecojo.getDate() + 15);
        localStorage.setItem('fechaMinRecojo', this.fecMinRecojo.toString());
        localStorage.setItem('fechaMaxRecojo', this.fecMaxRecojo.toString());
      } else if (this.financiamiento.tipoDespacho == 3) {
        this.fecMinRecojo = new Date(this.fechaVenta);
        this.fecMaxRecojo = new Date(this.fechaVenta);
        this.fecMinRecojo.setDate(this.fecMinRecojo.getDate() + 3);
        this.fecMaxRecojo.setDate(this.fecMaxRecojo.getDate() + 18);
        localStorage.setItem('fechaMinRecojo', this.fecMinRecojo.toString());
        localStorage.setItem('fechaMaxRecojo', this.fecMaxRecojo.toString());
      }
    }

    if (this.financiamiento.tipoTelefono) {
      switch (this.financiamiento.tipoTelefono) {
        case 'T001':
          this.lenghtValidacion = 7;
          this.visibilidad = 'visible';
          this.tipoValidacion = '^[0-9]+$';
          break;
        case 'T002':
          this.lenghtValidacion = 9;
          this.visibilidad = 'invisible';
          this.tipoValidacion = '^[0-9]+$';
          break;
      }
    } else this.visibilidad = 'invisible';

    const nroBoleta = this.forma.get('nroBoleta');
    const fechaEntrega = this.forma.get('fechaEntrega');
    nroBoleta.setValidators([Validators.required]);
    fechaEntrega.setValidators([Validators.required]);
  }

  submit() {
    const objetoEnviar = this.forma.getRawValue();
    objetoEnviar.correoElectronico = objetoEnviar.correoElectronico.toLowerCase(); //lordonez
    objetoEnviar.aliadoComercialId = objetoEnviar.aliadoComercialId == null ? 0 : objetoEnviar.aliadoComercialId; //lordonez
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const formattedDate = formatDate(this.financiamiento.fechaVenta, format, locale);

    objetoEnviar.fechaVenta = formattedDate;
    objetoEnviar.detalle = this.formatearJson(this.financiamiento.detalle);
    objetoEnviar.vendedor = this.vendedor;

    this._financiamientoEdicionService.grabarFinanciamiento(objetoEnviar);
  }

  formatearJson(lista: any) {
    let json = [];
    lista.forEach(aliadoX => {
      let aliado: ComboProducto = {};
      aliado.data = {};
      aliado.data.id = aliadoX.data.id;
      aliado.data.nombre = aliadoX.data.nombre;
      aliado.data.precio = aliadoX.data.precio;
      aliado.data.sku = aliadoX.data.sku;
      aliado.data.cantidad = aliadoX.data.cantidad;
      aliado.data.despacho = aliadoX.data.despacho;
      aliado.children = [];
      aliado.expanded = aliadoX.expanded;
      aliadoX.children.forEach(comboProductoX => {
        let combProducto: ComboProducto = {};
        combProducto.data = {};
        combProducto.data.id = comboProductoX.data.id;
        combProducto.data.nombre = comboProductoX.data.nombre;
        combProducto.data.precio = comboProductoX.data.precio;
        combProducto.data.sku = comboProductoX.data.sku;
        combProducto.data.cantidad = comboProductoX.data.cantidad;
        combProducto.data.tipo = comboProductoX.children != null ? 'C' : 'P';
        combProducto.expanded = comboProductoX.expanded;
        combProducto.children = [];
        if (comboProductoX.children != null) {
          comboProductoX.children.forEach(productoX => {
            let producto: ComboProducto = {};
            producto.data = {};
            producto.data.id = productoX.data.id;
            producto.data.nombre = productoX.data.nombre;
            producto.data.precio = productoX.data.precio;
            producto.data.sku = productoX.data.sku;
            producto.data.cantidad = productoX.data.cantidad;
            combProducto.children.push(producto);
          });
        }
        aliado.children.push(combProducto);
      });
      json.push(aliado);
    });
    return json;
  }

  obtenerTotal(): number {
    return Math.min(this.lineaCredito, this.sumarSubTotales());
  }

  verificarExcesoLineaCredito(): boolean {
    this.hayExceso = this.sumarSubTotales() > this.lineaCredito;
    return this.hayExceso;
  }

  sumarSubTotales() {
    let suma = 0;
    let cantidad = 0;
    if (this.financiamiento.detalle.length > 0) {
      let lista = this.financiamiento.detalle;
      lista.forEach(aliado => {
        aliado.children.forEach(comboproducto => {
          suma += comboproducto.data.cantidad * comboproducto.data.precio;
          cantidad += comboproducto.data.cantidad;
        });
        aliado.data.cantidad = cantidad;
        aliado.data.precio = suma;
        cantidad = 0;
        suma = 0;
      });
      this.financiamiento.detalle = lista;
      this.formatearJson(lista);
      suma = this.financiamiento.detalle.map(item => item.data.precio).reduce((prev, next) => prev + next);
    }
    this.totalMonto = suma;
    return suma;
  }

  notify() {
    this._financiamientoEdicionService.totalPedidoChange.next(this.obtenerTotal());
    this._financiamientoEdicionService.hayExcesoLinea.next(this.verificarExcesoLineaCredito());
    this.financiamiento.detalle = [...this.financiamiento.detalle];
  }

  alerta(tipo: number, mensaje: string) {
    if (tipo == 2) {
      swal({
        text: mensaje,
        type: 'warning',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: false
      });
    }
  }
}

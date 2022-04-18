import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FinanciamientoForm, FinanciamientoListas } from 'src/app/models/financiamiento.model';
import { GlobalService } from 'src/app/services/global.service';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { SimuladorCuotasComponent } from '../simulador-cuotas/simulador-cuotas.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Option } from '../../../../@core/models/option.model';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';

import { formatDate } from '@angular/common';
import { ComboProducto } from '../../../../models/financiamiento.model';
import { FinanciamientoCombosComponent } from '../financiamiento-combos/financiamiento-combos.component';
import { FinanciamientoDespachoComponent } from '../financiamiento-despacho/financiamiento-despacho.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-financiamiento-create',
  templateUrl: './financiamiento-create.component.html',
  styleUrls: [],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class FinanciamientoCreateComponent implements OnInit {
  @Input() financiamiento: FinanciamientoForm;
  @Input() listas: FinanciamientoListas;
  @Input() lineaCredito: 0;
  @ViewChild(FinanciamientoCombosComponent, { static: false }) financiamientoCombosComponent;

  forma: FormGroup;

  Vendedores: Observable<Option[]>;

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

  ViewUserResto: string;
  ViewUserVendedor: string;

  totalMonto: number = 0;
  hayExceso: boolean = false;
  idCanalAnterior: number = 0;

  public rol;
  public NombreCompleto;

  constructor(
    public _global: GlobalService,
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.forma = this._financiamientoEdicionService.setForm(this.financiamiento);
    this.rol = localStorage.getItem('RolUsuario');
    this.fechaActual = new Date(Date.now());

    this.Vendedores = this.forma.get('vendedor').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this._financiamientoEdicionService.obtenerListaVendedores(value))
    );

    this.forma.get('nroCuota').valueChanges.subscribe(value => {
      this.updateMontoCuota(value.replace('NB', ''), this._financiamientoEdicionService.totalPedidoChange.value);
    });

    this._financiamientoEdicionService.totalPedidoChange.subscribe(newTotal => {
      const nroCuota = this.forma.get('nroCuota').value;
      if (nroCuota) {
        this.updateMontoCuota(nroCuota.replace('NB', ''), newTotal);
      }
    });

    this._financiamientoEdicionService.hayExcesoLinea.subscribe(estado => {
      this.forma.get('excesoLinea').setValue(estado);
    });

    this.fechaVenta = this.fechaActual;
    if (this.rol == 'Vendedor' || this.rol == 'Call Center' || this.rol == 'CSC') {
      this.ViewUserResto = 'd-none';
      this.ViewUserVendedor = 'd-block';
      this.NombreCompleto = localStorage.getItem('NombreyApellidos');
      this.vendedor = localStorage.getItem('id').toString();
    } else {
      this.ViewUserResto = 'd-block';
      this.ViewUserVendedor = 'd-none';
    }

    this.activarControles();

    this.aliadoChange(this.financiamiento.aliadoComercialId);

    this.financiamiento.detalle = [];
    this.notify();
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
      if (this.financiamiento.tipoDespacho == 1) {
        this.fechaEntrega = this.fechaVenta;
      } else {
        this.fecMinRecojo = new Date(this.fechaVenta);
        this.fecMaxRecojo = new Date(this.fechaVenta);
        this.fecMinRecojo.setDate(this.fecMinRecojo.getDate() + 3);
        this.fecMaxRecojo.setDate(this.fecMaxRecojo.getDate() + 18);
        localStorage.setItem('fechaMinRecojo', this.fecMinRecojo.toString());
        localStorage.setItem('fechaMaxRecojo', this.fecMaxRecojo.toString());
      }
    }

    if (this.financiamiento.tipoTelefono) {
      this.changeTipoTel(this.financiamiento.tipoTelefono);
    } else {
      this.visibilidad = 'invisible';
    }
  }

  updateMontoCuota(nroCuota: number, montoTotal: number) {
    this._financiamientoEdicionService.tasaMensualFinanciamiento().subscribe(tasa => {
      const tasaMensual = parseFloat(tasa.toString());
      const cuotaActual = this._financiamientoEdicionService.calcularCuota(montoTotal, nroCuota, tasaMensual);
      this.forma.get('montoCuota').setValue(cuotaActual);
    });
  }

  aliadoChange(idAliadoComercial: number) {
    this._financiamientoEdicionService.obtenerSedesAliado(idAliadoComercial).subscribe(response => {
      this.listas.sedes = response;
    });
  }

  canalChange(idCanal: any) {
    const canalVenta = this.forma.get('canalVentaId');
    if (this.financiamiento.detalle.length > 0) {
      swal({
        text:
          'Está cambiando de canal de venta, se eliminará todos los productos o combos registrados, ¿Está seguro de su cambio?',
        type: 'question',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          canalVenta.setValue(idCanal.value.toString());
          this.idCanalAnterior = idCanal.value;
          this.financiamiento.canalVentaId = this.idCanalAnterior;
          this.financiamientoCombosComponent.cargarCombos(this.financiamiento.aliadoComercialId, idCanal.value, '');
          this.financiamiento.detalle = [];
          this.notify();
        } else {
          this.financiamiento.canalVentaId = this.idCanalAnterior;
          canalVenta.setValue(this.idCanalAnterior.toString());
        }
      });
    } else {
      this.idCanalAnterior = idCanal.value;
      canalVenta.setValue(this.idCanalAnterior);
      this.financiamientoCombosComponent.cargarCombos(this.financiamiento.aliadoComercialId, idCanal.value, '');
    }
  }

  submit() {
    if (this.validarSubmit()) {
      const objetoEnviar = this.forma.getRawValue();
      objetoEnviar.correoElectronico = objetoEnviar.correoElectronico.toLowerCase(); //lordonez
      objetoEnviar.aliadoComercialId = objetoEnviar.aliadoComercialId == null ? 0 : objetoEnviar.aliadoComercialId; //lordonez
      const format = 'yyyy-MM-dd';
      const locale = 'en-US';
      const formattedDate = formatDate(this.financiamiento.fechaVenta, format, locale);

      objetoEnviar.fechaVenta = formattedDate;
      objetoEnviar.detalle = this.formatearJson(this.financiamiento.detalle);
      objetoEnviar.vendedor = this.vendedor;
      objetoEnviar.pagoenTienda = this.totalMonto > this.lineaCredito ? this.lineaCredito - this.totalMonto : 0;
      objetoEnviar.totalMonto = this.totalMonto > this.lineaCredito ? this.lineaCredito : this.totalMonto;

      this._financiamientoEdicionService.grabarFinanciamiento(objetoEnviar);
    }
  }

  validarSubmit() {
    //Setear validadores
    let monto = this.lineaCredito;
    this.financiamiento.detalle.map(aliado => {
      monto -= aliado.data.despacho.tipoDespacho == 3 ? aliado.data.precio : 0;
    });

    for (let i = 0; i < this.financiamiento.detalle.length; i++) {
      let aliado = this.financiamiento.detalle[i];
      if (aliado.data.despacho.tipoDespacho == null) {
        this.alerta(2, 'Por favor elegir el despacho de ' + aliado.data.nombre);
        return false;
      }
      if (monto < 0 && aliado.data.sedes > 0 && aliado.data.despacho.tipoDespacho == 3) {
        this.alerta(2, 'Por favor elegir tipo despacho Recojo en Tienda o Entrega Inmediata de  ' + aliado.data.nombre);
        return false;
      }
    }
    return true;
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
      aliado.data.sedes = aliadoX.data.sedes;
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

  simularCuotas() {
    const dialogRef = this.dialog.open(SimuladorCuotasComponent, {
      width: '90%'
    });
  }

  changeTipoTel(value: any) {
    this.financiamiento.tipoTelefono = value;
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
  }

  changeVendedor(Vendedor: any) {
    this.vendedor = Vendedor.option.value.value;
  }

  displayFn(vendedor: any) {
    if (vendedor) {
      return vendedor.label;
    }
  }

  agregarComboProducto(objCP: any) {
    let aliadoExiste: boolean = false;
    let comboproductoExiste: boolean = false;
    let tipo: string = '';
    let cantidad: number = 0;
    let lista = this.financiamiento.detalle;
    tipo = objCP.children[0].children != null ? 'C' : 'P';
    cantidad = objCP.children[0].data.cantidad;

    if (this.validarAgregarProducto(objCP)) {
      lista.map(aliado => {
        if (aliado.data.id === objCP.data.id) {
          aliado.children.map(comboproducto => {
            if (comboproducto.data.id === objCP.children[0].data.id && comboproducto.data.tipo === tipo) {
              if (comboproducto.children !== null) {
                comboproducto.children.map(producto => {
                  producto.data.cantidad += cantidad;
                });
              }
              comboproducto.data.cantidad += cantidad;
              comboproductoExiste = true;
            }
          });
          if (!comboproductoExiste) {
            aliado.children.push(objCP.children[0]);
          }
          aliadoExiste = true;
        }
      });

      if (!aliadoExiste && !comboproductoExiste) {
        lista.push(objCP);
        this.despachoComboProducto(objCP.data);
      }
    }

    this.financiamiento.detalle = this.formatearJson(lista);

    this.notify();
  }

  eliminarComboProducto(objCP: any) {
    let aliado = -1;
    let comboproducto = -1;
    let lista = this.financiamiento.detalle;
    for (let a = 0; a < lista.length; a++) {
      if (lista[a].data.id == objCP.id && objCP.nivel == 0) {
        aliado = a;
        break;
      }
      for (let cp = 0; cp < lista[a].children.length; cp++) {
        if (lista[a].children[cp].data.id == objCP.id && objCP.nivel == 1) {
          aliado = a;
          comboproducto = cp;
          break;
        }
      }
    }

    if (objCP.nivel == 0) lista.splice(aliado, 1);
    if (objCP.nivel == 1) lista[aliado].children.splice(comboproducto, 1);

    if (lista.length > 0 && lista[aliado].children.length == 0) {
      lista.splice(aliado, 1);
    }

    this.financiamiento.detalle = this.formatearJson(lista);

    this.notify();
  }

  despachoComboProducto(objCP: any) {
    const dialogRef = this.dialog.open(FinanciamientoDespachoComponent, {
      width: '700px',
      data: {
        cuentaContrato: this.financiamiento.cuentaContrato,
        despacho: objCP.despacho,
        aliado: objCP,
        departamentos: this.listas.departamentos,
        tipoVentas: this.listas.tipoVenta,
        fechaVenta: this.fechaVenta
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let lista = this.financiamiento.detalle;
        lista.forEach(aliado => {
          if (aliado.data.id == objCP.id) {
            aliado.data.despacho = result;
          }
        });
        this.financiamiento.detalle = this.formatearJson(lista);
      }
    });
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

  validarAgregarProducto(objCP: any) {
    let lista: any = [];
    let monto: number = 0;

    //Obtener aliados
    this.financiamiento.detalle.map(aliado => {
      let ali: any = {};
      ali.sedes = aliado.data.sedes;
      ali.id = aliado.data.id;
      ali.precio = aliado.data.precio;
      ali.tipoDespacho = aliado.data.despacho.tipoDespacho;
      lista.push(ali);
    });

    //Validar
    if (this.financiamiento.detalle.length == 0) {
      monto += objCP.children[0].data.precio * objCP.children[0].data.cantidad;
      if (monto > this.lineaCredito && objCP.data.sedes == 0 && this.financiamiento.canalVentaId == 2) {
        let mensaje =
          'No puede agregar ' +
          objCP.children[0].data.nombre +
          ', porque supera su linea de crédito y el proveedor no cuenta con sedes para realizar la compra.';
        this.alerta(2, mensaje);
        return false;
      }
    } else if (this.financiamiento.detalle.length > 0) {
      monto = this.lineaCredito;
      let existeAliadoSedes = false;
      lista.map(aliado => {
        if (aliado.sedes == 0) {
          monto -= aliado.precio;
        } else {
          existeAliadoSedes = true;
        }
      });
      let esMenorMonto = monto - objCP.children[0].data.precio * objCP.children[0].data.cantidad;
      if (objCP.data.sedes == 0 && esMenorMonto < 0) {
        let mensaje = 'No puede agregar ' + objCP.children[0].data.nombre + ', porque supera su linea de crédito.';
        this.alerta(2, mensaje);
        return false;
      } else if (existeAliadoSedes && esMenorMonto < 0 && objCP.data.sedes == 0) {
        lista.map(aliado => {
          if (aliado.id == objCP.data.id) {
            if (aliado.sedes == 0) {
              let mensaje =
                'No puede agregar ' +
                objCP.children[0].data.nombre +
                ', porque supera su linea de crédito y no cuenta con sedes disponibles.';
              this.alerta(2, mensaje);
              return false;
            }
          }
        });
      } else if (!existeAliadoSedes && esMenorMonto < 0 && objCP.data.sedes == 0) {
        let mensaje =
          'No puede agregar ' +
          objCP.children[0].data.nombre +
          ', porque supera su linea de crédito y no existe proveedores con sedes disponibles en su compra.';
        this.alerta(2, mensaje);
        return false;
      }
    }

    return true;
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

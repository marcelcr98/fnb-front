import { Injectable } from '@angular/core';
import { FinanciamientoService } from 'src/app/services/backend.service.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import { Financiamiento, FinanciamientoForm, Producto } from 'src/app/models/financiamiento.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpressionValidation, CustomValidators } from 'src/app/@core/helpers/expression.validation';
import { Option } from 'src/app/@core/models/option.model';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { MatDialog } from '@angular/material/dialog';
import { FinanciamientoEncuestaComponent } from 'src/app/pages/operaciones/financiamientos/financiamiento-encuesta/financiamiento-encuesta.component';
import { FinanciamientoAnulacionComponent } from 'src/app/pages/operaciones/financiamientos/financiamiento-anulacion/financiamiento-anulacion.component';
import { FinanciamientoArchivoComponent } from '../../../../pages/operaciones/financiamientos/financiamiento-archivo/financiamiento-archivo.component';
import { EmailSenderComponent } from '../../../../pages/operaciones/financiamientos/email-sender/email-sender.component';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';

@Injectable({
  providedIn: 'root'
})
export class FinanciamientoEdicionService {
  state = '';
  consultaId: number;
  totalPedidoChange: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  hayExcesoLinea: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public _financiamientoService: FinanciamientoService,
    public _router: Router,
    public _enviromentService: EnviromentService,
    public http: HttpClient,
    public dialog: MatDialog
    
  ) {}

  init(activatedRoute: ActivatedRoute): Observable<Financiamiento> {
    return activatedRoute.queryParams.pipe(
      switchMap(queries => {
        this.state = queries.state ? queries.state : '';

        return activatedRoute.params.pipe(
          switchMap(params => {
            this.consultaId = params['consulta'];
            let cuentaContratoId = params['id'];
            let financiamientoId = cuentaContratoId;

            if (this.state === 'edit' || this.state === 'read') {
              cuentaContratoId = null;
            } else {
              financiamientoId = null;
            }

            return this._financiamientoService.get(cuentaContratoId, financiamientoId).pipe(
              filter(p => p.valid),
              map(p => p.data)
            );
          })
        );
      })
    );
  }

  newForm() {
    return new FormGroup({
      estado: new FormControl(''),
      vendedor: new FormControl(''),
      fechaVenta: new FormControl(''),
      fechaEntrega: new FormControl(''),
      nroContrato: new FormControl(''),
      nroPedido: new FormControl(''),
      aliadoId: new FormControl(''),
      sedeId: new FormControl(''),
      tipoDocumento: new FormControl(''),
      nroDocumento: new FormControl(''),
      idCategoria: new FormControl(''),
      canalId: new FormControl(''),
      proveedorId: new FormControl(''),
    });
  }

  setForm(financiamientoForm: FinanciamientoForm) {
    return new FormGroup(
      {
        id: new FormControl(financiamientoForm.id),

        clienteId: new FormControl(financiamientoForm.clienteId),
        idConsulta: new FormControl(this.consultaId),
        excesoLinea: new FormControl(),
        cuentaContrato: new FormControl(financiamientoForm.cuentaContrato),
        nroPedidoVenta: new FormControl(financiamientoForm.nroPedidoVenta),

        tipoDespacho: new FormControl({
          value: financiamientoForm.tipoDespacho != null ? financiamientoForm.tipoDespacho.toString() : null,
          disabled: this.state !== ''
        }),
        fechaVenta: new FormControl({
          value: moment(financiamientoForm.fechaVenta),
          disabled: this.state !== ''
        }),
        correoElectronico: new FormControl(
          {
            value: financiamientoForm.correoElectronico,
            disabled: this.state !== ''
          },
          [Validators.required, Validators.pattern(ExpressionValidation.Correo)]
        ),
        nroCuota: new FormControl(
          {
            value: financiamientoForm.nroCuota,
            disabled: this.state !== ''
          },
          Validators.required
        ),

        fechaEntrega: new FormControl({
          value: financiamientoForm.fechaEntrega ? moment(financiamientoForm.fechaEntrega) : null,
          disabled: this.state !== 'edit'
        }),
        nroBoleta: new FormControl({
          value: financiamientoForm.nroBoleta,
          disabled: this.state === 'read'
        }),
        numeroTelefono: new FormControl(
          {
            value: financiamientoForm.numeroTelefono,
            disabled: this.state !== ''
          },
          Validators.required
        ),
        tipoTelefono: new FormControl(
          {
            value: financiamientoForm.tipoTelefono,
            disabled: this.state !== ''
          },
          Validators.required
        ),

        canalVentaId: new FormControl(
          {
            value: financiamientoForm.canalVentaId != 0 ? financiamientoForm.canalVentaId.toString() : null,
            disabled: this.state !== ''
          },
          Validators.required
        ),
        vendedor: new FormControl(
          {
            value: financiamientoForm.vendedor,
            disabled:
              this.state !== '' ||
              localStorage.getItem('RolUsuario') == 'Vendedor' ||
              localStorage.getItem('RolUsuario') == 'Call Center' ||
              localStorage.getItem('RolUsuario') == 'CSC'
          },
          Validators.required
        ),

        vendedorS: new FormControl({
          value: financiamientoForm.vendedorS,
          disabled:
            this.state !== '' ||
            localStorage.getItem('RolUsuario') == 'Vendedor' ||
            localStorage.getItem('RolUsuario') == 'Call Center' ||
            localStorage.getItem('RolUsuario') == 'CSC'
        }),
        montoCuota: new FormControl(
          {
            value: financiamientoForm.montoCuota,
            disabled: this.state !== ''
          },
          [Validators.required, Validators.min(0.1)]
        ),

        aliadoComercialId: new FormControl({
          value: financiamientoForm.aliadoComercialId != 0 ? financiamientoForm.aliadoComercialId : null,
          disabled: this.state !== ''
        }),
        sedeId: new FormControl(
          {
            value: financiamientoForm.sedeId != 0 ? financiamientoForm.sedeId : null,
            disabled: this.state !== ''
          },
          Validators.required
        ),

        fechaEntregaFinal: new FormControl({
          value: moment(financiamientoForm.fechaEntregaFinal),
          disabled: this.state !== ''
        }),
        nroDiasRango: new FormControl({
          value: financiamientoForm.nroDiasRango,
          disabled: this.state !== ''
        }),
        tipoPago: new FormControl(
          { value: financiamientoForm.tipoPago, disabled: this.state !== '' },
          RxwebValidators.required({ conditionalExpression: (x, y) => x.excesoLinea })
        ),

        despacho: new FormGroup({
          departamentoId: new FormControl({
            value:
              financiamientoForm.despacho != null && financiamientoForm.despacho.departamentoId != null
                ? financiamientoForm.despacho.departamentoId.toString()
                : null,
            disabled: this.state !== ''
          }),
          provinciaId: new FormControl({
            value:
              financiamientoForm.despacho != null && financiamientoForm.despacho.provinciaId != null
                ? financiamientoForm.despacho.provinciaId.toString()
                : null,
            disabled: this.state !== ''
          }),
          distritoId: new FormControl({
            value:
              financiamientoForm.despacho != null && financiamientoForm.despacho.distritoId != null
                ? financiamientoForm.despacho.distritoId.toString()
                : null,
            disabled: this.state !== ''
          }),
          calleDespacho: new FormControl({
            value: financiamientoForm.despacho != null ? financiamientoForm.despacho.calleDespacho : null,
            disabled: this.state !== ''
          }),
          referenciaDespacho: new FormControl({
            value: financiamientoForm.despacho != null ? financiamientoForm.despacho.referenciaDespacho : null,
            disabled: this.state !== ''
          }),
          fechaRecojo: new FormControl({
            value:
              financiamientoForm.despacho != null && financiamientoForm.despacho.fechaRecojo
                ? moment(financiamientoForm.despacho.fechaRecojo)
                : null,
            disabled: this.state === 'read'
          }),
          horarioRecojo: new FormControl({
            value:
              financiamientoForm.despacho != null && financiamientoForm.despacho.horarioRecojo
                ? financiamientoForm.despacho.horarioRecojo.toString()
                : null,
            disabled: this.state === 'read'
          }),
          costoEnvioDespacho: new FormControl({
            value: financiamientoForm.despacho != null ? financiamientoForm.despacho.costoEnvioDespacho : null,
            disabled: this.state !== ''
          }),
          otraSedeTiendaId: new FormControl({
            value:
              financiamientoForm.despacho != null && financiamientoForm.despacho.otraSedeTiendaId != null
                ? financiamientoForm.despacho.otraSedeTiendaId.toString()
                : null,
            disabled: this.state !== ''
          }),
          quienRecibe: new FormControl({
            value:
              financiamientoForm.despacho != null && financiamientoForm.despacho.quienRecibe
                ? financiamientoForm.despacho.quienRecibe.toString()
                : '1',
            disabled: this.state !== ''
          }),
          tipoDespacho: new FormControl({
            value:
              financiamientoForm.despacho != null && financiamientoForm.despacho.tipoDespacho
                ? financiamientoForm.despacho.tipoDespacho.toString()
                : '1',
            disabled: this.state !== ''
          }),
          otraPersona: new FormGroup({
            dni: new FormControl({
              value:
                financiamientoForm.despacho != null && financiamientoForm.despacho.otraPersona != null
                  ? financiamientoForm.despacho.otraPersona.dni
                  : null,
              disabled: this.state !== ''
            }),
            nombre: new FormControl({
              value:
                financiamientoForm.despacho != null && financiamientoForm.despacho.otraPersona != null
                  ? financiamientoForm.despacho.otraPersona.nombre
                  : null,
              disabled: this.state !== ''
            }),
            parentesco: new FormControl({
              value:
                financiamientoForm.despacho != null && financiamientoForm.despacho.otraPersona != null
                  ? financiamientoForm.despacho.otraPersona.parentesco
                  : null,
              disabled: this.state !== ''
            })
          })
        })
      },
      {
        validators: [
          CustomValidators.dateLessThan('fechaVenta', 'fechaEntrega') //,
          // CustomValidators.dateLessThan('fechaVenta', 'despacho.fechaRecojo')
        ]
      }
    );
  }

  calcularCuota(montoEvaluar: number, nroCuota: number, tasaMensual: number): number {
    const tasa = tasaMensual; // 0.0234056907962921;

    let montoPago = (tasa * Math.pow(1 + tasa, nroCuota) * montoEvaluar) / (Math.pow(1 + tasa, nroCuota) - 1);
    montoPago = Math.round(montoPago * 100) / 100;

    return montoPago;
  }

  obtenerListaProveedores(aliadoComercial: number, canalVenta: number) {
    aliadoComercial = aliadoComercial == null ? 0 : aliadoComercial;
    return this._financiamientoService.cargarProveedores(aliadoComercial, canalVenta).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  obtenerListaProductos(
    aliadoComercial: any,
    proveedor: number,
    canalVenta: number,
    term: any
  ): Observable<Producto[]> {
    if (typeof term !== 'string') {
      return of([]);
    }
    aliadoComercial = aliadoComercial == null ? 0 : aliadoComercial;
    return this._financiamientoService.cargarProductos(aliadoComercial, proveedor, canalVenta, term).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  obtenerListaAliadoProveedor(
    aliadoComercial: any,
    canalVenta: number,
    term: any
  ): Observable<AliadoComercial[]> {
    if (typeof term !== 'string') {
      return of([]);
    }
    aliadoComercial = aliadoComercial == null ? 0 : aliadoComercial;
    return this._financiamientoService.cargarAliadoProveedor(aliadoComercial, canalVenta, term).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  obtenerListaComboProducto(aliadoComercial: number, canalVenta: number, term: any): Observable<any> {
    if (typeof term !== 'string') {
      return of([]);
    }
    aliadoComercial = aliadoComercial == null ? 0 : aliadoComercial;
    canalVenta = canalVenta == null ? 0 : canalVenta;
    return this._financiamientoService.cargarComboProductos(aliadoComercial, canalVenta, term).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  obtenerListaVendedores(term: any): Observable<Option[]> {
    if (typeof term !== 'string') {
      return of([]);
    }

    return this._financiamientoService.cargarVendedores(term).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  obtenerHistorialCredito(numeroDocumento: any, tipoDoc: any): Observable<JsonResult<any>> {
    let params = new HttpParams();

    if (numeroDocumento) {
      params = params.append('numeroDocumento', numeroDocumento);
    }

    if (tipoDoc) {
      params = params.append('tipoDocumento', tipoDoc);
    }

    const url = `${this._enviromentService.urlBaseServicios}financiamiento/historialCredito`;
    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  buscarUbigeo(nivel: number, ubigeoId: number): Observable<Option[]> {
    return this._financiamientoService.buscarUbigeo(nivel, ubigeoId).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  buscarDireccion(cuentaCorriente: string): Observable<any> {
    return this._financiamientoService.buscarDireccion(cuentaCorriente).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  obtenerSedesAliado(aliadoComercialId: number): Observable<Option[]> {
    return this._financiamientoService.obtenerSedesAliado(aliadoComercialId).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  grabarFinanciamiento(financiamientoForm: FinanciamientoForm) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        if (financiamientoForm.id === 0 || financiamientoForm.fechaEntrega === null) {
          this.registrarFinanciamiento(financiamientoForm);
        } else {
          this.registrarEntrega(financiamientoForm);
        }
      }
    });
  }

  imprimirDocumento(nombreArchivo: any) {
    
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    this._financiamientoService.imprimirFinanciamiento(nombreArchivo).subscribe(blobFile => {
      if (isIEOrEdge) {
        window.open(blobFile, '_blank');
      } else {
        this.downLoadFile(blobFile, 'application/pdf');
      }
    });
  }

  exportarDocumento(financiamiento: any) {
    this._financiamientoService.exportarFinanciamiento(financiamiento).subscribe(blobFile => {
      const url = window.URL.createObjectURL(blobFile);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'Financimientos.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  downLoadFile(data: any, type: string) {

    const blob = new Blob([data], { type: type.toString() });
    const url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');

    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  anularFinanciamiento(financiamiento: any) {
    const dialogRef = this.dialog.open(FinanciamientoAnulacionComponent, {
      width: '50%',
      data: {
        financiamiento: financiamiento,
        motivos: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelar();
      }
    });
  }

  cancelar() {
    if (this.state === '') {
      this._router.navigate(['consulta-credito']);
    } else {
      this._router.navigate(['financiamientosfilter', 'filter']);
    }
  }

  private registrarFinanciamiento(financiamientoForm: FinanciamientoForm) {
    this._financiamientoService
      .grabarFinanciamiento(financiamientoForm)
      .pipe(
        filter(p => p.valid),
        map(p => p.data)
      )
      .subscribe(response => {
        let nroPedido: string = response.nroPedidoVenta;
        let pedidos: string[] = nroPedido.split('|');
        let texto: string = '';
        if (nroPedido.trim() != '') {
          pedidos.forEach(nro => {
            texto += '<i class="far fa-check-circle"></i> N° Pedido Venta: ' + nro + '<br>';
          });
        }
        swal('La operación se realizó satisfactoriamente', '<div class="alert_content">' + texto + '</div>', 'success');

        this.cancelar();
        if (response.nombreArchivo && financiamientoForm.canalVentaId != 2) {
          this.imprimirDocumento(response.nombreArchivo); // imprimimos el documento.
        }
        //if (financiamientoForm.canalVentaId == 2) {
          this.dialog.open(FinanciamientoEncuestaComponent, {
            width: '50%',
            data: {
              clienteId: financiamientoForm.clienteId,
              financiamientoId: response.financiamientoId
            }
          });
        //}
      });
  }

  private registrarEntrega(financiamientoForm: FinanciamientoForm) {
    this._financiamientoService
      .procesarEntrega(financiamientoForm.id, financiamientoForm.fechaEntrega, financiamientoForm.nroBoleta)
      .pipe(
        filter(p => p.valid),
        map(p => p.data)
      )
      .subscribe(response => {
        swal(
          'Se realizó satisfactoriamente la entrega del producto',
          '<div class="alert_content">' +
            '<i class="far fa-check-circle"></i> N° Pedido Venta: ' +
            response.nroPedidoVenta +
            '<br>' +
            '</div>',
          'success'
        );

        this.cancelar();
      });
  }
  tasaMensualFinanciamiento(): Observable<number> {
    return this._financiamientoService.tasaMensualFinanciamiento();
  }

  openEmailSender(financiamientoId: number, clientEmail: string) {
    const dialogRef = this.dialog.open(EmailSenderComponent, {
      width: '50%',
      data: {
        type: 'ReenviarFinanciamiento',
        data: financiamientoId,
        clientEmail: clientEmail
      }
    });
  }

  openAdjuntarArchivo(financiamientoId: number,nroPedido: string) {
    const dialogRef = this.dialog.open(FinanciamientoArchivoComponent, {
      width: '50%',
      data: {        
        financiamientoId: financiamientoId ,
        nroPedido:nroPedido,
        descripcion:'' ,
        nombreArchivo:''    
      }
    });
  }
}

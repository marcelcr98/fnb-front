import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/backend.service.index';
import { UsuarioEdicionService } from '../services/feature.service.index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  forma: FormGroup;

  public showPassword: boolean = false;


  constructor(public _authenticationService: AuthenticationService, public router: Router) {}

  ngOnInit() {
    this.setForm();
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  setForm() {
    const usuarioGuardado = this._authenticationService.getStoredUser();
    this.forma = new FormGroup({
      usuario: new FormControl(usuarioGuardado, Validators.required),
      password: new FormControl('', Validators.required),
      captcha: new FormControl('*'),
      valor: new FormControl('')
    });
  }

  ingresar() {
    if (this.forma.invalid) {
      return;
    }

    this._authenticationService.login(this.forma.value).subscribe(response => {
      if (response.valid) {
        this.router.navigate(['/dashboard']);
      } else {
        if (response.message == 'Contraseña incorrecta') {
          this.generateCode();
          document.getElementById('Sequre').hidden = false;
          this.forma.get('captcha').setValue('');
        } else {
          document.getElementById('Sequre').hidden = true;
          this.forma.get('captcha').setValue('*');
        }
      }
    });
  }

  onInput(value) {
    if (value != null && value != this.forma.get('valor').value) {
      this.forma.get('captcha').setErrors([{ confirmedDoesNotMatch: true }]);
    } else {
      this.forma.get('captcha').setErrors(null);
    }
  }

  validerBlank(value) {
    if (value.isNullOrUndefined) return false;
    return true;
  }

  generateCode() {
    var strCaracteresPermitidos =
      'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
    var strArrayCaracteres = new Array(34);
    var lon = 4;
    strArrayCaracteres = strCaracteresPermitidos.split(',');
    var length = lon,
      i = 0,
      j,
      tmpstr = '';
    do {
      var randscript = -1;
      while (randscript < 1 || randscript > strArrayCaracteres.length || isNaN(randscript)) {
        randscript = parseInt((Math.random() * strArrayCaracteres.length).toString());
      }
      j = randscript;
      tmpstr = tmpstr + strArrayCaracteres[j];
      i = i + 1;
    } while (i < length);

    this.forma.get('valor').setValue(tmpstr);
    this.forma.get('captcha').setValue('');

    var ctxCanvas: any = document.getElementById('canvasOculto');
    ctxCanvas = ctxCanvas.getContext('2d');
    ctxCanvas.canvas.width = ctxCanvas.measureText(tmpstr).width;
    ctxCanvas.fillText(tmpstr, 0, 10);
  }
}

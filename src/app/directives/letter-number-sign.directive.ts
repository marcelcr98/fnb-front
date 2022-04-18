import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[letterNumberSign]'
})
export class LetterNumberSignDirective {

  constructor(public el: ElementRef, public renderer: Renderer2) {}

  @HostListener('paste', ['$event']) onPaste(e) {
    const pattern =  /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.?¿&%$\,\-\s\u00f1\u00d1]*$/g;
    if (!pattern.test(e.clipboardData.getData('text'))) e.preventDefault();
  }

  @HostListener('keypress', ['$event']) onInput(e) {
    const pattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.?¿&%$\,\-\s\u00f1\u00d1]*$/g;
    if (!pattern.test(e.key)) e.preventDefault();
  }
}

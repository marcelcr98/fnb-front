import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[onlyLetterSpaceNumber]'
})
export class OnlyLetterSpaceNumberDirective {
  constructor(public el: ElementRef, public renderer: Renderer2) {}

  @HostListener('paste', ['$event']) onPaste(e) {
    const pattern = /^[A-Za-z0-9 áéíóúÁÉÍÓÚÑñ]*$/g;
    if (!pattern.test(e.clipboardData.getData('text'))) e.preventDefault();
  }

  @HostListener('keypress', ['$event']) onInput(e) {
    const pattern = /^[A-Za-z0-9 áéíóúÁÉÍÓÚÑñ]*$/g;
    if (!pattern.test(e.key)) e.preventDefault();
  }
}

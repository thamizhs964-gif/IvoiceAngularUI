import { Directive, HostListener } from '@angular/core';
@Directive({
  selector: '[appSelectOnFocus]',
  standalone: true
})
export class SelectOnFocusDirective {

  constructor() { }

  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent): void {

    const input = event.target as HTMLInputElement | null;

    if (input && input.value) {
      setTimeout(() => input.select(), 0);
    }

  }

}
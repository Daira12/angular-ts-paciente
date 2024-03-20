import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string = ''; // Placeholder
  @Input() type: string = 'text'
  @Input() bloquearInput: boolean = false; // Nuevo input para bloquear el input

  isFocused: boolean = false;
  value: string = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // Método para actualizar el valor
  updateValue(event: Event): void {
    if (this.bloquearInput) return; 
    const target = event.target as HTMLInputElement; // Convertir event.target a HTMLInputElement
    const newValue = target.value; // Acceder a 'value' del elemento de entrada
    this.value = newValue;
    this.onChange(newValue);
    this.onTouch(newValue);
  }

  clearFields(): void {
    this.value = ''; // Limpiar el valor del input
  }

  
  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    if (!this.value) {
      this.isFocused = false;
    }
  }
}

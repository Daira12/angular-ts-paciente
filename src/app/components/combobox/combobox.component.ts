import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true
    }
  ]
})
export class ComboboxComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() placeholder: string = '';
  value: any = '';
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  writeValue(value: any): void {
    this.value = value ;
    this.cdr.detectChanges(); 

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  updateValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.value = newValue;
    this.onChange(newValue);
    this.onTouch(newValue);
    this.cdr.detectChanges(); 
  }
  isFocused: boolean = false;
  clearFields(): void {
    this.value = ''; // Limpiar el valor del combobox
  }

  onFocus() {
    this.isFocused = true;
  }

  // Método para manejar el evento de pérdida de enfoque
  onBlur() {
    this.isFocused = false;
  }

}

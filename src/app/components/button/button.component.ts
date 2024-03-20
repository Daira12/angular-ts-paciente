import { Component, EventEmitter, Input, Output, input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.css']
})

export class ButtonComponent {
    @Input() buttonText: string = 'Button Text';
    @Input() redirectUrl : string | null = '/';
    @Output() handleButtonClick: EventEmitter<void> = new EventEmitter<void>();
    @Output() clearFieldsClick: EventEmitter<void> = new EventEmitter<void>();


    constructor(private router: Router) {}

    handleClick(): void {
        if (this.redirectUrl == "eliminar") {
          
          return;
      }else if (this.redirectUrl) {
        this.handleButtonClick.emit();
            this.router.navigateByUrl(this.redirectUrl);
        } else {
          this.handleButtonClick.emit();
        }
      }

      clearFields(): void {
        this.clearFieldsClick.emit();
    }
    
}

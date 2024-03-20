import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PatientService } from '../services/paciente.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent {
  @Input() data: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private patienteService : PatientService){

  }

  getDataForCurrentPage(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.data.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  editarFila(item: any ) {
    this.cookieService.delete('pacienteData');
    this.cookieService.delete('acompananteData');
    
    this.cookieService.set('pacienteData', JSON.stringify(item));
    this.patienteService.getAcompanateByPaciente(item.paciente_id).subscribe(data => {
      if(data.length > 0) {
        this.cookieService.set('acompananteData', JSON.stringify(data[0]));
      }      
    });
    setTimeout(() => {
    this.router.navigateByUrl('/crear-paciente');
  }, 500);
  }
}

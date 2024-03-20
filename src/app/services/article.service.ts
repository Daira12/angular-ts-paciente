import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientService } from './paciente.service';


@Injectable({
   providedIn: 'root'
})
export class ArticleService {
   constructor(
      private patientService: PatientService,
    ) { }


   getDynamicColumns1() {
      return ['paciente_id', 'nombre_completo', 'Tipo_de_Documento', 'Numero_de_Documento', 'Fecha_Nacimiento'];
   }
   getDisplayColumnNames1() {
      return ['paciente_id', 'nombre_completo', 'Tipo_de_Documento', 'Numero_de_Documento', 'Fecha_Nacimiento'];
   }


} 

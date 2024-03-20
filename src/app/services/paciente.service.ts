
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
 })
 export class PatientService {
   private datosCompartidos = new BehaviorSubject<any>(null);
   datosCompartidos$ = this.datosCompartidos.asObservable();

   constructor(
      private _http: HttpClient,
      private cookieService: CookieService
  ) {
      this.initializeData();
  }
  
  enviarDatos(datos: any) {
   this.datosCompartidos.next(datos);
 }
  
  initializeData(): void {
   if (!this.cookieService.check('comboList')) {
       this.getComboList().subscribe(data => {
           this.cookieService.set('comboList', JSON.stringify(data));
       });
   }

   if (!this.cookieService.check('departamento')) {
       this.getComboUbigeo().subscribe(data => {
           this.cookieService.set('departamento', JSON.stringify(data));
       });
   }

   if (!this.cookieService.check('pacienteList')) {
       this.getPacienteList().subscribe(data => {
           this.cookieService.set('pacienteList', JSON.stringify(data));
       });
   }
}

   getComboList(): Observable<any> {
      return this._http.get<any[]>('http://localhost:8080/util/combos'); 
   }

   getComboUbigeo(departamento?: string, provincia?: string): Observable<any> {
      let url = 'http://localhost:8080/util/ubigeo';
      if (departamento) {
         url += `?codDepartamento=${departamento}`;
      }

      if (departamento && provincia) {
         url += `&codProvincia=${provincia}`;
      }

      const data =  this._http.get<any[]>(url); 
      return data
  }

   getComboListFromCookie(): any {
      const comboListString = this.cookieService.get('comboList');
      const departamentoList = this.cookieService.get('departamento');
      if (comboListString) {
         const listarCombos = JSON.parse(decodeURIComponent(comboListString));
         if (departamentoList) {
            listarCombos.listDepartamento = JSON.parse(decodeURIComponent(departamentoList));            
         }
         return listarCombos       
      }
      return null;
   }

   getTableListFromCookie(): any {
      const pacienteListString = this.cookieService.get('pacienteList');
      if (pacienteListString) {
         const listarPacientes = JSON.parse(decodeURIComponent(pacienteListString));
         return this.mapearDatos(listarPacientes)       
      }
      return null
      
   }

   getPacienteDocument(idTipoDocumento: string, numDocumento: string): Observable<any> {
      let url = `http://localhost:8080/paciente/consultar/documento?idTipoDocumento=${idTipoDocumento}&numDocumento=${numDocumento}`;
      const data =  this._http.get<any[]>(url); 
      return data
   }

  getPacienteList(nombres?: string, apellidos?: string): Observable<any> {
      let url = `http://localhost:8080/paciente/listar`
      if (nombres || apellidos) {
         url += `?`;
       }
   
       if (nombres) {
         url += `nombres=${encodeURIComponent(nombres)}`;
       }
   
       if (apellidos) {
         if (nombres) {
           url += `&`;
         }
         url += `apellidos=${encodeURIComponent(apellidos)}`;
       }
   
      const data = this._http.get<any[]>(url);
      return data
   }

   mapearDatos(datos: any[]){
      return datos.map((dato: any) => ({
          Id: dato.paciente_id,
          Nombres: dato.nombre_completo,
          Tipo_de_Documento: dato.des_tipo_documento,
          Numero_de_Documento: dato.numero_documento,
          Fecha_Nacimiento: dato.fecha_nacimiento
      }));
    }

    savePaciente(paciente: any) : Observable<any> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json'
       });

       const data = this._http.post<any[]>('http://localhost:8080/paciente/guardar', paciente, {headers});
      return data
    }

    saveAcompanante(acompanate: any) : Observable<any> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json'
       });

       const data = this._http.post<any[]>('http://localhost:8080/acompanante/guardar', acompanate, {headers});
      return data
    }

    getAcompanateByPaciente(pacienteId: string): Observable<any> {
      let url = `http://localhost:8080/acompanante/consultar/paciente?pacienteId=${pacienteId}`
      const data = this._http.get<any[]>(url);
      return data
   }

}
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { Observable, of } from 'rxjs';
import { ComboboxComponent } from '../components/combobox/combobox.component';
import { PatientService } from '../services/paciente.service';
import { CookieService } from 'ngx-cookie-service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
interface PacienteData {
  nombre_completo: string;
  ape_paterno: string;
  ape_materno: string;
  nombres: string;
  des_tipo_documento: string;
  numero_documento: string;
  des_sexo: string;
  fecha_nacimiento: string;
  paciente_id: string;
  lugar_nacimiento: string;
  direccion: string;
  codigo_ubigeo: string;
}

interface PacienteTable {
  Nombres: string;
  Tipo_de_Documento: string;
  Numero_de_Documento: string;
  Fecha_Nacimiento: string;
  
}

@Component({
  selector: 'app-consulta-paciente',
  templateUrl: './consulta-paciente.component.html',
  styleUrls: ['./consulta-paciente.component.css']
})
export class ConsultaPacienteComponent implements OnInit   {
  isNumeroDocumentoValid: boolean = false;
  nombreValido: boolean = false;
  apellidoValido: boolean = false;


  tipoDocumentos = [];
  tablaData = []
  dynamicColumns1!: string[];
  displayColNames1!: string[];

  formData = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: ''
  };
  

  constructor(
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private patientService: PatientService,
    private cookieService: CookieService
  ) { }
  
  submitForm(submit : boolean) {
    if(submit){
      if((!this.formData.tipoDocumento && this.isNumeroDocumentoValid) ||
      (this.formData.tipoDocumento && !this.isNumeroDocumentoValid)
      ){
        const parameter = this.isNumeroDocumentoValid ? "Tipo de documento": "Numero de documento"
        Swal.fire({
          icon: "error",
          title: "Error en la consulta",
          text: `${parameter}. Es requerido`,
        })
      }
  
      if( this.formData.tipoDocumento && this.isNumeroDocumentoValid ){
        this.patientService.getPacienteDocument(this.formData.tipoDocumento, this.formData.numeroDocumento).subscribe(data => {
          this.tablaData = data
        })
      }
  
      if(this.apellidoValido || this.nombreValido){
        this.patientService.getPacienteList(this.formData.nombres ?? null, this.formData.apellidos ?? null).subscribe(data => {
          this.tablaData = data
        })
      }
  
      if(!this.formData.tipoDocumento && !this.isNumeroDocumentoValid && !this.apellidoValido && !this.nombreValido){
        Swal.fire({
          icon: "error",
          title: "Error en la consulta",
          text: "Debe ingresar los datos para la consulta",
        })
      }
       
    }else {
      this.clearFields()
    }
   
    
  }
  
  clearFields() {
    this.formData.tipoDocumento = '';
    this.formData.numeroDocumento = '';
    this.formData.nombres = '';
    this.formData.apellidos = '';
    const comboboxElement = this.elRef.nativeElement.querySelector('.custom-combobox') as HTMLSelectElement;
    comboboxElement.value = '';
  }

  ngOnInit() {


    this.tipoDocumentos = this.patientService.getComboListFromCookie().listTipoDocumnento; 

    this.patientService.getPacienteList().subscribe(data => {
      this.tablaData = data
    })
   
 }

 eliminarCookies() {
  this.cookieService.delete('pacienteData');
  this.cookieService.delete('acompananteData');
}

validateNumeroDocumento(numeroDocumento: string) {
  const regex = /^[0-9]{8}$/;
  this.isNumeroDocumentoValid = regex.test(numeroDocumento);
}

validateNombre(string: string) {
  // Aquí puedes definir tu patrón de expresión regular para validar el número de documento
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,20}$/;
  this.nombreValido = regex.test(string);
}
validateApellido(string: string) {
  // Aquí puedes definir tu patrón de expresión regular para validar el número de documento
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,20}$/;
  this.apellidoValido = regex.test(string);
}



}


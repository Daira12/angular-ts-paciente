import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { PatientService } from '../services/paciente.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent implements OnInit {
  isNumeroDocumentoValido: boolean = false;
  nombreValido: boolean = false;
  apellidoPaternoValido: boolean = false;
  apellidoMaternoValido: boolean = false;
  lugarNaciemintoValidoPaciente: boolean = false;
  direccionValidoPaciente: boolean = false;


  nroDocumentoAcompanante: boolean = false;
  apePaternoAcompanante: boolean = false;
  apeMaternoAcompanante: boolean = false;
  nombresAcompanante: boolean = false;
  telefonoAcompanante: boolean = false;
  direccionAcompanante: boolean = false;


  constructor(
    private router: Router,
    private elRef: ElementRef,
    private patientService: PatientService,
    private cookieService: CookieService
  ) { }
  pacienteId = ''
  acompanantepacienteId = ''

  pacienteDepartamento = ""
  acompananteDepartamento = ""
  dataLoaded = false; 

  combos = {
    tipoDocumento: [],
    sexo:[],
    departamento:[],
    provincia: [],
    distrito: [],
    parentesco: []
  }

  paciente = {
    ape_paterno : '', 
    ape_materno : '', 
    nombres : '', 
    tipo_documento : '', 
    numero_documento : '', 
    id_sexo : '',
    fecha_nacimiento : '', 
    edad : 0,
    lugar_nacimiento: '',
    telf_contacto : '', 
    direccion : '', 
    cod_departamento : '',
    cod_provincia : '',
    cod_distrito : '',
    acompanante :{
      ape_paterno : '', 
      ape_materno : '', 
      nombres : '', 
      tipo_documento : '', 
      numero_documento : '', 
      fecha_nacimiento : '', 
      edad : 0,
      parentesco  : '',
      telf_contacto : '', 
      direccion : '', 
      cod_departamento : '',
      cod_provincia : '',
      cod_distrito : ''
    }
  };

  submitForm() {
    if(!this.ValidateRegistrarPaciente()) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar  paciente",
        text: `Debes ingresar todos los datos del paciente`,
      })
    }else {
      const {acompanante, ...datosPaciente} = this.paciente;
      let idPaciente = this.pacienteId ?? '';

      const payloadPaciente = this.mapDataGuardarPaciente(datosPaciente, idPaciente);

      this.patientService.savePaciente(payloadPaciente).subscribe( data => {
        idPaciente = data[0].descripcion;
        if(this.ValidateRegistrarPacienteAcompanante()) {
          let idPacienteAcompnante = this.acompanantepacienteId ?? '';
          const payloadAcompanante = this.mapDataGuardarAcomponanate(acompanante, idPaciente, idPacienteAcompnante);  
          this.patientService.saveAcompanante(payloadAcompanante).subscribe()
      
        }
        
      })
      setTimeout(() => {
        this.clearFields();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Se uardo los datos del Paciente Exitosamente",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigateByUrl('/');
      }, 500);
    }

   

   
  }
  clearFields() {
    this.paciente = {
      ape_paterno : '', 
      ape_materno : '', 
      nombres : '', 
      tipo_documento : '', 
      numero_documento : '', 
      id_sexo : '',
      fecha_nacimiento : '', 
      edad : 0,
      lugar_nacimiento: '',
      telf_contacto : '', 
      direccion : '', 
      cod_departamento : '',
      cod_provincia : '',
      cod_distrito : '',
      acompanante :{
        ape_paterno : '', 
        ape_materno : '', 
        nombres : '', 
        tipo_documento : '', 
        numero_documento : '', 
        fecha_nacimiento : '', 
        edad : 0,
        parentesco  : '',
        telf_contacto : '', 
        direccion : '', 
        cod_departamento : '',
        cod_provincia : '',
        cod_distrito : ''
      }
    };

  
    const comboboxElements = this.elRef.nativeElement.querySelectorAll('.custom-combobox');
    comboboxElements.forEach((element: HTMLSelectElement) => {
        element.value = '';
    });
  }

  ngOnInit() {
    this.loadComboData();
  }

  
  loadComboData() {
    const comboList = this.patientService.getComboListFromCookie();
    this.combos = {
      departamento: comboList.listDepartamento,
      distrito: [],
      parentesco: comboList.listParentesco,
      provincia: [],
      sexo: comboList.listSexo,
      tipoDocumento: comboList.listTipoDocumnento
    }
    const dataPaciente = this.cookieService.get('pacienteData');
      if(dataPaciente){ 
        const pacienteData = JSON.parse(dataPaciente);
        this.pacienteId = pacienteData.paciente_id
       this.paciente.tipo_documento = pacienteData.cod_tipo_documento;
       this.paciente.numero_documento= pacienteData.numero_documento;
       this.paciente.ape_paterno = pacienteData.ape_paterno;
       this.paciente.ape_materno = pacienteData.ape_materno ;
       this.paciente.nombres = pacienteData.nombres;
       this.paciente.id_sexo= pacienteData.cod_sexo;
       this.paciente.fecha_nacimiento = pacienteData.fecha_nacimiento;
       this.paciente.lugar_nacimiento= pacienteData.luga_nacimiento;
       this.paciente.direccion= pacienteData.direccion;
      const codioUbigeo = pacienteData.codigo_ubigeo
       this.paciente.cod_departamento = codioUbigeo.substring(0, 2);
       this.updatePacienteDepartamento({ target: { value: codioUbigeo.substring(0, 2) } });
       this.paciente.cod_provincia = codioUbigeo.substring(2, 4);
       this.updatePacienteProvincia({ target: { value: codioUbigeo.substring(2, 4) } });
       this.paciente.cod_distrito = codioUbigeo.substring(4, 6);
      }

      let acompananteData = this.cookieService.get('acompananteData');
       if(acompananteData){
         const dataAcompanante = JSON.parse(acompananteData)
         this.acompanantepacienteId = dataAcompanante.acompanante_paciente_id
         this.paciente.acompanante.ape_paterno  = dataAcompanante.ape_paterno ;
         this.paciente.acompanante.ape_materno = dataAcompanante.ape_materno ;
         this.paciente.acompanante.nombres = dataAcompanante.nombres ;
         this.paciente.acompanante.tipo_documento = dataAcompanante.id_tipo_docide ;
         this.paciente.acompanante.numero_documento = dataAcompanante.numero_documento ;
         this.paciente.acompanante.fecha_nacimiento = dataAcompanante.fecha_nacimiento ;
         //this.paciente.acompanante.edad = acompananteData. ;
         this.paciente.acompanante.parentesco = dataAcompanante.cod_parentesco ;
         this.paciente.acompanante.telf_contacto = dataAcompanante.telf_contacto ;
         this.paciente.acompanante.direccion = dataAcompanante.direccion ;

         const codioUbigeoAcompanante = dataAcompanante.codigo_ubigeo

         this.updateAcompananteDepartamento({ target: { value: codioUbigeoAcompanante.substring(0, 2) } });
         this.paciente.acompanante.cod_departamento  =  codioUbigeoAcompanante.substring(0, 2);
         this.paciente.acompanante.cod_provincia = acompananteData.substring(2, 4);
         this.updateAcompananteProvincia({ target: { value: codioUbigeoAcompanante.substring(2, 4) } });
         this.paciente.acompanante.cod_distrito = codioUbigeoAcompanante.substring(4, 6);
       }
       this.dataLoaded = true; // 
  }

  updatePacienteDepartamento(event: any){
    const departamento = event.target.value;
    this.pacienteDepartamento = departamento;
    this.patientService.getComboUbigeo(departamento).subscribe(provincia => {
      this.combos.provincia = provincia;
    }); 
  }
  
  updatePacienteProvincia(event: any){
    const provincia = event.target.value;
    const departamento = this.pacienteDepartamento;
    this.patientService.getComboUbigeo(departamento, provincia).subscribe(distrito => {
      this.combos.distrito = distrito;
      
    })
  }

  forceChangeDetection() {
    setTimeout(() => {
      this.dataLoaded = true; // Marcar los datos como cargados
    });
  }

  updateAcompananteDepartamento(event: any){
    const departamento = event.target.value;
    this.acompananteDepartamento = departamento;
    this.patientService.getComboUbigeo(departamento).subscribe(provincia => {
      this.combos.provincia =provincia;
    }); 
  }
  
  updateAcompananteProvincia(event: any){
    const provincia = event.target.value;
    const departamento = this.acompananteDepartamento;
    this.patientService.getComboUbigeo(departamento, provincia).subscribe(distrito => {
      this.combos.distrito =distrito;
      
    })
  }

  mapDataGuardarPaciente  = (data : any, paciente_id: string)  => {
    return {
      cod_tipo_documento : data.tipo_documento ,
      numero_documento : data.numero_documento ,
      ape_paterno : data.ape_paterno ,
      ape_materno : data.ape_materno ,
      nombres : data.nombres ,
      cod_sexo : data.id_sexo ,
      fecha_nacimiento : data.fecha_nacimiento ,
      luga_nacimiento : data.lugar_nacimiento ,
      direccion : data.direccion ,
      codigo_ubigeo : data.cod_departamento + data.cod_provincia + data.cod_distrito,
      paciente_id,
    }
  }
  mapDataPaciente  = (data : any, paciente_id: string)  => {
    return {
      tipo_documento : data.cod_tipo_documento, 
      numero_documento: data.numero_documento,
       ape_paterno : data.ape_paterno, 
       ape_materno: data.ape_materno ,
       nombres: data.nombres,
       id_sexo: data.cod_sexo,
       fecha_nacimiento : data.fecha_nacimiento,
       lugar_nacimiento: data.luga_nacimiento,
       direccion: data.direccion,
      paciente_id,
    }
  }

  mapDataGuardarAcomponanate = (data: any, paciente_id: string, paciente_acompanante_id: string ) => {
    return {
      ape_paterno : data.ape_paterno ,
      ape_materno : data.ape_materno ,
      nombres : data.nombres ,
      cod_tipo_documento : data.tipo_documento ,
      numero_documento  : data.numero_documento ,
      fecha_nacimiento : data.fecha_nacimiento ,
       parentesco_id : data.parentesco  ,
       num_telefono : data.telf_contacto ,
       direccion : data.direccion ,
       codigo_ubigeo : data.cod_departamento + data.cod_provincia + data.cod_distrito,
      paciente_id: paciente_id ,
      paciente_acompanante_id: paciente_acompanante_id,
    }
  }



  seleccionaDatePaciente (fecha: any) {
    const edad = this.calcularEdad(fecha);
    this.paciente.edad = edad

  }

  seleccionaDateAcompanate (fecha: any) {
    const edad = this.calcularEdad(fecha);
    this.paciente.acompanante.edad = edad

  }

  calcularEdad(fechaNacimiento: string): number {
    const fechaNac: Date = new Date(fechaNacimiento);
    if (isNaN(fechaNac.getTime())) {
        return 0;
    }

    const fechaActual: Date = new Date();
    const fechaMinima: Date = new Date();
    fechaMinima.setFullYear(fechaActual.getFullYear() - 150);
    if (fechaNac.getTime() > fechaActual.getTime() || fechaNac.getTime() < fechaMinima.getTime()) {
        return 0;
    }
    const diferencia: number = fechaActual.getTime() - fechaNac.getTime();
    const edad: number = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25)); 
    return edad;
}


validateNumeroDocumento(numeroDocumento: string) {
  if(this.paciente.tipo_documento == '1'){
    const regexDNI = /^\d{8}$/; 
    this.isNumeroDocumentoValido = regexDNI.test(numeroDocumento)
  }
  
  if (this.paciente.tipo_documento === '2' || this.paciente.tipo_documento === '3'){
    const regexPasaporte = /^[A-Za-z0-9]{1,15}$/; 
    this.isNumeroDocumentoValido = regexPasaporte.test(numeroDocumento);
  }
}

validateNombre(string: string) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,20}$/;
  this.nombreValido = regex.test(string);
}
validateApellidoPaterno(string: string) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,20}$/;
  this.apellidoPaternoValido = regex.test(string);
}

validateApellidoMaterno(string: string) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,20}$/;
  this.apellidoMaternoValido = regex.test(string);
}

validateLugarNacimiento(data:string){
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,40}$/;
  this.lugarNaciemintoValidoPaciente = regex.test(data);
}

validateDireccion(data:string) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,40}$/;
  this.direccionValidoPaciente = regex.test(data);
}


validateNumDocAcompanante(numeroDocumento: string) {
  if(this.paciente.acompanante.tipo_documento == '1'){
    const regexDNI = /^\d{8}$/; 
    this.nroDocumentoAcompanante = regexDNI.test(numeroDocumento)
  }
  
  if (this.paciente.acompanante.tipo_documento === '2' || this.paciente.acompanante.tipo_documento === '3'){
    const regexPasaporte = /^[A-Za-z0-9]{1,15}$/;
    this.nroDocumentoAcompanante = regexPasaporte.test(numeroDocumento);
  }
 
}

validateapePaternoAcompanante(data: string) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,40}$/;
  this.apePaternoAcompanante = regex.test(data);
}

validateapeMaternoAcompanante(data: string) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,40}$/;
  this.apeMaternoAcompanante = regex.test(data);
}

validatenombresAcompanante(data: string) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,40}$/;
  this.nombresAcompanante = regex.test(data);
}

validatetelefonoAcompanante(data: string) {
  const regex = /^\d{9}(,\d{9})?$/;
  this.telefonoAcompanante = regex.test(data);
}

validatedireccionAcompanante(data: string) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,40}$/;
  this.direccionAcompanante = regex.test(data);
}


ValidateRegistrarPaciente(): boolean{
  if(
    this.isNumeroDocumentoValido &&
    this.nombreValido &&
    this.apellidoPaternoValido &&
    this.apellidoMaternoValido &&
    this.lugarNaciemintoValidoPaciente &&
    this.direccionValidoPaciente &&
    this.paciente.tipo_documento &&
    this.paciente.cod_departamento &&
    this.paciente.cod_provincia &&
    this.paciente.cod_distrito &&
    this.paciente.fecha_nacimiento &&
    this.paciente.direccion &&
    this.paciente.id_sexo 
  ){
    return true
  }

  return false
}



ValidateRegistrarPacienteAcompanante(): boolean{

  const algunCampoLleno =
    this.direccionAcompanante ||
    this.telefonoAcompanante ||
    this.nombresAcompanante ||
    this.apeMaternoAcompanante ||
    this.apePaternoAcompanante ||
    this.nroDocumentoAcompanante ||
    this.paciente.acompanante.tipo_documento ||
    this.paciente.acompanante.cod_departamento ||
    this.paciente.acompanante.cod_provincia ||
    this.paciente.acompanante.cod_distrito ||
    this.paciente.acompanante.fecha_nacimiento ||
    this.paciente.acompanante.parentesco;


    if (algunCampoLleno) {
      const todosCamposLlenos =
        this.direccionAcompanante &&
        this.telefonoAcompanante &&
        this.nombresAcompanante &&
        this.apeMaternoAcompanante &&
        this.apePaternoAcompanante &&
        this.nroDocumentoAcompanante &&
        this.paciente.acompanante.tipo_documento &&
        this.paciente.acompanante.cod_departamento &&
        this.paciente.acompanante.cod_provincia &&
        this.paciente.acompanante.cod_distrito &&
        this.paciente.acompanante.fecha_nacimiento &&
        this.paciente.acompanante.parentesco;
  
      return true;
    }
  
    return false;
}

}


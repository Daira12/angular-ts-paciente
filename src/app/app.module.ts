import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ButtonComponent  } from "./components/button/button.component";
import { HomeComponent } from "./home/home.component";
import { ConsultaPacienteComponent } from "./consulta-paciente/consulta-paciente.component";
import { CrearPacienteComponent } from "./crear-paciente/crear-paciente.component";
import { RouterModule, Routes } from "@angular/router";
import { InputComponent } from "./components/input/input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableComponent } from "./components/table/table.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ComboboxComponent } from "./components/combobox/combobox.component";
import { HttpClientModule } from "@angular/common/http";
import { TableDataComponent } from "./table-data/table-data.component";


const routes: Routes = [
    { path: '' , component: HomeComponent},
    { path: 'consulta-paciente' , component: ConsultaPacienteComponent},
    { path: 'crear-paciente' , component: CrearPacienteComponent},
]

@NgModule({
    declarations: [
        AppComponent,
        ButtonComponent,
        InputComponent,
        HomeComponent,
        ConsultaPacienteComponent,
        CrearPacienteComponent,
        TableComponent,
        ComboboxComponent,
        CrearPacienteComponent,
        TableDataComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
    ],
    providers: [
        provideAnimationsAsync()
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }

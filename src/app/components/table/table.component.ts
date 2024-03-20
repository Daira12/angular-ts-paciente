import { Component, Input, ViewChild, AfterViewInit, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';

import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() dynamicColumns!: string[];
  @Input() displayColumnNames!: string[];
  @Input() dataToDisplay!: Observable<any>;
  dataSource = new MatTableDataSource();


  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.dataToDisplay) {
    this.dataToDisplay.subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges(); 
    });
  }
  }

  ngOnChanges() {
    // Reset the table data if dynamicColumns or displayColumnNames change
    this.dataSource = new MatTableDataSource();
    if (this.dataToDisplay) {
      this.dataToDisplay.subscribe(data => {
        console.log("Pinto la tabla Cambia:", data);
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  editarElementos(row: any) {
    // Lógica para editar el elemento seleccionado
    console.log('Editando elemento:', row);
  }
  
  eliminarElemento(row: any) {
    // Lógica para eliminar el elemento seleccionado
    console.log('Eliminando elemento:', row);
    // Puedes eliminar el elemento de tu dataSource si es necesario
    const index = this.dataSource.data.indexOf(row);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
  }

  agregarNuevoElemento() {

  }
}

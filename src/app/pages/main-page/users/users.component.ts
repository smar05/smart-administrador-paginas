import { UsersService } from './../../../services/users.service';
import { Iusers } from './../../../interface/iusers';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class UsersComponent implements OnInit {
  public displayedColumns: string[] = ['position', 'email', 'actions']; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<Iusers>; //Instancia la data que aparecera en la tabla
  public users: Iusers[] = [];
  public expandedElement!: Iusers | null;
  //public screenSizeSM: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getData();

    //Tamaño de la pantalla
    //Pantalla pequeña si es <767
    /*if (functions.screenSize(0, 767)) {
      this.screenSizeSM = true;
    } else {
      this.screenSizeSM = false;
      this.displayedColumns.splice(1, 0, 'displayName');
      this.displayedColumns.splice(2, 0, 'username');
    }*/
  }

  //Tomar la data de usuarios
  public getData(): void {
    this.userService.getData().subscribe((resp: any): any => {
      let position = 1;
      this.users = Object.keys(resp).map(
        (a) =>
          ({
            id: a,
            position: position++,
            address: resp[a].address,
            city: resp[a].city,
            country: resp[a].country,
            country_code: resp[a].country_code,
            displayName: resp[a].displayName,
            email: resp[a].email,
            idToken: resp[a].idToken,
            method: resp[a].method,
            phone: resp[a].phone,
            picture: resp[a].picture,
            username: resp[a].username,
            wishlist: resp[a].wishlist,
          } as Iusers)
      );
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  //FIltro de busqueda
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

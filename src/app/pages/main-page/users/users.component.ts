import { ICities } from './../../../interface/icities';
import { IState } from './../../../interface/istate';
import { ICountries } from './../../../interface/icountries';
import { LocationService } from './../../../services/location.service';
import { UsersService } from './../../../services/users.service';
import { Iusers } from './../../../interface/iusers';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import '../../../shared/spinkit/sk-cube-grid.css';
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
      state(
        'collapsed,void',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
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
  public loadData: boolean = false;
  public countries: ICountries[] = [];
  public statesByCountry: Map<string, IState[]> = new Map(); // <iso country, estados>
  public citiesByCountryAndStates: Map<string, ICities[]> = new Map(); // <iso country|iso state, ciudades>
  //public screenSizeSM: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UsersService,
    private locationService: LocationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getAllCountries();
    await this.getData();

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
  public async getData(): Promise<void> {
    this.loadData = true;
    let resp: any = await this.userService.getData().toPromise();
    let position = 1;
    this.users = Object.keys(resp).map(
      (a) =>
        ({
          id: a,
          position: position++,
          address: resp[a].address,
          city: resp[a].city,
          country: resp[a].country,
          name: resp[a].name,
          lastName: resp[a].lastName,
          email: resp[a].email,
          phone: resp[a].phone,
          state: resp[a].state,
          idType: resp[a].idType,
          idValue: resp[a].idValue,
        } as Iusers)
    );
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.users.forEach(async (user: Iusers) => {
      await this.getStatesByCountry(user.country, user.state);
      await this.getCitiesByCountryAndState(
        user.country,
        user.state,
        user.city
      );
    });

    this.loadData = false;
  }

  //FIltro de busqueda
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getAllCountries(): void {
    this.locationService.getAllContries().then((resp: ICountries[]) => {
      this.countries = resp;
    });
  }

  public getCountryNameByIso(iso: string): string | undefined {
    return this.countries.find((country: ICountries) => country.iso2 == iso)
      ?.name;
  }

  public getStatesByCountryName(
    isoCountry: string,
    isoState: string
  ): string | undefined {
    if (!isoState) return '';

    if (this.statesByCountry.has(isoCountry)) {
      let states: IState[] | undefined = this.statesByCountry.get(isoCountry);

      return states?.find((state: IState) => state.iso2 == isoState)?.name;
    } else {
      return '';
    }
  }

  public getCitiesByCountryAndStateName(
    isoCountry: string,
    isoState: string,
    idCity: number
  ): string | undefined {
    if (!(isoCountry && isoState && idCity)) return '';

    let key: string = `${isoCountry}|${isoState}`;

    if (this.citiesByCountryAndStates.has(key)) {
      let cities: ICities[] | undefined =
        this.citiesByCountryAndStates.get(key);

      return cities?.find((city: ICities) => city.id == idCity)?.name;
    } else {
      return '';
    }
  }

  public async getStatesByCountry(
    isoCountry: string,
    isoState: string
  ): Promise<void> {
    if (!isoState) return;

    if (!this.statesByCountry.has(isoCountry)) {
      let resp: IState[] = await this.locationService.getAllStatesByCountry(
        isoCountry
      );

      if (resp) {
        this.statesByCountry.set(isoCountry, resp);
      }
    }
  }

  public async getCitiesByCountryAndState(
    isoCountry: string,
    isoState: string,
    idCity: number
  ): Promise<void> {
    if (!(isoCountry && isoState && idCity)) return;

    let key: string = `${isoCountry}|${isoState}`;

    if (!this.citiesByCountryAndStates.has(key)) {
      let resp: ICities[] =
        await this.locationService.getAllCitiesByCountryAndState(
          isoCountry,
          isoState
        );

      if (resp) {
        this.citiesByCountryAndStates.set(key, resp);
      }
    }
  }
}

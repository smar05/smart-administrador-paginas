import { environment } from 'src/environments/environment';
import { ICities } from './../../../interface/icities';
import { IState } from './../../../interface/istate';
import { LocationService } from './../../../services/location.service';
import { ICountries } from './../../../interface/icountries';
import { CountService } from './../../../services/count.service';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from './../../../services/store.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IStore } from './../../../interface/istore';
import { MatTableDataSource } from '@angular/material/table';
import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css'],
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
export class StoresComponent implements OnInit {
  public displayedColumns: string[] = ['position', 'name', 'actions']; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<IStore>; //Instancia la data que aparecera en la tabla
  public stores: IStore[] = [];
  public expandedElement!: IStore | null;
  public loadData: boolean = false;
  public storeImages: Map<string, string> = new Map();
  public countries: ICountries[] = [];
  public statesByCountry: Map<string, IState[]> = new Map(); // <iso country, estados>
  public citiesByCountryAndStates: Map<string, ICities[]> = new Map(); // <iso country|iso state, ciudades>
  //public screenSizeSM: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private storeService: StoreService,
    public dialog: MatDialog,
    public countService: CountService,
    private alertsPagesService: AlertsPagesService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.alertPage();
    this.getAllCountries();
    this.getData();
  }

  //Tomar la data de categorias
  public getData(): void {
    this.loadData = true;
    this.storeService.getData().subscribe((res: any): any => {
      let position = Object.keys(res).length;
      this.stores = Object.keys(res).map(
        (a) =>
          ({
            id: a,
            position: position--,
            abaout: res[a].abaout,
            address: JSON.parse(res[a].address),
            celphone: JSON.parse(res[a].celphone),
            email: JSON.parse(res[a].email),
            idType: res[a].idType,
            idValue: res[a].idValue,
            name: res[a].name,
            principalColor: res[a].principalColor,
            social: JSON.parse(res[a].social),
            url: res[a].url,
          } as IStore)
      );
      this.dataSource = new MatTableDataSource(this.stores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.stores.forEach(async (store: IStore) => {
        await this.getStoreImage(store);

        store.address.forEach(async (address: any) => {
          await this.getStatesByCountry(address.country, address.state);
          await this.getCitiesByCountryAndState(
            address.country,
            address.state,
            address.city
          );
        });
      });

      this.loadData = false;
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

  //Dialogo para una nueva categoria
  public newStore(): void {
    /*const dialogRef = this.dialog.open(NewCategoriesComponent, {
      width: '100%',
    });
    //actualizar estado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });*/
  }

  //Editar Store
  public editStore(id: string): void {
    /*const dialogRef = this.dialog.open(EditCategoriesComponent, {
      width: '100%',
      data: {
        id: id,
      },
    });
    //actualizar estado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });*/
  }

  public async getStoreImage(store: IStore): Promise<void> {
    let urlImage: string = '';

    if (store.id) {
      urlImage = await this.storeService.getImage(`${store.id}/logo`);
    }

    if (urlImage) {
      this.storeImages.set(store.id!, urlImage);
    }
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.categories)
      .subscribe((res: any) => {});
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

import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { EditCountsComponent } from './edit-counts/edit-counts.component';
import { IQueryParams } from './../../../interface/i-query-params';
import { NewCountsComponent } from './new-counts/new-counts.component';
import { alerts } from 'src/app/helpers/alerts';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ICountries } from './../../../interface/icountries';
import { ICities } from './../../../interface/icities';
import { IState } from './../../../interface/istate';
import { LocationService } from './../../../services/location.service';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { ICount, EnumCountPermission } from 'src/app/interface/icount';
import { CountService } from './../../../services/count.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  selector: 'app-counts',
  templateUrl: './counts.component.html',
  styleUrls: ['./counts.component.css'],
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
export class CountsComponent implements OnInit {
  public counts: ICount[] = [];
  public myCount: ICount = {};
  public loading: boolean = false;
  public countries: ICountries[] = [];
  public statesByCountry: Map<string, IState[]> = new Map(); // <iso country, estados>
  public citiesByCountryAndStates: Map<string, ICities[]> = new Map(); // <iso country|iso state, ciudades>
  public displayedColumns: string[] = ['position', 'name', 'email', 'actions']; //Variable para nombrar las columnas de la tabla
  public dataSource!: MatTableDataSource<ICount>; //Instancia la data que aparecera en la tabla
  public expandedElement!: ICount | null;
  public showPermission: boolean = false;

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private countService: CountService,
    private locationService: LocationService,
    public dialog: MatDialog,
    private alertsPagesService: AlertsPagesService
  ) {}

  ngOnInit(): void {
    this.alertPage();
    this.getAllCountries();
    this.getCounts();
  }

  public getCounts(): void {
    this.loading = true;

    let qf: QueryFn = (ref) =>
      ref.where(
        'keyCount',
        '==',
        localStorage.getItem(EnumLocalStorage.localId)
      );

    this.countService
      .getDataFS(qf)
      .toPromise()
      .then((res: IFireStoreRes[]) => {
        let position = Object.keys(res).length;
        this.counts = res.map((a: IFireStoreRes) => {
          return {
            id: a.id,
            position: position--,
            name: a.data.name,
            email: a.data.email,
            celphone: a.data.celphone,
            sex: a.data.sex,
            active: a.data.active,
            country: a.data.country,
            state: a.data.state,
            city: a.data.city,
            permission:
              a.data.permission == EnumCountPermission.admin
                ? EnumCountPermission.admin
                : JSON.parse(a.data.permission),
            idType: a.data.idType,
            idValue: a.data.idValue,
            activeCount: a.data.activeCount,
            keyCount: a.data.keyCount,
          };
        });

        let email: string | null = localStorage.getItem(EnumLocalStorage.email);

        // Se obtiene la cuenta actual logueada
        this.myCount =
          this.counts.find((count: ICount) => count.email == email) || {};

        this.counts.forEach(async (count: ICount) => {
          if (count.country && count.state && count.city) {
            await this.getStatesByCountry(count.country, count.state);
            await this.getCitiesByCountryAndState(
              count.country,
              count.state,
              count.city
            );
          }
        });

        this.counts = this.counts.filter(
          (count: ICount) => count.id != this.myCount.id
        );

        this.dataSource = new MatTableDataSource(this.counts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.loading = false;
      });
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

  public getAllCountries(): void {
    this.locationService.getAllContries().then((resp: ICountries[]) => {
      this.countries = resp;
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

  public newCount(): void {
    const dialogRef = this.dialog.open(NewCountsComponent, {
      width: '100%',
    });
    //actualizar estado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCounts();
      }
    });
  }

  public editCount(id: string): void {
    const dialogRef = this.dialog.open(EditCountsComponent, {
      width: '100%',
      data: {
        id: id,
      },
    });
    //actualizar estado de la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCounts();
      }
    });
  }

  public deleteCount(id: string, name: string): void {
    alerts
      .confirmAlert(
        '¿Esta seguro?',
        'La información no podra recuperarse',
        'warning',
        'Si, eliminar'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          //Eliminar registro de la base de datos
          this.countService.deleteDataFS(id).then(
            () => {
              alerts.basicAlert(
                'Listo',
                'El usuario ha sido eliminado',
                'success'
              );
              this.getCounts();
            },
            (err) => {
              alerts.basicAlert(
                'Error',
                'No se ha podido eliminar el usuario',
                'error'
              );
            }
          );
        }
      });
  }

  //Cambia el estado del producto
  public cambiarEstado(count: ICount, estado: boolean): void {
    if (estado) {
      //Desactivar el estado
      alerts
        .confirmAlert(
          '¿Esta seguro de cambiar el estado de la cuenta?',
          'Desea desactivar la cuenta',
          'question',
          'Si'
        )
        .then((result: any) => {
          if (result.isConfirmed) {
            let idCount: string = count.id;
            count.activeCount = false;
            delete count.id;

            this.countService.patchDataFS(idCount, count).then(
              () => {
                this.getCounts();
                alerts.basicAlert(
                  'Listo',
                  'Se ha cambiado el estado de la cuenta',
                  'success'
                );
              },
              (error) => {
                alerts.basicAlert(
                  'Error',
                  'No se ha podido cambiar el estado de la cuenta',
                  'error'
                );
              }
            );
          }
        });
    } else if (!estado) {
      //Activar el estado
      alerts
        .confirmAlert(
          '¿Esta seguro de cambiar el estado de la cuenta?',
          'Desea activar la cuenta',
          'question',
          'Si'
        )
        .then((result: any) => {
          if (result.isConfirmed) {
            let idCount: string = count.id;
            count.activeCount = true;
            delete count.id;

            this.countService.patchDataFS(idCount, count).then(
              () => {
                this.getCounts();
                alerts.basicAlert(
                  'Listo',
                  'Se ha cambiado el estado de la cuenta',
                  'success'
                );
              },
              (err) => {
                alerts.basicAlert(
                  'Error',
                  'No se ha podido cambiar el estado de la cuenta',
                  'error'
                );
              }
            );
          }
        });
    }
  }

  public getPermissionsData(count: ICount | any, name: any): boolean {
    if (typeof count.permission == 'object') {
      return count.permission[name];
    }

    return false;
  }

  public mostrarPermisos(): void {
    this.showPermission = !this.showPermission;
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.counts)
      .toPromise()
      .then((res: any) => {});
  }
}

import { ICountries } from './../../../interface/icountries';
import { ICities } from './../../../interface/icities';
import { IState } from './../../../interface/istate';
import { LocationService } from './../../../services/location.service';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { ICount } from 'src/app/interface/icount';
import { CountService } from './../../../services/count.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-counts',
  templateUrl: './counts.component.html',
  styleUrls: ['./counts.component.css'],
})
export class CountsComponent implements OnInit {
  public counts: ICount[] = [];
  public myCount: ICount = {};
  public loading: boolean = false;
  public countries: ICountries[] = [];
  public statesByCountry: Map<string, IState[]> = new Map(); // <iso country, estados>
  public citiesByCountryAndStates: Map<string, ICities[]> = new Map(); // <iso country|iso state, ciudades>

  constructor(
    private countService: CountService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.getAllCountries();
    this.getCounts();
  }

  public getCounts(): void {
    this.loading = true;

    this.countService.getData().subscribe((res: any) => {
      this.counts = Object.keys(res).map(
        (a: any) =>
          ({
            id: a,
            name: res[a].name,
            email: res[a].email,
            celphone: res[a].celphone,
            sex: res[a].sex,
            active: res[a].active,
            country: res[a].country,
            state: res[a].state,
            city: res[a].city,
            permission: res[a].permission,
            idType: res[a].idType,
            idValue: res[a].idValue,
          } as ICount)
      );

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
}

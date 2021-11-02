import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  constructor(private http: HttpClient) {}

  //Data filtrada de subcategorias
  public getFilterData(orderBy: string, equalTo: string): Observable<any> {
    return this.http.get(
      `${environment.urlFirebase}sub-categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`
    );
  }
}

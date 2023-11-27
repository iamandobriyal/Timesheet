import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class ProjectaddService {

    constructor(private http: HttpClient) { }

    addproject(id): Observable<any> {
        return Observable.create(observer => {
            this.http.post('/api/prikklok/addproject', { id: id }).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }
    


}

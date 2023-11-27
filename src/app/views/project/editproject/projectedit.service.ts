import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class ProjecteditService {

    constructor(private http: HttpClient) { }


    getproject(project_id): Observable<any> {
        
        return Observable.create(observer => {
            this.http.post('/api/prikklok/getproject',{id:project_id}).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }

    updateProject(projectData) {
        return this.http.post('/api/prikklok/update_project', projectData);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class ProjectaddService {

    constructor(private http: HttpClient) { }
    createProject(project: any) {
        const url = `/api/prikklok/newproject`;
        return this.http.post(url, project);
    }
}

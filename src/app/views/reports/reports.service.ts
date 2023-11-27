import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ReportsService {
  constructor(private http: HttpClient) {} //, private token: TokenStorage

  getPriklokUsers(): Observable<any> {
    return Observable.create((observer) => {
      this.http.get("/api/prikklok/users").subscribe((data: any) => {
        if (data.success) {
          observer.next(data.user_list);
        } else {
          observer.next([]);
        }
        observer.complete();
      });
    });
  }

  download_report(
    start_date: string,
    stop_date: string,
    assignedSelect1: any[]
  ): Observable<any> {
    const data = {
      start_date: start_date,
      stop_date: stop_date,
      assigned: assignedSelect1,
    };
    return this.http.post("/api/prikklok/get_report", data);
  }
}

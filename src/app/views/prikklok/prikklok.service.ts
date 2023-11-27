import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable({
  // needed
  providedIn: "root",
})
export class PrikklokService {
  constructor(private http: HttpClient) {}

  public get_events(time_start): Observable<any> {
    const params = { time_start: time_start };
    return this.http.get("/api/prikklok/get_events", { params: params });
  }

  public get_projects(): Observable<any> {
    return this.http.get("/api/prikklok/project_task");
  }

  public update_events(events, currentdate): Observable<any> {
    const data = {
      events: events,
      currentdate: currentdate,
    };
  
    return Observable.create(observer => {
      this.http.post("/api/prikklok/update_events", data).subscribe(
        response => {
          observer.next(response);
          observer.complete();
        }
      );
    });
  }
  
  


  public remove_event(id)
  {
    const params = { id: id };
    return Observable.create(observer => {
      this.http.post("/api/prikklok/remove_event", { params: params }).subscribe(
        response => {
          observer.next(response);
          observer.complete();
        }
      );
    });
  }



  public event_create_post(create_events): Observable<any> {
    return Observable.create((observer) => {
      this.http
        .post("/api/prikklok/event", create_events)
        .subscribe((data: any) => {
          observer.next(data);
          observer.complete();
        });
    });
  }

  public event_create_put(update_events): Observable<any> {
    let _id = update_events._id;
    delete update_events._id;

    let url = "/api/prikklok/event/" + _id;

    return Observable.create((observer) => {
      this.http.put(url, update_events).subscribe((data: any) => {
        observer.next(data);
        observer.complete();
      });
    });
  }

  public getproject(): Observable<any> {
    return Observable.create((observer) => {
      this.http.get("/api/prikklok/project").subscribe((data: any) => {
        observer.next(data);
        observer.complete();
      });
    });
  }
}

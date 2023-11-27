import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<any> {
    return this.http.get("/api/prikklok/analytics");
  }
}
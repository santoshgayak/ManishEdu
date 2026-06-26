import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Service } from '../../models/services/service.model';
import { HttpClient } from '@angular/common/http';

//interface for api response
interface ApiResponse {
  success: boolean;
  data: Service[];
}
@Component({
  selector: 'app-services',
  imports: [RouterModule, CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {

  serviceList: Service[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ){}

  //load service data from database
  ngOnInit(){
          this.http.get<ApiResponse>('http://localhost:3000/api/data/services').subscribe({
        next:(res)=>{
          this.serviceList = res.data;
          this.cdr.detectChanges();
        },
        error: (err) =>{
          console.error("API error:", err);

        }
  });
  }

}

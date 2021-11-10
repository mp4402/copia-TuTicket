import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  //eventos ={id:'', nombre:'', descripcion:'', categoria:'', fecha:'',boletos:'',ubicacion:'',boletosmax:'',fechamax:''}
  eventos: any = [];
  public imagen:string;
  url_api = 'http://localhost:3000/eventos'
  constructor(private http: HttpClient) {
    this.imagen ="";
  }

  ngOnInit(): void {
    this.imagen = "../../../assets/logo.png";
    this.http.get(this.url_api).subscribe(
      res => {
        this.eventos = res;
      },
      err => console.log(err)
    )

  }

}

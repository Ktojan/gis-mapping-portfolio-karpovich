import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`
    #home {
      padding: 1rem;
    }
    .about {
      display: flex;
      column-gap: 30px;
    }
    .about-block p {
      font-size: 18px;
    }
    h2, .connect-links {
      text-align: center;
    }
  `]
})
export class HomeComponent {


  constructor() { }

}

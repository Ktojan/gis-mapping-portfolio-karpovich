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
    .about > * {
      flex: 1 1 100%;
    } 
    .about-block {
      text-align: center;
    }
    p.intro {
      text-align: start;
      font-size: 18px;
    }
    h2, .connect-links {
      text-align: center;
    }
    #geodrop {
      width: 70%;
      max-width: 400px;
      border-radius: 12px;
      margin-top: 2rem;
    }
  `]
})
export class HomeComponent {


  constructor() { }

}

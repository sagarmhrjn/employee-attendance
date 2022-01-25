import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  sideBarOpen: boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}

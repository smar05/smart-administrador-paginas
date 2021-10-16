import { Iusers } from './../../../interface/iusers';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  public users: Iusers[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log(this.users);
  }
}

import { UsersService } from './../../../services/users.service';
import { Iusers } from './../../../interface/iusers';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  public users: Iusers[] = [];

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getData();
  }

  //Tomar la data de usuarios
  public getData(): void {
    this.userService.getData().subscribe((resp: any): any => {
      this.users = Object.keys(resp).map(
        (a) =>
          ({
            address: resp[a].address,
            city: resp[a].city,
            country: resp[a].country,
            country_code: resp[a].country_code,
            displayName: resp[a].displayName,
            email: resp[a].email,
            idToken: resp[a].idToken,
            method: resp[a].method,
            phone: resp[a].phone,
            picture: resp[a].picture,
            username: resp[a].userName,
            wishlist: resp[a].wishlist,
          } as Iusers)
      );
      console.log(this.users);
    });
  }
}

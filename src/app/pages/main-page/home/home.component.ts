import { UsersService } from './../../../services/users.service';
import { SalesService } from './../../../services/sales.service';
import { ProductsService } from './../../../services/products.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public itemsQuantity: any = {
    products: 0,
    sales: 0,
    users: 0,
  };
  public loadItems: any = {
    products: false,
    sales: false,
    users: false,
  };

  constructor(
    private productsService: ProductsService,
    private salesService: SalesService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getSales();
    this.getUsers();
  }

  public getProducts(): void {
    this.loadItems.products = true;
    this.productsService.getData().subscribe((resp: any) => {
      this.itemsQuantity.products = Object.keys(resp).length;
      this.loadItems.products = false;
    });
  }

  public getSales(): void {
    this.loadItems.sales = true;
    this.salesService.getData().subscribe((resp: any) => {
      this.itemsQuantity.sales = Object.keys(resp).length;
      this.loadItems.sales = false;
    });
  }

  public getUsers(): void {
    this.loadItems.users = true;
    this.usersService.getData().subscribe((resp: any) => {
      this.itemsQuantity.users = Object.keys(resp).length;
      this.loadItems.users = false;
    });
  }
}

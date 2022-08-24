import { Iproducts } from './../../../../interface/iproducts';
import { ProductsService } from './../../../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  public id: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params.id;

      this.productsService.getItem(this.id).subscribe((resp: Iproducts) => {});
    });
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubcategoriesComponent } from './subcategories.component';
import { SubcategoriesRoutingModule } from './subcategories-routing.module';

@NgModule({
  declarations: [SubcategoriesComponent],
  imports: [CommonModule, SubcategoriesRoutingModule],
})
export class SubcategoriesModule {}

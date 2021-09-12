import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, SideBarComponent],
  exports: [NavbarComponent, FooterComponent, SideBarComponent],
  imports: [CommonModule, RouterModule],
})
export class SharedModule {}

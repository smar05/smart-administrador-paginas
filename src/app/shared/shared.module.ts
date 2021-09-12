import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, SideBarComponent],
  exports: [NavbarComponent, FooterComponent, SideBarComponent],
  imports: [CommonModule],
})
export class SharedModule {}

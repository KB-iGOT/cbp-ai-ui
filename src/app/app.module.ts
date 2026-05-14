import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedService } from './modules/shared/services/shared.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './modules/shared/shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InitService } from './modules/shared/services/init.service';
import { ToastrModule } from 'ngx-toastr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDialogModule } from '@angular/material/dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoginComponent } from './components/login/login.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

import { MarkdownModule } from 'ngx-markdown';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { HelpSidebarComponent } from './components/help-sidebar/help-sidebar.component';
import { AiCbpModule } from '@sunbird-cb/cbp-ai';

const appInitializer = (initSvc: InitService) => async () => {
  try {
    await initSvc.init()
  } catch (error) {
    console.error('ERROR DURING APP INITIALIZATION >', error)
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HelpSidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    PaginationModule.forRoot(),
    ToastrModule.forRoot(),
    NgbModalModule,
    MatSidenavModule, MatListModule,  MatCardModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule,
    MatRadioModule, MatDialogModule, MatChipsModule, MatSelectModule,MatLegacyCheckboxModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    MarkdownModule.forRoot(),
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxDaterangepickerMd.forRoot(),
    AiCbpModule
  ],
  providers: [
    {
      deps: [InitService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    SharedService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


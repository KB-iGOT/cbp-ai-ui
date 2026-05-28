import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
// import { InitialScreenComponent } from '@sunbird-cb/cbp-ai';
//import { PublicHomeComponent } from "./modules/public-home/components/public-home/public-home.component";
// import { UploadDocumentPageComponent } from './modules/upload-document-page/upload-document-page.component';
// import { InitialScreenComponent } from './modules/initial-screen/initial-screen.component';
// import { RoleMappingGenerationComponent } from './components/role-mapping-generation/role-mapping-generation.component';
// import { RoleMappingListComponent } from './components/role-mapping-list/role-mapping-list.component';
// import { ApprovalRequestsComponent } from './components/approval-requests/approval-requests.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { ReviewRequestComponent } from './components/review-request/review-request.component';
const routerOptions: any = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 120],
  onSameUrlNavigation: 'reload',
  relativeLinkResolution: 'legacy',
  useHash: true
};

const routes: Routes = [
  {
    path: 'ai',
    loadChildren: () =>
      import('@sunbird-cb/cbp-ai').then(m => m.AiCbpModule)
  },
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'logout',
    component: LoginComponent,
    pathMatch: 'full'
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

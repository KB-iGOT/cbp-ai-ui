import { Component, ViewChild } from '@angular/core';
import { HEADER_DATA } from './modules/shared/constant/app.constant';
import { EventService } from './modules/shared/services/event.service';
import { SharedService } from './modules/shared/services/shared.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleMappingGenerationComponent } from './components/role-mapping-generation/role-mapping-generation.component';
import { Router } from '@angular/router';
import { UpdateDesignationHierarchyComponent } from './components/update-designation-hierarchy/update-designation-hierarchy.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  headerData = HEADER_DATA;
  title = 'sunbird-cb-staticweb';
  isMaintenancePage: any
  selectedValue = ''
  searchText = ''
  dataSource: any
  displayedColumns: string[] = ['RequestId', 'title', 'requestor', 'requestType',
    'requestStatus', 'assignee', 'requestedOn', 'interests', 'action']
  selectedMinistryType: string = 'ministry';
  ministryData: any = []
  ministryFullData: any = []
  sectorData = [
    {
      value: 'Women and child development'
    },
    {
      value: 'Rural development'
    },
    {
      value: 'Urben development'
    },
    {
      value: 'Healthcare'
    },
    {
      value: 'Agriculture'
    },
    {
      value: 'Others'
    }

  ]
  formData: {}
  nextStep = 'initial'
  loginSuccess = false
  cbpFinalObj: any = {}
  userEmail = ''
  userProfile: any = {}
  disableUploadDocument = true
  disableUploadDocumentOriginal = true
  openUpdateDesignationHierarchyDrawer = false
  @ViewChild(RoleMappingGenerationComponent)
  roleMappingChild!: RoleMappingGenerationComponent;
  constructor(
    private dialog: MatDialog,
    private eventSvc: EventService,
    public sharedService: SharedService,
    private router: Router,
    public snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<any>([])
    this.isMaintenancePage = window.location.href.includes('/maintenance')
  }

  ngOnInit() {
    this.sharedService.loginSuccess.subscribe((data: any) => {
      this.loginSuccess = data
    })
    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    this.sharedService.checkRoleMappingFormValidation.subscribe((data: any) => {
      if ( this.cbpFinalObj?.role_mapping_generation?.length) {
        
        this.disableUploadDocument = false
        this.disableUploadDocumentOriginal = false
      } else
        if (data === 'VALID') {
          this.disableUploadDocument = false
          this.disableUploadDocumentOriginal = false
        } else {
          this.disableUploadDocument = true
          this.disableUploadDocumentOriginal = true
        }
    })
    this.loginSuccess = this.sharedService.checkIfLogin()
    if (this.loginSuccess) {

      this.userEmail = localStorage.getItem('userEmail')
      
      console.log('userProfile--',this.userProfile)
    }
    
    if (this.cbpFinalObj && this.cbpFinalObj?.ministry && (this.cbpFinalObj?.ministry?.sbOrgType === 'ministry' || this.cbpFinalObj?.ministry?.sbOrgType === 'state') &&
      this.cbpFinalObj?.role_mapping_generation?.length) {
      this.nextStep = 'role-mapping'
    } else {
      this.nextStep = 'initial'
    }
    if ( this.cbpFinalObj?.role_mapping_generation?.length) {
      this.disableUploadDocument = false
      this.disableUploadDocumentOriginal = false
    }
    console.log('this.nextStep', this.nextStep)
    console.log('this.sharedService.cb', this.sharedService.cbpPlanFinalObj)
  }


  successRoleMapping(event) {
    this.nextStep = 'role-mapping'
    this.formData = event
    console.log('event', event)
  }

  alreadyAvailableRoleMapping(event) {
    this.nextStep = 'role-mapping'
    console.log('event', event)
    this.formData = event


  }

  moveToInitialScreen(event) {
    if (event === 'add') {
      this.nextStep = 'initial'
    } else if (event === 'edit') {
      this.nextStep = 'initial'
    }

  }

  loginSuccessStatus(event) {
    this.loginSuccess = event
    this.nextStep = 'initial'
  }

  logout() {
    this.loginSuccess = false
    this.nextStep = 'initial'
    localStorage.clear()
    if (this.roleMappingChild) {
      this.roleMappingChild.roleMappingForm.reset();
    }
    this.sharedService.logout().subscribe({
      next: (res) => {
        this.sharedService.loginSuccess.next(false)
        this.router.navigate(['/logout']);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 500)
        this.snackBar.open('You are logout successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (error) => {
        this.sharedService.loginSuccess.next(false)
        this.snackBar.open(error?.error?.detail, 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  goToUploadDocument() {

    this.router.navigate(['/upload-documents']);

  }

  routeToMain() {
    this.router.navigate(['/']);
  }

  openUpdateDesignationHierarchy() {
    // const dialogRef = this.dialog.open(UpdateDesignationHierarchyComponent, {
    //       width: '1000px',
    //       data: '',
    //       panelClass: 'view-cbp-plan-popup',
    //       minHeight: '300px',          // Set minimum height
    //       maxHeight: '80vh',           // Prevent it from going beyond viewport
    //       disableClose: true // Optional: prevent closing with outside click
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //       // if (result === 'saved') {
    //       //   console.log('Changes saved!');
    //       //   // Refresh data or show a toast here

    //       // }
    //       // this.refreshRoleMappingData();
    //     });
    this.openUpdateDesignationHierarchyDrawer = true;
  }

  closeDrawer() {
    this.openUpdateDesignationHierarchyDrawer = false;

  }

  openApproveRequests() {
    this.router.navigate(['/approve-requests']);
  }

  routeToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}

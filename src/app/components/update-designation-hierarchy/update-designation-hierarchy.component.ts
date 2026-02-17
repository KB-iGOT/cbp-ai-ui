import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Designation {
  id: string;
  name: string;
  sort_order: number;
}

@Component({
  selector: 'app-update-designation-hierarchy',
  templateUrl: './update-designation-hierarchy.component.html',
  styleUrls: ['./update-designation-hierarchy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateDesignationHierarchyComponent implements OnInit {

  isOpen = true;
  state_center_id!: string;
  department_id!: string;
  designations: Designation[] = [];
  role_mapping_generation: any
  loading = false
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  numbers: number[] = [];

  constructor(private http: HttpClient, public sharedService: SharedService, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.numbers = Array.from({ length: 999 }, (_, i) => i + 1);

    const cbpPlanFinalObj = JSON.parse(localStorage.getItem('cbpPlanFinalObj') || '{}');
    console.log('cbpPlanFinalObj--', cbpPlanFinalObj)
    if (cbpPlanFinalObj?.departments) {
      this.department_id = cbpPlanFinalObj?.departments
    }
    if (cbpPlanFinalObj?.ministry && cbpPlanFinalObj?.ministry.identifier) {
      this.state_center_id = cbpPlanFinalObj?.ministry.identifier
    }

    this.role_mapping_generation = cbpPlanFinalObj?.role_mapping_generation || '[]';
    // Map role_mapping_generation to internal designations array
    this.designations = (this.role_mapping_generation).map((r: any, index: number) => ({
      id: r.id,
      name: r.designation_name,
      sort_order: r.sort_order || index + 1, // fallback if sort_order missing
    }));

    console.log('this.designations--', this.designations)

    // Sort by sort_order
    this.designations.sort((a, b) => a.sort_order - b.sort_order);
    this.updateSortOrderByIndex();
  }

  drop(event: CdkDragDrop<Designation[]>) {
    moveItemInArray(this.designations, event.previousIndex, event.currentIndex);

    // Update sort_order based on the new array index
    this.designations.forEach((item, index) => {
      item.sort_order = index + 1;
    });
  }

  onOrderChange(item: Designation) {
    const selectedOrder = item.sort_order; // number selected in dropdown
    const currentIndex = this.designations.findIndex(d => d.id === item.id);

    // Remove the item
    this.designations.splice(currentIndex, 1);

    // Insert at the new position (subtract 1 because arrays are 0-based)
    this.designations.splice(selectedOrder - 1, 0, item);

    // Update sort_order for all items
    this.designations.forEach((d, index) => (d.sort_order = index + 1));
  }

  private updateSortOrderByIndex() {
    this.designations.forEach((item, index) => {
      item.sort_order = index + 1;
    });
  }

  submit() {
    let payload = {
      designations: this.designations.map(d => ({
        id: d.id,
        sort_order: d.sort_order
      }))
    };

    if (this.department_id) {
      payload['department_id'] = this.department_id
    }
    if (this.state_center_id) {
      payload['state_center_id'] = this.state_center_id
    }

    console.log('payload--', payload)
    this.loading = true
    // Example API call
    this.sharedService.updateDesignationHierarchy(payload)
      .subscribe(() => {
        this.sharedService.updateDesignationHierarchySubject.next(true)
        this.submitted.emit(payload);
        this.closeDrawer.emit();
      });

    this.sharedService.updateDesignationHierarchy(payload).subscribe({
      next: (res) => {
        // Success handling
        console.log('Success:', res);
        this.loading = false
        this.sharedService.updateDesignationHierarchySubject.next(true)
        this.submitted.emit(payload);
        this.closeDrawer.emit();
        this.snackBar.open('Designation Hierarchy Saved Successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        //this.successRoleMapping.emit(this.roleMappingForm)
      },
      error: (error) => {
        console.log('error', error)
        // Handle 409 Conflict here
        // alert('Conflict detected: The resource already exists or action conflicts.');
        //this.get
        // Or you can set a UI error message variable
        this.snackBar.open(error?.error?.detail, 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.loading = false
        //this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
      }
    });
  }

  cancel() {
    this.isOpen = false
    this.closeDrawer.emit();
  }
}

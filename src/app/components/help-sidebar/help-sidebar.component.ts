import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-help-sidebar',
  templateUrl: './help-sidebar.component.html',
  styleUrls: ['./help-sidebar.component.scss']
})
export class HelpSidebarComponent {

  activeTab: string = 'steps';
  sidebarOpen = true;
  @Output() closeHelpDrawer = new EventEmitter<void>();

  toggleStep(step:any){
    step.open = !step.open;
  }

  hideSideBar() {
    this.sidebarOpen = false
    this.closeHelpDrawer.emit()
  }

  steps = [
    {
      title:'Login to the Platform',
      open:true,
      content:[
        'Open the iGOT-AI CBP Tool in your browser.',
        'Enter credentials provided by your PC & AM.',
        'Click Login to access the dashboard.'
      ]
    },
    {
      title:'Select Ministry / Department',
      open:false
    },
    {
      title:'Manage Relevant Documents',
      open:false
    },
    {
      title:'Generate CBP — Initial Draft',
      open:false
    }
  ];

}
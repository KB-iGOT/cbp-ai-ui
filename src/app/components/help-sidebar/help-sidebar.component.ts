import { Component, EventEmitter, Output } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Step {
  title: string;
  open: boolean;
  content: any[];
  imageSrc: string[];
  acknowledge?: string;
  caption?:string
}


interface NextStep {
  text: string;
}

interface DosDonts {
  dos: string[];
  donts: string[];
}

@Component({
  selector: 'app-help-sidebar',
  templateUrl: './help-sidebar.component.html',
  styleUrls: ['./help-sidebar.component.scss']
})
export class HelpSidebarComponent {



  activeTab: 'steps' | 'dos' | 'next' = 'steps';

  sidebarOpen = true;

  @Output() closeHelpDrawer = new EventEmitter<void>();

  toggleStep(step: Step): void {
    step.open = !step.open;
  }

  hideSideBar(): void {
    this.sidebarOpen = false;
    this.closeHelpDrawer.emit();
  }

  steps: Step[] = [
    {
      title: 'Login to the Platform',
      open: true,
      content: [
        'Open the iGOT-AI CBP Tool in your browser.',
        'Enter credentials provided by your PC & AM.',
        'Click Login to access the dashboard.'
      ],
      imageSrc: ['1.png'],
      acknowledge: 'Acknowledge usage terms and confirm document compliance before logging in.',
      caption: 'Login Screen'
    },
    {
      title: 'Select Ministry / Department',
      open: false,
      content: [
        {
          label: 'A — Government Type',
          text: 'Select Centre or State.'
        },
        {
          label: 'B — State Selection',
          text: 'Choose State Name, then select Department from dropdown.'
        },
        {
          label: 'C — Add Documents',
          text: 'Click "Manage Documents" to proceed.'
        }
      ],
    

      imageSrc: ['2.png']
    },
{
  title: 'Manage Relevant Documents',
    open: false,
      content: [
        'Upload official policy documents.',
        'Ensure files are searchable PDFs.',
        'File size must be below 25 MB.'
      ],
        imageSrc: ['3.png', '3_1.png']
},
{
  title: 'Generate CBP — Initial Draft',
    open: false,
      content: [
        'Use AI to generate an initial CBP draft.',
        'Review suggested competencies carefully.'
      ],
        imageSrc: ['4.png']
},
{
  title: 'Manage Designation Hierarchy',
    open: false,
      content: [
        'Check competency alignment with KCM framework.',
        'Remove irrelevant suggestions.'
      ],
        imageSrc: ['5.png', '5_1.png']
},
{
  title: 'Edit the CBP',
    open: false,
      content: [
        'Modify competency levels and descriptions.',
        'Add department-specific requirements.'
      ],
        imageSrc: ['6.png', '6_1.png']
},
{
  title: 'Add New Designations',
    open: false,
      content: [
        'Ensure all competencies match Karmayogi Competency Model.'
      ],
        imageSrc: ['7.png']
},
{
  title: 'Generate Course Recommendations',
    open: false,
      content: [
        'Run analysis to identify capability gaps.'
      ],
        imageSrc: ['8.png', '8_1.png']
},
{
  title: 'Suggest Additional Course from iGOT',
    open: false,
      content: [
        'Download generated CBP and supporting reports.'
      ],
        imageSrc: ['9.png']
},
{
  title: 'View & Download Course List',
    open: false,
      content: [
        'Submit CBP draft for Competent Authority review.'
      ],
        imageSrc: ['10.png', '10_1.png']
},
{
  title: 'Download Combined CBP & Courses',
    open: false,
      content: [
        'Incorporate feedback and finalise document.'
      ],
        imageSrc: ['11.png']
},
{
  title: 'Download in Multiple Languages',
    open: false,
      content: [
        'Map competencies to MyiGOT learning resources.'
      ],
        imageSrc: ['12.png']
}
  ];

dos = [
  'Keep only official publicly, available PDFs under 25 MB.',
  'Use only your designated login credentials.',
  'Acknowledge usage terms before logging in.',
  'Review and edit all AI-generated CBP drafts.',
  'Combine AI recommendations with manual additions',
  'Align all competencies with KCM framework.',
  'Download and securely store finalised CBP and reports.'
];

donts = [
  'Do not upload confidential or classified documents.',
  'Do not adopt AI outputs without Competent authority review.',
  'Do not add competencies outside KCM without approval.',
  'Do not share login credentials with others.',
  'Do not upload oversized or non-text-searchable files.'
];

nextSteps = [
  'Collect all necessary documents — official guidelines, implementation toolkits, annual reports, and Work Allocation Orders.',
  'Generate, review and edit department-wise CBP to create the finalised version with Competent Authority sign-off.',
  'Actionise the CBP — create and assign designation-wise MyiGOT training plans for available courses.',
  'Plan development of new courses to address identified competency gap areas.'
];

downloadPdf() {

  const pdf = new jsPDF('p', 'mm', 'a4');

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const lineHeight = 7;



  pdf.rect(0, 0, pageWidth, 30, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('How to Use', margin, 14);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('iGOT-AI CBP Tool · Step-by-Step Guide', margin, 21);

  /* reset text color */

  pdf.setTextColor(0, 0, 0);

  /* start content BELOW header */

  let y = 40;
  const checkPage = (spaceNeeded: number) => {
    if (y + spaceNeeded > pageHeight - margin) {
      pdf.addPage();
      y = 20;
    }
  }

  /* HEADER */

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('How to Use', margin, y);

  y += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('iGOT-AI CBP Tool · Step-by-Step Guide', margin, y);

  y += 15;


  /* STEPS */

  this.steps.forEach((step: any, index: number) => {

    checkPage(15);

    pdf.setFontSize(15);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`STEP ${index + 1}: ${step.title}`, margin, y);

    y += 8;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    step.content.forEach((item: any) => {

      const lines = pdf.splitTextToSize(`• ${item}`, pageWidth - margin * 2);

      checkPage(lines.length * lineHeight);

      pdf.text(lines, margin, y);

      y += lines.length * lineHeight;

    });

    y += 5;

  });


  /* DO's */

  checkPage(20);



  pdf.setFontSize(15);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DOs', margin, y);

  y += 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  this.dos.forEach((item: any) => {

    const lines = pdf.splitTextToSize(`• ${item}`, pageWidth - margin * 2);

    checkPage(lines.length * lineHeight);

    pdf.text(lines, margin, y);

    y += lines.length * lineHeight;

  });


  /* DON'Ts */

  y += 8;

  checkPage(20);

  pdf.setFontSize(15);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`DON'Ts`, margin, y);

  y += 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  this.donts.forEach((item: any) => {

    const lines = pdf.splitTextToSize(`• ${item}`, pageWidth - margin * 2);

    checkPage(lines.length * lineHeight);

    pdf.text(lines, margin, y);

    y += lines.length * lineHeight;

  });


  /* NEXT STEPS */

  y += 10;

  checkPage(20);

  pdf.setFontSize(15);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Next Steps', margin, y);

  y += 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  this.nextSteps.forEach((item: any, index: number) => {

    const lines = pdf.splitTextToSize(`${index + 1}. ${item}`, pageWidth - margin * 2);

    checkPage(lines.length * lineHeight);

    pdf.text(lines, margin, y);

    y += lines.length * lineHeight;

  });

  pdf.save('iGOT-AI-CBP-Help-Guide.pdf');

}

}
import { Component, EventEmitter, Output } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Step {
  title: string;
  open: boolean;
  content: any[];
  imageSrc: string[];
  acknowledge?: string;
  caption?: string[]
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
      acknowledge: '💡 Acknowledge usage terms and confirm document compliance before logging in.',
      caption: ['Login Screen']
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
      caption: ['Select Ministry/Department Screen'],


      imageSrc: ['2.png']
    },
    {
      title: 'Manage Relevant Documents',
      open: false,
      content: [
        'Upload CBP Summaries, Work Allocation Orders, guidelines.',
        'Max 10 PDF files, each under 25 MB.',
        'View or download AI-generated document summaries.'
      ],
      imageSrc: ['3.png', '3_1.png'],
      caption: ['Document Library', 'Upload Document Modal'],
      acknowledge: '⚠️ Only upload official, publicly available text-searchable PDFs.'
    },
    {
      title: 'Generate CBP — Initial Draft',
      open: false,
      content: [
        'System extracts all designations from uploaded documents.',
        'Maps roles and competencies using theKCM framework.',
        'Displays Initial Draft CBP for review.'
      ],
      imageSrc: ['4.png'],
      caption: ['Generated CBP - Initial Draft View'],
      acknowledge: '🤖 AI drafts are a starting point — always validate with subject-matter experts.'
    },
    {
      title: 'Manage Designation Hierarchy',
      open: false,
      content: [
        'Click the Profile icon (top-right corner).',
        'Select "Update Designation Hierarchy"',
        'Rearrange the hierarchy via dropdown as required.'
      ],
      imageSrc: ['5.png', '5_1.png'],
      caption: ['Update Designation Hierarchy panel']
    },
    { 
      title: 'Edit the CBP',
      open: false,
      content: [
        'Use built-in editor for Manual Edits— designations, responsibilities, wings/divisions.',
        'Edit Domain Competencies to align with KCM.',
        'Click Save CBP when done.'
      ],
      imageSrc: ['6.png', '6_1.png'],
      caption: ['Edit Role Mapping Modal']
    },
    {
      title: 'Add New Designations',
      open: false,
      content: [
        'Manually add any designations the AI may have missed.',
        'Enter roles, responsibilities & details for each.',
        'Save after each addition.'
      ],
      imageSrc: ['7.png'],
      caption: ['Add New Designation Modal']
    },
    {
      title: 'Generate Course Recommendations',
      open: false,
      content: [
        'Click "Generate Course Recommendation".',
        'Filter by Competencies, Ratings, Language, Duration, Provider.',
        'Select courses via checkbox, click "Save Courses".'
      ],
      imageSrc: ['8.png', '8_1.png'],
      caption: ['Action menu — Generate Course Recommendation option', 'Course Recommendation modal — filters & course cards']
    },
    {
      title: 'Suggest Additional Course from iGOT',
      open: false,
      content: [
        'Use this step to manually suggest courses from the iGOT platform that were not recommended by AI.',
        'Use the search bar to type the name of a course available on iGOT — results will appear as you type.',
        'Select the desired course from the search results to add it as a manual suggestion for the relevant designation.',
        'Click "Save"to confirm and add the course to the CBP catalogue.'
      ],
      acknowledge:'💡 Tip: Use this to fill competency gaps where AI suggestions may not cover niche or department-specific iGOT courses.',
      imageSrc: ['9.png'],
      caption: ['📸  Suggest Courses from iGOT — Search & Select Modal']
    },
    {
      title: 'View & Download Course List',
      open: false,
      content: [
        'Click the ⋮ Action menu next to any designation row and select "View Course Recommendation".',
        'A modal shows the designations course card with AI Recommended – iGOTtag, linked competencies, provider, and relevancy score.',
        'Remove any course using the 🗑 Delete icon at the bottom of the card.',
        'Click "Download" to export the course recommendation list as a PDF.'
      ],
      imageSrc: ['10.png', '10_1.png'],
      caption: [' 📸 Action Menu — View Course Recommendation option', '📸 View Course Recommendation — Course card with competencies & relevancy score']
    },
    {
      title: 'Download Combined CBP & Courses',
      open: false,
      content: [
        'Click "View Final CBP" button (top-right) to open the Final ACBP modal.',
        'The modal displays a summary with stat cards — Total, Behavioral, Functional, and Domain Competencies.',
        'Scroll to review the Detailed Competency Framework by Designation with Roles & Responsibilities per role.',
        'Use the language dropdown (e.g., English ) to switch the CBP language before downloading.',
        'Click "Download as Excel" or "Download as PDF"to export the combined CBP.'
      ],
      imageSrc: ['11.png'],
      caption: ['📸  View Final ACBP — Summary stats, competency framework & download options']
    },
    {
      title: 'Download in Multiple Languages',
      open: false,
      content: [
        'Click "View Final CBP"to open the Final ACBP modal.',
        'Click the Language dropdown (default: English) — a searchable list appears with languages including Hindi, Telugu, Kannada, Marathi, Tamil, Gujarati, and more.',
        'Select your desired language — the CBP content will be rendered in that language before download',
        'Click "Download as PDF" or "Download as Excel" to save the multilingual CBP.'


      ],
      imageSrc: ['12.png'],
      caption: ['📸 Language dropdown — select from 8+ regional languages including Hindi, Telugu, Kannada & more']
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
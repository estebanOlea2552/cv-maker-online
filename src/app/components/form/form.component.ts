import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

//Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Internal App Files
import { PreviewConnectorService } from 'src/app/services/preview-connector.service';
import { cvData } from 'src/app/model/cv-data.model';
import { cvDataInit } from 'src/app/model/cv-data-init';
import { distinctUntilChanged } from 'rxjs';
import { TextLineComponent } from "./text-line/text-line.component";
import { InitEndDateComponent } from "./init-end-date/init-end-date.component";
import { ParagraphComponent } from "./paragraph/paragraph.component";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextLineComponent,
    InitEndDateComponent,
    ParagraphComponent
]
})
export class FormComponent implements OnInit {
  // FormGroup Declaration
  protected cvFormGroup: FormGroup;

  // cvData Declaration and init
  private cvDataInput: cvData = cvDataInit;

  constructor(
    private formBuilder: FormBuilder,
    private previewConnector: PreviewConnectorService
  ) {
    // FormGroup construction
    this.cvFormGroup = this.formBuilder.group(
      {
        personalInfo: this.createPersonalInfo(),
        education: this.formBuilder.array(
          this.cvDataInput.education.map(edu => this.createEducation(edu))
        ),
        /* workExperience: this.formBuilder.array(
          this.cvDataInput.workExperience.map(wExp => this.createWorkExp(wExp))
        ),
        certifications: this.formBuilder.array(
          this.cvDataInput.certifications.map(cert => this.createCertification(cert))
        ),
        skills: this.formBuilder.array(
          this.cvDataInput.skills.map(skill => this.createSkill(skill))
        ),
        languages: this.formBuilder.array(
          this.cvDataInput.languages.map(lang => this.createLanguage(lang))
        ),
        volunteerWorks: this.formBuilder.array(
          this.cvDataInput.voluneerWorks.map(vWork => this.createVolunteerWork(vWork))
        ),
        references: this.formBuilder.array(
          this.cvDataInput.references.map(ref => this.createReference(ref))
        ),
        links: this.formBuilder.array(
          this.cvDataInput.links.map(link => this.createLink(link))
        ) */
      }
    );
  };

  ngOnInit(): void {
    this.initFormListeners();
  }

  // Personal Info Controls
  get personalInfo(): FormGroup {
    return this.cvFormGroup.get('personalInfo') as FormGroup;
  }

  private createPersonalInfo(): FormGroup {
    return this.formBuilder.group({
      name: [this.cvDataInput.personalInfo.name],
      lastname: [this.cvDataInput.personalInfo.lastname],
      jobPosition: [this.cvDataInput.personalInfo.jobPosition],
      professionalSummary: [this.cvDataInput.personalInfo.professionalSummary]
    });
  }

  // Education FormArray methods
  get education(): FormArray {
    return this.cvFormGroup.get('education') as FormArray;
  }
  private createEducation(edu: any = {}): FormGroup {
    return this.formBuilder.group({
      grade: [edu.grade || ''],
      school: [edu.school || ''],
      edInitMonth: [edu.edInitMonth || ''],
      edInitYear: [edu.edInitYear || ''],
      edEndMonth: [edu.edEndMonth || ''],
      edEndYear: [edu.edEndYear || ''],
      inCourse: [edu.inCourse || ''],
      description: [edu.description || '']
    });
  }
  protected addEducation(): void {
    this.education.push(this.createEducation());
  }
  protected removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  // Work Experience FormArray methods
  /* get workExperience(): FormArray {
    return this.cvFormGroup.get('workExperience') as FormArray;
  }
  private createWorkExp(wExp: any = {}): FormGroup {
    return this.formBuilder.group({
      position: [wExp.position || ''],
      organization: [wExp.organization || ''],
      wExpInitMonth: [wExp.wExpInitMonth || ''],
      wExpInitYear: [wExp.wExpInitYear || ''],
      wExpEndMonth: [wExp.wExpEndMonth || ''],
      wExpEndYear: [wExp.wExpEndYear || ''],
      inCourse: [wExp.inCourse || ''],
      description: [wExp.description || '']
    });
  }
  protected addWorkExp(): void {
    this.workExperience.push(this.createWorkExp());
  }
  protected removeWorkExp(index: number): void {
    this.workExperience.removeAt(index);
  } */

  // Certifications FormArray methods
  /* get certifications(): FormArray {
    return this.cvFormGroup.get('certifications') as FormArray;
  }
  private createCertification(cert: any = {}): FormGroup {
    return this.formBuilder.group({
      title: [cert.title || ''],
      average: [cert.average || '']
    });
  } */
  
  // Skills FormArray methods
  /* get skills(): FormArray {
    return this.cvFormGroup.get('skills') as FormArray;
  }
  private createSkill(skill: any = {}): FormGroup {
    return this.formBuilder.group({
      skill: [skill.skill || ''],
      level: [skill.level || '']
    });
  }
  protected addSkill(): void {
    this.skills.push(this.createSkill());
  }
  protected removeSkill(index: number): void {
    this.skills.removeAt(index);
  } */

  // Languages FormArray methods
  /* get languages(): FormArray {
    return this.cvFormGroup.get('languages') as FormArray;
  }
  private createLanguage(lang: any = {}): FormGroup {
    return this.formBuilder.group({
      language: [lang.language || ''],
      level: [lang.level || '']
    });
  } */

  // Volunteer Works FormArray methods
  /* get volunteerWorks(): FormArray {
    return this.cvFormGroup.get('volunteerWorks') as FormArray;
  }
  private createVolunteerWork(vWork: any = {}): FormGroup {
    return this.formBuilder.group({
      position: [vWork.position || ''],
      organization: [vWork.organization || ''],
      vWInitMonth: [vWork.vWInitMonth || ''],
      vWInitYear: [vWork.vWInitYear || ''],
      vWEndMonth: [vWork.vWEndMonth || ''],
      vWEndYear: [vWork.vWEndYear || ''],
      inCourse: [vWork.inCourse || ''],
      description: [vWork.description || '']
    });
  } */

  // References FormArray methods
  /* get references(): FormArray {
    return this.cvFormGroup.get('references') as FormArray;
  }
  private createReference(ref: any = {}): FormGroup {
    return this.formBuilder.group({
      name: [ref.name || ''],
      organization: [ref.organization || ''],
      email: [ref.email || ''],
      phone: [ref.phone || '']
    });
  } */

  // Links FormArray methods
  /* get links(): FormArray {
    return this.cvFormGroup.get('links') as FormArray;
  }
  private createLink(link: any = {}): FormGroup {
    return this.formBuilder.group({
      link: [link.link || '']
    });
  } */

  // Return the result of the .at method as FormGroup
  protected getFormGroup(group: string, index?: number): FormGroup {
    switch (group) {
      case 'personalInfo':
        return this.personalInfo as FormGroup;
      case 'education':
        return this.education.at(index || 0) as FormGroup;
      /* case 'workExperience':
        return this.workExperience.at(index) as FormGroup;
      case 'certifications':
        return this.certifications.at(index) as FormGroup;
      case 'skills':
        return this.skills.at(index) as FormGroup;
      case 'languages':
        return this.languages.at(index) as FormGroup;
      case 'volunteerWorks':
        return this.volunteerWorks.at(index) as FormGroup;  
      case 'references':
        return this.references.at(index) as FormGroup;
      case 'links':
        return this.links.at(index) as FormGroup; */
      default:
        throw new Error(`Invalid group: ${group}`);
    }
  }

  // Create subscriptions for each FormControl
  private initFormListeners() {
    Object.keys(this.cvFormGroup.controls).forEach(
      (controlName: string) => {
        const control = this.cvFormGroup.get(controlName);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(
            (subControlName: string) => {
              const subControl = control.get(subControlName);
              this.subscribeToTheControl(subControl, `${controlName}.${subControlName}`);
            }
          );
        } else {
          this.subscribeToTheControl(control, controlName);
        }
      }
    );
  }

  // Take a FormControl and create a subscription
  private subscribeToTheControl(control: any, controlName: string) {
    control.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((value: string) => {
      this.updateCvData(controlName, value);
    });
  }

  // Loads the input value to the cvDataInput object and sends it to the previewConnector
  private updateCvData(controlName: string, value: any) {
    const keys: string[] = controlName.split('.');
    if (keys.length === 1) {
      (this.cvDataInput as any)[keys[0]] = value;
    } else if (keys.length === 2) {
      (this.cvDataInput as any)[keys[0]][keys[1]] = value;
    }
    this.previewConnector.updateCvData(controlName, value);
  }

  protected resetForm(){
    this.cvFormGroup.reset(this.cvDataInput);
  }
}
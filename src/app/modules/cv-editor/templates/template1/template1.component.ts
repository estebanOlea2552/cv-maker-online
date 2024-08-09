import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { cvDataI } from 'src/app/interfaces/cv.interface';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-template1',
  templateUrl: './template1.component.html',
  styleUrls: ['./template1.component.css'],
  standalone: true,
  imports: [ CommonModule ]
})
export class Template1Component implements OnInit {
  @ViewChild('cvContent', {static: true}) cvContent!: ElementRef;
  @Input() cvPreview: cvDataI = {
    name: '',
    lastname: '',
    jobPosition: '',
    aboutMe: '',
    academicBackground: [{
      grade: '',
      school: '',
      academicBackgroundInitDate: '',
      academicBackgroundEndDate: '',
      description: ''
    }],
    workExperience: [{
      position: '',
      company: '',
      workExperienceInitDate: '',
      workExperienceEndDate: '',
      description: ''
    }],
    skills: ['']
  };

  constructor(private exportCv: ExportService) {}

  ngOnInit(): void {
    this.exportCv.setCvToExport(this.cvContent);
  }
}
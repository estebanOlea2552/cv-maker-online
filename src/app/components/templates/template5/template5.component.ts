import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { cvData } from 'src/app/model/cv-data.model';
import { cvDataInit } from 'src/app/model/cv-data-init';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-template5',
  templateUrl: './template5.component.html',
  styleUrls: ['./template5.component.css'],
  standalone: true,
  imports: [ CommonModule ]
})
export class Template5Component implements OnInit {
  @ViewChild('cvContent', {static: true}) cvContent!: ElementRef;
  @Input() cvPreview: cvData = cvDataInit;

  constructor(private exportCv: ExportService) {}

  ngOnInit(): void {
    this.exportCv.setCvToExport(this.cvContent);
  }
}
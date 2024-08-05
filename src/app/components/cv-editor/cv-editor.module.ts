import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvEditorComponent } from './cv-editor.component';
import { FormComponent } from '../form/form.component';
import { PreviewComponent } from '../preview/preview.component';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    CvEditorComponent
  ],
  imports: [
    CommonModule,
    FormComponent,
    PreviewComponent,
    TemplateSelectorComponent,
    MatCardModule
  ]
})
export class CvEditorModule { }

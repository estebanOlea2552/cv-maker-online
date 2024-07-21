import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvEditorComponent } from './cv-editor.component';
import { FormComponent } from '../form/form.component';
import { PreviewComponent } from '../preview/preview.component';

@NgModule({
  declarations: [
    CvEditorComponent
  ],
  imports: [
    CommonModule,
    FormComponent,
    PreviewComponent
  ]
})
export class CvEditorModule { }
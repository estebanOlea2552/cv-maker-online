import { AfterViewInit, Component, ViewContainerRef, OnDestroy, ViewChild, ElementRef, Type, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { PreviewConnectorService } from 'src/app/services/preview-connector.service';
import { MatCardModule } from '@angular/material/card';

import { cvData } from 'src/app/model/cv-data.model';
import { cvDataInit } from 'src/app/model/cv-data-init'; 
import { MatButtonModule } from '@angular/material/button';
import { ExportService } from 'src/app/services/export.service';
import { TemplateRegistryService } from 'src/app/services/template-registry.service';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { Store } from '@ngrx/store';
import { templateSelector } from 'src/app/state/selectors/template.selectors';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class PreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('templateContainer', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef; // Where the preview is displayed

  @ViewChild('previewContainer', { static: false })
  private previewContainer!: ElementRef; // Container for Panzoom element

  @ViewChild('preview', { static: false })
  private preview!: ElementRef; // The element controlled by Panzoom

  // Panzoom instance
  protected panzoom!: PanzoomObject;

  // Values for Panzoom's configuration
  private previewWidth: number = 0;
  private previewHeight: number = 0;

  // Subscriptions for managing the observable data of the cvData
  private cvDataSubscription: Subscription | undefined;
  private templateSelectorSubscription: Subscription | undefined;

  // Initialization of the cvPreview object
  protected cvDataPreview: cvData = cvDataInit;

  constructor(
    private templateService: TemplateRegistryService,
    private previewConnector: PreviewConnectorService,
    private store: Store,
    private exportCv: ExportService,
  ) { }

  // Here are all the subscriptions
  ngOnInit(): void {
    // Subscription to the cvData of the previewConnector
    this.cvDataSubscription = this.previewConnector.cvDataInput$.
      subscribe((cvData) => {
        this.updatePreview(cvData.controlName, cvData.value);
      });

    this.updateSelectedTemplate('template1');
    
    // Template selector from the Store
    this.templateSelectorSubscription = this.store.select(templateSelector).subscribe((templateId: string) => {
      this.updateSelectedTemplate(templateId);
    });
  }

  ngAfterViewInit(): void {
    // Config Panzoom. Panzoom depends to the first render of the view
    this.panzoom = Panzoom(this.preview.nativeElement, {
      animate: true, // Define si se animan las transiciones.
      duration: 300, // (número) Duración de la transición en milisegundos.
      startScale: 1, // (número) Valores iniciales de escala y desplazamiento (X e Y).
      minScale: 1.2,
      maxScale: 1.8,
      easing: 'ease-in',
    });

    // Defines a center position to the panzoom element
    this.setPanInitPosition();

    // Init Wheel Event listener
    this.previewContainer.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      const zoomFactor = event.deltaY < 0 ? 1.05 : 0.01;
      const currentScale = this.panzoom?.getScale();
      let newScale = currentScale * zoomFactor;

      if (newScale < this.panzoom?.getOptions().minScale!) {
        newScale = this.panzoom?.getOptions().minScale!;
      } else if (newScale > this.panzoom?.getOptions().maxScale!) {
        newScale = this.panzoom?.getOptions().maxScale!;
      }
      this.panzoom.zoom(
        newScale, { animate: true, focal: { x: 250, y: 250 } }
      );
    });
  } 

  // Updates the cvDataPreview in real time
  private updatePreview(controlName: string, value: any): void {
    const keys: string[] = controlName.split('.');
    if (keys.length === 1) {
      (this.cvDataPreview as any)[keys[0]] = value;
    } else if (keys.length === 2) {
      (this.cvDataPreview as any)[keys[0]][keys[1]] = value;
    }
  }

  // Updates the selected template in real time
  private updateSelectedTemplate(templateId: string): void {
    const template = this.templateService.getTemplateById(templateId);
    if (template) {
      this.container.clear();
      const componentRef = this.container.createComponent(template.component as Type<any>);
      (componentRef.instance as any).cvPreview = this.cvDataPreview;
    }
  }

  // Panzoom methods
  private setPanInitPosition() {
    this.previewWidth = this.previewContainer.nativeElement.clientWidth;
    this.previewHeight = this.previewContainer.nativeElement.clientHeight;
    this.panzoom?.setOptions({
      // This values need more precision
      startX: (this.previewWidth / 5),
      startY: (this.previewHeight / 10)
    })
  }
  protected zoomIn(): void {
    this.panzoom?.zoomIn()
  }
  protected zoomOut(): void {
    this.panzoom?.zoomOut()
  }
  protected reset(): void {
    this.panzoom?.reset()
  }

  // Export Resume
  protected export(): void {
    this.exportCv.generatePdf();
  }

  ngOnDestroy(): void {
    if (this.cvDataSubscription) {
      this.cvDataSubscription.unsubscribe();
    }
    if (this.templateSelectorSubscription) {
      this.templateSelectorSubscription.unsubscribe();
    }
  }
}
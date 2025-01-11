import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { cvData } from 'src/app/model/cv-data.model';
import { cvDataInit } from 'src/app/model/cv-data-init';
import { ExportService } from 'src/app/services/export.service';
import { Subscription } from 'rxjs';
import { ProfilePictureService } from 'src/app/services/profile-picture.service';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { themeSelector } from 'src/app/state/selectors/selected-template.selectors';
import {
  template3_theme01, template3_theme02, template3_theme03, template3_theme04, template3_theme05, template3_theme06
} from './template3-themes';
import { notifyOverflow } from 'src/app/state/actions/selected-template.action';

@Component({
  selector: 'app-template3',
  templateUrl: './template3.component.html',
  styleUrls: ['./template3.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Template3Component implements OnInit, OnDestroy {
  @ViewChild('cvContainer', { static: true }) cvContainer!: ElementRef;
  @ViewChild('leftContainer', { static: true }) leftContainer!: ElementRef;
  @ViewChild('rightContainer', { static: true }) rightContainer!: ElementRef;
  @Input() cvPreview: cvData = cvDataInit;
  resizeObserver!: ResizeObserver;
  overflowDetected: boolean = false;
  pictureUrl: string | null = null;
  pictureSubscription!: Subscription;
  templateThemeSubscription!: Subscription;
  themes: Record<string, string> = {
    'theme01': template3_theme01,
    'theme02': template3_theme02,
    'theme03': template3_theme03,
    'theme04': template3_theme04,
    'theme05': template3_theme05,
    'theme06': template3_theme06,
  }
  style: HTMLStyleElement = document.createElement('style');

  constructor(
    private exportCv: ExportService,
    private pictureService: ProfilePictureService, // TODO: Replace ProfilePictureService with NGRX state management
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.exportCv.setCvToExport(this.cvContainer);
    this.pictureSubscription = this.pictureService.picture$.subscribe(picture => {
      this.pictureUrl = picture;
    });

    this.templateThemeSubscription = this.store.select(themeSelector).subscribe(theme => {
      console.log('Theme selected: ', theme);
      this.changeTheme(theme);
    })

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.alertOverflow(entry);
      }
    })
    this.resizeObserver.observe(this.leftContainer.nativeElement as HTMLElement);
    this.resizeObserver.observe(this.rightContainer.nativeElement as HTMLElement);
  }

  hasValues(object: any, keys: string[]): boolean {
    if (!object) return false; /* If the field does not exist within cvPreview, returns false */
    return keys.some(key => !!String(object[key] ?? '').trim());
    /* .some() checks if at least one element meets the condition, the anonymous function returns false if object[key] does not contain any value */
  }

  changeTheme(theme: string) {
    this.style.textContent = this.themes[theme] || this.themes['theme01'];
    if (!document.head.contains(this.style)) {
      document.head.appendChild(this.style);
    }
  }

  alertOverflow(entry: ResizeObserverEntry): void {
    if (entry.contentRect.height >= 562) {
      this.overflowDetected = true;
      this.store.dispatch(notifyOverflow({ hasOverflow: this.overflowDetected }));

    } else if (entry.contentRect.height < 562) {
      this.overflowDetected = false;
      this.store.dispatch(notifyOverflow({ hasOverflow: this.overflowDetected }));
    }
  }

  ngOnDestroy(): void {
    this.style.remove();
    if(this.pictureSubscription) {
      this.pictureSubscription.unsubscribe();
    }
    if(this.templateThemeSubscription) {
      this.templateThemeSubscription.unsubscribe();
    }
    if(this.resizeObserver){
      this.resizeObserver.disconnect();
    }
  }
}
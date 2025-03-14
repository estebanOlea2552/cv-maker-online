import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { InitEndDateComponent } from "src/app/components/form/form-shared-components/init-end-date/init-end-date.component";
import { NumInputComponent } from "src/app/components/form/form-shared-components/num-input/num-input.component";
import { ParagraphComponent } from "src/app/components/form/form-shared-components/paragraph/paragraph.component";
import { TextLineComponent } from "src/app/components/form/form-shared-components/text-line/text-line.component";
import { cvDataInit } from 'src/app/model/cv-data-init';
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormService } from "src/app/shared/services/form.service";

@Component({
    selector: 'education',
    template: `
        <div class="container" [formGroup]="cvFormGroup">
            <mat-card class="header">
                <mat-icon class="title-icon">school</mat-icon>
                <h2>Educación</h2>
            </mat-card>
            <div class="input-group-container" formArrayName="education">
                <mat-card
                class="input-list-container"
                [ngClass]="{'input-list-container-desktop': !isMobile}"
                *ngFor="let control of educationGroup.controls, let i=index"
                [formGroupName]="i">
                    <div class="input">
                        <text-line
                        [groupName]="getFormGroup(i)"
                        controlName="grade"
                        label="Título">
                        </text-line>
                    </div>
                    <div class="input">
                        <text-line
                        [groupName]="getFormGroup(i)"
                        controlName="school"
                        label="Institución">
                        </text-line>
                    </div>
                   
                    <div class="date-container">    
                        <init-end-date
                        [groupName]="getFormGroup(i)"
                        initMControl="edInitMonth"
                        initYControl="edInitYear"
                        endMControl="edEndMonth"
                        endYControl="edEndYear">
                        </init-end-date>
                    </div>   
                    <div class="accordion-container">
                        <mat-accordion>
                            <mat-expansion-panel>
                                <mat-expansion-panel-header class="accordion-header">
                                    Agregar más información
                                </mat-expansion-panel-header>
                                <div class="accordion-content" [ngClass]="{'accordion-content-desktop': !isMobile}">
                                     <div class="input">
                                        <text-line
                                        [groupName]="getFormGroup(i)"
                                        controlName="type"
                                        label="Tipo">
                                        </text-line>
                                    </div>
                                    <div class="input">
                                        <num-input
                                        [groupName]="getFormGroup(i)"
                                        controlName="average"
                                        label="Promedio académico">
                                        </num-input>
                                    </div>
                                    <div class="paragraph-container">
                                        <paragraph
                                        [groupName]="getFormGroup(i)"
                                        controlName="description">
                                        </paragraph>
                                    </div>
                                </div>
                            </mat-expansion-panel>
                        </mat-accordion>
                    </div>
                    <div
                    [ngClass]="{
                        'card-button-container-mobile': isMobile, 'card-button-container-desktop': !isMobile
                    }">
                        <button mat-flat-button (click)="removeEducation(i)" class="card-button">
                            <mat-icon>close</mat-icon>
                            Eliminar
                        </button>
                        <button mat-flat-button (click)="resetEducation(i)" class="card-button">
                            <mat-icon>undo</mat-icon>
                            Reiniciar campos
                        </button>
                    </div>
                </mat-card>
            </div>
            <div class="button-container">
                <button class="add-button" mat-flat-button (click)="addEducation()">
                    <mat-icon>add</mat-icon>
                    Añadir estudios
                </button>
            </div>
            <div
            class="prev-next-container"
            [ngClass]="{'prev-next-container-mobile': isMobile, 'prev-next-container-desktop': !isMobile}">
                <button mat-raised-button class="prev" (click)="changeSelectedCard('workexp')">
                    <mat-icon>chevron_left</mat-icon>
                    Anterior
                </button>
                <button mat-raised-button class="next" (click)="changeSelectedCard('cert')">
                    <mat-icon>chevron_right</mat-icon>
                    Siguiente
                </button>
            </div>
        </div>
    `,
    styleUrls: ['form-cards_styles.css'],
    styles: [`
        .input-group-container {
            width: 100%;
            box-sizing: border-box;
        }
        .input-list-container {
            width: 100%;
            height: auto;
            box-sizing: border-box;
            padding: 3%;
            margin-bottom: 3%;
        }
        .input-list-container-desktop {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        .input {
            width: 100%;
            transform: scale(0.9);
            box-sizing: border-box;
        }
        .date-container {
            width: 100%;
            box-sizing: border-box;
            grid-column: 1 / 3;
            margin-top: 3%;
            margin-bottom: 3%;
        }
        .accordion-container {
            grid-column: 1 / 3;
            box-sizing: border-box;
            width: 100%;
            margin-top: 3%;
        }
        .paragraph-container {
            width: 100%;
            box-sizing: border-box;
            grid-column: 1 / 3;
            margin-top: 3%;
            margin-bottom: 3%;
        }
    `],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        ParagraphComponent,
        InitEndDateComponent,
        NumInputComponent,
        TextLineComponent,
    ],
})
export class EducationComponent implements OnInit {
    cvFormGroup!: FormGroup;
    educationGroup!: FormArray;
    eduDataInit: any = cvDataInit.education;
    isMobile: boolean = true;
    @ViewChild(ParagraphComponent) paragraphComponent!: ParagraphComponent;
    @Output() selectedCard = new EventEmitter<string>();

    constructor(
        private fb: FormBuilder, private form: FormService,
        private breakpointObserver: BreakpointObserver
    ) { }

    ngOnInit(): void {
        this.cvFormGroup = this.form.getFormGroup();
        this.educationGroup = this.cvFormGroup.get('education') as FormArray;
        this.createEducation();
        this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
        .subscribe(result => {
            this.isMobile = result.matches;
        });
    }

    getFormGroup(index: number): FormGroup {
        return this.educationGroup.at(index || 0) as FormGroup;
    }

    createEducation(): FormGroup {
        return this.fb.group({
            /* grade: [this.eduDataInit.map((edu: any) => edu.grade) || ''], */
            /* school: [this.eduDataInit.map((edu: any) => edu.school) || ''], */
            /* type: [this.eduDataInit.map((edu: any) => edu.type) || ''], */
            /* average: [this.eduDataInit.map((edu: any) => edu.average) || ''], */
            /* edInitMonth: [this.eduDataInit.map((edu: any) => edu.edInitMonth) || ''], */
            /* edInitYear: [this.eduDataInit.map((edu: any) => edu.edInitYear) || ''], */
            /* edEndMonth: [this.eduDataInit.map((edu: any) => edu.edEndMonth) || ''], */
            /* edEndYear: [this.eduDataInit.map((edu: any) => edu.edEndYear) || ''], */
            /* inCourse: [this.eduDataInit.map((edu: any) => edu.inCourse) || ''], */
            /* description: [this.eduDataInit.map((edu: any) => edu.description) || ''] */
            grade: [''],
            school: [''],
            type: [''],
            average: [''],
            edInitMonth: [''],
            edInitYear: [''],
            edEndMonth: [''],
            edEndYear: [''],
            inCourse: [''],
            description: ['']
        })
    }

    addEducation(): void {
        const index = this.educationGroup.length;
        this.educationGroup.push(this.createEducation());
        this.resetEducation(index);
    }

    removeEducation(index: number): void {
        this.educationGroup.removeAt(index);
    }

    resetEducation(index: number): void {
        const educationGroup = this.getFormGroup(index);
        educationGroup.reset();
    }

    changeSelectedCard(cardName: string) {
        this.selectedCard.emit(cardName);
    }
}
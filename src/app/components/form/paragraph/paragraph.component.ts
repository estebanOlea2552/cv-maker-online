import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Jodit } from 'jodit';

@Component({
  selector: 'paragraph',
  template: `
    <div [formGroup]="groupName">
        <textarea
          [formControlName]="controlName"
          #textEditor
          id="textEditor">
        </textarea>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class ParagraphComponent implements OnInit, AfterViewInit {
  @Input() groupName!: FormGroup;
  @Input() controlName!: string;
  @ViewChild('textEditor') textEditor!: ElementRef;
  editor: Jodit | undefined;

  constructor() { }

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    const editorConfig = {
      buttons: ['bold', 'italic', 'underline', 'ul', 'left', 'undo', 'redo'],
      toolbarSticky: false,
      height: 'auto',
      minHeight: 300,
      maxHeight: '100%',
      width: '100%',
      allowResizeX: false,
      allowResizeY: false,
      showWordsCounter: false,
      showCharsCounter: false,
    };

    this.editor = Jodit.make(this.textEditor.nativeElement, editorConfig);

    this.editor.events.on('change', () => {
      const content = this.editor?.value; // Obtains the editor's content
      this.groupName.get(this.controlName)?.setValue(content); // Update the formControl
    });
  }
}
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PromptMessage} from "../../shared/prompts-store.service";
import {v4 as uuidv4} from "uuid";
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatHint, MatInput, MatLabel} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";


export enum PromptType {
  SYSTEM = 'System',
  USER = 'User'}

export type PromptEvent = {
  toDelete: boolean
  promptType: PromptType,
  message: PromptMessage
}

@Component({
  selector: 'app-prompts-list',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    MatFormField,
    MatButton,
    MatInput,
    MatLabel,
    MatHint,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './prompts-list.component.html',
  styleUrl: './prompts-list.component.scss'
})
export class PromptsListComponent implements OnInit {
  @Input('type') type!: PromptType;
  @Input('propts') propts!: Promise<PromptMessage[]>;
  @Output('promptEvent') promptEvent = new EventEmitter<PromptEvent>();
  openForm = false;
  promptsForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.promptsForm = this.formBuilder.group({
      title: [''],
      content: [''],
      id: null
    })
  }

  savePrompt() {
    const raw = this.promptsForm.getRawValue();
    this.promptEvent.emit({
      toDelete: false,
      promptType: this.type,
      message: {
        id: raw.id || uuidv4(),
        content: raw.content,
        title: raw.title
      }
    })
    this.openForm = false
    this.promptsForm.reset()
  }

  copyPrompt(message: PromptMessage){
    message.id = '';
    this.promptsForm.patchValue(message)
    this.openForm = true
  }

  editPrompt(message: PromptMessage) {
    this.promptsForm.patchValue(message)
    this.openForm = true
  }

  deletePrompt(message: PromptMessage) {
    this.promptEvent.emit({
      toDelete: true,
      promptType: this.type, message
    })
  }
}


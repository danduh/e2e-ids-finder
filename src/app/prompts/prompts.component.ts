import {Component, OnInit} from '@angular/core';
import {
  AccordionModule,
  CheckboxModule,
  DDSAngularModule,
  HelperModule,
  IconModule,
  InputModule,
  LabelModule,
  ViewMoreLessTargetDirective
} from "@dds/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, CommonModule} from "@angular/common";
import {PromptMessage, PromptsStoreService} from "../shared/prompts-store.service";
import {RouterLink} from "@angular/router";
import {PromptEvent, PromptsListComponent, PromptType} from "./prompts-list/prompts-list.component";


@Component({
  imports: [
    CheckboxModule,
    HelperModule,
    InputModule,
    LabelModule,
    CommonModule,
    FormsModule, ReactiveFormsModule, AsyncPipe, DDSAngularModule, IconModule,
    RouterLink, PromptsListComponent
  ],
  providers: [PromptsStoreService],
  selector: 'app-prompts',
  standalone: true,
  styleUrl: './prompts.component.scss',
  templateUrl: './prompts.component.html',
  viewProviders: [ViewMoreLessTargetDirective]
})
export class PromptsComponent implements OnInit {
  systemMessages!: Promise<PromptMessage[]>;
  userPrompts!: Promise<PromptMessage[]>;

  constructor(
    private storageService: PromptsStoreService
  ) {
  }

  ngOnInit() {
    this.loadMessages();
  }

  async loadMessages() {
    try {
      this.systemMessages = this.storageService.getSystemMessages();
      this.userPrompts = this.storageService.getUserPrompts();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  async promptEvent(event: PromptEvent) {
    switch (event.promptType) {
      case PromptType.SYSTEM:
        if(event.toDelete)
          await this.storageService.deleteSystemMessage(event.message.id);
        else
          await this.storageService.saveSystemMessage(event.message);
        break
      case PromptType.USER:
        if(event.toDelete)
          await this.storageService.deleteUserPrompt(event.message.id);
        else
          await this.storageService.saveUserPrompt(event.message);
        break
      default:
        console.warn('Something wrong with your prompt event', event);
    }
    await this.loadMessages()
  }

  protected readonly PromptType = PromptType;
}

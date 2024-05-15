import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
} from "@angular/core";
import { SnippetComponent } from "../snippet/snippet.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "prism, [prism]",
  standalone: true,
  imports: [SnippetComponent, CommonModule],
  templateUrl: "./code-holder.component.html",
  styles: [
    `
      :host.dark {
        background: #333;
        color: #fff;
        padding: 8px;
        font-size: 0.8rem;
      }
    `,
  ],
})
export class CodeHolderComponent implements AfterViewInit {
  codeRegex = /```(typescript|ts)([\s\S]*?)```/; // Updated regex to match both 'typescript' and 'ts'
  @Input() content: string = "";
  formattedContent: string = "";
  @Input() language = "typescript";
  codeSnippets: string[] = [];
  segments: string[] = [];

  constructor(private ref: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.formatContent();
  }

  isCodeSegment(segment: string): boolean {
    return segment.startsWith("```");
  }

  formatContent() { 
    this.segments = this.content.split(/(```(?:typescript|ts)[\s\S]*?```)/g);
    this.ref.detectChanges();
  }
}

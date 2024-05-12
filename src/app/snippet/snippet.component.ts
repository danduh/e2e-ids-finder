import { Component, Input, OnInit } from "@angular/core";
import * as Prism from "prismjs";
import { DDSAngularModule } from "@dds/angular";

@Component({
  selector: "app-snippet",
  standalone: true,
  imports: [
    DDSAngularModule
  ],
  templateUrl: "./snippet.component.html",
  styleUrl: "./snippet.component.scss",
})
export class SnippetComponent implements OnInit {
  @Input() code!: string;
  private cleanCode!: string;
  highlightedCode!: string;

  constructor() {}

  ngOnInit() {
    this.cleanCode = this.code.replace(/```(?:typescript|ts)|```/g, "").trim();

    this.highlightedCode = Prism.highlight(
      this.cleanCode,
      Prism.languages["js"],
      "typescript"
    );
  }

  async copyToClipboard() {
    const clipBoard = navigator.clipboard;
    await clipBoard.writeText(this.cleanCode);
  }

  saveToFile() {
    const el = document.createElement("a");
    el.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(this.cleanCode)
    );
    el.setAttribute("download", "page-object.ts");
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }
}

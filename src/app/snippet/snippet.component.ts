import { Component, Input, OnInit } from "@angular/core";
import * as Prism from "prismjs";

@Component({
  selector: "app-snippet",
  standalone: true,
  imports: [],
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

  copyToClipboard() {
    const el = document.createElement("textarea");
    el.value = this.cleanCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
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

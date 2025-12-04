import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-resume",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./resume.component.html",
  styleUrls: ["./resume.component.css"],
})
export class ResumeComponent {
  resumeDownloadUrl = "../assets/docs/Melissa_Lutz_Resume.pdf";
}

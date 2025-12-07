import { Component } from "@angular/core";
import { CommonModule, NgForOf } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface IrisAccount {
  address: string;
  account: string;
  findings: string;
}

@Component({
  selector: "app-iris",
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf],
  templateUrl: "./iris.component.html",
  styleUrl: "./iris.component.css",
})
export class IrisComponent {
  mainNode = "";
  reason = "";
  output = "";

  // Build 3 accounts dynamically
  accounts: IrisAccount[] = [
    { address: "", account: "", findings: "" },
    { address: "", account: "", findings: "" },
    { address: "", account: "", findings: "" },
  ];

  generateOutput() {
    let text = "";

    if (this.mainNode.trim()) {
      text += `Node: ${this.mainNode.trim()}\n\n`;
    }

    this.accounts.forEach((acc, i) => {
      if (acc.address || acc.account || acc.findings) {
        text += `Account ${i + 1}:\n`;
        text += `• Address ${acc.address.trim() || "N/A"}\n`;
        text += `• Account # ${acc.account.trim() || "N/A"}\n`;
        text += `• Findings ${acc.findings.trim() || "N/A"}\n\n`;
      }
    });

    if (this.reason.trim()) {
      text += `Reason for NTF: ${this.reason.trim()}\n`;
    }

    this.output = text.trim();

    navigator.clipboard.writeText(this.output);

    // Show "copied" message
    this.showCopied = true;
    setTimeout(() => (this.showCopied = false), 1500);
  }

  showCopied = false;

  clearAll() {
    this.mainNode = "";
    this.reason = "";
    this.output = "";

    this.accounts = [
      { address: "", account: "", findings: "" },
      { address: "", account: "", findings: "" },
      { address: "", account: "", findings: "" },
    ];
  }
}

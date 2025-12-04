import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AboutComponent } from "./pages/about/about.component";
import { ResumeComponent } from "./pages/resume/resume.component";
import { ProjectsComponent } from "./pages/projects/projects.component";
import { IrisDocumenterComponent } from "./pages/iris-documenter/iris-documenter.component";
import { RpgDemoComponent } from "./pages/rpg-demo/rpg-demo.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

export const routes: Routes = [
  { path: "", component: HomeComponent, title: "Code By Lissa | Home" },
  { path: "about", component: AboutComponent, title: "About | Code By Lissa" },
  {
    path: "resume",
    component: ResumeComponent,
    title: "Resume & Expertise | Code By Lissa",
  },
  {
    path: "projects",
    component: ProjectsComponent,
    title: "Projects | Code By Lissa",
  },
  {
    path: "iris-documenter",
    component: IrisDocumenterComponent,
    title: "IRIS Documenter | Code By Lissa",
  },
  {
    path: "rpg-demo",
    component: RpgDemoComponent,
    title: "RPG Character Maker Demo | Code By Lissa",
  },
  {
    path: "**",
    component: NotFoundComponent,
    title: "Page Not Found | Code By Lissa",
  },
];

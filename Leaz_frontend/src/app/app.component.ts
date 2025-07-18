// --- src/app/app.component.ts ---
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * The root component of the application. It acts as the main shell,
 * containing the sidebar and the main content area where other components are rendered.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Leaz';
  private router = inject(Router);

  /**
   * Navigates the user to the "Create Document" page.
   */
  createDocument() {
    this.router.navigate(['/documents/new']);
  }
}
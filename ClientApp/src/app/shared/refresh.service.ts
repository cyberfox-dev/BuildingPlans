import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private isReloaded: boolean = false;
  private openModals: NgbModalRef[] = [];

  constructor(private router: Router, private modalService: NgbModal) { }

  private handleWindowBeforeUnload = (event: BeforeUnloadEvent) => {
    // Customize the confirmation message if needed
    event.preventDefault();
    event.returnValue = '';

    // Store the current route in local storage
    localStorage.setItem('reloadRoute', this.router.url);
  }



  openModal(content: any) {
    const modalRef = this.modalService.open(content);
    this.openModals.push(modalRef);
  }

  // Method to close all open modals
  closeAllModals() {
    this.openModals.forEach(modal => modal.close());
    this.openModals = [];
  }



  private handleWindowLoad = () => {
    // Retrieve the stored route from local storage
    const reloadRoute = localStorage.getItem('reloadRoute');

    // Clear the stored route from local storage
    localStorage.removeItem('reloadRoute');

    // Delay before closing the modals
    setTimeout(() => {
      // Close all open modals
      this.closeAllModals();

      // Navigate to the stored route if it exists
      if (reloadRoute) {
        this.router.navigateByUrl(reloadRoute);
      }
    }, 1000); // Adjust the delay time (in milliseconds) as needed
  }


  enableRefreshNavigation(route: string) {
    const handleWindowUnload = () => {
      // Store the current route in session storage 
      sessionStorage.setItem('reloadRoute', route);
    };

    const handleWindowLoad = () => {
      // Retrieve the stored route from session storage
      const reloadRoute = sessionStorage.getItem('reloadRoute');

      // Clear the stored route from session storage
      sessionStorage.removeItem('reloadRoute');

      // Navigate to the stored route if it exists
      if (reloadRoute) {
        this.router.navigateByUrl(reloadRoute);
      }
    };

    window.addEventListener('unload', handleWindowUnload);
    window.addEventListener('load', handleWindowLoad);
  }

  disableRefreshNavigation() {
    window.removeEventListener('beforeunload', this.handleWindowBeforeUnload);
    window.removeEventListener('load', this.handleWindowLoad);
  }

}

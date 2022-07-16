import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { CommunicationService } from './services/communication/communication.service';
import { UserService } from './services/user/user.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
   isBackButtonVisible = false;
   isSaveChangesButtonVisible = false;
   isUploadSpinnerVisible = false;
   isDoneIconVisible = false;

   constructor(
      public communicationService: CommunicationService,
      private router: Router,
      private userService: UserService,
      private snackBar: MatSnackBar
   ) {
      router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
         let ev = e as NavigationEnd;
         this.isBackButtonVisible = ev.urlAfterRedirects.startsWith('/edit-user/');
         this.isSaveChangesButtonVisible = ev.urlAfterRedirects.startsWith('/users');
      });
   }
   ngOnInit(){
   }

   saveChanges() {
      this.isUploadSpinnerVisible = true;
      this.userService
         .saveChanges()
         .pipe(take(1))
         .subscribe({
            next: (v) => {
               console.log('Next', v);
            },
            error: (e) => {
               console.log('Error', e);
               this.isUploadSpinnerVisible = false;
               this.snackBar.open('Failed to synchronize with remote server', '', {
                  duration: 3000,
               });
            },
            complete: () => {
               console.log('Complete');
               this.isUploadSpinnerVisible = false;
               this.isDoneIconVisible = true;
               this.snackBar.open('Successfully synchronized with remote server', '', {
                  duration: 3000,
               });

               setTimeout(() => {
                  this.isDoneIconVisible = false;
               }, 2000);
            },
         });
   }
}

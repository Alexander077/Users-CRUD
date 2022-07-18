import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class CommunicationService {
   public appTitle$: ReplaySubject<string> = new ReplaySubject<string>(1);
   public isSavingChanges$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

   constructor() {}
}

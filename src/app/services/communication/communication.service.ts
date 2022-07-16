import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {

  public appTitle$: ReplaySubject<string> = new ReplaySubject<string>();

  constructor() {}
}

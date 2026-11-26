import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StorageGlobal } from '../../../../../_shared_/controllers/services/StorageGlobal';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';
import { IClient } from '../../../../../_shared_/models/IClient';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.css',
})
export class Header {
  private _storeGlobal = inject(StorageGlobal);
  router = inject(Router);


  isLoginOrRegister = toSignal<boolean>(
    this.router.events.pipe(
      filter((ev): ev is NavigationEnd => ev instanceof NavigationEnd),
      map((ev: NavigationEnd) => new RegExp("/auth/(Login|Register)").test(ev.url))
    )
  )

  client = computed<IClient | null>(() => {
    if (this.isLoginOrRegister()) return null;
    return this._storeGlobal.GetDataClient()();
  });

  isLogged = computed<boolean>(() => {
    return this._storeGlobal.GetLoginSession();
  })

}

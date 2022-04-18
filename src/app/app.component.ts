import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from './components/loading/loading.component';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  permisos: any;
  constructor() {}
  title = 'app';

  public FNBLoading = LoadingComponent;
  ngOnInit() {}
}

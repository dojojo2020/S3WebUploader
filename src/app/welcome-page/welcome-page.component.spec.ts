import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WelcomePageComponent } from './welcome-page.component'
import { SideHeaderComponent } from '../side-header/side-header.component'
import { AwsAccountsModule } from '../aws-accounts/aws-accounts.module'
import { AccountsService } from '../aws-accounts/services/accounts.service'
import { RouterTestingModule } from '@angular/router/testing'
import { Router } from '@angular/router'
import { HistoriesModule } from '../histories/histories.module'
import { InfrastructureModule } from '../infrastructure/infrastructure.module'
import { SimpleNotificationsModule } from 'angular2-notifications'
import { UpdaterService, UpdaterStatus } from '../infrastructure/services/updater.service'
import { EventEmitter } from '@angular/core'

describe('WelcomePageComponent', () => {
  let component: WelcomePageComponent
  let fixture: ComponentFixture<WelcomePageComponent>
  let updater: UpdaterService
  let updaterStatus: EventEmitter<UpdaterStatus>
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AwsAccountsModule,
        RouterTestingModule,
        HistoriesModule,
        InfrastructureModule,
        SimpleNotificationsModule.forRoot(),
      ],
      declarations: [SideHeaderComponent, WelcomePageComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    updater = TestBed.get(UpdaterService) as UpdaterService
    updaterStatus = new EventEmitter<UpdaterStatus>()
    updater.updaterStatus = updaterStatus
    fixture = TestBed.createComponent(WelcomePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
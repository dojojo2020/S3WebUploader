import { inject, TestBed } from '@angular/core/testing'

import { MockElectron } from 'src/app/infrastructure/mock-electron.service'
import { ElectronService } from 'src/app/infrastructure/services/electron.service'
import { InfrastructureModule } from 'src/app/infrastructure/infrastructure.module'
import { S3Service } from 'src/app/aws-s3/services/s3.service'

describe('S3Service', () => {
  let electron: MockElectron
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureModule],
      providers: [S3Service, { provide: ElectronService, useClass: MockElectron }],
    })
    electron = TestBed.get(ElectronService) as MockElectron
  })

  it('should be created', inject([S3Service], (service: S3Service) => {
    expect(service).toBeTruthy()
  }))
  it('should send S3-ListBuckets on listBuckets', inject([S3Service], (service: S3Service) => {
    service.listBuckets({ id: 'hi', secret: '', url: '' })
    expect(electron.messageWasSent('S3-ListBuckets', { id: 'hi', secret: '', url: '' })).toBeTruthy()
  }))
  it('should send S3-ListObjects on listObjects', inject([S3Service], (service: S3Service) => {
    service.listObjects({ id: 'hi', secret: '', url: '' }, 'hi')
    expect(
      electron.messageWasSent('S3-ListObjects', {
        account: { id: 'hi', secret: '', url: '' },
        bucket: 'hi',
        prefix: '',
      }),
    ).toBeTruthy()
  }))
  it('should send S3-RequestDownload on requestDownload', inject([S3Service], (service: S3Service) => {
    service.requestDownload({ id: 'hi', secret: '', url: '' }, 'hi', 'hi123')
    expect(electron.messageWasSent('S3-RequestDownload')).toBeTruthy()
  }))

  it('should emit ItemsEnumerated on ObjectListed', inject([S3Service], (service: S3Service) => {
    let items = []
    service.ItemsEnumerated.subscribe(its => {
      items = its.items
    })
    service.init()
    electron.send('S3-ObjectListed', {
      folders: [{ Prefix: 'hi/' }],
      objects: [{ Key: 'abc' }, { Key: 'me' }],
      parents: [],
    })
    expect(items.length).toBe(3)
  }))
  it('should send S3-RequestBulkUpload on requestBulkUpload', inject([S3Service], (service: S3Service) => {
    service.requestBulkUpload({ id: 'hi', secret: '', url: '' }, 'bucket', '', [
      { filePath: 'hi', newPath: 'hiagain', file: null },
    ])
    expect(electron.messageWasSent('S3-RequestBulkUpload')).toBeTruthy()
  }))
  it('should call listObject on S3-BulkUploadCompleted', inject([S3Service], (service: S3Service) => {
    service.init()
    let spy = spyOn(service, 'listObjects')
    electron.send('S3-BulkUploadCompleted', { parents: ['hi', 'bucket', 'prefix'], filename: 'test.txt' })
    expect(spy).toHaveBeenCalled()
  }))
  it('should emit RefreshingObjects with correct parents on S3-ListingObjects', inject(
    [S3Service],
    (service: S3Service) => {
      let parents = []
      service.RefreshingObjects.subscribe(_ => {
        parents = _.parents
      })
      service.init()
      electron.send('S3-ListingObjects', { parents: ['hi', '1', '2', '3'] })

      expect(parents.length).toBe(4)
    },
  ))

  it('should retrieve previous iterated items on getCachedItems', inject([S3Service], (service: S3Service) => {
    service.init()
    electron.send('S3-ObjectListed', {
      folders: [{ Prefix: 'hi/' }],
      objects: [{ Key: 'abc' }, { Key: 'me' }],
      parents: ['hi', '123'],
    })

    expect(service.getCachedItems('hi/123').length).toBe(3)
  }))
})

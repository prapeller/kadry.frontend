import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class UploadDownloadService {
  constructor(private backendService: BackendService) { }

  // USERS ************************************************************************************************

  downloadUsersUploadTemplateExcelFile(): Observable<Blob> {
    return this.backendService.get(`/users/download-users-upload-template-excel-file`, {
      responseType: 'blob'
    });
  }

  createOrUpdateFromExcel(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.backendService.post(`/users/create-or-update-from-excel`, formData);
  }

}
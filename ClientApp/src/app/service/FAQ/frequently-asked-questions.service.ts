import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class FrequentlyAskedQuestionsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "FAQ/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateFAQ(faqID: number | null, question: string | null, answer: string | null,  createdBy: string | null) {
    const body = {
      FAQID: faqID,
      Question: question,
      Answer: answer,
      CreatedById: createdBy,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateFAQ", body);
  }

  public deleteFAQ(faqID: number) {

    return this.httpClient.post(this.baseURL + "DeleteFAQ", faqID);

  }

  public getAllFAQ() {

    return this.httpClient.get(this.baseURL + "GetAllFAQ");

  }

}

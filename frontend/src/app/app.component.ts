import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GptDto } from './dto/gptDto';
import { AppHttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'saudi-chat-gpt';
  response!:any
  regForm = new FormGroup({
    CompanySize: new FormControl("" , Validators.required),
    CompanyName: new FormControl("" ,Validators.required),
    sectorName: new FormControl('', Validators.required),
    RegulationName: new FormControl('' ,Validators.required),
    moreDetails: new FormControl('' , Validators.required),
  });

  constructor(public http : AppHttpService){

  }

  submit(){
    console.log(this.regForm)
    this.http.getRegulation(this.regForm.value).subscribe(result => {
      console.log(result)
      this.response = result.result
    })
  }
}

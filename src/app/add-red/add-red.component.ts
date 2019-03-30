import { Component, OnInit, Injectable } from '@angular/core';
import { AddRedService } from '../services/add-red/add-red.service';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Dropbox } from 'dropbox';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-add-red',
  templateUrl: './add-red.component.html',
  styleUrls: ['./add-red.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class AddRedComponent implements OnInit {

  public addRedForm: FormGroup;


  constructor(private route: ActivatedRoute, private addRedService: AddRedService, private location: Location) { 
    
  }

  ngOnInit() {
    this.addRedForm = new FormGroup({
      name: new FormControl(),
      type: new FormControl(),
      author: new FormControl(),
      description: new FormControl(),
      folder: new FormControl(),
      filetest: new FormControl()
   });
  }

  addRed(){
    var result =
      this.addRedService.addRed(
        this.addRedForm.get('name').value,
        this.addRedForm.get('type').value,
        this.addRedForm.get('author').value,
        this.addRedForm.get('description').value,
        this.addRedForm.get('folder').value,
        this.route.snapshot.params.idRed);
  }  

  uploadFile() {
    var ACCESS_TOKEN = "I0Ng9kItu5AAAAAAAAAAHR16cYlxD2zh7tyDcSjg7cRFs0brDmSS088zp6kwqIEx";
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    var fileInput = (<HTMLInputElement> document.getElementById('filetest'));
    var file = fileInput.files[0];
    dbx.filesUpload({path: '/' + file.name, contents: file})
      .then(function(response) {
        var results = document.getElementById('results');
        results.appendChild(document.createTextNode('File uploaded!'));
        console.log(response);
      })
      .catch(function(error) {
        console.error(error);
      });
    return false;
  }

  public filesPickedToArray(files: FileList) {
    var filesArray: Array<File> = new Array<File>();

    for (let i = 0; i < files.length; i++) {
      filesArray.push(files.item(i));
    }

    this.uploadFiles(filesArray);
  }

  public uploadFiles(files: Array<File>) {
    var ACCESS_TOKEN = "I0Ng9kItu5AAAAAAAAAAHR16cYlxD2zh7tyDcSjg7cRFs0brDmSS088zp6kwqIEx";
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    var newFiles: Array<File> = files.slice(0, files.length - 1);

    if (files.length > 0) {
      for (let i = 0; i < files.length - 1; i++) {
        const file = files[i];
        newFiles.push()
      }
      console.error(files[files.length - 1].name); 

      if (files[files.length - 1].name != ".DS_Store") {
        dbx.filesUpload({path: "/"+ this.addRedForm.get('folder').value, contents: files[files.length - 1]})
        .then(function(response) {
            console.log(response);
            if (files.length - 1 > 0) {
              return this.uploadFiles(newFiles);  
            }
            else {
              this.addRed();  
            } 
          }.bind(this))
          .catch(function(error) {
            console.error(error);
        });
      }
      else {
        if (files.length - 1 > 0) {
          return this.uploadFiles(newFiles);   
        }
      }
      
    }

    return
    
  }

  goBack(): void {
    this.location.back()
  }

}

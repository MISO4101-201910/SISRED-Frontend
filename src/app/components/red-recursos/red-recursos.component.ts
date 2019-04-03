import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RedService } from 'src/app/services/red/red.service';

@Component({
  selector: 'app-red-recursos',
  templateUrl: './red-recursos.component.html',
  styleUrls: ['./red-recursos.component.css']
})
export class RedRecursosComponent implements OnInit {

  reds: [] = [];
  id: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private api: RedService) {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getReds();
    }

    ngOnInit() {}

    getReds = () => {
      this.api.getRedDetail(this.id).subscribe(
       data => {
          this.reds = data;
          console.log(this.id);
          console.log(data);
        },
        error => {
          console.log(error);
        }
      )
    }
}

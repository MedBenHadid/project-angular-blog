import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {Post} from "../../../_models/post";
import {Router} from "@angular/router";
import {AlertService} from "../../../_shared";
import {PostsService} from "../../../_shared/posts.service";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  post: Post = new Post(null,'','','pic.png',Number(sessionStorage.getItem('id')),[],[]);
  createForm = this.fb.group({
    title: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(60)]],
    body: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(255)]],
    categories: this.fb.array([
      this.fb.control('',Validators.required)
    ])
  });
  get categories() {
    return this.createForm.get('categories') as FormArray;
  }
  constructor(private fb: FormBuilder, private router: Router, private alertService: AlertService, private postsService: PostsService) { }
  addCategory() {
    this.categories.push(this.fb.control(''));
  }

  onSubmit() {
    this.post.title = this.createForm.value.title;
    this.post.body = this.createForm.value.body;
    this.post.categories = this.createForm.value.categories;

    this.postsService.createOrUpdate(this.post).subscribe(value => {
      this.router.navigate(["/posts"]).then(r => {
        this.alertService.success('Succesfully added new post', false)
      });
    },error => this.alertService.error(error,false));
  }

  ngOnInit(): void {
  }
}

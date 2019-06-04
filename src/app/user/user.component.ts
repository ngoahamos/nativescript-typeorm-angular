import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../shared/models/user.model';
import * as Toast from 'nativescript-toast';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { ListViewEventData } from 'nativescript-ui-listview';
import { RouterExtensions } from 'nativescript-angular';

@Component({
  selector: 'ns-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  moduleId: module.id,
})
export class UserComponent implements OnInit {
  name: string = "";
  users$: ObservableArray<User>;
  constructor(private _changeDetectionRef: ChangeDetectorRef,
              private router: RouterExtensions) { }

  ngOnInit() {
    this.refreshUsers();
    this._changeDetectionRef.detectChanges();
  }
  refreshUsers(args?: ListViewEventData): void {
    User.find().then((users) => {
      this.users$ = new ObservableArray(users);
      if (args) {
        const listView = args.object;
        listView.notifyPullToRefreshFinished();
      }
    });
  }
  saveUser(): void {
    if (this.name.length > 0) {
      const user = new User();
      user.name = this.name;
      user.save().then((_user) => {
        this.users$.push(_user);
        this.name = "";
        Toast.makeText("Saved!").show();
      });
    } else {
      Toast.makeText("Enter Name First").show();
    }
  }
  toTodos(args: ListViewEventData): void {
    const user = this.users$.getItem(args.index);
    this.router.navigate(['/user-todos', user.id], {transition: {name: 'slide'}});
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../shared/models/user.model';
import { RouterExtensions } from 'nativescript-angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Todo } from '../shared/models/todo.model';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import * as Toast from "nativescript-toast";
import { ListViewEventData } from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/page/page';
import { layout } from "tns-core-modules/utils/utils";
import { RadListViewComponent } from 'nativescript-ui-listview/angular/listview-directives';
@Component({
  selector: 'ns-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  moduleId: module.id,
})
export class TodoComponent implements OnInit {
  @ViewChild("todoListView") listViewComponent: RadListViewComponent;
  userId: number;
  title = 'Todos';
  todos$: ObservableArray<Todo>;
  task: string = "";
  user: User;
  private leftItem: View;
  private rightItem: View;
  private mainView: View;
  constructor(private router: RouterExtensions,
              private route: ActivatedRoute) {
                this.route.paramMap.subscribe((params: ParamMap) => {
                  this.userId = +params.get('id');
                  this.userTodos();
                })
               }

  ngOnInit() {
  }
  userTodos(args?: ListViewEventData): void {
    // with Relation example
    User.findOne({id: this.userId},{relations: ["todos"]}).then((user) => {
      this.title = user.name + ' Todos';
      this.todos$ = new ObservableArray(user.todos);
      if (args) {
        const listView = args.object;
        listView.notifyPullToRefreshFinished();
      }
    });

    // without relation example
    User.findOne(this.userId).then((user) => {
      this.user = user;
    });
  }
  goBack(): void {
    this.router.backToPreviousPage();
  }
  saveTodo(): void {
    if (this.task.length > 0) {
      const todo = new Todo();
      todo.task = this.task;
      todo.done = false;
      todo.user = this.user;
      todo.save().then((_todo) => {
        this.todos$.push(_todo);
        Toast.makeText("Todo Saved!").show();
        this.task = "";
      });

    } else {
      Toast.makeText("Enter Task First!").show();
    }
  }
  changeTaskStatus(todo: Todo, index: number): void {
    todo.done = !todo.done;
    todo.save().then((_todo) => {
      this.todos$.setItem(index, _todo);
      this.onSwipeActionComplete();
    });
  }
  removeTodo(todo: Todo, index: number): void {
    todo.remove().then(() => {
      this.todos$.splice(index,1);
      this.onSwipeActionComplete();
    })
  }

  public onSwipeCellFinished(args: ListViewEventData) {
  }
  public onLeftSwipeClick(args: ListViewEventData) {
    let itemView = args.object as View;
    const index = this.listViewComponent.listView.items.indexOf(itemView.bindingContext);
    const todo: Todo = this.todos$.getItem(index);
    
    if (itemView.id === "btnMark") {
      this.changeTaskStatus(todo, index);
    } else if (itemView.id === "btnDelete") {
      this.removeTodo(todo, index);
    }
    
  }
  onSwipeActionComplete(): void {
    this.listViewComponent.listView.notifySwipeToExecuteFinished();
  }

  public onCellSwiping(args: ListViewEventData) {
      const swipeLimits = args.data.swipeLimits;
      const swipeView = args['swipeView'];
      this.mainView = args['mainView'];
      this.leftItem = swipeView.getViewById('left-stack');
      this.rightItem = swipeView.getViewById('right-stack');

      if (args.data.x > 0) {
          const leftDimensions = View.measureChild(
              <View>this.leftItem.parent,
              this.leftItem,
              layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
              layout.makeMeasureSpec(this.mainView.getMeasuredHeight(), layout.EXACTLY));
          View.layoutChild(<View>this.leftItem.parent, this.leftItem, 0, 0, leftDimensions.measuredWidth, leftDimensions.measuredHeight);
          this.hideOtherSwipeTemplateView("left");
      } 
  }

  private hideOtherSwipeTemplateView(currentSwipeView: string) {
    switch (currentSwipeView) {
        case "left":
            if (this.rightItem.getActualSize().width !== 0) {
                View.layoutChild(<View>this.rightItem.parent, this.rightItem, this.mainView.getMeasuredWidth(), 0, this.mainView.getMeasuredWidth(), 0);
            }
            break;
        case "right":
            if (this.leftItem.getActualSize().width !== 0) {
                View.layoutChild(<View>this.leftItem.parent, this.leftItem, 0, 0, 0, 0);
            }
            break;
        default:
            break;
    }
  }
  public onSwipeCellStarted(args: ListViewEventData) {
    const swipeLimits = args.data.swipeLimits;
    swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.2; // 20% of whole width
    swipeLimits.left  = args['mainView'].getMeasuredWidth() * 0.65; // 65% of whole width
  }

}

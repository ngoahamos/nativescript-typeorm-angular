import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { UserComponent } from "./user/user.component";
import { TodoComponent } from "./todo/todo.component";


const routes: Routes = [
    { path: "", redirectTo: "/users", pathMatch: "full" },
    { path: "users", component: UserComponent },
    { path: "user-todos/:id", component: TodoComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

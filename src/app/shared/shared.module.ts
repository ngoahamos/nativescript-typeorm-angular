import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import {NativeScriptFormsModule} from 'nativescript-angular';
import { NativeScriptUIListViewModule} from 'nativescript-ui-listview/angular';

@NgModule({
  declarations: [],
  imports: [
    NativeScriptCommonModule,
    NativeScriptUIListViewModule,
    NativeScriptFormsModule
  ],
  exports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptUIListViewModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule { }

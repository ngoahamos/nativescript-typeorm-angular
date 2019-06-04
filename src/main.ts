// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import {createConnection} from "typeorm/browser";
import { AppModule } from "./app/app.module";
import { Todo } from "./app/shared/models/todo.model";
import { User } from "./app/shared/models/user.model";
const Sqlite = require("nativescript-sqlite");

// A traditional NativeScript application starts by initializing global objects,
// setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization:
// modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together,
// so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.

(async () => {
    try {
        const connection = await createConnection({
            database: 'test.db',
            type: 'nativescript',
            driver: Sqlite,
            entities: [
                Todo, User
            ],
            logging: true
        })

        console.log("Connection Created")

        // setting true will drop tables and recreate
        await connection.synchronize(false) 

        console.log("Synchronized")


    } catch (err) {
        console.error(err)
    }
})();


platformNativeScriptDynamic().bootstrapModule(AppModule);

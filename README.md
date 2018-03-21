# Task Manager

This is a task management site that allows you to make lists and assign tasks to them.  Thus you could have a list of
work tasks, or a list of tasks for a specific project.

You can book mark a specific list you're looking at as list ids in the URL will load the list.  Similarly, various interface
settings are stored locally, so if you only want to view incomplete tasks, that setting will be remembered on each reload.

The tasks are sortable by task name and (optional) due date.  Incomplete tasks that are coming due (in a week or less) are 
marked orange, and tasks that are coming due in two days or are over due are marked in red.

Lists and tasks can be edited (through edit in place).  They can also be deleted; deleting a list will remove all the
associated tasks.

You can search through all tasks via a search box.  Clicking on the list or task name that comes up will take you to 
that list.

The site is fully adaptive to different screen sizes.  I considered using modal windows for adding list names and tasks,
but as I've had some sites using modals that behave poorly on phones and even tablets, I opted for a more explicit form
set up.  Which is not to say that modal windows couldn't be used, but being explicit with the options made the most sense
for this specific site.

The front end is built out with React, the server with Express, the site is styled with Bootstrap, and light restyling is
handled with LESS. 

The server is included, along with all the necessary end points (described below).  The REST end points are all protected 
by token based auth.

## Planned improvements
There are a few things that I would like to add in time:

1. Some forms do not give adequate notice if the form requirements are not met before submitting.  However, the forms do
    self validate, so that they can't be submitted with bad info (for example, you cannot save a list or task without a 
    list name or a task name).
2. I would like to add a better date picker.  I've not found one for React that I like (as they are no longer being updated,
    have strange requirements, or have other issues), and have not yet simply made my own.  The string based date entry 
    is prone to user error, but is serviceable for now.
    
# API endpoints
The included server also has all necessary end points to manage the content.  The are as follows:

## Authentication

1. POST `/api/users`: Create a new user
2. POST `/api/users/authenticate`: Authenticate a user for login
3. GET `/api/users`: Get a user, using a token

## List Management

1. POST `/api/lists`: Create new list
2. GET `/api/lists`: Get a user's lists
3. GET `/api/lists/:listId`: Return a specific list
4. DELETE `/api/lists/:listId`: Delete a specific list
4. PUT `/api/lists/:listId`: Update a list

## Task Management
1. POST `/api/lists/:listId/tasks`: Create new task in a specific list
2. GET `/api/lists/:listId/tasks`: Get a user's tasks for a specific list
3. GET `/api/lists/:listId/tasks/:taskId`: Return a specific task
4. DELETE `/api/lists/:listId/tasks/:taskId`: Delete a specific task
4. PUT `/api/lists/:listId/tasks/:taskId`: Update a task      

# Dev and site management

## Getting Started
To get a local environment up and running, install this repo locally and run `npm install`.  To run the development 
environment simply run `npm run dev` on the command line from the root directory where you have installed the software.

The site will then be available at `http://localhost:3000`.

### Prerequisites

The prerequisites are Node.js / npm and MongoDB.  The server itself should install with `npm install`.

The database is currently set up to run at localhost and will need to be configured in the `src/server/config/db.config.js` 
file.  DO NOT run a production server without properly setting up your production database!  This must include
proper passwords and security!

### Installing

After downloading the repo, run `npm install`.  At that point you should have various scripts available to you via the package.json file. 
These include:

1. `clear`: clean the `dist` or distribution folder
2. `lint`: run the linter; currently linter isn't set up because it does not like decorators
3. `build:server`: compile the server through babel
4. `build:client`: run webpack on the code
5. `build`: run webpack and babel
6. `dev`: run the dev server
7. `start`: run the production server code at `dist/server/index.js`
8. `deploy`: run the production build and server start commands `build` and `start`

To run any of these scripts, run `npm run SCRIPTNAME`.  For example, `npm run dev` or `npm run start`.  Most of these scripts will not be used 
for day to day development.

Make sure that your database configurations are properly set up in `src/server/config/db.config.js`.

Similarly, hashing of passwords is configured through `src/server/config/auth.config.js`.  The auth "secret code" should be set here to 
ensure proper security.

### Basic structure
Server code is handled under `src/server`, and front end code under `src/app`.  

To adjust server settings, look under `src/server/config` or `src/server/index.js`, the entry point to the server code.

Front end code is handled under `src/app`, with it's entry point at `src/app/app.js`.

## Running the tests

Tests are pending.  They will be set up with Mocha and Storybook, and will test both the server and front end code.

## Deployment

You can deploy with `npm run build` and then `npm run start`, or simply `npm run deploy` to both run and deploy in one.

## License

This project is licensed under the WTFPL License 

## Acknowledgments

* The all in one set up is inspired by code from Scotch.com 
* Some components were inspired by the React - MobX Real World system, though have gone through radical changes

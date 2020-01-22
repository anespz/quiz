# Index 

This project was created with create-react-app, and has therefore got some boilerplate code in different files. 
More instructions on how to run the react app is given below. 
The main files I have worked on are

    |- src/

        |- Cards/

            |- MenuCard.js

            |- QuestionCard.js

            |- ResultsCard.js

        |- Container.js

        |- Style.js

## Bugs

There is currently one known bug in the code: 
When going from menu to one of the activities, error messages will appear because of an async fetch returning too late. 
To continue the demo around this bug, refresh the browser page. 

## Features not implemented

The timed "Round" cards between rounds has not been implemented due to lack of time. 
They could have been linked to the rest of the question cards in QuestionCard's redirect(path) method, and timed using setTimeout().
The interface is also currently very simple, and could have been made to look more similar to the refence given more time. 

## The MockAPI

I ended up using a local copy of the .json file (./mockAPI.json) for testing, 
which I ran on a local server (http://localhost:3000/payload') using 'json-server --watch mockAPI.json'. 

The data added from the quiz stays as a history of user answers, for the mock scenario that you would want to analyse it. 
There is currently no interface method for clearing the user data, as I did this manually when testing. 


## Deploying the website

I was planning to deploy the website using github's gh-pages, but just now found out that they don't allow React Routing via the history API, which I have based some of my code on. Hopefully a live demonstration during the interview will be alright. 



# README by create-react-app 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

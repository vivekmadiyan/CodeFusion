# CodeFusion : Realtime Collaborative Code Editor

## Introduction

Are you tired of sending code snippets back and forth, struggling to debug and collaborate with your team? Look no further! CodeFusion is here to revolutionize the way you code together. This powerful and intuitive collaborative code editor is designed to empower developers, and teams to work seamlessly in real-time, regardless of their location. With CodeFusion, you can code together, debug together, and ship faster, together.

## Features

- Multiple users can join a room and edit code together
- Changes are reflected in real time
- Copy button to copy the room id to clipboard
- Leave button to leave the room
- Supports syntax highlighting for different programming languages
- Users can choose theme based on their preferences
- Users can leave the room and rejoin later to continue editing
- Joining & leaving of users is also reflected in real time

### Prerequisites

#### For running locally

- Node.js (v20.11.1)
- npm (10.2.4)

## Tech Stack

- React.js
- Node.js
- Express.js
- Socket.io
- CodeMirror

### Running Locally

1. Clone this repository and cd into it
2. Run `npm install` to install the dependencies
3. Create .env file in the root folder and copy paste the content of example.env, and add necessary credentials.
4. To start the react app client run `npm run dev` in one terminal
5. To start the server run `npm start`
6. Go to `http://localhost:3000` to view the app


**Note:** To stop your server, press `Ctrl+c` in the terminal.

## Future Scope

1. [x] Added syntax highlighting for multiple languages
2. [x] Added support for multiple themes
3. [x] Added support for saving the last theme and language selected by the user in local storage
4. [ ] Add support to accept or reject new users trying to join the room
5. [ ] Add to implement video and voice chat feature inside the editor
6. [ ] Add support for local code file uploading

## Open Source Contribution

If you want to make contribution to this projects, follow the steps below:

1. Fork this repository
2. Clone the forked repository <br>

```
git clone https://github.com/your-github_username/Realtime-Collaborative-Code-Editor.git
```

3. cd into the cloned repository
4. Create a new branch <br>

```
git checkout -b your_branch_name
```

5.  Make your changes
6.  Commit and push your changes <br>

```
git add . <br>
git commit -m "your commit message" <br>
git push origin your_branch_name
```

7. Finally, create a pull request by visiting your forked repository on GitHub

**Note:** Please make sure to use your own branch when contributing.

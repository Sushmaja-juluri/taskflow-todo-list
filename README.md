# TaskFlow — Smart To-Do List App

TaskFlow is a responsive task management web application built using HTML, CSS, and JavaScript. It helps users organize daily activities, prioritize tasks, track deadlines, and monitor their progress through a simple dashboard.

Task information and theme preferences are saved in the browser using LocalStorage, so they persist across page refreshes in the same browser.

## Features

- **Task management:** Add, edit, complete, and delete tasks.
- **Priority levels:** Organize tasks as High, Medium, or Low priority.
- **Due dates:** Assign deadlines and identify overdue tasks.
- **Search:** Find tasks quickly by searching their names.
- **Status filters:** View all, pending, completed, or overdue tasks.
- **Priority filters:** Display tasks by their priority level.
- **Dark mode:** Switch between light and dark themes, with the selected theme saved in the browser.
- **Progress dashboard:** View total, completed, pending, and overdue task counts.
- **Completion percentage:** Track overall progress with a visual progress bar.
- **Persistent storage:** Save tasks using browser LocalStorage.
- **Responsive design:** Use the application on desktop and smaller screens.
- **Backward compatibility:** Load existing tasks saved by the earlier version of the app, assigning Medium priority to tasks without a saved priority.

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JavaScript)
- Browser LocalStorage
- Visual Studio Code
- Live Server extension for local development

## Project Structure

```text
todo-list-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

### Prerequisites

- A modern web browser
- Visual Studio Code (recommended)
- The Live Server extension for VS Code (optional, but recommended)

### Run Locally

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using Live Server, or open the HTML file directly in a browser.
4. Add tasks, set priorities and deadlines, and explore the dashboard.

## How It Works

1. Users enter a task name and optionally select a priority and due date.
2. JavaScript manages tasks and updates the interface dynamically.
3. LocalStorage saves task data and the selected theme in the browser.
4. Search and filters help users find specific tasks.
5. Dashboard statistics and the progress bar update as tasks are completed or changed.
6. Overdue tasks are identified using their deadlines and completion status.

## Testing Checklist

- [ ] Add, edit, complete, and delete tasks.
- [ ] Verify that tasks persist after refreshing the browser.
- [ ] Verify all three priority levels.
- [ ] Test due dates and overdue indicators.
- [ ] Test search, status filters, and priority filters.
- [ ] Verify that dark mode persists after refresh.
- [ ] Verify dashboard statistics and completion percentage.
- [ ] Check the layout on a smaller screen.
- [ ] Confirm previously saved tasks remain available.

## Limitations

- Tasks are stored locally in the browser and are not synchronized across devices.
- Clearing browser storage can remove saved tasks and preferences.
- The application does not currently use a backend or user accounts.

## Future Improvements

- Task categories and tags
- Sorting by priority and deadline
- Notifications for upcoming deadlines
- Export and import tasks
- Cloud synchronization and user authentication

## Author

Developed as a hands-on web development project to practice HTML, CSS, JavaScript, DOM manipulation, responsive design, and browser storage.

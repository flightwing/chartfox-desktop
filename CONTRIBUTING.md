# Contributing to ChartFox Desktop

First off, thank you for considering contributing to **ChartFox Desktop**! 🎉

This document provides guidelines for contributing to this project. Being an open-source project under the MIT license, we value every bit of help, whether it's reporting bugs, proposing new features, or submitting Pull Requests.

Please note that this project is a **desktop wrapper** for the ChartFox web service and is not directly affiliated with the official ChartFox team.

## 🤝 Code of Conduct

We want participation in this project to be a harassment-free experience for everyone. We expect all contributors to conduct themselves with respect and courtesy towards others.

## 🐛 How to Report a Bug

Before creating a new bug report, please check the following:

1.  **Is the bug in the desktop app or on the ChartFox website?**
    *   If the map isn't loading correctly, charts are missing, or data is incorrect, this is likely an issue with the [ChartFox.org](https://chartfox.org/) service itself, not this application.
    *   If the application crashes, fails to install, has window resizing issues, or desktop-specific features (menu, shortcuts) are broken, please report it to us.

2.  **Search existing Issues** to see if the bug has already been reported.

If you are opening a new Issue, please use a descriptive title and provide as much information as possible:
*   Operating System version
*   Application version (if known)
*   Steps to reproduce the error
*   Expected vs. actual behavior

[🔗 Open a new Issue](https://github.com/flightwing/chartfox-desktop/issues)

## 💡 How to Suggest a Feature

Have an idea to improve the app? Great!
Open a new Issue on GitHub and include:
*   A clear and concise description of the proposed feature.
*   The reason why this feature would be useful.
*   Ideally, a sketch or screenshot of what it might look like.

## 🛠️ Development & Pull Requests

If you want to contribute code:

1.  **Fork** this repository on GitHub.
2.  **Clone** your fork locally:
    ```bash
    git clone https://github.com/your-username/chartfox-desktop.git
    cd chartfox-desktop
    ```
3.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b fix/your-fix-name
    ```
4.  **Install dependencies**:
    ```bash
    npm install
    ```
5.  **Make your changes**. You can test the app locally using:
    ```bash
    npm start
    ```
    > **Note:** If you are modifying web interactions, keep in mind that we are using Electron.
6.  **Commit** your changes. Please write clear commit messages (following the *Conventional Commits* specification is recommended).
    ```bash
    git commit -m "feat: add support for dark menu"
    ```
7.  **Push** changes to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Open a Pull Request** (PR) to the main repository `flightwing/chartfox-desktop`.
    *   In the PR description, explain what the change does.
    *   Link to relevant Issues (e.g., "Closes #123").

## 🎨 Code Style

*   Try to follow the coding style already used in the project.
*   Ensure your code does not introduce unnecessary errors or warnings.

## 🏗️ Building the App

If your changes require verifying a production build, you can create one using:
```bash
npm run dist
```
The resulting files will be located in the `dist/` folder.

---

Thank you for your contributions! We appreciate your time and effort in helping improve ChartFox Desktop for the entire flight simulation community. ✈️

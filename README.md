# NPM Package Template

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

This is a public template repository designed to help you quickly and easily start developing your own npm package. By using this template, you can get a basic structure and essential tooling already set up, allowing you to focus on building the core functionality of your package.

## Highlights

- **Git Flow:**
  This template follows the Git Flow branching strategy, enabling a well-organized development workflow with dedicated branches for features, hotfixes, and releases.
- **Pre-configured development tools:**
  - ESLint for code quality and consistency
  - Prettier for code formatting
  - Husky for managing Git hooks
  - Lint-staged and pre-commit hooks for pre-push checks
- **Automated workflows:**
  - Dependabot with auto-merge simplifies dependency management.
  - Release hotfix scripts for streamlined versioning.
- **Organized template structure:**
  Provides a well-defined directory layout for your package files.
- **Changelog tracking:**
  Tracks changes made to the package for transparency.
- **Public template:**
  Anyone can generate their own repository based on this template

## Getting Started

Choose one of the following methods to quickly set up and start developing your npm package:

1. **Generate a new repository:**

   - Click on the **"Use this template"** button at the top of this page to create a new repository based on this template.
   - Enter a name for your repository and customize other settings.

2. **Clone your new repository:**

   - Open a terminal and run the following command, replacing `[your-username]` with your GitHub username and `[your-repository]` with the name of your newly generated repository:

     ```bash
     git clone https://github.com/[your-username]/[your-repository].git
     cd [your-repository]
     ```

3. **Install dependencies:**
   Run the following command to install the necessary development tools and dependencies:

   ```bash
   npm install
   ```

4. **Initialize Git Flow:**

   - **macOS/Linux users:** Install Git Flow globally:

   ```bash
   npm i -g gitflow
   ```

   - **For all users:** Navigate to your project directory and run:

   ```bash
   git flow init
   ```

   - **Follow the prompts:** to configure Git Flow. Set the following branch names:
     - **`main`:** for production releases.
     - **`develop`:** for "next release" development.
     - Default names for branch prefixes.

5. **Start development:**

   - Begin developing your package code and features. The pre-configured tools like ESLint and Prettier will help maintain code quality and consistency.
   - Commit changes respecting the conventional commits style: https://www.conventionalcommits.org/en/v1.0.0/#summary

6. **Release your package:**
   Run the following command:

   ```bash
   npm run release
   ```

## Contributing

Contributions are welcome! Here's how you can help:

- Report bugs and suggest improvements (help us make it better!)
- Submit pull requests with new features or fixes (we appreciate your code!)
- Provide feedback and discussion on the project (your feedback is valuable!)

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## Author

- [Hussam Aldarwish](https://github.com/hussam-aldarwish)

## Acknowledgments

This template is inspired by existing open-source projects and best practices. We thank the community for their contributions to the npm package development ecosystem.

## Contact

For any questions or feedback, feel free to open an issue in this repository or reach out to Me: https://github.com/hussam-aldarwish.

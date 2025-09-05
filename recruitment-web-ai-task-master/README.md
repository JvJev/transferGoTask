# Recruitment Task: Crypto Dashboard

Welcome! Your task is to analyze, fix, and extend this small application for browsing cryptocurrency data.

## Context

The application fetches data from the public CoinGecko API and displays a list of the top 100 cryptocurrencies. You can also click on an item to see more details. Unfortunately, the project contains several bugs and is missing one key feature.

## How to Start

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Your Tasks

### 1. Bug Fixing

* **UI/CSS Bug:** The grid displaying the list of cryptocurrencies on the main page is not responsive and "breaks" on smaller screens. Please fix the styles to ensure it looks good on all devices.
* **Logical Bug:** The search bar on the main page is case-sensitive. Please correct it to search regardless of the case of the input text.
* **Data Formatting Bug:** On the details page, the price and market cap are displayed as raw, unreadable numbers. Please format them to be user-friendly (e.g., add thousand separators and a currency symbol).

### 2. New Feature

* **Sorting:** Add the ability to **sort the list of cryptocurrencies** on the main page. The user should be able to sort the list by **name** (alphabetically A-Z) and by **price** (ascending and descending).

### 3. UI & Code Quality Improvements

* **Loading State:** The application doesn't show any feedback to the user while data is being fetched. Implement a simple loading indicator (e.g., a "Loading..." message or a spinner) that displays while the initial list of coins is loading.
* **Error Handling:** If the CoinGecko API is down or a request fails, the application may crash or show a server error. Gracefully handle potential API errors on **both the homepage and the single coin page**. Instead of an error, display a user-friendly HTML page explaining the problem (e.g., "Could not load data, please try again later.").
* **Component Refactoring:** The coin card on the main page is currently part of the `index.js` file. Refactor it by creating a separate, reusable component (e.g., `components/CoinCard.js`) and import it into the main page.
* **Visual Polish:** The single coin page is currently very basic. Improve its design to make it more visually appealing and professional. Feel free to be creative with the layout, typography, and styling.

### 4. Going the Extra Mile

* Anything you consider valuable to add based on your experience will be treated as an extra contribution, allowing you to benefit from your knowledge, expertise, or AI. If you choose to go beyond the core requirements, please document it clearly so it can be easily found. We encourage and rely on your proactivity.

### 5. AI Usage Documentation

In the `AI_USAGE.md` file, describe how and for what purpose you used AI tools (e.g., GitHub Copilot, ChatGPT) while completing this task. Be specific - describe what problems they helped you solve or what code they helped you generate.

## Good Luck!

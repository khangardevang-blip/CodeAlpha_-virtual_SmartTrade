# SmartTrade Virtual Platform

SmartTrade is a full-stack, real-time virtual stock market simulator designed to provide users with a clean, modern interface to practice trading top global stocks without any financial risk.

## Features

*   **Real-time Market Simulation:** A background daemon actively simulates market volatility, updating stock prices every few seconds to reflect real-world market dynamics.
*   **User Portfolios:** Users start with a virtual balance of ₹100,000 to buy and sell stocks, tracking their positions and average buy prices.
*   **Transaction History:** A comprehensive ledger of all past trades, capturing execution price, quantity, and timestamps.
*   **Dynamic Visualizations:** Interactive Chart.js graphs mapping portfolio allocations dynamically.
*   **Admin Dashboard:** A robust role-based administrative interface for managing the user ecosystem, including cascading data deletion capabilities.
*   **Secure Authentication:** Powered by Spring Security using robust HS512 JWT (JSON Web Tokens) for stateless authentication.

## Tech Stack

*   **Frontend**: 
    *   Vanilla JavaScript (Single Page Application Router)
    *   HTML5 / Custom Vanilla CSS (Glassmorphism design language)
    *   Bootstrap 5 (Layout & Modals)
    *   Chart.js (Data Visualization)
*   **Backend**:
    *   Java 17+
    *   Spring Boot 3.x
    *   Spring Security & JWT
    *   Spring Data JPA (Hibernate)
*   **Database**:
    *   H2 In-Memory Database (for rapid prototyping and testing)

## Getting Started

### Prerequisites
*   Java Development Kit (JDK) 17 or higher

### Running the Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Run the Spring Boot application using the Maven wrapper:
    ```bash
    ./mvnw spring-boot:run
    ```
    *Note: The backend runs on `http://localhost:8080`. An H2 console is available at `/h2-console`.*

### Running the Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Open your browser and navigate to `http://localhost:3000`.

## Administrative Access

 *   The Advantage: It acts as the "control room" for your entire business     logic as you grow.
 *    Why use it: Right now, your panel allows you to delete users. In the future, you can easily expand it to include:
      *   Financial Controls: Manually adding or deducting virtual funds from a user's account.
      *    Market Controls: Halting trading on a specific stock or tweaking the market volatility algorithm.
     *     Analytics: Viewing platform-wide metrics (e.g., total trades made today, most popular stocks being bought).

## Project Structure

```
task3/
├── backend/               # Spring Boot Application
│   ├── src/main/java/...  # Controllers, Models, Repositories, Security
│   └── pom.xml            # Maven dependencies
└── frontend/              # Vanilla JS SPA
    ├── css/               # Styling (Glassmorphism theme)
    ├── js/                # app.js, router.js, components.js
    └── index.html         # Entry point
```

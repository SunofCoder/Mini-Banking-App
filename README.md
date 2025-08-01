## Technologies Used

### Backend

* **Spring Boot:** A Java-based framework for building RESTful APIs.

* **Spring Security:** For JWT (JSON Web Token) based authentication and authorization.

* **Spring Data JPA:** For database interactions.

* **H2 Database:** A lightweight, in-memory database for the development environment.

* **Maven:** For project and dependency management.

* **Lombok:** To reduce boilerplate code (getters/setters etc.).

* **Jackson:** For JSON serialization/deserialization.

### Frontend

* **React:** A JavaScript library for building user interfaces.

* **Tailwind CSS:** A CSS framework for rapid and responsive UI development.

* **React Context API:** For managing application-wide state (especially authentication status).

* **Fetch API:** For making HTTP requests to the backend.

* **Hash-Based Routing:** For navigation between pages (a simple hash-based solution instead of React Router).

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Java Development Kit (JDK) 17 or higher

* Maven 3.6.3 or higher

* Node.js 14 or higher

* npm (comes with Node.js)

### Backend Setup

1.  **Clone the Repository:**

    ```
    git clone (https://github.com/SunofCoder/Mini-Banking-App.git)
    cd Mini-App/backend
    ```

2.  **Install Dependencies and Build the Project:**

    ```
    mvn clean install -DskipTests
    ```

3.  **Run the Application:**

    ```
    java -jar target/backend-0.0.1-SNAPSHOT.jar
    ```

    The backend application will run on `http://localhost:8080` by default.

### Frontend Setup

1.  **Navigate to the Frontend Directory:**

    ```
    cd Mini-App/frontend
    ```

2.  **Install Dependencies:**

    ```
    npm install
    ```

3.  **Run the Application:**

    ```
    npm run dev
    ```

    The frontend application will run on `http://localhost:5173` by default.

## Usage

1.  **Open the Application:** Go to `http://localhost:5173` in your browser.

2.  **Register:** To start using the application, go to the "Register" page and create a new user account.

3.  **Login:** After registering, log in from the "Login" page with your created user credentials.

4.  **Dashboard:** After logging in, you will be redirected to the dashboard where you can manage your accounts and perform other banking operations.

5.  **Create Account:** Open new bank accounts using the "Create New Account" option.

6.  **View Accounts:** With the "View Accounts" option, you can list all your accounts, view their details, update them, or delete them.

7.  **Transfer Money:** You can send money to another account from an account's detail page using the "Transfer Money" option.

8.  **Transaction History:** You can view the transaction history for a specific account from its detail page using the "View Transaction History" option.

## Future Enhancements (Optional)

* **Swagger Integration:** To provide automatic documentation for Backend APIs.

* **More Advanced UI/UX:** Graphs on the Dashboard, more detailed form validation, theme options.

* **Additional Banking Functions:** Deposit/withdrawal, bill payments, recurring transfers.

* **Enhanced Security:** Two-factor authentication (2FA), password reset.

* **Performance Improvements:** Pagination or infinite scrolling for large data sets.

* **Tests:** Writing unit and integration tests for both backend and frontend.
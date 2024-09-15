# Smart Search

**Smart Search** is a dynamic real estate application that allows users to search for house listings using natural language queries. It utilizes OpenAI's Azure API to convert user queries into SQL, which is executed against an SQLite database. The results are displayed with relevant images, property details

## Features
- **Natural Language Search**: Users can input queries such as *"Find me a 3-bedroom house in New York under $500k with a garden."*
- **SQL Query Generation**: The app uses OpenAI to convert these queries into SQL statements.
- **Dynamic Data Display**: House listings are dynamically fetched from the database and displayed with property images.
- **Modern UI**: The app boasts a clean and intuitive UI built using React and Material-UI.
- **Cross-Origin Resource Sharing (CORS)**: The Flask backend allows communication between the front and backend services.


## Tech Stack

### Backend
- **Python**
- **Flask**: Backend framework for the API.
- **SQLite**: Database to store house listings.
- **OpenAI API**: Azure OpenAI integration for query generation.

### Frontend
- **React**: JavaScript library for building the user interface.
- **Material-UI (MUI)**: For a modern and responsive design.
- **Axios**: To handle HTTP requests.

---

## Setup Instructions

### Prerequisites
- **Node.js** and **npm**: For the frontend React app.
- **Python 3.x**: For the Flask backend.
- **SQLite**: Comes bundled with Python, no separate installation required.
- **Azure OpenAI API key**: You need access to the Azure OpenAI services.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-search.git
cd smart-search
```

## Backend Setup

1. **Navigate to the `backend` folder**:
    ```bash
    cd backend
    ```

2. **Create a virtual environment** and activate it:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. **Install the required packages**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Environment Setup**: 
    - Create a `.env` file in the backend root directory and add your Azure OpenAI API keys:

    ```plaintext
    AZURE_OPENAI_API_KEY=your-azure-api-key
    AZURE_OPENAI_ENDPOINT=your-azure-endpoint
    ```

5. **Populate the SQLite Database**:
    - Run the following Python script to create and populate the `listings.db` database:

    ```bash
    python populate_db.py
    ```

6. **Run the Flask Backend**:
    - Start the Flask server by running:

    ```bash
    python app.py
    ```

    - The backend will run on `http://127.0.0.1:5000`.

## Frontend Setup

1. **Navigate to the `frontend` folder**:
    ```bash
    cd ../frontend
    ```

2. **Install the required npm packages**:
    ```bash
    npm install
    ```

3. **Start the React development server**:
    ```bash
    npm start
    ```

4. The frontend will now be available at `http://localhost:3000`.

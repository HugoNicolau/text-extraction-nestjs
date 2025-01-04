
# Text Extraction Backend (NestJS)

This is the backend for a text extraction application. It acts as a middleman between the frontend and the FastAPI service, handling image uploads and returning extracted text.

---

## Related Repositories

- [Frontend Repository (React + Vite + TypeScript)](https://github.com/HugoNicolau/text-extraction-react)


- [Backend Repository (NestJS + TypeScript)](https://github.com/HugoNicolau/text-extraction-nestjs)

- [Backend Repository (FastAPI + Python)](https://github.com/HugoNicolau/text-extraction-py)

---

## Features

- Accepts image uploads from the frontend.
- Forwards the image to the FastAPI service for text extraction.
- Returns the extracted text to the frontend.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v18 or higher)
- Yarn (or npm)
- FastAPI service running (for text extraction)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/HugoNicolau/text-extraction-nestjs.git
   cd text-extraction-nestjs
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   FASTAPI_URL=http://localhost:8000
   ```

   Replace `http://localhost:8000` with the URL of your FastAPI service.

---

## Running the Project

1. **Start the NestJS server:**

   ```bash
   yarn start
   ```

   The server will start at `http://localhost:3000`.

2. **Test the API:**

   Use `curl` or Postman to test the `/ocr/extract` endpoint:

   ```bash
   curl -X POST -F "file=@./test-image.png" http://localhost:3000/ocr/extract
   ```

   Example response:

   ```json
   {
     "text": "This is the extracted text from the image."
   }
   ```

---

## API Endpoints

### POST `/ocr/extract`

Extract text from an uploaded image.

**Request:**

- **File:** The image file to process (supported formats: PNG, JPEG, etc.).

**Response:**

- **text:** The extracted text.

---

## Project Structure

```
text-extraction-backend/
├── src/
│   ├── ocr/
│   │   ├── ocr.controller.ts       # Handles image uploads
│   │   ├── ocr.service.ts          # Calls the FastAPI service
│   │   └── ocr.module.ts           # OCR module
│   ├── app.module.ts               # Main application module
│   └── main.ts                     # Application entry point
├── .env                            # Environment variables
├── .gitignore                      # Files to ignore in Git
├── package.json                    # Project dependencies
├── README.md                       # Project documentation
└── yarn.lock                       # Dependency lock file
```

---

## Dependencies

- **@nestjs/axios:** For making HTTP requests to the FastAPI service.
- **form-data:** For handling multipart form-data requests.
- **@nestjs/platform-express:** For handling file uploads.

---

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [NestJS](https://nestjs.com/) for the backend framework.
- [FastAPI](https://fastapi.tiangolo.com/) for the text extraction service.
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) for text extraction.

---

## Contact

For questions or feedback, please reach out to [Hugo Nicolau](mailto:nicolau.hugogiles@gmail.com).

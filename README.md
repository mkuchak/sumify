# YouTube Video Summarizer

This is a simple web application that allows you to summarize your favorite YouTube videos. Just paste the link of the video, and the application will provide a summary for you. It utilizes various technologies to achieve this functionality.

## Technologies and Patterns Used

- React with Vite: This project is built using React, a popular JavaScript library for building user interfaces, and Vite, a fast development server and bundler.
- TailwindCSS: TailwindCSS is a utility-first CSS framework that provides a set of predefined classes to rapidly build user interfaces. It is used for styling the web application in this project.
- Cloudflare Workers: Cloudflare Workers is a serverless platform that allows you to deploy and run JavaScript code at the edge of the network. It is used in this application to handle the backend logic and process the YouTube video summaries.
- ChatGPT: ChatGPT is a large language model developed by OpenAI. It powers the video summarization feature by generating summaries based on the YouTube video content.
- DDD (Domain-Driven Design): DDD is an architectural approach that emphasizes modeling a software system based on the domain it operates in. It helps in organizing the codebase and separating concerns.

## Usage

1. Clone the repository: `git clone https://github.com/mkuchak/sumify.git`
2. Install dependencies: `npm install`
3. Copy the `.env.example` file to `.env` and fill in the required values
4. Start the development server: `npm run dev`
5. Open the application in your browser: `http://localhost:5173`

## Contribution

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use and modify the code as per the terms of the license.

## Disclaimer

This application is for demonstration purposes only and should not be used for any commercial or production purposes. The video summaries generated may not always be accurate or comprehensive. Use at your own risk.

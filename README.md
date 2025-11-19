# team-6-project
⭐ Project Overview (Simple Explanation)

This project is a URL Summarization System.
A user submits a link → backend scrapes and extracts the article → an AI model summarizes it → stores it in a database → user can view the summary and topics.

Everything runs through a queue-based architecture so the system remains fast and scalable.

⭐ Tech Stack Explained (Simple + Detailed)
1️⃣ Frontend

Purpose:

Allows users to submit URLs.

Shows the summary, extracted topics, and job status.

Simple Explanation:
The frontend is just a clean UI where users paste a link and see the final summarized article.

2️⃣ Node.js + Express (Backend API)

Purpose:

Acts as the main API gateway.

Handles user authentication using JWT (JSON Web Tokens).

Sends scraping/summarization jobs to the queue.

Simple Explanation:
Node.js receives the user URL and creates a job for the Python workers.
It is also responsible for validating users.

3️⃣ Redis

Purpose:

Stores job status (pending, completed, failed).

Caches scraped content and summaries for faster responses.

Simple Explanation:
Redis works like a fast in-memory storage.
It helps track if a URL is already summarized so the system doesn’t repeat work.

4️⃣ Celery (Python Worker)

Purpose:

Runs long tasks: scraping, text cleaning, summarization, topic classification.

Works asynchronously using a queue.

Simple Explanation:
Celery is where all the heavy work happens.
Node.js sends the job → Celery processes it → saves results.

5️⃣ Web Scraping Libraries

Tools Used:

Requests: Download page HTML.

BeautifulSoup / Readability: Extract clean readable article text.

Simple Explanation:
These tools fetch the webpage and remove ads, menus, and irrelevant HTML to get clean text.

6️⃣ External AI APIs (HuggingFace)
Summarization Model

facebook/bart-large-cnn

Used for abstractive summarization (rewrites text into short meaning-full summary).

Topic Classification Model

facebook/bart-large-mnli

Used for zero-shot classification to detect topics like:
Technology, Politics, Finance, Health, etc.

Simple Explanation:
Your Python worker sends extracted text to these models and receives:

A short summary

A list of predicted topics

7️⃣ MongoDB

Purpose:

Stores:

Original article

Cleaned text

Summary

Topics

Metadata (URL, timestamps)

Simple Explanation:
MongoDB is the main database that stores all results permanently.

8️⃣ Prometheus (Monitoring)

Tracks:

Scraping time

Summarization latency

Failed jobs

API response time

Simple Explanation:
Prometheus helps you monitor performance and detect issues.

9️⃣ Logstash (Logging)

Purpose:

Collects logs from scraping tasks, AI calls, errors, Python worker logs, Node.js logs.

Simple Explanation:
It keeps all logs in one place for debugging and analytics.

⭐ Simple Flow of the Entire System

User submits a URL from frontend.

Node.js validates + creates a job in Redis.

Celery takes the job → scrapes the page.

Clean text is extracted using BeautifulSoup/Readability.

Text is summarized using HuggingFace BART model.

Topic classification is done using zero-shot classifier.

Results saved in MongoDB.

Redis updated with job status.

Frontend fetches the summary and displays it.

⭐ Why This Architecture Is Good

Scalable (Celery workers can be increased)

Fast (Redis caching)

Accurate (Uses advanced NLP models)

Monitored (Prometheus ensures reliability)

Traceable (Logstash helps debugging)

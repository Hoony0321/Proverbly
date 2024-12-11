# Proverbly - Learn English Proverbs and Phrases (MSA with Docker Compose)
Proverbly is a web platform that showcases a rich collection of English proverbs, helping users understand their meanings and usage through curated examples.

<br>

## 🎯 **Goals**

1. Introduce English proverbs and commonly used phrases while providing an interactive learning tool.  
2. Implement the project to learn Microservice Architecture (MSA).  
3. Utilize Docker Compose to independently develop, deploy, and operate multiple services.

<br>

## 🕹️ **Key Features**

1. **Proverbs and Expressions Database**  
    - Organize English proverbs and expressions by category.  
    - Provide meanings, examples, and translations in other languages (e.g., Korean).  
        - **Proverb:** "What goes around comes around."  
        - **Meaning:** Actions have consequences.  
        - **Example:** "He always helps others because he believes what goes around comes around."  

2. **Search and Recommendation**  
    - Enable keyword-based search and random proverb recommendations.  

3. **Bookmark and Learning Mode**  
    - Offer bookmark and learning record features.  

4. **User Contributions**  
    - Allow users to add and share new proverbs.  

<br>

## ⚒️ **Service Architecture (MSA with Docker Compose)**

- **Frontend Service:**  
    - **Features:** UI for search, recommendations, and learning mode.  
    - **Tech Stack:** Next.js  
    - **Docker:** Use Nginx for serving static files.  

- **Proverb Service:**  
    - **Features:** Provide CRUD operations for proverb data (API).  
    - **Tech Stack:** Spring Boot  
    - **Database:** PostgreSQL  
    - **Docker:** Containerize database and API server.  

- **User Service:**  
    - **Features:** Manage bookmarks, learning records, and user data.  
    - **Tech Stack:** Next.js (TypeScript)  
    - **Database:** MongoDB  
    - **Docker:** Containerize database and API server.  






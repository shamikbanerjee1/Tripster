# Tripster

## Demo 

https://drive.google.com/file/d/1Vo3f3EnAEYKJI8WDoGaDqj5R-VXRTbFX/view?usp=drive_link

## General Overview

**Tripster** is an innovative and comprehensive web application designed to streamline and enrich travel planning for adventurers and explorers worldwide. Regardless of whether you are about to explore an entirely new place or revisit an old one, Tripster helps you create customized itineraries tailored to your preferences. Leveraging API's such as ***Trip Advisor*** and ***Four Square***, Tripster offers an extensive list of choices of restaurants, leisurely activities, attractions and local spots to explore! ***Personalised Reviews*** and ***Like feature***, ***Interative Maps*** and ***Personalised User Preferences*** are just the tip of the iceberg provided by Tripster to empower fellow travellers to make the most of their journeys! With the growing demand for personalized travel experiences, Tripster stands as a vanguard for change, ensuring its relevance for years to come. 

### Problem Statement

Travel planning can be overwhelming due to the abundance of choices and lack of personalized recommendations. Tripster addresses this problem by providing customized itineraries based on user preferences and finding user preferred destinations and solving challenges related to time management, decision fatigue, and travel optimization. The complexity of integrating various data sources such as weather, location, and user reviews makes Tripster not only novel but also a significant future-proof solution in the travel domain. 

### Challenges

Some of the ***challenges*** involved in coming up with such a solution involves effective collection, integration and managing voluminous amounts of data from various sources, integrating algorithms that can help with personalized recommendations for users and most importantly, ensuring that our platform is scalable without comprising on speed or accuracy of travel planning services. 

### Relevancy in the next 2/5/10 years

With respect to ***relevancy*** of the problem for the next ***2-10 years***, the demand for personalized itinerary generation for travel purposes will be at an all time high with us seeing integrations of newer and complex AI technologies and even Augmented Reality for meeting consume expectations with greater accuracy and for providing virtual tours for smoother transit respectively.


### Solution Architecture

Tripster is architected around a user-centric design, ensuring an intuitive experience across all touchpoints. Below is an overview of the key tools and technologies used for our architecture - 

1. ***Frontend*** - We have built our frontend using ***React.js*** which is a popular JavaScript library for building interactive user interfaces. Reason for choosing React is that it is easy to work with, since it is a component-based architecture and helps us also reuse UI elements across various components.
2. ***Backend*** - For our backend, we used ***Node.js***, which is a lightweight and efficient JavaScript runtime. ***Express.js*** has been used to build the server-side logic and handle HTTP requests/responses. We have used ***GraphQL***, which is a query language utilized by API's, acting as a middleware layer by interfacing with our MongoDB database allowing for efficient fetching and manipulation of data. It helps in reducing over and under-fetching of data by enabling the client retrieve the data pertinent to them. 
3. ***Database*** - Tripster utilizes ***MongoDB***, a NoSQL document based database for its scalability, ease of use and flexibility. It allows for a schema-less data modelling by storing data in the backend as JSON documents and helps us working with dynamic schemas. This very much helps our databases deal with variety of datatypes such as image URL's, text, etc.
4. ***API Integration*** - Tripster leverages with 2 main API's that assist it with providing a wide range of data to the users.The webapp leverages the ***Travel Advisor API*** and ***Four Square API*** to fetch information about restaurants, leisurely activities, attractions, and local spots in various destinations. These APIs provide rich and meaningful data including details, reviews, ratings, and photos of places, enabling users to make informed decisions when planning their trips. Apart from these 2 API's, we have used around 5-6 more API's which aims to aid in the completion of our website's functionality (Has been discussed under ***API's used*** section)
5. ***User Authentication and Authorization*** - Tripster implements ***Google Auth API*** for enabling secure access for individual accounts and their respective data. ***JWT Decode*** is used for authentication, allowing users to securely access protected endpoints after logging in.

### Novel Features

1. ***Customizable Itinerary Generation***: Plan your trip with ease by customizing your itinerary based on your interests and preferences by using the Itinerary Generator functionality.
2. ***Displaying Itineraries on Maps***: One can visualize their custom itineraries created once they have confirmed the activites that they would be partaking in for a particular day on the map which aids in finding the spots.
3. ***Manual Location Marker on Itinerary Map***: While editing the itinerary, user can manually add a location marker for the respective itinerary related spots. 
4. ***Filtering Itineraires by Days***: One can filter out certain days of their itineraries on the map as well allowing them to focus on a particular day, or any combination of days.
5. ***Auto-Center feature of map***: One can turn on or off our auto-centering functionality of our map as per their needs. 
6. ***Unavailable Data Modal***: If one is planning to visit a location whose coordinate details are not found on the map, but the traveller wants to add it as an item in his/her itinerary, the data gets stored on the modal which is located on the Itinerary Map. Only if correct coordinates are fetched by GPT-s API, the data will not be populated inside the Modal.
7. ***Integration with Trip Advisor and Four Square APIs***: Access a vast list of restaurants, leisurely activities,attractions, and local spots to enrich your travel experience.
8. ***Integration with other API's***- We have developed a robust,scalable system making use of accurate API's such as WeatherMap API, Google OAuth API, Google Maps API, Google Autocomplete API,Google Maps Geocoding API and OpenAI API (GPT 3.5 Turbo) which have been described under the ***API's used*** section.
9. ***Personalised User Preferences***: Tailor your experience by selecting the types of activities you want to display in your itinerary by taking a Quiz.
10. ***Seamless Reviewing Process***: We have kept predefined review texts for a faster and seamless process of adding reviews by a traveller.
11. ***Drag and Drop Functionality for Reviews***: We have developed a Drag and Drop functionality which aids in seamless and faster ways of adding reviews.
12. ***Shuffling of Itineraries***: We can also shuffle a particular activity from one itinerary to another using Drag and Drop functionality in case the travellers want to shift some activity to another day.
13. ***Efficient Handling of Foursquare API***: For Foursquare API, we have efficiently consolidated multiple API requests into a single single streamlined process, coherent operation that not only searches for places but also enriches each place's data with detailed attributes. This ensures to to get the most accurate results for the user.

### API's used

1. ***Foursquare API (https://rapidapi.com/serg.osipchuk/api/Foursquare/details)*** - This API provides a vast list of restaurants, 
cafes, nearby local attractions, leisurely activities for tourists etc helping the users customize their itinerary along the way. The API provides further details such as ratings and user reviews of these places, so as to help the fellow travellers make informed decisions about their itineraries. 
2. ***Travel Advisor API (https://rapidapi.com/apidojo/api/travel-advisor)*** - This API is similar to Trip Advisor API, in the sense that it provides Flights prices, Hotels booking, Restaurants, Attracting locations etc similar to Trip Advisor, but is a free version of it. It does not provide more custom details which helps to supplement the customisation we want to introduce in our website which is why we have also used Foursquare API.
3. ***OpenAI API (GPT 3.5 Turbo) (https://platform.openai.com/docs/api-reference/introduction)*** - The OpenAI API leverages state-of-the-art AI technology such as Natural Language Processing to help users generate their custom personalised itineraries, which serves as a very important feature of our website.
4. ***Google Maps JavaScript API*** - This API provides a comprehensive mapping and location-based services, offering functionalities such as displaying maps and searching for places of interest.
5. ***Google OAuth API*** - This API enables seamless and secure authentication using Google accounts, allowing users to log in to tripster accounts with their Google credentials.
6. ***Google Autocomplete API*** - This API enables predictive text suggestions based on partial user input, enhancing user experience by providing real-time auto-suggestions as the users type in their locations.
7. ***Google Maps Geocoding API***: This API to convert geographic coordinates into human-readable addresses. For example, after a user clicks on a location and you get the coordinates, you can make a request to the Geocoding API to get more detailed information about that location. 
8. ***OpenWeatherMap API (https://openweathermap.org/api)*** - This API provides us data about the weather, including current conditions as well as forecasts keeping the users informed about the weather conditions of a particular place at any given point in time. This thus helps them plan their custom itinerary accordingly as they visit new places.

### Frontend Features - 

### LOGIN PAGE
- Integrated with Google OAuth to facilitate seamless and secure authentication using Google Accounts into our web app.

### SIGNUP PAGE
- For new users making an ccount for the first time on our web app.

### PRODUCT PAGE
- Overview of the web app's novel features implemented.

### HOMEPAGE
- ***Itinerary Generator*** - The Itinerary functionality helps in generating customisable and personalized itineraries for fellow travellers.
- ***Quiz*** -  The Quiz functionality helps in setting user preferences catering to individual interests. The filters will also display only those preferences chosen by the user.
- ***Customizable Filter (Foursquare API)*** - This filter provides us with many categories of activities to select from Cultural and Historical Interests, Shopping Interests, Outdoor Activities, Local Attraction Spots etc
- ***Generic Filter (Travel Advisor API)*** - This filter provides us with just the Restaurants and Ratings.
- ***Search Textfield*** - Helps to pinpoint the locations on our Google Map by simply entering a place. It is also integrated with Google's Autocomplete API which enables predictive text completions.
- ***Google Maps*** - An interactive Map that helps users plan out their trips efficiently. Custom Itineraries, Nearby spot locations can be displayed on the map using a card. 
- ***Liked Page*** - Page consists of Liked items by a particular user. One can filter out Likes by Catergories filter as well.
- ***Reviews Page*** - Page consists of Reviews given by a particular user. One can filter out Reviews by Ratings filter as well.
- ***Itinerary Page*** -  Page consists of all itineraries made and generated by and for the user. One can edit their itineraries or delete them accordingly. Made highly customizable for the users by allowing them to drag and drop itineraries across various days and displaying them on the map.

### Backend Features - 

- New user is created when any user sign-ups for the first time using Sign up page and the details are added to Database. Checks exist to prevent same user from creating another acccunt if the user already has an ancount with existing email.
- Storing user preferences such as Cultural and Historical Interests, Entertainment interests, Leisurely activities etc are stored to database for each user and the filters in UI display these preferences accordingly from the backend.
- Details of places,restaurants,activities etc liked and reviews given by the users are saved in Database and displayed accordingly in the UI in separate well designated pages.
- Liked places,restaurants,activities can be removed accordingly from the database and they will not be rendered on the UI accordingly as well.
- Itinerary generated by the users or manually created are stored in the database along with Itinerary name and time of iternary creation to save the progress and to view any itinerary that is customized by a particular user.
- Stored Itinerary can be updated or deleted accordingly in the Database, and the changes are rendered on the UI accordingly.
- To monitor all data in all collections(users,liked,reviews,preferences), respective functions have been implemented in the backend to view relevant data.
- The Heart icon for the Like feature implemented is in sync with the database. It will display as a red color on the UI, if there is data in the backend otheriwse it will be not coloured at all.

### Legal/Other Aspects

Our codebase incorporates open-source libraries compliant with respective licenses, and we're exploring the possibility of open-sourcing Tripster to contribute to the community. 

### Competition Analysis

Tripster competes with various travel planning tools, such as Layla and Wanderlog. However, our unique algorithm for personalized itinerary generation, combined with the visualisation of the itinerary on a  map, as well as the integration of Google reviews, sets us apart. Our analysis indicates that while there are similar tools available, Tripster's emphasis on personalization and user experience will carve out a significant niche in the market.

### Code References

https://github.com/adrianhajdin/project_travel_advisor?tab=readme-ov-file 

(Note: More than 90% of the code is unique as we have integrated several API's, added lots of novelty features making our web app truly stand out amongst other similar web apps present. We have basically used the above repository to understand how Travel Advisor and Google Maps API works!)

### Future Scope

- We can collaborate with tourist service provider companies and based on user preferences and customizable itineraries generated, we can provide travellers different travelling plans at flexible rates.
- Converting the web app to a mobile app for ease of use for the travellers and to navigate using location services as a part of the app's implementation.

Happy Traveling with Tripster! 🌍✈️

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

- Node.js (version 20 and above)
- MongoDB

### Installation

1. Clone the repo
   git clone https://github.com/IT5007-2320/course-project-team-6.git

2. Install NPM packages
   npm install

### Usage

After setting up the project, you can:
- Sign up and create a personalized profile.
- Input travel preferences to receive tailored itinerary suggestions.
- View and manage your favorite destinations and planned trips.

### Note

- On starting the server inside docker, it redirects to http://0.0.0.0:3000/, make sure to manually redirect the page to localhost:3000.
- Node version of 20 or above is required to successfully compile and run the project.
- The server starts on port 5000.

## Authors
Nivash Sudalaimani - A0280048H\
Shamik Banerjee - A0276524Y\
Marco Stopper - A0280071N

____

### Running the Application

In the project directory, using the docker container it5007_tutorial:t4 , you can run the followingin order - 

*** Initializing Script *** 

mongo tripster scripts/init.mongo.js

*** Stating MongoDB server ***

systemctl start mongod

*** Running React Server ***

npm run server

Will start the server at: http://localhost:5000

*** Starting the application ***

npm run start

Will run the app at: http://localhost:3000

<h1 align="center" id="title">Daily diet backend - Desafio 02 Rocketseat Ignite</h1>

<p align="center"><img src="https://socialify.git.ci/pedromeira220/daily-diet-backend/image?font=Inter&amp;language=1&amp;name=1&amp;owner=1&amp;pattern=Solid&amp;theme=Dark" alt="project-image"></p>

<p id="description">
"Daily Diet" is an app that helps you manage what you eat every day. You can easily write down your meals and see how you're doing with your eating plan. The main goal of this project is to show how things work (a bit like a practice project), where I'm trying out different ideas I want to learn about. This includes things like making tests run automatically, using NestJS as a framework, setting up the app in a good way, dealing with pictures, and even putting files onto Amazon S3 storage.

At first, Rocketseat suggested this project to help us practice what we learned, but since I already knew the basics, I decided to make it more interesting and solve some new problems.

So, I learned about the NestJS web framework, read its docs, watched videos, tried it in other projects, and used that knowledge in this one. I also made sure the app is structured well, following good ideas like SOLID, Clean Architecture, TDD, a little bit of DDD (Domain Driven Design) and other design patterns.

With a more organized app, I added automatic tests to make sure the app works well. I thought about how to test it from different angles and set up special places for each kind of test. I separate it into layers, for unit, integration and end-to-end tests.

One tricky part was figuring out how to upload pictures, like profile pictures for users. At first, I tried saving them right on the computer, but that wouldn't work well if this was a real app. So, I set up a connection to Amazon S3, a service for saving pictures and files securely and easily.

So, this project has been really helpful for learning, trying out new things, and making sure certain ideas work in real situations. I'll use what I've learned here to make software that's easier to take care of, grows well, and works even better.
</p>

<!-- <h2>🚀 Demo</h2>

[url-do-projeto(colocar-depois)](url-do-projeto(colocar-depois))
 -->
  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   User Registration
*   User Authentication
*   Meal Registration
*   Diet Status Indicator
*   Meal Editing
*   Meal Deletion
*   Meal Listing
*   Detailed Meal Viewing
*   User Metrics Retrieval

<h2>🛠️ Installation Steps:</h2>

<p>1. Installation</p>

Since the project use Docker, you need first the to install it.

After that you need to configure the .env file for the environment variables, use the .env.testing as example.

You also have to configure and AWS S3 service,

With docker installed property, you can run in the root directory of the application the command:

```bash
$ sudo docker-compose -f "docker-compose.yml" up --build -d
```

After that, all the dependencies will be installed, all services will go up, and the application is started :) 

<p>2. Opening the docs</p>

Just access the base url + swagger

```bash
base-url/swagger
```

<p>3. Test</p>

For running the end to end (e2e) tests will need to make sure all the services is up, like database and AWS S3

```bash
# unit tests 
$ npm run test  

# e2e tests 
$ npm run test:e2e  

# test coverage 
$ npm run test:cov
```
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   TypeScript
*   NestJS
*   PostgresSQL
*   AWS S3 (Image storage)
*   PrismaORM
*   Jest (Testing)
*   Swagger (Documentation)
*   Docker


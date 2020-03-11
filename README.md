# NightLife
NightLife is a scalable project I created using material I learned from an Intro to Full Stack course at VT. 
I wanted this website to be a home for my future projects.  
<br>
This first iteration allows users to register their unique account in the database and login. Everyone then gets to play a game of mine 
and their high score is then updated on their account. 
The admin can then see the updated scores of all the users that are registered on the website. 

## Front End
**Angular** was used to design the front end with material UI. 

Demonstration of Angular forms for proper form validation when registering a user:
<img src="https://github.com/TahaBilalCS/NightLife/blob/master/demo/register.gif"/>

We only have the option to choose between admin and user for demonstrative purposes.

## Back End

The database and server management were done using **NodeJS**(Mostly ExpressJS) and **Mongoose**. 

Logging in with the wrong credentials triggers a notification:
<img src="https://github.com/TahaBilalCS/NightLife/blob/master/demo/login.gif"/>

It is a good idea to be vague about user authentication so that harmful users can't use any information to their advantage.

I also store a hashed version of a person's password to add another layer of security. 
<img src="https://github.com/TahaBilalCS/NightLife/blob/master/demo/mongo.PNG"/>

## Database Updates
To demonstrate user vs. admin functionalities, the admin is the only one who can view all the users' highscores. The registered users
tab is not visible to regular users.
<img src="https://github.com/TahaBilalCS/NightLife/blob/master/demo/highscore.gif"/>

## Final Thoughts
This project helped me understand the complexity of web security. Knowing the difference between a GET and POST request is
fundamental to passing data securely through a website. There is always much to learn but this served as a solid
foundation to becoming a Full Stack Web Developer

# Author
**Bilal Taha**

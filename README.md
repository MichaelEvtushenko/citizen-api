## Project for kpi labs.

**The application that displays on a map in a radius of a person, all incidents (accidents, hurricanes, crashes, etc. ...)**

_Idea came from Citizen app: https://en.wikipedia.org/wiki/Citizen_(app) that does not work in Ukraine._

### Basic functionality
* Registration, authentication, authorization.
* Ability to see all real-time incidents by yourself.
* Ability to post new alerts, providing text description and photos.
* Two kinds of users: usual and "trusted". All new reports will be reviewed by users and consider to approve or not.
### Advanced features
* Ability to record real-time video stream, where incident happened.

### Technologies
#### Front-end (new other technologies will be added in the future updates):
* React
* Bootstrap or material ui
#### Back-end (new other technologies will be added in the future updates):
* Koa
* Docker
* PostgreSQL
* AWS
### Data flow

![data-flow-pic](https://citizen-app-bucket.s3.eu-central-1.amazonaws.com/readme_static/data-flow.png)

**How user can report safety alert?**
* User will post new alerts in radius, where incedent happened, providing text and photos (or video stream in advanced plans)
* Then, other users will approve this alert or not.

**How many users have to approve alert?**
* less than 50% people in radius, where incedent happened -> point on the map become grey color.
* more than 50% people in radius, where incedent happened -> point on the map become yellow color.
* more than 75% people in radius, where incedenet happened-> point on the map become red color.

*Having become "trusted person", user can post new alerts, with no need to be approved by others.*



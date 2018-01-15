Cloud Ex1:
By: David Gefen, Liza Dashevski.

To access our app please go to the following link, http://sendfile.mybluemix.net
To log in you must enter the following credentials:  Username: admin
							Password: admin
When authentication is successful you will be redirected to a home page, where you can select a file, enter a recipient’s email address, and message subject, and send the file to the recipient by clicking the send button.


Rest API:
Method type
URI
Desctiption
Get
‘/’  (root)
Returns the main html file of the application
Get
‘/main.css’
Returns the main css file for main html
Post
‘/send’
Uploads the file to the server and sends it to the recipient.
Parameters include file to upload (uploadFile), recipient email (email), and message subject (subject).


Note: All commands require that the user is authenticated.

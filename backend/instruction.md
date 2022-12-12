// Forgot password process

#1. User clicks on Forgot Password
#2. Create a reset token (string) and save in our database
#3. send reset token to user email in the form of a link
#4. When user clicks the link, compare the reset token in the link with that saved in the database
#5. If they match, change reset the user's password

// Forgot password Steps
#1. Create forget passworrd route
#2. Create Token Model

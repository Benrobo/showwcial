### Authentication flow

User would only be able to authenticate using their `Showwcase` credentials like **email** and **username**. If this credentials doesn't match with what Showwcase db has, we mark the authentication flow as failed, else, we simply check if user has an account on `Showwcial`, if they dont, we simply create a new account for them with a default password which will be used later on when loggin in.

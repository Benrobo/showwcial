### Discord bot

User should be able to create `intent` and choose which commmunities they would love to get updates from. for eg (reactjs, nodejs, memes) etc. After selecting this communities, they could select the `tags` they would like to get updates from. After that, we create a token for each intents created which would be used to authenticate discord bot.

```js
model BotNotifier {
    id              String  @id
    userId          String
    name            String
    type            String // thread, shows, jobs
    tags            String
    communities     Json
    token           String? @db.Text
    isAuthenticated Boolean @default(false) // filled when user get authenticated using the bot on discord.

    discordChannelId   String? // filled when user get authenticated using the bot on discord.
    discordChannelName String? // filled when user get authenticated using the bot on discord.

    createdAt DateTime @default(now())

    user      Users          @relation(fields: [userId], references: [id])
    prevPosts BotPrevPosts[]

    @@index([userId])
}

model BotPrevPosts {
    notifierId String @id
    action     String
    type       String // thread, shows, jobs
    postId     String

    createdAt DateTime @default(now())

    notifier BotNotifier @relation(fields: [notifierId], references: [id])

    @@index([notifierId])
}
```

## How to use th discord bot.

user would be able to requests latests or random `threads, shows, jobs.` using `/latest` or `/shows`. we then make requests to backend api, retrieve the user token from cache and use the token to fetch notifier details

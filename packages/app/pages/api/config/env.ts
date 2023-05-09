const LOCAL_MYSQL = "mysql://root:@localhost:3306/showwcial";

const ENV = {
  jwtSecret: process.env.JWT_SECRET,
  mongoUrl: process.env.MONGODB,
  databaseUrl:
    process.env.NODE_ENV === "development"
      ? LOCAL_MYSQL
      : process.env.DATABASE_URL,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailSender: "alumonabenaiah71@gmail.com",
  emailPassword: process.env.EMAIL_PASSWORD,
  clientUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3002"
      : `https://paycode.co`,
  showwcaseAPIKey: process.env.SHOWWCASE_API_KEY,
  showwcaseToken: process.env.SHOWWCASE_TOKEN,
  notionApiToken: process.env.NOTION_API_KEY,
};

export default ENV;

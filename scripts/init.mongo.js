/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

// db.travellers.remove({});
// db.blacklist.remove({});

db.users.remove({});


db.reviews.remove({});

db.favorites.remove({});

db.itinerary.remove({});

db.userpreferences.remove({});

db.users.insertMany([
    {
      "name": "jane_doe",
      "email": "jane@example.com",
      "passwordHash": "$2a$10$e3DqSreM/r7ogLq4wG0AeuDL5lQLFLjmO3udN6uwzskQjcPUE65zO",//hashedPassword2
      "createdAt": ISODate(),
      "updatedAt": ISODate()
    },
    {
      "name": "alex_smith",
      "email": "alex@example.com",
      "passwordHash": "$2a$10$p8ufLn8VdubOs5qBF0DNHu6jqHdySftkQLsevERx2/svYN0MurH2S",//hashedPassword3
      "createdAt": ISODate(),
      "updatedAt": ISODate()
    }
  ]);
  
  db.reviews.insertMany([
    {
      "userId": "66117531b59c19asdawdwesdasd",
      "placeId": "4da91cfd6e81162ae7b5e044",
      "reviewText": "Really good food",
      "rating": 5,
      "createdAt": ISODate(),
      "placeDetails": {
        "name": "Central Park",
      }
      },
      {
        "userId": "66117531b59c19asdawdwesdasd",
        "placeId": "4da91cfd6e81162ae7b5e044",
        "reviewText": "Average, can visit once",
        "rating": 4,
        "createdAt": ISODate(),
        "placeDetails": {
          "name": "Central Park",
        }
        },
        {
          "userId": "66117531b59c19asdawdwesdasd",
          "placeId": "4da91cfd6e81162ae7b5e044",
          "reviewText": "Nan was bad",
          "rating": 3,
          "createdAt": ISODate(),
          "placeDetails": {
            "name": "Central Park",
          }
          },
          {
            "userId": "66117531b59c19asdawdwesdasd",
            "placeId": "4da91cfd6e81162ae7b5e044",
            "reviewText": "Needs to improve hygiene",
            "rating": 3,
            "createdAt": ISODate(),
            "placeDetails": {
              "name": "Central Park",
            }
            },
            {
              "userId": "66117531b59c19asdawdwesdasd",
              "placeId": "4da91cfd6e81162ae7b5e044",
              "reviewText": "Dont Prefer this place",
              "rating": 3,
              "createdAt": ISODate("2020-01-15T14:56:59.301Z"),
              "placeDetails": {
                "name": "Central Park"
              }
            },
            {
              "userId": "66117531b59c19asdawdwesdasd",
              "placeId": "4da91cfd6e81162ae7b5e044",
              "reviewText": "Unacceptable",
              "rating": 3,
              "createdAt": ISODate("2020-01-15T14:56:59.301Z"),
              "placeDetails": {
                "name": "Central Park"
              }
            },
      {
        "userId": "66117531b59c19asdasdasdasd",
        "placeId": "386880asdasdasdda",
        "reviewText": "The worst",
        "rating": 1,
        "createdAt": ISODate(),
        "placeDetails": {
          "name": "Central Park",
        }
        }
  ]);

  db.favorites.insertMany([
    {
      "userId": "66117531b59c19asdawdwesdasd",
      "placeId": "386880aasdasdwsdasdda",
      "placeDetails": {
        "name": "Central Park",
      }
      },
      {
        "userId": "66117531b59c19asdasdasdasd",
        "placeId": "386880asdasdasddaasd",
        "placeDetails": {
          "name": "Central Park 223",
        }
        }
  ]);

  db.userpreferences.insertMany([
    {
      "userId": "66351f04970b2ec3223f2a2e",
      "preferences": "{\"Cultural and Historical Interests\":true,\"Wellness and Relaxation\":true,\"Travel and Transportation\":true,\"Shopping Experiences\":true,\"Religious and Spiritual Sites\":true}"
      },
      {
        "userId": "6634f22205cbaeac4eda9c87",
        "preferences": "{\"Cultural and Historical Interests\":true,\"Wellness and Relaxation\":true,\"Travel and Transportation\":true,\"Shopping Experiences\":true,\"Religious and Spiritual Sites\":true}"
        },
  ]);

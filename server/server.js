const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

let db;
const bcrypt = require('bcryptjs');

const login = async (_, { email, password }) => {
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    throw new Error('No such user found');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid password');
  }
  return user
};

async function listUsers()
{
  const users = await db.collection('users').find({}).toArray();
  return users;
}

async function listAllReviews()
{
  const allReviews = await db.collection('reviews').find({}).toArray();
  return allReviews;
}

async function listAllFavorites()
{
  const allFavorites = await db.collection('favorites').find({}).toArray();
  return allFavorites;
}

async function listAllItinerary()
{
  const itinerary = await db.collection('itinerary').find({}).toArray();
  return itinerary;
}


async function getReviewsByUserId(_, { userId }) {
  const reviews = await db.collection('reviews').find({ userId }).toArray();
  return reviews;
}

async function getReviewsByPlaceId(_, { placeId }) {
  const reviews = await db.collection('reviews').find({ placeId }).toArray();
  return reviews;
}

async function getFavoritesByUserId(_, { userId }) {
  const favs = await db.collection('favorites').find({ userId }).toArray();
  return favs;
}

async function getItineraryByUserId(_, { userId }) {
  const favs = await db.collection('itinerary').find({ userId }).toArray();
  return favs;
}

async function listAllUserPreferences(){
  const userPreferences = await db.collection('userpreferences').find({}).toArray();
  return userPreferences;
}

async function addUser(_, { user }) {
  console.log("Adding user", user);
  const existingUser = await db.collection('users').findOne({ email: user.email });
  
  if (existingUser) {
    return { errorMessage: 'User with this email already exists.' };
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.passwordHash, salt);
  user.passwordHash = hashedPassword;
  
  const insertResult = await db.collection('users').insertOne(user);
  const addedUser = {
    ...user,
    _id: insertResult.insertedId.toString(),
  };

  return { user: addedUser };
}


async function addReview(_, { reviewInput }) {
  console.log("Adding review", reviewInput);
  const insertResult = await db.collection('reviews').insertOne(reviewInput);
  return reviewInput;
}

async function checkReviewExistence(_, { userId, placeId }) {
  const review = await db.collection('reviews').findOne({
    userId: userId,
    placeId: placeId,
  });

  if (review != null) {
    return {
      exists: true,
      rating: review.rating,
      reviewText: review.reviewText,
    };
  } else {
    return {
      exists: false,
    };
  }
}

async function addFavorite(_, { userId, placeId, placeDetails }) {
  const existingFavorite = await db.collection('favorites').findOne({ userId, placeId });
  
  if (existingFavorite) {
    return {
      success: false,
      message: "Favorite already exists.",
    };
  }

  await db.collection('favorites').insertOne({
    userId,
    placeId,
    placeDetails,
  });

  return {
    success: true,
    message: "Favorite added successfully.",
  };
}

async function getFavorites(_, { userId }) {
  const favorites = await db.collection('favorites').find({ userId }).toArray();
  const placeIds = favorites.map(favorite => favorite.placeId);
  return placeIds;
}

async function removeFavorite(_, { userId, placeId }) {
  const result = await db.collection('favorites').deleteOne({ userId, placeId });
  if (result.deletedCount === 0) {
    return {
      success: false,
      message: "Favorite not found or could not be removed.",
    };
  } else {
    return {
      success: true,
      message: "Favorite successfully removed.",
    };
  }
}

async function removeSchedule(_, { userId, itineraryId }) {
  const result = await db.collection('itinerary').deleteOne({
    userId, 
    _id: new ObjectId(itineraryId) // Convert itineraryId string to ObjectId
  });
  if (result.deletedCount === 0) {
    return {
      success: false,
      message: "Itinerary not found or could not be removed.",
    };
  } else {
    return {
      success: true,
      message: "Itinerary successfully removed.",
    };
  }
}

async function addOrUpdateSchedule(_, { userId, _id, name, scheduleData }) {
  try {
    let response = { success: true, message: "", id: null };
    if (_id) {
      // Update an existing schedule by _id
      const updateResult = await db.collection('itinerary').updateOne(
        { _id: new ObjectId(_id), userId },
        { $set: { name, scheduleData, updatedAt: new Date() } }
      );

      if (updateResult.matchedCount === 0) {
        return { success: false, message: "Schedule not found or userId does not match." };
      } else {
        response.message = "Schedule updated successfully.";
        response.id = _id; // Return the same _id back
      }
    } else {
      // Always insert a new schedule if no _id is provided
      const insertResult = await db.collection('itinerary').insertOne({
        userId,
        name,
        scheduleData,
        updatedAt: new Date(),
        createdAt: new Date(),
      });

      response.message = "New schedule added successfully.";
      response.id = insertResult.insertedId.toString();
    }

    return response;
  } catch (error) {
    console.error('Error adding/updating schedule:', error);
    return { success: false, message: error.message || "Failed to add/update schedule.", id: null };
  }
}

async function addOrUpdatePreferences(_, { userId, preferences }) {
  console.log("Adding preferences", preferences);
  const existingPreferences = await db.collection('userpreferences').findOne({ userId });

  if (existingPreferences) {
    const updateResult = await db.collection('userpreferences').updateOne(
      { userId },
      { $set: { preferences, updatedAt: new Date() } }
    );
    return { success: true, message: "Preferences updated successfully." };
  }

  const insertResult = await db.collection('userpreferences').insertOne({
    userId,
    preferences,
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  return { success: true, message: "Preferences added successfully." };
}

async function getUserPreferencesByUserId(_, { userId }) {
  const preferences = await db.collection('userpreferences').findOne({ userId });
  if (!preferences) {
    return "no data"; 
  }
  return preferences;
}

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    console.log(value)
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
});


const resolvers = {
  Query: {
    listUsers,
    listAllReviews,
    getReviewsByUserId,
    getReviewsByPlaceId,
    checkReviewExistence,
    getFavorites,
    listAllFavorites,
    getFavoritesByUserId,
    getItineraryByUserId,
    listAllItinerary,
    getUserPreferencesByUserId,
    listAllUserPreferences,
  },
  Mutation: {
    addUser,
    login,
    addReview,
    addFavorite,
    removeFavorite,
    addOrUpdateSchedule,
    removeSchedule,
    addOrUpdatePreferences,
  },
  GraphQLDate,
};

const app = express();
app.use(express.static('public'));

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/tripsterschema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});
server.applyMiddleware({ app, path: '/graphql' });

async function connectToDb() {
	  const url = 'mongodb://localhost/tripster';
	  const client = new MongoClient(url, { useNewUrlParser: true });
	  await client.connect();
	  console.log('Connected to Ticket To Ride MongoDB at', url);
	  db = client.db();
}

(async function () {
  try {
    await connectToDb();
    app.listen(5000, function () {
      console.log('App started on port 5000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();

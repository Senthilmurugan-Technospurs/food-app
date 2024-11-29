import { S3 } from '@aws-sdk/client-s3';
import slugify from 'slugify';
import xss from 'xss';
import { MongoClient } from 'mongodb';

const URI = "mongodb+srv://vsenthilmurugan08:UpsPTxCtOgsLZLqX@cluster0.q1q7v.mongodb.net/meals?retryWrites=true&w=majority&appName=Cluster0";

const s3 = new S3({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: 'AKIATWBJ2PFFBVKU2MVB',
    secretAccessKey: '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',
  },
});

const client = new MongoClient(URI);
let mealsCollection;

async function connectToDb() {
  if (!mealsCollection) {
    try {
      await client.connect();
      const db = client.db();
      mealsCollection = db.collection('meals');
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      throw new Error('Failed to connect to MongoDB');
    }
  }
}

export async function getMeals() {
  try {
    await connectToDb();
    const meals = await mealsCollection.find().toArray();
    return meals;
  } catch (error) {
    console.error('Error fetching meals', error);
    throw new Error('Failed to fetch meals');
  }
}

export async function getMeal(slug) {
  try {
    await connectToDb();
    const meal = mealsCollection.findOne({ slug });
    return meal;
  } catch (error) {
    console.error('Error fetching meal', error);
    throw new Error('Failed to fetch meal');
  }
}

export async function saveMeal(meal) {
  try {
    await connectToDb();

    // Generate the slug
    meal.slug = slugify(meal.title, { lower: true });

    // Sanitize the instructions to prevent XSS
    meal.instructions = xss(meal.instructions);

    // Prepare the image for upload to S3
    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`;

    const bufferedImage = await meal.image.arrayBuffer();

    // Upload the image to AWS S3
    try {
      await s3.putObject({
        Bucket: 'senthilmurugan-nextjs-project',
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: meal.image.type,
      });
    } catch (s3Error) {
      console.error("Error uploading image", s3Error);
      throw new Error("Failed to upload image");
    }

    // Save meal data to MongoDB
    meal.image = fileName;

    await mealsCollection.insertOne(meal);
  } catch (error) {
    console.error('Error saving meal:', error);
    throw new Error('Failed to save meal');
  }
}

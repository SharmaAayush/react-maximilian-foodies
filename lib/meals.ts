import fs from 'node:fs';

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export type Meal = {
  id: string;
  title: string;
  slug: string;
  image: string;
  summary: string;
  creator: string;
  creator_email: string;
  instructions: string;
}

export async function getMeals(): Promise<Meal[]> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  // throw new Error('Loading meals failed');
  return db
    .prepare<unknown[], Meal>('SELECT * FROM meals')
    .all();
}

export async function getMealBySlug(slug: string) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return db
    .prepare<{ slug: string }, Meal>('SELECT * FROM meals WHERE slug = @slug')
    .get({ slug });
}

export async function saveMeal(
  meal: Omit<Meal, 'id' | 'slug' | 'image'>
    & Partial<Pick<Meal, 'id' | 'slug'>>
    & { image: File | string }
) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const image = meal.image as File;

  const extension = image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('Saving image failed');
    }
  });

  meal.image = `/images/${fileName}`;

  db.prepare<Omit<Meal, 'id'>>(`
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `)
    .run(meal as Omit<Meal, 'id'>)
}
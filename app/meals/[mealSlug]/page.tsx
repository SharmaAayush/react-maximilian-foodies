import { getMealBySlug } from "@/lib/meals";

import classes from './page.module.css';
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function MealDetailsPage({ params }: PageProps<'/meals/[mealSlug]'>) {
  const { mealSlug } = await params;
  const meal = await getMealBySlug(mealSlug);

  if (!meal) {
    notFound();
  }

  const { title, image, summary, creator, creator_email, instructions } = meal;

  console.log(meal);

  return (<>
    <header className={classes.header}>
      <div className={classes.image}>
        <Image src={image} alt={title} fill />
      </div>
      <div className={classes.headerText}>
        <h1>{title}</h1>
        <p className={classes.creator}>
          by <a href={`mailto:${creator_email}`}>{creator}</a>
        </p>
        <p className={classes.summary}>{summary}</p>
      </div>
    </header>
    <main>
      <p className={classes.instructions} dangerouslySetInnerHTML={{
        __html: instructions.replace(/\n/g, '<br />'),
      }}></p>
    </main>
  </>
  )
}
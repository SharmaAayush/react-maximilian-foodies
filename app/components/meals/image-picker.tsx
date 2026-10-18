'use client';

import { ChangeEvent, useRef, useState } from 'react';
import classes from './image-picker.module.css';
import Image from 'next/image';

export type ImagePickerProps = {
  label: string;
  name: string;
}

export default function ImagePicker({ label, name }: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState<string | null>();
  const imagePicker = useRef<HTMLInputElement>(null);

  function handlePickClick() {
    if (imagePicker.current) {
      imagePicker.current.click();
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const file = event.target.files?.[0] || undefined;

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result as string);
    }

    fileReader.readAsDataURL(file);
  }

  return (<>
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt='The image selected by the user.'
              fill
            />
          )}
        </div>
        <input
          ref={imagePicker}
          className={classes.input}
          required
          type="file"
          id={name}
          accept='image/png, image/jpeg'
          name={name}
          onChange={handleImageChange}
        />
        <button
          className={classes.button}
          type='button'
          onClick={handlePickClick}
        >
          Pick an image
        </button>
      </div>
    </div>
  </>)
}
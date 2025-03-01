import { Dog } from "../services";
import DefaultText, { CustomTextProps } from "./DefaultText";
import { Heart, X } from "lucide-react";
import '../styles/ResultItem.css';

const matchTextVariations = [
  "Take Me With You!",
  "Adopt Me!",
  "Bring Me Home!",
  "Let's Go Home!",
  "I'm Yours!",
  "Take Me Home!",
  "Love Me Forever!",
  "Be My Family!",
  "Let's Be Friends!",
  "Choose Me!"
];

export default function ResultItem({ dog, isMatch, onFavorite, isFavorite, inFavoritesSection }: {
  dog: Dog,
  isMatch?: boolean,
  onFavorite: () => void,
  isFavorite?: boolean,
  inFavoritesSection?: boolean
}) {
  const randomMatchText = matchTextVariations[Math.floor(Math.random() * matchTextVariations.length)];
  const commonTextStyle = {
    fontSize: 'normal',
    className: 'bg-[var(--bg-mid)] rounded-lg p-2 flex flex-row gap-2 font-bold',
  } as CustomTextProps;

  return (
    <div
      style={{
        backgroundColor: isMatch ? 'var(--bg-mid)' : undefined,
      }}
      className="flex items-center flex-row gap-2 px-2 bg-[var(--bg-secondary)] rounded-lg mb-2 fade-style hover:bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]"
    >
      <img
        src={dog.img}
        alt={dog.name}
        style={{ objectFit: 'cover', borderRadius: 10, height: 80, width: 80, borderColor: 'var(--bg-mid)', borderWidth: 6 }}
      />
      <div className="flex flex-col gap-2 p-2">
        <DefaultText
          className="text-[var(--accent-vivid)] font-bold flex flex-row gap-2 items-center"
          fontSize="mid"
          style={{ color: isMatch ? 'var(--text-primary)' : 'var(--accent-vivid)' }}
        >
          {dog.name}{isMatch && <DefaultText className="text-[var(--accent-vivid)]"> - "{randomMatchText}"</DefaultText>}
        </DefaultText>
        <div className="flex flex-row gap-2">
          <DefaultText {...commonTextStyle}><div className="text-[var(--text-dim)]">breed:</div>{dog.breed}</DefaultText>
          {dog.age === 0
            ? <DefaultText {...commonTextStyle}>Puppy</DefaultText>
            : <DefaultText {...commonTextStyle}><div className="text-[var(--text-dim)]">age:</div>{dog.age}</DefaultText>}
          <DefaultText {...commonTextStyle}><div className="text-[var(--text-dim)]">zip:</div>{dog.zip_code}</DefaultText>
        </div>
      </div>
      {inFavoritesSection ?
        <X
          onClick={onFavorite}
          size={40}
          className="ml-auto cursor-pointer 
        text-[var(--accent-vivid)] p-2"
        />
        :
        <Heart
          onClick={onFavorite}
          fill={isFavorite ? 'var(--accent-vivid)' : 'transparent'}
          size={40}
          className="ml-auto cursor-pointer 
        text-[var(--accent-vivid)] p-2"
        />}
    </div>
  )
}
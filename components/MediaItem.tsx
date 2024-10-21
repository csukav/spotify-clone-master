"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import PlayButton from "./PlayButton";

interface MediaItemProps {
    data: Song;
    onClick?: (id: string) => void;
    
}

const MediaItem: React.FC<MediaItemProps> = ({
    data,
    onClick
}) => {
    const imageURL = useLoadImage(data);
    const handleClick = () => {
        if(onClick)  {
            return onClick(data.id)
        }

        // todo default turn on player
    }
    return (
        <div className="
        flex
        items-center
        gap-x-3
        cursor-pointer
        hover:bg-neutral-800/50
        w-full
        p-2
        rounded-md
        ">
            <div className="
            relative
            rounded-md
            min-h-[48px]
            min-w-[48px]
            overflow-hidden
            ">
                <Image
                fill
                src={imageURL || '/images/liked.png'}
                className="object-hover"
                alt="media item"
                />
                 <div className="
            absolute
            bottom-24
            right-5
            ">
                <PlayButton />
            </div>
            </div>
            <div
            className="
            flex
            flex-col
            gap-y-1
            overflow-hidden
            ">
                <p className=" text-white truncate">
                    {data.title}
                </p>
                <p className="text-neutral-400 text-sm truncate"></p>
                    {data.author}
            </div>
            <div 
        className="
          absolute 
          bottom-24 
          right-5
        "
      >
        <PlayButton />
      </div>
        </div>
    );
}
 
export default MediaItem;
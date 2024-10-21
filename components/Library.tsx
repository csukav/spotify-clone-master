"use client"

import useAuthModal from "@/hooks/useAuthModal";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";

interface LibraryProps {
    songs: Song[];
}

const Library: React.FC<LibraryProps> = ({
    songs
}) => {
    const authModal = useAuthModal();
    const uploadModal = useUploadModal();
    const { user, subscription } = useUser();

    const onPlay = useOnPlay(songs);
    const onClick = () => {
        if (!user) {
            return authModal.onOpen();
        }
        return uploadModal.onOpen();

    };
    return (
        <div className="flex flex-col">
            <div className="
            flex
            items-center
            justify-between
            px-4
            py-4
            ">
                <div className="
                inline-flex
                items-center
                gap-x-2
                ">
                    <TbPlaylist className="text-neutral-400" size={20} />
                    <p className="
                    text-neutral-400
                    font-medium
                    text-md">
                        Könyvtárad
                    </p>
                </div>
                <AiOutlinePlus 
                onClick={onClick}
                size={20}
                className="
                text-neutral-400
                cursor-pointer
                hover:text-white
                transition
                "
                />
            </div>
            <div className="
                flex
                flex-col
                gap-y-">
                {songs.map((item) => (
                    <MediaItem
                    onClick={(id: string ) => onPlay(id)}
                    key={item.id}
                    data={item}
                    />
                ))}
                </div>
        </div>
    );
}
 
export default Library;
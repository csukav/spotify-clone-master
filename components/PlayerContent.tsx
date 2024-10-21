"use client";

import { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import usePlayer from "@/hooks/usePlayer";
import Slider from "./Slider";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    song,
    songUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const soundRef = useRef<Howl | null>(null);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        }
        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    };

    const onPlayPrevious = () => {
        if (player.ids.length === 0) {
            return;
        }
        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    };

    useEffect(() => {
        const sound = new Howl({
            src: [songUrl],
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            },
            onpause: () => setIsPlaying(false),
            onload: () => {
                setDuration(sound.duration());
            }
        });

        soundRef.current = sound;

        sound.play();

        return () => {
            sound.unload();
        };
    }, [songUrl]);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                if (soundRef.current) {
                    setCurrentTime(soundRef.current.seek() as number);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    const handlePlay = () => {
        if (soundRef.current) {
            if (!isPlaying) {
                soundRef.current.play();
            } else {
                soundRef.current.pause();
            }
        }
    };

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
            soundRef.current?.volume(1);
        } else {
            setVolume(0);
            soundRef.current?.volume(0);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="
            flex
            w-full
            justify-start
            ">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>
            <div className="
            flex
            md:hidden
            col-auto
            w-full
            justify-end
            items-center">
                <div
                onClick={handlePlay}
                className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-full
                bg-white
                p-1
                cursor-pointer
                ">
                    <Icon size={30} className="text-black" />
                </div>
            </div>
            <div className="
            hidden
            h-full
            md:flex
            justify-center
            items-center
            w-full
            max-w-[722px]
            gap-x-6
            ">
                <AiFillStepBackward 
                onClick={onPlayPrevious}
                size={30}
                className="text-neutral-400
                cursor-pointer
                hover:text-white
                transition"
                />
                <div
                onClick={handlePlay}
                className="
                flex
                items-center
                justify-center
                h-10
                w-10
                rounded-full
                bg-white
                p-1
                cursor-pointer
                ">
                    <Icon size={30} className=" text-black" />
                </div>
                <AiFillStepForward 
                onClick={onPlayNext}
                size={30}
                className="text-neutral-400
                cursor-pointer
                hover:text-white
                transition"
                />
            </div>
            <div className="flex flex-col items-center">
                <div>{formatTime(currentTime)} / {formatTime(duration)}</div>
            </div>
            <div className="
            hidden
            md:flex
            w-full
            justify-end
            pr-2">
                <div className=" flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon
                    onClick={toggleMute}
                    className="cursor-pointer"
                    size={34}
                    />
                    <Slider 
                    value={volume}
                    onChange={(value) => {
                        setVolume(value);
                        soundRef.current?.volume(value);
                    }}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlayerContent;
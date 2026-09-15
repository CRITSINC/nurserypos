"use client";

import {
    useCallback,
    useEffect,
    useState,
    forwardRef,
} from "react";

import { useDropzone } from "react-dropzone";
import Image from "next/image";

import {
    XCircle,
    UploadCloud,
} from "lucide-react";

import { cn } from "@/lib/utils";


interface ImageDropzoneProps {
    previewImage?: string;
    onFileAccepted: (file: File) => void;
    onFileRemoved: () => void;
}


export const ImageDropzone = forwardRef<
    HTMLDivElement,
    ImageDropzoneProps
>(function ImageDropzone(
    {
        previewImage,
        onFileAccepted,
        onFileRemoved,
    },
    ref
) {

    const [preview, setPreview] =
        useState<string | undefined>(
            previewImage
        );

    const [isNewFile, setIsNewFile] =
        useState(false);

    const [isRemoved, setIsRemoved] =
        useState(false);


    /*
     * When existing banner data arrives
     * after component mount, show it.
     *
     * Do not restore it after user
     * explicitly removed it.
     */
    useEffect(() => {

        if (
            !isNewFile &&
            !isRemoved
        ) {
            setPreview(previewImage);
        }

    }, [
        previewImage,
        isNewFile,
        isRemoved,
    ]);


    const onDrop = useCallback(
        (acceptedFiles: File[]) => {

            const file =
                acceptedFiles[0];

            if (!file) {
                return;
            }


            /*
             * Revoke only locally-created
             * blob URLs.
             */
            if (
                preview &&
                preview.startsWith("blob:")
            ) {
                URL.revokeObjectURL(
                    preview
                );
            }


            const objectUrl =
                URL.createObjectURL(file);


            setPreview(objectUrl);

            setIsNewFile(true);

            setIsRemoved(false);


            onFileAccepted(file);

        },
        [
            preview,
            onFileAccepted,
        ]
    );


    const removePreview = () => {

        if (
            preview &&
            preview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                preview
            );
        }


        setPreview(undefined);

        setIsNewFile(false);

        setIsRemoved(true);


        onFileRemoved();
    };


    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({

        onDrop,

        accept: {
            "image/jpeg": [
                ".jpeg",
                ".jpg",
            ],

            "image/png": [
                ".png",
            ],

            "image/webp": [
                ".webp",
            ],
        },

        maxFiles: 1,
    });


    return (
        <div className="w-full">

            {/* Upload Area */}

            <div
                {...getRootProps({
                    className: cn(
                        "w-full border-2 border-dashed rounded-lg",
                        "px-6 py-8 text-center",
                        "transition-all duration-200",
                        "cursor-pointer",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-ring",
                        "focus-visible:ring-offset-2",

                        isDragActive
                            ? "border-primary bg-primary/5"
                            : "border-input hover:border-primary/50 hover:bg-muted/30"
                    ),

                    ref,
                })}
            >

                <input
                    {...getInputProps()}
                />


                <div className="flex flex-col items-center gap-2 pointer-events-none">

                    <div className="flex items-center justify-center">

                        <UploadCloud
                            className="h-10 w-10 text-primary"
                        />

                    </div>


                    <p className="text-sm font-medium text-foreground">

                        {isDragActive
                            ? "Drop your image here"
                            : "Drag your image or click here"}

                    </p>


                    <p className="text-xs italic text-muted-foreground">

                        Only JPEG, WEBP and PNG images
                        are accepted

                    </p>

                </div>

            </div>


            {/* Preview */}

            {preview && (

                <div className="mt-5">

                    <p className="mb-2 text-sm font-medium text-foreground">

                        {isNewFile
                            ? "New Image"
                            : "Current Image"}

                    </p>


                    <div className="relative inline-block">

                        <div className="relative h-32 w-32 overflow-hidden rounded-lg border bg-muted">

                            <Image
                                src={preview}
                                alt="Banner preview"
                                fill
                                sizes="128px"
                                className="object-cover"
                                unoptimized
                            />

                        </div>


                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removePreview();
                            }}
                            className="
                                absolute
                                -right-2
                                -top-2
                                z-10
                                rounded-full
                                bg-white
                                text-red-500
                                shadow-sm
                                hover:text-red-600
                            "
                            aria-label="Remove image"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
});
import { useState, useRef, useCallback, type DragEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfilePic } from "@/services/auth/updateProfilePic";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { updateProfile } from "@/redux/features/auth/authSlice";
import { getProfilePic } from "@/constants/getProfilePic";
import { Upload, X, CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UpdateAvatarModal({ open, onOpenChange }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const currentPic = getProfilePic(user?.profilePicUrl ?? "");

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        setFile(null);
        setPreview(null);
        setIsSuccess(false);
      }
      onOpenChange(newOpen);
    },
    [onOpenChange]
  );

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        if (!e.target?.result) return;
        img.src = e.target.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 400;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (!blob) return;
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.7
          );
        };
      };
    });
  };

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith("image/")) {
      toast.error("Only image files are allowed.", { position: "top-center" });
      return;
    }
    if (selected.size > 3 * 1024 * 1024) {
      toast.error("Image must be less than 3 MB.", { position: "top-center" });
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setIsSuccess(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select an image.", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);
    const compressed = await compressImage(file);
    const response = await updateProfilePic(compressed);
    setIsSubmitting(false);

    if (response.success && response.message) {
        console.log("image update: ", response.message)
      dispatch(updateProfile(response.message));
      setIsSuccess(true);
      toast.success("Profile photo updated!", { position: "top-center" });
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setIsSuccess(false);
        onOpenChange(false);
      }, 1000);
    } else {
      toast.error(response.message, { position: "top-center" });
    }
  };

  const fileSizeLabel = file
    ? file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : null;

  const shortFileName =
    file && file.name.length > 28
      ? file.name.slice(0, 25) + "..."
      : file?.name;

  const hasImage = preview ?? currentPic;
  const [imageError, setImageError] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {open && (
        <DialogContent className="p-0 overflow-hidden max-w-md">
          <DialogHeader className="px-6 py-5 border-b border-black/10">
            <DialogTitle className="text-base font-semibold">
              Update profile photo
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-0.5">
              JPG or PNG · max 3 MB
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center gap-3
                rounded-xl border-2 border-dashed cursor-pointer
                transition-all duration-150 min-h-[200px]
                ${isDragging
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              {(hasImage && !imageError) ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="relative">
                    <img
                      src={preview ?? currentPic}
                      alt="Avatar preview"
                      onError={() => {setImageError(true)}}
                      className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    {preview && (
                      <button
                        onClick={handleRemove}
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-50 border border-white flex items-center justify-center hover:bg-red-100 transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>

                  {file && (
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-800">
                        {shortFileName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {fileSizeLabel}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    Click to choose a different photo
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Drop your photo here
                  </p>
                  <p className="text-sm text-gray-400">
                    or{" "}
                    <span className="text-green-600 font-medium">
                      browse files
                    </span>
                  </p>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
          </div>

          <DialogFooter className="px-6 py-4 border-t border-black/10 flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleSubmit}
              disabled={!file || isSubmitting}
              className={`flex-1 transition-all ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isSubmitting ? (
                <span className="loader" />
              ) : isSuccess ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </span>
              ) : (
                "Save photo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
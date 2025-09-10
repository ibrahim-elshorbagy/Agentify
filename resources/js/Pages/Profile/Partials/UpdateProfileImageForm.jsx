import { useRef, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { useTrans } from "@/Hooks/useTrans";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function UpdateProfileImageForm({ className = "" }) {
  const user = usePage().props.auth.user;
  const { t } = useTrans();
  const fileInput = useRef();

  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    image: null,
    _method: 'POST',
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('image', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = (e) => {
    console.log('Submitting form with image:', data.image);
    e.preventDefault();

    post(route("profile.image.update"), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        reset('image');
        setPreviewUrl(null);
        if (fileInput.current) {
          fileInput.current.value = "";
        }
      },
    });
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {t("profile_image")}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {t("update_profile_image")}
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="image" value={t("profile_image")} />

          <div className="mt-2 flex items-center gap-6">
            {/* Current Profile Image */}
            {user.image_url ? (
              <div>
                <img
                  src={user.image_url}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                />
              </div>
            ) : (
              <div className="h-20 w-20 text-white rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center">
                <span className="text-neutral-500 dark:text-neutral-400 text-2xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </span>
              </div>
            )}

            {/* Preview New Image */}
            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-20 w-20 rounded-full object-cover border-2 border-green-400 dark:border-green-600"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <input
              id="image"
              type="file"
              ref={fileInput}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />

            <label
              htmlFor="image"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-700"
            >
              <i className="fas fa-upload"></i>
              {t("choose_file")}
            </label>

            <InputError message={errors.image} className="mt-2" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {data.image &&(
            <PrimaryButton
              type="submit"
              disabled={!data.image || processing}>
              {processing ? t("uploading") : t("save_changes")}
            </PrimaryButton>
          )}

          {recentlySuccessful && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {t("saved_successfully")}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

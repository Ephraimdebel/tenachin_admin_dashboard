import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {
  fetchCallToAction,
  updateCallToAction,
} from "../../services/callToActionService";

// ---------------- TYPES ---------------- //
interface CallToActionData {
  content: string;
  download_url: string;
}

export default function CallToActionAdmin() {
  const { isOpen, openModal, closeModal } = useModal();
  const [cta, setCta] = useState<CallToActionData | null>(null);

  // ---------------- FETCH DATA ---------------- //
  useEffect(() => {
    const loadCta = async () => {
      try {
        const data = await fetchCallToAction();
        setCta(data);
      } catch (err) {
        console.error("Failed to fetch call to action:", err);
      }
    };
    loadCta();
  }, []);

  // ---------------- SAVE ---------------- //
  const handleSaveCta = async () => {
    if (!cta) return;

    try {
      await updateCallToAction({
        content: cta.content,
        download_url: cta.download_url,
      });
      closeModal();
    } catch (err) {
      console.error("Failed to update call to action:", err);
    }
  };

  if (!cta) return <p>Loading...</p>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 relative">
      {/* Edit Button */}
      <button
        onClick={openModal}
        className="absolute top-5 right-5 flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
         <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
        Edit
      </button>

      {/* Preview */}
      <div className="mb-4">
        <div className="col-xl-9 text-xl-start" style={{ maxWidth: "90%" }}>
          <p className="text-gray-800 dark:text-white/90 mb-3">{cta.content}</p>
          <a
            href={cta.download_url}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Now
          </a>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px]">
        <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-10">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Edit Call to Action
          </h4>

          <form
            className="flex flex-col space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Content */}
            <div>
              <Label>Content</Label>
              <textarea
                value={cta.content}
                onChange={(e) => setCta({ ...cta, content: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg h-32 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Download URL */}
            <div>
              <Label>Download URL</Label>
              <Input
                type="text"
                value={cta.download_url}
                onChange={(e) =>
                  setCta({ ...cta, download_url: e.target.value })
                }
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" size="sm" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSaveCta}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

import {
  fetchFeatures,
  updateFeature,
  updateFeatureListItem,
  deleteFeatureListItem,
  addFeatureListItem,
} from "../../services/featureService.ts";

// ---------------- TYPES ---------------- //
interface FeatureListItem {
  id: number;
  text: string;
}

interface FeatureSectionData {
  id: number;
  key_name: string;
  content: string;
  media_url: string;
  media_type: "image" | "video";
  newMediaFile?: File | null; // for handling new uploads
  items?: FeatureListItem[];
}

export default function FeatureSection() {
  const { isOpen, openModal, closeModal } = useModal();

  const titles: { [key: string]: string } = {
    mission: "Mission",
    vision: "Vision",
    core_values: "Core Values",
    why_different: "Why we are different",
  };

  const [features, setFeatures] = useState<FeatureSectionData[]>([]);
  const [activeFeature, setActiveFeature] = useState<FeatureSectionData | null>(
    null
  );
  const [newListText, setNewListText] = useState("");

  // ---------------- FETCH DATA ---------------- //
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await fetchFeatures();
        setFeatures(data);
        console.log("features ", data);
        if (data.length > 0) setActiveFeature(data[0]);
      } catch (err) {
        console.error("Failed to fetch features:", err);
      }
    };
    loadFeatures();
  }, []);

  // ---------------- SAVE MAIN CONTENT ---------------- //
  const handleSaveFeature = async () => {
    if (!activeFeature) return;
    try {
      await updateFeature(activeFeature.id, {
        content: activeFeature.content,
        media: activeFeature.newMediaFile || null,
      });
      setFeatures((prev) =>
        prev.map((f) => (f.id === activeFeature.id ? activeFeature : f))
      );
    } catch (err) {
      console.error("Failed to update feature:", err);
    }
    closeModal();
  };

  // ---------------- LIST ITEM HANDLERS ---------------- //
  const handleUpdateItem = async (itemId: number, newText: string) => {
    if (!activeFeature) return;
    try {
      await updateFeatureListItem(activeFeature.id, itemId, { text: newText });
      setActiveFeature({
        ...activeFeature,
        items: activeFeature.items?.map((item) =>
          item.id === itemId ? { ...item, text: newText } : item
        ),
      });
    } catch (err) {
      console.error("Failed to update list item:", err);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!activeFeature) return;
    try {
      await deleteFeatureListItem(activeFeature.id, itemId);
      setActiveFeature({
        ...activeFeature,
        items: activeFeature.items?.filter((item) => item.id !== itemId),
      });
    } catch (err) {
      console.error("Failed to delete list item:", err);
    }
  };

  const handleAddItem = async () => {
    if (!activeFeature || !newListText.trim()) return;
    try {
      const newItem = await addFeatureListItem(activeFeature.id, {
        text: newListText,
      });
      setActiveFeature({
        ...activeFeature,
        items: [...(activeFeature.items || []), newItem],
      });
      setNewListText("");
    } catch (err) {
      console.error("Failed to add list item:", err);
    }
  };

  // ---------------- IMAGE CHANGE HANDLER ---------------- //
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!activeFeature || !e.target.files?.[0]) return;

  const file = e.target.files[0];
  const previewUrl = URL.createObjectURL(file);
  const type = file.type.startsWith("video") ? "video" : "image";

  setActiveFeature({
    ...activeFeature,
    media_url: previewUrl,   // preview
    media_type: type,        // image or video
    newMediaFile: file,      // file to upload
  });
};


  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 relative">
      {/* Edit Button Top-Right */}
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

      {/* Tabs */}
      <ul className="flex gap-3 mb-4">
        {features?.map((f) => (
          <li key={f?.id}>
            <button
              className={`px-4 py-2 rounded ${
                activeFeature?.id === f.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveFeature(f)}
            >
              {titles[f.key_name]}
            </button>
          </li>
        ))}
      </ul>

      {/* Preview */}
      {activeFeature && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-sm font-medium mb-2">
              {titles[activeFeature.key_name]}
            </p>
            <p className="text-gray-800 dark:text-white/90 mb-3">
              {activeFeature.content}
            </p>
            {activeFeature?.items?.length !== undefined &&
              activeFeature.items.length > 0 && (
                <ul className="text-gray-800 dark:text-white/90 list-disc pl-5">
                  {activeFeature.items.map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              )}
          </div>
          <div className="text-center">
            {activeFeature.media_url &&
              (activeFeature?.media_type === "video" ? (
                <video
                  src={activeFeature.media_url}
                  controls
                  className="mx-auto max-h-60 rounded-lg"
                />
              ) : (
                <img
                  src={activeFeature.media_url}
                  alt={activeFeature.key_name}
                  className="mx-auto max-h-60 object-cover rounded-lg"
                />
              ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1000px]">
        <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-10">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Edit {activeFeature && titles[activeFeature.key_name]}
          </h4>

          <form className="flex flex-col space-y-6">
            {/* Content */}
            <div>
              <Label>Content</Label>
              <textarea
                value={activeFeature?.content || ""}
                onChange={(e) =>
                  activeFeature &&
                  setActiveFeature({
                    ...activeFeature,
                    content: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg h-32 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Image */}
            <div>
              <Label>Image</Label>
              <input
                type="file"
                onChange={handleMediaChange}
                className="mt-1"
              />
              {activeFeature?.media_url && (
                <img
                  src={activeFeature.media_url}
                  alt="Preview"
                  className="mt-2 max-h-40 object-cover rounded-lg"
                />
              )}
            </div>

            {/* List Items */}
            <div>
              <Label>List Items</Label>
              {activeFeature?.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3 mb-3">
                  <Input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}

              {/* Add New Item */}
              <div className="flex items-center gap-3 mt-3">
                <Input
                  type="text"
                  placeholder="New item..."
                  value={newListText}
                  onChange={(e) => setNewListText(e.target.value)}
                />
                <Button size="sm" onClick={handleAddItem}>
                  Add
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" size="sm" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSaveFeature}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

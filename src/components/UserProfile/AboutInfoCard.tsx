import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

import {
  fetchAbout,
  updateAbout,
  addAboutItem,
  updateAboutItem,
  deleteAboutItem,
} from "../../services/aboutService";

// ---------------- TYPES ---------------- //
interface AboutItem {
  id: number;
  text: string;
}

interface AboutResponse {
  description_left: string;
  description_right: string;
  list_items: AboutItem[];
}

export default function AboutSection() {
  const { isOpen, openModal, closeModal } = useModal();

  // NOT EDITABLE
  const title = "About";
  const subtitle = "Who we are";

  // EDITABLE FIELDS
  const [descriptionLeft, setDescriptionLeft] = useState("");
  const [descriptionRight, setDescriptionRight] = useState("");
  const [listItems, setListItems] = useState<AboutItem[]>([]);
  const [newListText, setNewListText] = useState("");

  // ---------------- FETCH DATA ---------------- //
  useEffect(() => {
    const loadData = async () => {
      const data: AboutResponse = await fetchAbout();

      setDescriptionLeft(data.description_left);
      setDescriptionRight(data.description_right);
      setListItems(data?.list_items || []);
    };

    loadData();
  }, []);

  // ---------------- SAVE MAIN CONTENT ---------------- //
  const handleSaveMainContent = async () => {
    try {
      await updateAbout({
        description_left: descriptionLeft,
        description_right: descriptionRight,
      });
    } catch (err) {
      console.error("Error updating about:", err);
    }
    closeModal();
  };

  // ---------------- ADD ITEM ---------------- //
  const handleAddItem = async () => {
    if (!newListText.trim()) return;

    const newItem = await addAboutItem({ text: newListText });

    setListItems((prev) => [...prev, newItem]);
    setNewListText("");
  };

  // ---------------- UPDATE ITEM ---------------- //
  const handleUpdateItem = async (id: number, newText: string) => {
    await updateAboutItem(id, { text: newText });

    setListItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };

  // ---------------- DELETE ITEM ---------------- //
  const handleDeleteItem = async (id: number) => {
    await deleteAboutItem(id);

    setListItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        
        {/* LEFT PREVIEW */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            About Section Content
          </h4>

          <div className="grid grid-cols-1 gap-4">
            {/* TITLE */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Title</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {title}
              </p>
            </div>

            {/* SUBTITLE */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Subtitle</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {subtitle}
              </p>
            </div>

            {/* LEFT DESCRIPTION */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Left Description</p>
              <p className="text-sm text-gray-800 dark:text-white/90">
                {descriptionLeft}
              </p>
            </div>

            {/* RIGHT DESCRIPTION */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Right Description</p>
              <p className="text-sm text-gray-800 dark:text-white/90">
                {descriptionRight}
              </p>
            </div>

            {/* LIST ITEMS */}
            <div>
              <p className="text-xs text-gray-500 mb-1">List Items</p>
              <ul className="text-gray-800 dark:text-white/90">
                {listItems.map((item) => (
                  <li key={item.id} className="text-sm">• {item.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1000px]">
        <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-10">

          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Edit About Section
          </h4>

          <form className="flex flex-col">
            
            <div className="h-[350px] custom-scrollbar overflow-y-auto space-y-6">

              {/* LEFT DESCRIPTION */}
              <div>
                <Label>Left Description</Label>
                <textarea
                  value={descriptionLeft}
                  onChange={(e) => setDescriptionLeft(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              {/* RIGHT DESCRIPTION */}
              <div>
                <Label>Right Description</Label>
                <textarea
                  value={descriptionRight}
                  onChange={(e) => setDescriptionRight(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              {/* LIST ITEMS */}
              <div>
                <Label>List Items</Label>

                {listItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 mb-3">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) =>
                        handleUpdateItem(item.id, e.target.value)
                      }
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

                {/* ADD ITEM */}
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
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" size="sm" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSaveMainContent}>
                Save Changes
              </Button>
            </div>

          </form>
        </div>
      </Modal>
    </div>
  );
}

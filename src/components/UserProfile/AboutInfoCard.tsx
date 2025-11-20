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

import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";

import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../services/servicesService";

interface Service {
  id?: number;
  title: string;
  description: string;
  icon_class: string;
  color: string;
  delay: number;
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await fetchServices();
    setServices(data);
  };

  const handleOpenAdd = () => {
    setEditing({
      title: "",
      description: "",
      icon_class: "",
      color: "#000000",
      delay: 100,
    });
    openModal();
  };

  const handleEdit = (service: Service) => {
    setEditing(service);
    openModal();
  };

  const handleDelete = async (id: number) => {
    await deleteService(id);
    loadServices();
  };

  const handleSave = async () => {
    if (!editing) return;

    if (editing.id) {
      await updateService(editing.id, editing);
    } else {
      await createService(editing);
    }

    closeModal();
    loadServices();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Services</h2>
        <Button size="sm" onClick={handleOpenAdd}>
          Add Service
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="border p-4 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex justify-between">
              <span className="font-bold dark:text-white">{srv.title}</span>
              <i
                className={`${srv.icon_class}`}
                style={{ color: srv.color }}
              ></i>
            </div>
            <p className="text-sm mt-1 dark:text-gray-300">{srv.description}</p>

            <div className="flex gap-3 mt-3">
              <Button size="xs" onClick={() => handleEdit(srv)}>
                Edit
              </Button>
              <Button
                size="xs"
                variant="danger"
                onClick={() => handleDelete(srv.id!)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px]">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 dark:text-white">
            {editing?.id ? "Edit Service" : "Add Service"}
          </h3>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editing?.title}
                onChange={(e) =>
                  setEditing({ ...editing!, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={editing?.description}
                onChange={(e) =>
                  setEditing({ ...editing!, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Icon Class (Bootstrap Icon)</Label>
              <Input
                placeholder="bi bi-heart-pulse"
                value={editing?.icon_class}
                onChange={(e) =>
                  setEditing({ ...editing!, icon_class: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Color</Label>
              <input
                type="color"
                className="w-16 h-10"
                value={editing?.color}
                onChange={(e) =>
                  setEditing({ ...editing!, color: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Delay (Animation)</Label>
              <Input
                type="number"
                value={editing?.delay}
                onChange={(e) =>
                  setEditing({ ...editing!, delay: Number(e.target.value) })
                }
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

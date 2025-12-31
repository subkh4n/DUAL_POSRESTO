"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { Badge } from "@/components/selia/badge";
import { Input } from "@/components/selia/input";
import {
  PlusIcon,
  Trash2Icon,
  EditIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SaveIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ModifierGroup {
  id: string;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  required: boolean;
  min_select: number;
  max_select: number;
}

interface ModifierItem {
  id: string;
  group_id: string;
  name: string;
  price_adjust: number;
  available: boolean;
}

export default function ModifiersPage() {
  const [groups, setGroups] = useState<ModifierGroup[]>([]);
  const [items, setItems] = useState<ModifierItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Form states
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
  const [groupForm, setGroupForm] = useState({
    id: "",
    name: "",
    type: "SINGLE" as "SINGLE" | "MULTIPLE",
    required: false,
    min_select: 0,
    max_select: 1,
  });

  const [showItemForm, setShowItemForm] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({
    id: "",
    name: "",
    price_adjust: 0,
  });

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data: groupsData } = await supabase
        .from("modifier_groups")
        .select("*")
        .order("name");
      const { data: itemsData } = await supabase
        .from("modifier_items")
        .select("*")
        .order("name");
      if (groupsData) setGroups(groupsData);
      if (itemsData) setItems(itemsData);
      setLoading(false);
    };
    loadData();
  }, []);

  // Refetch function for CRUD operations
  const refetchData = async () => {
    const { data: groupsData } = await supabase
      .from("modifier_groups")
      .select("*")
      .order("name");
    const { data: itemsData } = await supabase
      .from("modifier_items")
      .select("*")
      .order("name");
    if (groupsData) setGroups(groupsData);
    if (itemsData) setItems(itemsData);
  };

  // Group CRUD
  const saveGroup = async () => {
    if (!groupForm.id || !groupForm.name) {
      alert("ID dan Nama wajib diisi!");
      return;
    }

    if (editingGroup) {
      await supabase
        .from("modifier_groups")
        .update({
          name: groupForm.name,
          type: groupForm.type,
          required: groupForm.required,
          min_select: groupForm.min_select,
          max_select: groupForm.max_select,
        })
        .eq("id", editingGroup.id);
    } else {
      await supabase.from("modifier_groups").insert({
        id: groupForm.id,
        name: groupForm.name,
        type: groupForm.type,
        required: groupForm.required,
        min_select: groupForm.min_select,
        max_select: groupForm.max_select,
      });
    }

    setShowGroupForm(false);
    setEditingGroup(null);
    setGroupForm({
      id: "",
      name: "",
      type: "SINGLE",
      required: false,
      min_select: 0,
      max_select: 1,
    });
    refetchData();
  };

  const deleteGroup = async (id: string) => {
    if (!confirm("Hapus grup ini beserta semua item-nya?")) return;
    await supabase.from("modifier_groups").delete().eq("id", id);
    refetchData();
  };

  const editGroup = (group: ModifierGroup) => {
    setEditingGroup(group);
    setGroupForm({
      id: group.id,
      name: group.name,
      type: group.type,
      required: group.required,
      min_select: group.min_select,
      max_select: group.max_select,
    });
    setShowGroupForm(true);
  };

  // Item CRUD
  const saveItem = async (groupId: string) => {
    if (!itemForm.id || !itemForm.name) {
      alert("ID dan Nama wajib diisi!");
      return;
    }

    await supabase.from("modifier_items").upsert({
      id: itemForm.id,
      group_id: groupId,
      name: itemForm.name,
      price_adjust: itemForm.price_adjust,
      available: true,
    });

    setShowItemForm(null);
    setItemForm({ id: "", name: "", price_adjust: 0 });
    refetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Hapus item ini?")) return;
    await supabase.from("modifier_items").delete().eq("id", id);
    refetchData();
  };

  const toggleItemAvailable = async (item: ModifierItem) => {
    await supabase
      .from("modifier_items")
      .update({ available: !item.available })
      .eq("id", item.id);
    refetchData();
  };

  if (loading) {
    return <div className="p-8 text-center text-muted">Memuat data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Modifier</h1>
          <p className="text-muted">
            Atur grup modifier (Topping, Size, Level) dan item-nya
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingGroup(null);
            setGroupForm({
              id: "",
              name: "",
              type: "SINGLE",
              required: false,
              min_select: 0,
              max_select: 1,
            });
            setShowGroupForm(true);
          }}
        >
          <PlusIcon className="size-4" />
          Tambah Grup
        </Button>
      </div>

      {/* Group Form Modal */}
      {showGroupForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>
              {editingGroup ? "Edit Grup" : "Tambah Grup Baru"}
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  ID (unik)
                </label>
                <Input
                  placeholder="grp-topping"
                  value={groupForm.id}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, id: e.target.value })
                  }
                  disabled={!!editingGroup}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nama</label>
                <Input
                  placeholder="Pilih Topping"
                  value={groupForm.name}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tipe</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={groupForm.type}
                  onChange={(e) =>
                    setGroupForm({
                      ...groupForm,
                      type: e.target.value as "SINGLE" | "MULTIPLE",
                    })
                  }
                >
                  <option value="SINGLE">Single (1 pilihan)</option>
                  <option value="MULTIPLE">Multiple (banyak)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Min Pilih
                </label>
                <Input
                  type="number"
                  value={groupForm.min_select}
                  onChange={(e) =>
                    setGroupForm({
                      ...groupForm,
                      min_select: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Max Pilih
                </label>
                <Input
                  type="number"
                  value={groupForm.max_select}
                  onChange={(e) =>
                    setGroupForm({
                      ...groupForm,
                      max_select: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={groupForm.required}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, required: e.target.checked })
                }
              />
              <label htmlFor="required" className="text-sm">
                Wajib dipilih
              </label>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveGroup}>
                <SaveIcon className="size-4" />
                Simpan
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowGroupForm(false);
                  setEditingGroup(null);
                }}
              >
                Batal
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Groups List */}
      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() =>
                setExpandedGroup(expandedGroup === group.id ? null : group.id)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedGroup === group.id ? (
                    <ChevronDownIcon className="size-5" />
                  ) : (
                    <ChevronRightIcon className="size-5" />
                  )}
                  <div>
                    <CardTitle className="text-base">{group.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {group.id}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={group.type === "SINGLE" ? "primary" : "warning"}
                  >
                    {group.type}
                  </Badge>
                  {group.required && <Badge variant="danger">Wajib</Badge>}
                  <Badge variant="secondary">
                    {items.filter((i) => i.group_id === group.id).length} item
                  </Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editGroup(group);
                    }}
                    className="p-2 hover:bg-secondary rounded-lg"
                  >
                    <EditIcon className="size-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGroup(group.id);
                    }}
                    className="p-2 hover:bg-danger/10 rounded-lg text-danger"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              </div>
            </CardHeader>

            {expandedGroup === group.id && (
              <CardBody className="pt-0">
                <div className="border-t pt-4 space-y-2">
                  {items
                    .filter((i) => i.group_id === group.id)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={() => toggleItemAvailable(item)}
                          />
                          <div>
                            <p
                              className={`font-medium ${
                                !item.available ? "line-through text-muted" : ""
                              }`}
                            >
                              {item.name}
                            </p>
                            <p className="text-xs text-muted">{item.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-primary font-medium">
                            {item.price_adjust > 0
                              ? `+Rp ${item.price_adjust.toLocaleString()}`
                              : "Gratis"}
                          </span>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 hover:bg-danger/10 rounded text-danger"
                          >
                            <Trash2Icon className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {showItemForm === group.id ? (
                    <div className="p-3 border border-dashed rounded-lg space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          placeholder="ID (mod-xxx)"
                          value={itemForm.id}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, id: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Nama Item"
                          value={itemForm.name}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, name: e.target.value })
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Tambah Harga"
                          value={itemForm.price_adjust}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              price_adjust: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveItem(group.id)}>
                          <SaveIcon className="size-3" /> Simpan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowItemForm(null)}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowItemForm(group.id);
                        setItemForm({ id: "", name: "", price_adjust: 0 });
                      }}
                      className="w-full p-3 border border-dashed rounded-lg text-muted hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="size-4" />
                      Tambah Item
                    </button>
                  )}
                </div>
              </CardBody>
            )}
          </Card>
        ))}

        {groups.length === 0 && (
          <Card>
            <CardBody className="text-center py-12 text-muted">
              Belum ada grup modifier. Klik &quot;Tambah Grup&quot; untuk
              memulai.
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

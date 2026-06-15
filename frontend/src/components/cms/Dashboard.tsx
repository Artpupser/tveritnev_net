import React, { useState, useEffect } from "react";
import Sidebar from "@/components/cms/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import {
  Reorder,
  useDragControls,
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Layout,
  UserCircle,
  ArrowLeftRight,
  MessageSquareQuote,
  HelpCircle,
  Plus,
  X,
  Copy,
  Check,
  Download,
} from "lucide-react";

interface CMSSection {
  id: string;
  type: "hero" | "about" | "serviceSwitcher" | "reviews" | "faq";
  isActive: boolean;
  props: any;
}

const sectionTypes = [
  { id: "hero", label: "Hero", icon: Layout },
  { id: "about", label: "About", icon: UserCircle },
  { id: "serviceSwitcher", label: "Services", icon: ArrowLeftRight },
  { id: "reviews", label: "Reviews", icon: MessageSquareQuote },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

const Dashboard: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const [pageConfig, setPageConfig] = useState({
    title: "Лендинг Tveritnev",
    showHeader: false,
    showFooter: true,
  });

  const [sections, setSections] = useState<CMSSection[]>([
    {
      id: "sec_1",
      type: "hero",
      isActive: true,
      props: {
        title: "Какой то текст",
        description: "Очень длинное описание которое только можно придумать.",
        buttonText: "Смотреть",
        videoUrl: "/hero-bg.mp4",
      },
    },
    {
      id: "sec_2",
      type: "about",
      isActive: true,
      props: {
        name: "Anatoly Tveritnev",
        avatarUrl: "/about_photo.jpg",
        skills: ["Английский с нуля", "Разговорный клуб"],
        badges: ["Пешие прогулки по Рязани"],
        socials: [{ name: "VK", url: "https://vk.com/tveritnev_rules" }],
      },
    },
    {
      id: "sec_3",
      type: "serviceSwitcher",
      isActive: true,
      props: {
        english: {
          title: "Курсы Английского Языка",
          description: "Индивидуальные занятия для любого уровня.",
          phone: "+7 999 123 45 67",
          vkUrl: "https://vk.com/tveritnev_rules",
          maxUrl: "#",
          tgUrl: "https://t.me/Username",
          plans: [],
        },
        guide: {
          title: "Экскурсии по Рязани",
          description: "Уникальные авторские маршруты.",
          phone: "+7 999 777 77 77",
          vkUrl: "https://vk.com/tveritnev_rules",
          maxUrl: "#",
          tgUrl: "https://t.me/Username",
          plans: [],
        },
      },
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [jsonInput, setJsonInput] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      const loadConfig = async () => {
        try {
          const res = await apiClient.post("/configs/load", {
            name: "site",
          });
          const parsedJson = JSON.parse(res.data.json);

          if (parsedJson.config) setPageConfig(parsedJson.config);
          if (parsedJson.sections) setSections(parsedJson.sections);
          else setSections(parsedJson);
        } catch (err) {
          console.error("Ошибка загрузки конфига:", err);
        } finally {
          setIsDataLoading(false);
        }
      };
      loadConfig();
    }
  }, [authLoading, user]);

  const saveConfig = async () => {
    try {
      await apiClient.post("/configs/save", {
        name: "site",
        json: JSON.stringify({ config: pageConfig, sections }),
      });
      alert("Сохранено успешно!");
    } catch (err) {
      alert("Ошибка сохранения");
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonInput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    link.download = `config_backup_${local}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setJsonInput(JSON.stringify({ config: pageConfig, sections }, null, 2));
  }, [pageConfig, sections]);

  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      if (parsed.config) setPageConfig(parsed.config);
      if (parsed.sections) setSections(parsed.sections);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
    );
  };

  const deleteSection = (id: string) => {
    if (confirm("Удалить этот блок?")) {
      setSections((prev) => prev.filter((s) => s.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const updateProp = (sectionId: string, key: string, value: any) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, props: { ...s.props, [key]: value } } : s,
      ),
    );
  };

  const addSection = (type: CMSSection["type"]) => {
    const templates: Record<string, any> = {
      hero: {
        title: "Новый заголовок",
        description: "",
        buttonText: "Кнопка",
        videoUrl: "",
      },
      about: {
        name: "Новое имя",
        avatarUrl: "",
        skills: [],
        badges: [],
        socials: [],
      },
      serviceSwitcher: {
        english: {
          title: "English",
          description: "",
          phone: "",
          vkUrl: "",
          maxUrl: "",
          tgUrl: "",
          plans: [],
        },
        guide: {
          title: "Guide",
          description: "",
          phone: "",
          vkUrl: "",
          maxUrl: "",
          tgUrl: "",
          plans: [],
        },
      },
      reviews: { title: "Отзывы", row1: [], row2: [], row3: [] },
      faq: { title: "FAQ", items: [{ question: "Вопрос", answer: "Ответ" }] },
    };

    const newSec: CMSSection = {
      id: `sec_${Date.now()}`,
      type,
      isActive: true,
      props: JSON.parse(JSON.stringify(templates[type])),
    };
    setSections([...sections, newSec]);
    setExpandedId(newSec.id);
    setShowAddMenu(false);
  };

  if (authLoading || isDataLoading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-slate-950 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {authLoading ? "Авторизация..." : "Загрузка контента..."}
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50/50 flex flex-col md:flex-row text-slate-900 select-none">
      <Sidebar />

      <main className="grow p-8 md:p-12 w-full max-w-5xl">
        <div className="border-b border-slate-200 pb-8 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-slate-950">
              Редактор
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Привет, {user?.username}. Управляй контентом здесь.
            </p>
          </div>
          <button
            onClick={saveConfig}
            className="px-6 py-3 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100"
          >
            Опубликовать
          </button>
        </div>

        <div className="mb-10 p-6 border border-slate-200 rounded-3xl bg-white shadow-sm">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">
            Настройки страницы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Заголовок сайта"
              value={pageConfig.title}
              onChange={(v) => setPageConfig({ ...pageConfig, title: v })}
            />
            <div className="flex items-center gap-3 pt-4 md:pt-6">
              <input
                type="checkbox"
                checked={pageConfig.showHeader}
                onChange={(e) =>
                  setPageConfig({ ...pageConfig, showHeader: e.target.checked })
                }
                className="w-4 h-4 rounded text-slate-950 focus:ring-slate-950"
              />
              <label className="text-[10px] font-black uppercase text-slate-600 cursor-pointer">
                Показывать шапку
              </label>
            </div>
            <div className="flex items-center gap-3 pt-4 md:pt-6">
              <input
                type="checkbox"
                checked={pageConfig.showFooter}
                onChange={(e) =>
                  setPageConfig({ ...pageConfig, showFooter: e.target.checked })
                }
                className="w-4 h-4 rounded text-slate-950 focus:ring-slate-950"
              />
              <label className="text-[10px] font-black uppercase text-slate-600 cursor-pointer">
                Показывать подвал
              </label>
            </div>
          </div>
        </div>

        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={setSections}
          className="flex flex-col gap-4"
        >
          <AnimatePresence initial={false}>
            {sections.map((sec) => (
              <SectionItem
                key={sec.id}
                sec={sec}
                isExpanded={expandedId === sec.id}
                onExpand={() =>
                  setExpandedId(expandedId === sec.id ? null : sec.id)
                }
                onToggle={() => toggleSection(sec.id)}
                onDelete={() => deleteSection(sec.id)}
                updateProp={updateProp}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>

        <motion.div
          layout
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`mt-12 border-2 rounded-[2.5rem] bg-white overflow-hidden ${
            showAddMenu
              ? "border-dashed border-slate-950 shadow-sm"
              : "border-dashed border-slate-200 hover:border-slate-400 shadow-sm"
          }`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!showAddMenu ? (
              <motion.button
                key="collapsed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowAddMenu(true)}
                className="w-full p-10 flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-slate-950 group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <Plus size={20} strokeWidth={3} />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-950 transition-colors">
                    Добавить новый блок
                  </span>
                </div>
              </motion.button>
            ) : (
              <motion.div
                key="expanded"
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="p-8"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-slate-950 uppercase tracking-tight">
                        Тип нового блока
                      </h3>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">
                        Выберите нужную секцию
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddMenu(false)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors group"
                    >
                      <X
                        size={20}
                        className="text-slate-400 group-hover:text-slate-950"
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {sectionTypes.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addSection(item.id as any)}
                        className="flex flex-col items-center gap-3 p-5 rounded-3xl border border-slate-100 hover:border-slate-950 hover:bg-slate-50 transition-all group"
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all">
                          <item.icon size={20} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-950">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <AnimatePresence>
        <motion.aside
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-2xl bg-white border-l border-slate-200 flex flex-col h-screen sticky top-0 z-50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)]"
        >
          <div className="p-8 pb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest">
                JSON
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold">
                Редактирование в реальном времени
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadJson}
                title="Скачать JSON файл"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 group"
              >
                <Download size={16} className="group-hover:text-slate-950" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
              >
                {copySuccess ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>

          <div className="relative grow px-8 pb-4 flex flex-col">
            <textarea
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              spellCheck={false}
              className={`w-full h-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl outline-none resize-none shadow-inner leading-relaxed ${jsonError ? "ring-2 ring-rose-500/50" : "focus:ring-2 ring-indigo-500/30"}`}
            />

            {jsonError && (
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-xl">
                Ошибка синтаксиса: {jsonError.slice(0, 40)}...
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100"></div>
        </motion.aside>
      </AnimatePresence>
    </div>
  );
};

const SectionItem = ({
  sec,
  isExpanded,
  onExpand,
  onToggle,
  onDelete,
  updateProp,
}: any) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={sec}
      id={sec.id}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
        scale: 0.95,
        transition: {
          height: { duration: 0.3 },
          opacity: { duration: 0.2 },
        },
      }}
      layout
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      }}
      className={`border rounded-3xl bg-white flex flex-col transition-shadow duration-300 ${
        isExpanded
          ? "border-slate-950 shadow-lg z-10"
          : "border-slate-200 shadow-sm"
      }`}
    >
      <div className="flex items-center p-6 w-full">
        <div
          onPointerDown={(e) => controls.start(e)}
          className="text-slate-300 hover:text-slate-600 transition-colors shrink-0 p-2 mr-2 cursor-grab active:cursor-grabbing"
        >
          <svg
            className="w-4 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <circle cx="5" cy="5" r="1" fill="currentColor" />
            <circle cx="5" cy="12" r="1" fill="currentColor" />
            <circle cx="5" cy="19" r="1" fill="currentColor" />
            <circle cx="11" cy="5" r="1" fill="currentColor" />
            <circle cx="11" cy="12" r="1" fill="currentColor" />
            <circle cx="11" cy="19" r="1" fill="currentColor" />
          </svg>
        </div>

        <div className="grow cursor-pointer" onClick={onExpand}>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            {sec.type}
          </span>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
            {sec.props.title || sec.props.name || "Без названия"}
          </h3>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <span
            className={`hidden sm:block text-[10px] font-bold uppercase px-3 py-1 rounded-full ${sec.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
          >
            {sec.isActive ? "Активен" : "Выкл"}
          </span>
          <button
            onClick={onToggle}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-950 hover:text-white transition-all"
          >
            Вкл/Выкл
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
          >
            Удалить
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            style={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                  ease: "easeOut",
                },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.15 },
              },
            }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pb-6">
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-6">
                {sec.type === "hero" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Заголовок"
                      value={sec.props.title}
                      onChange={(v) => updateProp(sec.id, "title", v)}
                    />
                    <Input
                      label="Текст кнопки"
                      value={sec.props.buttonText}
                      onChange={(v) => updateProp(sec.id, "buttonText", v)}
                    />
                    <div className="col-span-2">
                      <Input
                        label="Video URL (Фон)"
                        value={sec.props.videoUrl || ""}
                        onChange={(v) => updateProp(sec.id, "videoUrl", v)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">
                        Описание
                      </label>
                      <textarea
                        rows={3}
                        value={sec.props.description}
                        onChange={(e) =>
                          updateProp(sec.id, "description", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-slate-950 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {sec.type === "about" && (
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Имя профиля"
                        value={sec.props.name}
                        onChange={(v) => updateProp(sec.id, "name", v)}
                      />
                      <Input
                        label="Аватар URL"
                        value={sec.props.avatarUrl}
                        onChange={(v) => updateProp(sec.id, "avatarUrl", v)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <StringListEditor
                        title="Навыки (Skills)"
                        items={sec.props.skills || []}
                        onChange={(v) => updateProp(sec.id, "skills", v)}
                      />
                      <StringListEditor
                        title="Бейджи (Badges)"
                        items={sec.props.badges || []}
                        onChange={(v) => updateProp(sec.id, "badges", v)}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Социальные сети
                        </span>
                        <button
                          onClick={() =>
                            updateProp(sec.id, "socials", [
                              ...(sec.props.socials || []),
                              { name: "", url: "" },
                            ])
                          }
                          className="text-[10px] font-bold text-slate-950 uppercase"
                        >
                          + Добавить
                        </button>
                      </div>
                      {(sec.props.socials || []).map(
                        (social: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 border border-slate-100 rounded-2xl flex flex-col gap-2 relative"
                          >
                            <button
                              onClick={() =>
                                updateProp(
                                  sec.id,
                                  "socials",
                                  sec.props.socials.filter(
                                    (_: any, i: number) => i !== idx,
                                  ),
                                )
                              }
                              className="absolute top-4 right-4 text-rose-600 text-[10px] font-bold uppercase"
                            >
                              Удалить
                            </button>
                            <input
                              placeholder="Название (например, VK)"
                              value={social.name}
                              onChange={(e) => {
                                const n = [...sec.props.socials];
                                n[idx].name = e.target.value;
                                updateProp(sec.id, "socials", n);
                              }}
                              className="w-5/6 bg-transparent font-bold text-sm outline-none"
                            />
                            <input
                              placeholder="Ссылка (URL)"
                              value={social.url}
                              onChange={(e) => {
                                const n = [...sec.props.socials];
                                n[idx].url = e.target.value;
                                updateProp(sec.id, "socials", n);
                              }}
                              className="w-full bg-transparent text-xs text-slate-500 outline-none"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {sec.type === "serviceSwitcher" && (
                  <div className="flex flex-col gap-8">
                    {["english", "guide"].map((k) => (
                      <div
                        key={k}
                        className="p-6 border border-slate-100 rounded-3xl flex flex-col gap-4 bg-slate-50/30"
                      >
                        <div className="border-b border-slate-200 pb-2 mb-2">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Вкладка:{" "}
                            {k === "english"
                              ? "Языки (English)"
                              : "Гидинг (Guide)"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Заголовок"
                            value={sec.props[k]?.title || ""}
                            onChange={(v) =>
                              updateProp(sec.id, k, {
                                ...sec.props[k],
                                title: v,
                              })
                            }
                          />
                          <Input
                            label="Телефон"
                            value={sec.props[k]?.phone || ""}
                            onChange={(v) =>
                              updateProp(sec.id, k, {
                                ...sec.props[k],
                                phone: v,
                              })
                            }
                          />
                          <div className="col-span-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">
                              Описание
                            </label>
                            <textarea
                              value={sec.props[k]?.description || ""}
                              onChange={(e) =>
                                updateProp(sec.id, k, {
                                  ...sec.props[k],
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-slate-950 outline-none resize-none"
                              rows={2}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            label="VK Link"
                            value={sec.props[k]?.vkUrl || ""}
                            onChange={(v) =>
                              updateProp(sec.id, k, {
                                ...sec.props[k],
                                vkUrl: v,
                              })
                            }
                          />
                          <Input
                            label="MAX Link"
                            value={sec.props[k]?.maxUrl || ""}
                            onChange={(v) =>
                              updateProp(sec.id, k, {
                                ...sec.props[k],
                                maxUrl: v,
                              })
                            }
                          />
                          <Input
                            label="TG Link"
                            value={sec.props[k]?.tgUrl || ""}
                            onChange={(v) =>
                              updateProp(sec.id, k, {
                                ...sec.props[k],
                                tgUrl: v,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              Тарифы
                            </span>
                            <button
                              onClick={() =>
                                updateProp(sec.id, k, {
                                  ...sec.props[k],
                                  plans: [
                                    ...(sec.props[k].plans || []),
                                    { name: "", price: "", features: [] },
                                  ],
                                })
                              }
                              className="text-[10px] font-bold text-slate-950 uppercase"
                            >
                              + Добавить тариф
                            </button>
                          </div>
                          {(sec.props[k]?.plans || []).map(
                            (plan: any, pIdx: number) => (
                              <div
                                key={pIdx}
                                className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-4 relative shadow-sm"
                              >
                                <button
                                  onClick={() =>
                                    updateProp(sec.id, k, {
                                      ...sec.props[k],
                                      plans: sec.props[k].plans.filter(
                                        (_: any, i: number) => i !== pIdx,
                                      ),
                                    })
                                  }
                                  className="absolute top-4 right-4 text-rose-600 text-[10px] font-bold uppercase"
                                >
                                  Удалить
                                </button>
                                <div className="grid grid-cols-2 gap-3 w-5/6">
                                  <Input
                                    label="Название"
                                    value={plan.name}
                                    onChange={(v) => {
                                      const np = [...sec.props[k].plans];
                                      np[pIdx].name = v;
                                      updateProp(sec.id, k, {
                                        ...sec.props[k],
                                        plans: np,
                                      });
                                    }}
                                  />
                                  <Input
                                    label="Цена"
                                    value={plan.price}
                                    onChange={(v) => {
                                      const np = [...sec.props[k].plans];
                                      np[pIdx].price = v;
                                      updateProp(sec.id, k, {
                                        ...sec.props[k],
                                        plans: np,
                                      });
                                    }}
                                  />
                                </div>
                                <StringListEditor
                                  title="Список фичей"
                                  items={plan.features || []}
                                  onChange={(v) => {
                                    const np = [...sec.props[k].plans];
                                    np[pIdx].features = v;
                                    updateProp(sec.id, k, {
                                      ...sec.props[k],
                                      plans: np,
                                    });
                                  }}
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sec.type === "reviews" && (
                  <div className="flex flex-col gap-6">
                    <Input
                      label="Заголовок секции"
                      value={sec.props.title}
                      onChange={(v) => updateProp(sec.id, "title", v)}
                    />

                    <div className="flex flex-col gap-6">
                      {["row1", "row2", "row3"].map((rowKey) => (
                        <div
                          key={rowKey}
                          className="flex flex-col gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                              Ряд {rowKey.replace("row", "")}
                            </span>
                            <button
                              onClick={() =>
                                updateProp(sec.id, rowKey, [
                                  ...(sec.props[rowKey] || []),
                                  { text: "", author: "" },
                                ])
                              }
                              className="text-[10px] font-bold text-slate-950 uppercase"
                            >
                              + Отзыв
                            </button>
                          </div>
                          {(sec.props[rowKey] || []).map(
                            (review: any, rIdx: number) => (
                              <div
                                key={rIdx}
                                className="p-4 border border-slate-200 bg-white rounded-2xl flex flex-col gap-2 relative"
                              >
                                <button
                                  onClick={() =>
                                    updateProp(
                                      sec.id,
                                      rowKey,
                                      sec.props[rowKey].filter(
                                        (_: any, i: number) => i !== rIdx,
                                      ),
                                    )
                                  }
                                  className="absolute top-4 right-4 text-rose-600 text-[10px] font-bold uppercase"
                                >
                                  Удалить
                                </button>
                                <input
                                  placeholder="Имя автора"
                                  value={review.author}
                                  onChange={(e) => {
                                    const n = [...sec.props[rowKey]];
                                    n[rIdx].author = e.target.value;
                                    updateProp(sec.id, rowKey, n);
                                  }}
                                  className="w-5/6 bg-transparent font-bold text-sm outline-none"
                                />
                                <textarea
                                  placeholder="Текст отзыва"
                                  value={review.text}
                                  onChange={(e) => {
                                    const n = [...sec.props[rowKey]];
                                    n[rIdx].text = e.target.value;
                                    updateProp(sec.id, rowKey, n);
                                  }}
                                  className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none mt-1"
                                  rows={2}
                                />
                              </div>
                            ),
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sec.type === "faq" && (
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Заголовок секции"
                      value={sec.props.title || "Частые вопросы"}
                      onChange={(v) => updateProp(sec.id, "title", v)}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Вопросы и ответы
                      </span>
                      <button
                        onClick={() =>
                          updateProp(sec.id, "items", [
                            ...(sec.props.items || []),
                            { question: "", answer: "" },
                          ])
                        }
                        className="text-[10px] font-bold text-slate-950 uppercase"
                      >
                        + Добавить
                      </button>
                    </div>
                    {(sec.props.items || []).map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 border border-slate-100 rounded-2xl flex flex-col gap-2 relative"
                      >
                        <button
                          onClick={() =>
                            updateProp(
                              sec.id,
                              "items",
                              sec.props.items.filter(
                                (_: any, i: number) => i !== idx,
                              ),
                            )
                          }
                          className="absolute top-4 right-4 text-rose-600 text-[10px] font-bold uppercase"
                        >
                          Удалить
                        </button>
                        <input
                          placeholder="Вопрос"
                          value={item.question}
                          onChange={(e) => {
                            const newItems = [...sec.props.items];
                            newItems[idx].question = e.target.value;
                            updateProp(sec.id, "items", newItems);
                          }}
                          className="w-5/6 bg-transparent font-bold text-sm outline-none"
                        />
                        <textarea
                          placeholder="Ответ"
                          value={item.answer}
                          onChange={(e) => {
                            const newItems = [...sec.props.items];
                            newItems[idx].answer = e.target.value;
                            updateProp(sec.id, "items", newItems);
                          }}
                          className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                  ID: {sec.id} • Type: {sec.type}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
};

const Input = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black uppercase text-slate-400 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-slate-950 outline-none bg-white transition-colors"
    />
  </div>
);

const StringListEditor = ({
  title,
  items = [],
  onChange,
}: {
  title: string;
  items: string[];
  onChange: (v: string[]) => void;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center mb-1">
      <label className="text-[9px] font-black uppercase text-slate-400">
        {title}
      </label>
      <button
        onClick={() => onChange([...items, ""])}
        className="text-[10px] font-bold text-slate-950 uppercase"
      >
        + Добавить
      </button>
    </div>
    {items.map((val, idx) => (
      <div key={idx} className="flex gap-2">
        <input
          type="text"
          value={val}
          onChange={(e) => {
            const n = [...items];
            n[idx] = e.target.value;
            onChange(n);
          }}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-slate-950 outline-none bg-white transition-colors"
        />
        <button
          onClick={() => onChange(items.filter((_, i) => i !== idx))}
          className="w-9 shrink-0 flex items-center justify-center border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

export default Dashboard;

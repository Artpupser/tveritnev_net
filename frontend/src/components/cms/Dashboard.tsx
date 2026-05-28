import React, { useState } from "react";

interface CMSSection {
  id: string;
  type: "hero" | "about" | "serviceSwitcher" | "reviews" | "faq";
  isActive: boolean;
  props: any;
}

const Dashboard: React.FC = () => {
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
        skills: ["Английский с нуля", "Разговорный клуб", "Для путешествий"],
        badges: ["Пешие прогулки по Рязани", "Исторические гиды"],
        socials: [
          { name: "VKontakte", url: "https://vk.com/tveritnev_rules" },
          { name: "Telegram", url: "https://t.me/Username" },
        ],
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
          plans: [{ name: "Начальный", price: "1 500₽/ч" }],
        },
        guide: {
          title: "Экскурсии по Рязани",
          description: "Авторские маршруты по городу.",
          phone: "+7 999 777 77 77",
          plans: [{ name: "Уикенд", price: "5 000₽" }],
        },
      },
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...sections];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setSections(updated);
    setDraggedIndex(null);
  };

  const toggleSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSections(
      sections.map((sec) =>
        sec.id === id ? { ...sec, isActive: !sec.isActive } : sec,
      ),
    );
  };

  const deleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить эту секцию?")) {
      setSections(sections.filter((sec) => sec.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const addSection = (
    type: "hero" | "about" | "serviceSwitcher" | "reviews" | "faq",
  ) => {
    const templates = {
      hero: {
        title: "Новый баннер",
        description: "Описание баннера",
        buttonText: "Кнопка",
        videoUrl: "",
      },
      about: {
        name: "Новый профиль",
        avatarUrl: "",
        skills: ["Скилл 1"],
        badges: ["Гидинг"],
        socials: [],
      },
      serviceSwitcher: {
        english: { title: "Языки", description: "Текст", phone: "", plans: [] },
        guide: { title: "Туры", description: "Текст", phone: "", plans: [] },
      },
      reviews: { title: "Новые отзывы", row1: [], row2: [], row3: [] },
      faq: {
        title: "Новый FAQ",
        items: [{ question: "Вопрос", answer: "Ответ" }],
      },
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

  const updateProp = (sectionId: string, key: string, value: any) => {
    setSections(
      sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            props: { ...sec.props, [key]: value },
          };
        }
        return sec;
      }),
    );
  };

  const handleLogout = () => {
    window.location.href = "/cms/auth";
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/50 flex flex-col md:flex-row text-slate-900 select-none">
      <aside className="w-full md:w-64 border-r border-slate-200 bg-white p-8 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              CMS Panel
            </span>
            <div className="font-bold text-xl tracking-wider text-slate-950">
              AT.ADMIN
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button className="w-full px-4 py-3 bg-slate-950 text-white rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-colors">
              Контент сайта
            </button>
            <button className="w-full px-4 py-3 hover:bg-slate-50 text-slate-500 hover:text-slate-950 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-colors duration-150">
              Настройки
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3.5 border border-slate-200 hover:border-slate-950 text-slate-500 hover:text-white hover:bg-slate-950 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-150 ease-out hover:-translate-y-px active:translate-y-px active:bg-slate-850"
        >
          Выйти
        </button>
      </aside>

      <main className="grow p-8 md:p-12 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 mb-10">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-slate-950">
              Управление лендингом
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Зажми и тащи карточку за левый край для сортировки. Кликни для
              редактирования.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
            Конструктор структуры сайта:
          </span>

          {sections.map((sec, index) => {
            const isExpanded = expandedId === sec.id;

            return (
              <div
                key={sec.id}
                onClick={() => setExpandedId(isExpanded ? null : sec.id)}
                draggable={true}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`p-6 border rounded-3xl bg-white flex flex-col shadow-sm transition-all duration-300 cursor-grab active:cursor-grabbing ${
                  isExpanded
                    ? "border-slate-950 shadow-md"
                    : "border-slate-200 hover:border-slate-350"
                } ${draggedIndex === index ? "opacity-40" : ""}`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-300 group-hover:text-slate-600 transition-colors shrink-0">
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

                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                        Type: {sec.type}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                        {sec.props.title || sec.props.name || "Без названия"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        sec.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {sec.isActive ? "Активен" : "Выключен"}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => toggleSection(sec.id, e)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-150 ease-out ${
                          sec.isActive
                            ? "border-slate-250 text-slate-500 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                            : "border-slate-250 text-slate-950 bg-slate-50 hover:bg-slate-950 hover:text-white"
                        }`}
                      >
                        {sec.isActive ? "Выкл" : "Вкл"}
                      </button>
                      <button
                        onClick={(e) => deleteSection(sec.id, e)}
                        className="px-4 py-2 border border-rose-200 hover:border-rose-600 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 ease-out"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-slate-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-4 text-left">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                        Настройки контента:
                      </span>

                      {sec.type === "hero" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                              Заголовок
                            </label>
                            <input
                              type="text"
                              value={sec.props.title}
                              onChange={(e) =>
                                updateProp(sec.id, "title", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-slate-50/40"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                              Текст кнопки
                            </label>
                            <input
                              type="text"
                              value={sec.props.buttonText}
                              onChange={(e) =>
                                updateProp(sec.id, "buttonText", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-slate-50/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                              Описание
                            </label>
                            <textarea
                              rows={3}
                              value={sec.props.description}
                              onChange={(e) =>
                                updateProp(
                                  sec.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-slate-50/40 resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {sec.type === "about" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                              Имя профиля
                            </label>
                            <input
                              type="text"
                              value={sec.props.name}
                              onChange={(e) =>
                                updateProp(sec.id, "name", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-slate-50/40"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                              Путь к фото
                            </label>
                            <input
                              type="text"
                              value={sec.props.avatarUrl}
                              onChange={(e) =>
                                updateProp(sec.id, "avatarUrl", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-slate-50/40"
                            />
                          </div>
                        </div>
                      )}

                      {sec.type === "serviceSwitcher" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                              Английский:
                            </span>
                            <div className="flex flex-col gap-3">
                              <input
                                type="text"
                                placeholder="Заголовок"
                                value={sec.props.english.title}
                                onChange={(e) => {
                                  const updatedEng = {
                                    ...sec.props.english,
                                    title: e.target.value,
                                  };
                                  updateProp(sec.id, "english", updatedEng);
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                              />
                              <input
                                type="text"
                                placeholder="Телефон"
                                value={sec.props.english.phone}
                                onChange={(e) => {
                                  const updatedEng = {
                                    ...sec.props.english,
                                    phone: e.target.value,
                                  };
                                  updateProp(sec.id, "english", updatedEng);
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                              />
                            </div>
                          </div>

                          <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                              Экскурсии:
                            </span>
                            <div className="flex flex-col gap-3">
                              <input
                                type="text"
                                placeholder="Заголовок"
                                value={sec.props.guide.title}
                                onChange={(e) => {
                                  const updatedGuide = {
                                    ...sec.props.guide,
                                    title: e.target.value,
                                  };
                                  updateProp(sec.id, "guide", updatedGuide);
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                              />
                              <input
                                type="text"
                                placeholder="Телефон"
                                value={sec.props.guide.phone}
                                onChange={(e) => {
                                  const updatedGuide = {
                                    ...sec.props.guide,
                                    phone: e.target.value,
                                  };
                                  updateProp(sec.id, "guide", updatedGuide);
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {sec.type === "faq" && (
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              Список вопросов и ответов:
                            </span>
                            <button
                              onClick={() => {
                                const updatedItems = [
                                  ...sec.props.items,
                                  {
                                    question: "Новый вопрос",
                                    answer: "Новый ответ",
                                  },
                                ];
                                updateProp(sec.id, "items", updatedItems);
                              }}
                              className="px-3 py-1.5 border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors"
                            >
                              Добавить вопрос
                            </button>
                          </div>

                          {sec.props.items.map((faqItem: any, fIdx: number) => (
                            <div
                              key={fIdx}
                              className="p-4 border border-slate-100 rounded-xl bg-slate-50/40 flex flex-col gap-3 relative"
                            >
                              <button
                                onClick={() => {
                                  const updatedItems = sec.props.items.filter(
                                    (_: any, i: number) => i !== fIdx,
                                  );
                                  updateProp(sec.id, "items", updatedItems);
                                }}
                                className="absolute right-4 top-4 text-[9px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-800"
                              >
                                Удалить
                              </button>

                              <div className="max-w-[80%]">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                                  Вопрос {fIdx + 1}
                                </label>
                                <input
                                  type="text"
                                  value={faqItem.question}
                                  onChange={(e) => {
                                    const updatedItems = [...sec.props.items];
                                    updatedItems[fIdx] = {
                                      ...faqItem,
                                      question: e.target.value,
                                    };
                                    updateProp(sec.id, "items", updatedItems);
                                  }}
                                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-white"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                                  Ответ {fIdx + 1}
                                </label>
                                <textarea
                                  rows={2}
                                  value={faqItem.answer}
                                  onChange={(e) => {
                                    const updatedItems = [...sec.props.items];
                                    updatedItems[fIdx] = {
                                      ...faqItem,
                                      answer: e.target.value,
                                    };
                                    updateProp(sec.id, "items", updatedItems);
                                  }}
                                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-white resize-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {sec.type === "reviews" && (
                        <div className="flex flex-col gap-6">
                          <div className="max-w-md">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                              Заголовок секции
                            </label>
                            <input
                              type="text"
                              value={sec.props.title}
                              onChange={(e) =>
                                updateProp(sec.id, "title", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-slate-50/40"
                            />
                          </div>

                          {["row1", "row2", "row3"].map((rowKey, rIdx) => {
                            const currentRow = sec.props[rowKey] || [];

                            return (
                              <div
                                key={rowKey}
                                className="p-5 border border-slate-200 rounded-2xl bg-slate-50/30 flex flex-col gap-4"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                                    Строка бегущей ленты {rIdx + 1}
                                  </span>
                                  <button
                                    onClick={() => {
                                      const updatedRow = [
                                        ...currentRow,
                                        { text: "Новый отзыв", author: "Имя" },
                                      ];
                                      updateProp(sec.id, rowKey, updatedRow);
                                    }}
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors"
                                  >
                                    Добавить отзыв
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {currentRow.map(
                                    (reviewItem: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className="p-4 border border-slate-100 rounded-xl bg-white flex flex-col gap-3 relative"
                                      >
                                        <button
                                          onClick={() => {
                                            const updatedRow =
                                              currentRow.filter(
                                                (_: any, i: number) =>
                                                  i !== idx,
                                              );
                                            updateProp(
                                              sec.id,
                                              rowKey,
                                              updatedRow,
                                            );
                                          }}
                                          className="absolute right-3 top-3 text-[9px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-800"
                                        >
                                          Удалить
                                        </button>

                                        <div className="max-w-[85%]">
                                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                                            Текст отзыва
                                          </label>
                                          <textarea
                                            rows={2}
                                            value={reviewItem.text}
                                            onChange={(e) => {
                                              const updatedRow = [
                                                ...currentRow,
                                              ];
                                              updatedRow[idx] = {
                                                ...reviewItem,
                                                text: e.target.value,
                                              };
                                              updateProp(
                                                sec.id,
                                                rowKey,
                                                updatedRow,
                                              );
                                            }}
                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-white resize-none"
                                          />
                                        </div>

                                        <div>
                                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                                            Автор
                                          </label>
                                          <input
                                            type="text"
                                            value={reviewItem.author}
                                            onChange={(e) => {
                                              const updatedRow = [
                                                ...currentRow,
                                              ];
                                              updatedRow[idx] = {
                                                ...reviewItem,
                                                author: e.target.value,
                                              };
                                              updateProp(
                                                sec.id,
                                                rowKey,
                                                updatedRow,
                                              );
                                            }}
                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-950 bg-white"
                                          />
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {!showAddMenu ? (
            <div
              onClick={() => setShowAddMenu(true)}
              className="border-2 border-dashed border-slate-200 hover:border-slate-950 p-6 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-slate-50/50 transition-all duration-300 gap-3 text-slate-400 hover:text-slate-950"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest">
                Добавить новый блок
              </span>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-950 p-6 rounded-3xl bg-white flex flex-col gap-4 animate-fade-in">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-center">
                Выберите тип создаваемого блока:
              </span>
              <div className="flex flex-wrap gap-2.5 justify-center">
                <button
                  onClick={() => addSection("hero")}
                  className="px-4 py-2.5 border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Hero Баннер
                </button>
                <button
                  onClick={() => addSection("about")}
                  className="px-4 py-2.5 border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  About Профиль
                </button>
                <button
                  onClick={() => addSection("serviceSwitcher")}
                  className="px-4 py-2.5 border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Услуги Switcher
                </button>
                <button
                  onClick={() => addSection("reviews")}
                  className="px-4 py-2.5 border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reviews Отзывы
                </button>
                <button
                  onClick={() => addSection("faq")}
                  className="px-4 py-2.5 border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  FAQ Вопросы
                </button>
                <button
                  onClick={() => setShowAddMenu(false)}
                  className="px-4 py-2.5 border border-rose-200 hover:border-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

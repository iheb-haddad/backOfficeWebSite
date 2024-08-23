import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';    

i18next
.use(initReactI18next)
.use(LanguageDetector)
.init({
    fallbackLng: 'en',
    debug : true,
    resources: {
        en: {
            translation: {
                    "search" : "search",
                    "Language" : "Language",
                    "done" : "done",
                    "Memo" : "Memo",
                    "messageMemo" : "Enter your notes here...",
                    "Alerts" : "Alerts",
                    "Commons" : "Commons",
                    "Job sheets" : "Job sheets",
                    "Instructions" : "Instructions",
                    "Notes" : "Notes",
                    "Trainings" : "Trainings",
                    "Others" : "Others"
            }
        },
        de : {
            translation: {
                "search" : "suchen",
                "Language" : "Sprache",
                "done" : "fertig",
                "Memo" : "Memo",
                "messageMemo" : "Geben Sie hier Ihre Notizen ein...",
                "Alerts" : "Warnungen",
                "Commons" : "Commons",
                "Job sheets" : "Jobblätter",
                "Instructions" : "Anweisungen",
                "Notes" : "Notizen",
                "Trainings" : "Schulungen",
                "Others" : "Andere"
            }
        },
        fr : {
            translation: {
                "search": "recherche",
                "Language": "Langue",
                "done": "enregistrer",
                "Memo" : "Mémo",
                "messageMemo" : "Entrez vos notes ici...",
                "Alerts" : "Alertes",
                "Commons" : "Communs",
                "Job sheets" : "Fiches métier",
                "Instructions" : "Instructions",
                "Notes" : "Notes",
                "Trainings" : "Formations",
                "Others" : "Autres"
            }
        },
        es : {
            translation: {
                "search": "buscar",
                "Language": "Idioma",
                "done": "hecho",
                "Memo" : "Memorándum",
                "messageMemo" : "Ingrese sus notas aquí...",
                "Alerts" : "Alertas",
                "Commons" : "Comunes",
                "Job sheets" : "Hojas de trabajo",
                "Instructions" : "Instrucciones",
                "Notes" : "Notas",
                "Trainings" : "Entrenamientos",
                "Others" : "Otros"
            }
        },
        it: {
            translation: {
                "search": "ricerca",
                "Language": "Lingua",
                "done": "fatto",
                "Memo" : "Memo",
                "messageMemo" : "Inserisci le tue note qui...",
                "Alerts" : "Allarmi",
                "Commons" : "Comuni",
                "Job sheets" : "Fogli di lavoro",
                "Instructions" : "Istruzioni",
                "Notes" : "Note",
                "Trainings" : "Formazioni",
                "Others" : "Altri"
            }
        },
        zh: {
            translation: {
                "search": "搜索",
                "Language": "语言",
                "done": "完成",
                "Memo" : "备忘录",
                "messageMemo" : "在这里输入您的笔记...",
                "Alerts" : "警报",
                "Commons" : "常见",
                "Job sheets" : "工作表",
                "Instructions" : "说明",
                "Notes" : "笔记",
                "Trainings" : "培训",
                "Others" : "其他"
            }
        },
        pt: {
            translation: {
                "search": "pesquisa",
                "Language": "Língua",
                "done": "feito",
                "Memo" : "Memorando",
                "messageMemo" : "Insira suas notas aqui...",
                "Alerts" : "Alertas",
                "Commons" : "Comuns",
                "Job sheets" : "Folhas de trabalho",
                "Instructions" : "Instruções",
                "Notes" : "Notas",
                "Trainings" : "Treinamentos",
                "Others" : "Outros"
            }
        },
        ar: {
            translation: {
                "search": "بحث",
                "Language": "لغة",
                "done": "تم",
                "Memo" : "مذكرة",
                "messageMemo" : "أدخل ملاحظاتك هنا...",
                "Alerts" : "تنبيهات",
                "Commons" : "مشترك",
                "Job sheets" : "أوراق العمل",
                "Instructions" : "تعليمات",
                "Notes" : "ملاحظات",
                "Trainings" : "تدريبات",
                "Others" : "آخرين"
            }
        },
        tr: {
            translation: {
                "search": "arama",
                "Language": "Dil",
                "done": "tamam",
                "Memo": "Not",
                "messageMemo": "Notlarınızı buraya girin...",
                "Alerts": "Uyarılar",
                "Commons": "Ortaklar",
                "Job sheets": "İş sayfaları",
                "Instructions": "Talimatlar",
                "Notes": "Notlar",
                "Trainings": "Eğitimler",
                "Others": "Diğerleri"
            }
        },
        nl: {
            translation: {
                "search": "zoeken",
                "Language": "Taal",
                "done": "klaar",
                "Memo": "Memo",
                "messageMemo": "Voer hier uw notities in...",
                "Alerts": "Waarschuwingen",
                "Commons": "Gemeenschappelijk",
                "Job sheets": "Takenbladen",
                "Instructions": "Instructies",
                "Notes": "Notities",
                "Trainings": "Trainingen",
                "Others": "Anderen"
            }
        },
        pl: {
            translation: {
                "search": "szukaj",
                "Language": "Język",
                "done": "gotowe",
                "Memo": "Memo",
                "messageMemo": "Wprowadź swoje notatki tutaj...",
                "Alerts": "Alerty",
                "Commons": "Wspólne",
                "Job sheets": "Arkusze pracy",
                "Instructions": "Instrukcje",
                "Notes": "Notatki",
                "Trainings": "Szkolenia",
                "Others": "Inni"
            }
        },
    },
});

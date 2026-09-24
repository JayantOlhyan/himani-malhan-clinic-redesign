import type { FAQ } from "./services";
import { clinics, contact, doctor } from "./site";

/**
 * General FAQ. Questions follow the topics in the brief. Answers either restate verified
 * practice facts or give conservative, general guidance — no claims about outcomes.
 * Review status: pending comparison with the FAQ on the current site (see CONTENT_STATUS.md).
 */
export const generalFaqs: FAQ[] = [
  {
    q: `What conditions does ${doctor.name} treat?`,
    a: `${doctor.shortName} provides care across obstetrics, gynaecology, and fetal & maternal medicine — including high-risk pregnancy, antenatal care and delivery, fetal medicine, pre-pregnancy counselling, infertility, PCOS/PCOD, menstrual and hormonal disorders, fibroids and ovarian cysts, endometriosis, infections, gynaecological surgery, cancer screening, HPV vaccination, and menopause care.`,
  },
  {
    q: "When should I consult for a high-risk pregnancy?",
    a: "If you have a medical condition such as high blood pressure, diabetes or a thyroid disorder, had complications in a previous pregnancy, are expecting twins, or have been told a scan finding needs review, it is best to consult early — ideally before conception or as soon as the pregnancy is confirmed.",
  },
  {
    q: "What is included in a pregnancy check-up?",
    a: "Antenatal visits typically include checking blood pressure and weight, following the baby's growth, blood and urine tests, and ultrasound scans at recommended stages. The exact schedule depends on your pregnancy and is planned with you.",
  },
  {
    q: "Is normal delivery possible after a C-section?",
    a: "In many cases a vaginal birth after caesarean (VBAC) can be considered. It depends on the reason for the previous caesarean, the type of uterine incision, the interval since, and the current pregnancy, so it needs individual assessment.",
  },
  {
    q: "Can PCOS/PCOD be treated?",
    a: "PCOS/PCOD cannot be permanently cured, but it can be managed well. Treatment focuses on regulating cycles, managing symptoms, supporting fertility when pregnancy is planned, and long-term metabolic health.",
  },
  {
    q: "When should I consider fertility treatment?",
    a: "Consider an evaluation after 12 months of trying to conceive without success, or after 6 months if you are 35 or older. Consult sooner if you have irregular periods, known PCOS, endometriosis, or a history of pelvic infection or surgery.",
  },
  {
    q: "How often should I have a gynaecological check-up?",
    a: "A yearly well-woman check-up is a sensible routine for most women. How often cervical screening is needed depends on your age and previous results, and is advised at your visit.",
  },
  {
    q: `Where does ${doctor.shortName} consult?`,
    a: `${doctor.shortName} consults at ${clinics.map((c) => `${c.name} (${c.locality})`).join(" and ")}. Call ${contact.phoneDisplay} to confirm availability and book.`,
  },
];

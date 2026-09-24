/**
 * Care categories and services.
 *
 * The service list (names + grouping) comes from the verified brief.
 * Detailed page copy (`detail`) is general, conservative patient-education text written
 * for the demo because the source site could not be fetched from the build environment.
 * Every `detail` block carries `review: "pending"` until it is checked against the
 * matching page on the current site and signed off by the doctor. See CONTENT_STATUS.md.
 *
 * A service gets its own page at /services/[slug]/ only when it has a `detail` block.
 */

export type FAQ = { q: string; a: string };

export type ServiceDetail = {
  review: "pending" | "approved";
  intro: string;
  whatIs: string[];
  whoShouldConsult: string[];
  indicationsTitle?: string;
  care: { title: string; text: string }[];
  faqs: FAQ[];
};

export type Service = {
  slug: string;
  name: string;
  summary: string;
  detail?: ServiceDetail;
};

export type CareCategory = {
  slug: string;
  name: string;
  navLabel: string;
  eyebrow: string;
  description: string;
  image: { src: string; alt: string };
  services: Service[];
};

export const categories: CareCategory[] = [
  {
    slug: "pregnancy-maternity",
    name: "Pregnancy & Maternity",
    navLabel: "Pregnancy Care",
    eyebrow: "Obstetrics & fetal medicine",
    description:
      "Antenatal care from the first scan to delivery, with specialist fetal & maternal medicine for pregnancies that need closer attention.",
    image: { src: "/images/category-pregnancy.jpg", alt: "Pregnancy care" },
    services: [
      {
        slug: "high-risk-pregnancy",
        name: "High-Risk Pregnancy",
        summary: "Closer monitoring and careful planning when the health of mother or baby needs additional attention.",
        detail: {
          review: "pending",
          intro:
            "Specialist care for pregnancies that need closer monitoring — planned carefully, explained clearly, and adjusted as the pregnancy progresses.",
          whatIs: [
            "A pregnancy is described as high-risk when a pre-existing health condition, a condition that develops during pregnancy, or a finding related to the baby means that mother or baby need closer monitoring than routine antenatal care provides.",
            "Being described as high-risk does not mean something will go wrong. It means the pregnancy is followed more closely, so that any change can be recognised and managed early.",
          ],
          whoShouldConsult: [
            "High blood pressure, diabetes or thyroid disorders before pregnancy",
            "Blood pressure or blood sugar problems that develop during pregnancy",
            "Complications in a previous pregnancy, such as preterm birth or pregnancy loss",
            "Twin or multiple pregnancy",
            "Concerns about the baby's growth or a finding on a routine scan",
            "Pregnancy at an older maternal age",
          ],
          care: [
            { title: "Assessment", text: "A detailed review of medical and obstetric history to understand the specific risks in this pregnancy." },
            {
              title: "Monitoring plan",
              text: "A schedule of check-ups, tests and scans matched to those risks, rather than a one-size-fits-all timetable.",
            },
            { title: "Coordinated care", text: "Working with other specialists where a medical condition needs shared management." },
            {
              title: "Delivery planning",
              text: "Discussing the timing, place and mode of delivery well in advance, and revisiting the plan as needed.",
            },
          ],
          faqs: [
            {
              q: "Does a high-risk pregnancy always mean a caesarean delivery?",
              a: "No. The mode of delivery depends on the individual situation of mother and baby. It is discussed openly during pregnancy and reviewed as the pregnancy progresses.",
            },
            {
              q: "When should I first consult if I have a pre-existing condition?",
              a: "Ideally before trying to conceive, through pre-pregnancy counselling, or as early as possible once the pregnancy is confirmed.",
            },
          ],
        },
      },
      {
        slug: "fetal-medicine",
        name: "Fetal Medicine",
        summary: "Specialist assessment of the baby's growth, development and wellbeing before birth.",
        detail: {
          review: "pending",
          intro: "Focused assessment of the baby's health during pregnancy, with clear explanations of every finding and what it means for you.",
          whatIs: [
            "Fetal medicine is the part of obstetrics that focuses on the baby before birth — assessing growth and development, screening for certain conditions, and planning care when a concern is identified.",
            "It combines detailed ultrasound assessment with counselling, so parents understand the findings and the options available.",
          ],
          whoShouldConsult: [
            "An abnormal or unclear result on a screening test",
            "A finding on a routine pregnancy scan that needs further evaluation",
            "Concerns about the baby's growth or amniotic fluid",
            "Twin or multiple pregnancy",
            "A previous pregnancy affected by a fetal condition",
            "A family history of genetic conditions",
          ],
          care: [
            { title: "Detailed evaluation", text: "Specialist scans and review of screening results to clarify the concern." },
            { title: "Counselling", text: "Unhurried explanation of findings, what they may mean, and the choices available." },
            { title: "Follow-up", text: "Planned monitoring of the baby through the rest of the pregnancy where needed." },
            { title: "Birth planning", text: "Coordinating delivery and newborn care when a condition is expected to need attention after birth." },
          ],
          faqs: [
            {
              q: "Is a fetal medicine consultation only for serious problems?",
              a: "No. Many referrals are to clarify a screening result or a scan finding, and often provide reassurance. The aim is to understand the baby's health as clearly as possible.",
            },
          ],
        },
      },
      {
        slug: "antenatal-care",
        name: "Pregnancy Check-up & Antenatal Care",
        summary: "Regular check-ups through each trimester to follow the health of mother and baby.",
      },
      {
        slug: "pregnancy-scans",
        name: "Ultrasound & Pregnancy Scans",
        summary: "Scans at the recommended stages of pregnancy to assess the baby's development.",
      },
      { slug: "normal-delivery", name: "Normal Delivery", summary: "Support for vaginal birth, with preparation and guidance through labour." },
      { slug: "painless-delivery", name: "Painless Delivery", summary: "Pain relief options during labour, discussed and planned ahead of time." },
      {
        slug: "caesarean-section",
        name: "Caesarean Section",
        summary: "Planned or emergency caesarean delivery when it is the safer option for mother or baby.",
      },
    ],
  },
  {
    slug: "fertility-conception",
    name: "Fertility & Conception",
    navLabel: "Fertility",
    eyebrow: "Planning a family",
    description:
      "Preparing for pregnancy, evaluating difficulty conceiving, managing PCOS/PCOD, and reproductive choices — including contraception and MTP.",
    image: { src: "/images/category-fertility.jpg", alt: "Fertility and conception care" },
    services: [
      {
        slug: "pre-pregnancy-counselling",
        name: "Pre-Pregnancy Counselling",
        summary: "Preparing your health before conception, especially with existing medical conditions.",
        detail: {
          review: "pending",
          intro:
            "A consultation before trying to conceive — to prepare your health, review risks, and plan the healthiest possible start to pregnancy.",
          whatIs: [
            "Pre-pregnancy counselling is a consultation that takes place before you try to conceive. It reviews your medical history, current medicines, previous pregnancies and lifestyle, so that anything that could affect a future pregnancy can be addressed in advance.",
            "It is useful for everyone planning a pregnancy, and particularly important when there is an existing medical condition or a previous pregnancy complication.",
          ],
          whoShouldConsult: [
            "Anyone planning a pregnancy in the coming months",
            "Existing conditions such as diabetes, thyroid disorders or high blood pressure",
            "Long-term medication that may need review before pregnancy",
            "Complications or loss in a previous pregnancy",
            "A family history of genetic conditions",
          ],
          care: [
            { title: "Health review", text: "Medical history, medicines and previous pregnancies reviewed together." },
            { title: "Tests & screening", text: "Relevant blood tests and screening before conception." },
            { title: "Preparation", text: "Advice on supplements such as folic acid, vaccinations and lifestyle." },
            { title: "Condition planning", text: "Optimising existing medical conditions before pregnancy begins." },
          ],
          faqs: [
            {
              q: "How long before trying to conceive should I book?",
              a: "A few months in advance is ideal. This allows time for tests, any change in medication, and starting supplements such as folic acid before conception.",
            },
          ],
        },
      },
      {
        slug: "infertility-treatment",
        name: "Infertility Treatment",
        summary: "Evaluation of both partners and a clear, stepwise treatment plan.",
        detail: {
          review: "pending",
          intro: "A structured evaluation of why conception has not happened yet, followed by a clear, stepwise plan.",
          whatIs: [
            "Infertility is generally defined as not conceiving after 12 months of regular unprotected intercourse, or after 6 months when the woman is 35 or older.",
            "Causes can involve ovulation, the fallopian tubes, the uterus, male factors, or a combination — and sometimes no single cause is found. Evaluation looks at both partners.",
          ],
          whoShouldConsult: [
            "Trying to conceive for 12 months (or 6 months if 35 or older) without success",
            "Irregular or absent periods",
            "Known PCOS/PCOD, endometriosis or fibroids",
            "Previous pelvic infection or pelvic surgery",
            "Recurrent pregnancy loss",
          ],
          care: [
            { title: "Evaluation", text: "History, examination and appropriate tests for both partners." },
            { title: "Diagnosis", text: "Identifying contributing factors and explaining them clearly." },
            {
              title: "Treatment plan",
              text: "Options that may range from lifestyle changes and medical treatment to assisted reproduction, depending on the cause.",
            },
            { title: "Ongoing support", text: "Regular review of progress and adjustment of the plan." },
          ],
          faqs: [
            {
              q: "Should both partners attend the first consultation?",
              a: "It helps. Fertility evaluation involves both partners, and attending together allows history and next steps to be discussed at once.",
            },
          ],
        },
      },
      {
        slug: "pcos-pcod-treatment",
        name: "PCOD / PCOS Treatment",
        summary: "Managing cycles, symptoms, fertility and long-term health with PCOS/PCOD.",
        detail: {
          review: "pending",
          intro: "Individual management of PCOS/PCOD — for regular cycles, symptom control, fertility, and long-term health.",
          whatIs: [
            "Polycystic ovary syndrome (PCOS, often called PCOD) is a common hormonal condition. It can cause irregular or missed periods, signs of raised androgen levels such as acne or excess hair growth, and polycystic-appearing ovaries on ultrasound.",
            "PCOS is often linked with insulin resistance and weight changes, and can affect fertility. It cannot be 'cured', but it can be managed well with the right plan.",
          ],
          whoShouldConsult: [
            "Irregular, infrequent or absent periods",
            "Acne, excess facial or body hair, or scalp hair thinning",
            "Difficulty conceiving",
            "Weight gain that is difficult to manage",
            "A previous PCOS/PCOD diagnosis that needs review",
          ],
          care: [
            { title: "Diagnosis", text: "History, examination, blood tests and ultrasound where appropriate." },
            { title: "Cycle & symptom care", text: "Treatment to regulate cycles and manage symptoms." },
            { title: "Fertility support", text: "Specific treatment when pregnancy is the goal." },
            { title: "Long-term health", text: "Guidance on lifestyle and metabolic health over time." },
          ],
          faqs: [
            {
              q: "Can I get pregnant if I have PCOS?",
              a: "Many people with PCOS do conceive, sometimes with treatment to support ovulation. The right approach depends on the individual evaluation.",
            },
          ],
        },
      },
      {
        slug: "family-planning-contraception",
        name: "Family Planning & Contraception",
        summary: "Guidance on contraceptive options suited to your health and plans.",
      },
      {
        slug: "abortion-mtp",
        name: "Abortion / MTP Services",
        summary: "Confidential, non-judgemental medical termination of pregnancy within the law.",
        detail: {
          review: "pending",
          intro: "Confidential and non-judgemental care, with clear information at every step.",
          whatIs: [
            "Medical termination of pregnancy (MTP) is the ending of a pregnancy by medical or surgical methods. In India it is governed by the Medical Termination of Pregnancy Act, and is provided by registered medical practitioners within the limits the Act sets.",
            "The appropriate method depends on how far the pregnancy has progressed and on individual health factors.",
          ],
          whoShouldConsult: [
            "Anyone considering ending a pregnancy",
            "Those needing information on options before deciding",
            "Care after a failed pregnancy or incomplete miscarriage",
          ],
          care: [
            { title: "Confirmation", text: "Confirming the pregnancy and its duration, usually with an ultrasound." },
            { title: "Counselling", text: "Explaining the options, methods and what to expect, in confidence." },
            { title: "Procedure", text: "Medical or surgical method, as appropriate and as permitted by law." },
            { title: "Follow-up", text: "Checking recovery and discussing contraception." },
          ],
          faqs: [
            {
              q: "Is my consultation confidential?",
              a: "Yes. Confidentiality is a legal requirement under the MTP Act and is respected throughout care.",
            },
          ],
        },
      },
    ],
  },
  {
    slug: "gynecological-health",
    name: "Gynecological Health",
    navLabel: "Women's Health",
    eyebrow: "Gynaecology",
    description:
      "Diagnosis and treatment for periods, infections, fibroids, cysts, endometriosis and pelvic pain — including gynaecological surgery when needed.",
    image: { src: "/images/category-gynecology.jpg", alt: "Gynaecological care" },
    services: [
      {
        slug: "irregular-periods-treatment",
        name: "Irregular Periods Treatment",
        summary: "Finding the cause of irregular cycles and treating it.",
        detail: {
          review: "pending",
          intro: "Understanding why your cycle has changed, and treating the cause rather than only the symptom.",
          whatIs: [
            "Most menstrual cycles last between 21 and 35 days. Periods are considered irregular when the cycle length varies widely, periods are missed, or bleeding is unusually heavy, light, or prolonged.",
            "Common causes include hormonal changes, PCOS/PCOD, thyroid disorders, stress, significant weight change, and the transition towards menopause.",
          ],
          indicationsTitle: "When to consult",
          whoShouldConsult: [
            "Cycles consistently shorter than 21 or longer than 35 days",
            "Missed periods when pregnancy has been ruled out",
            "Very heavy bleeding or periods lasting longer than 7 days",
            "Bleeding between periods or after intercourse",
            "Any bleeding after menopause",
          ],
          care: [
            { title: "History", text: "Understanding your cycle pattern, symptoms and general health." },
            { title: "Investigation", text: "Examination, blood tests and ultrasound where appropriate." },
            { title: "Treatment", text: "Addressing the underlying cause — hormonal, structural or other." },
            { title: "Review", text: "Following up to check that the cycle and symptoms are improving." },
          ],
          faqs: [
            {
              q: "Are irregular periods always a sign of a problem?",
              a: "Not always — cycles can vary, especially in adolescence and around menopause. Persistent changes are worth evaluating to find the cause.",
            },
          ],
        },
      },
      {
        slug: "abnormal-uterine-bleeding",
        name: "Abnormal Uterine Bleeding Management",
        summary: "Evaluation and treatment of heavy, prolonged or unexpected bleeding.",
      },
      {
        slug: "menstrual-hormonal-disorders",
        name: "Menstrual and Hormonal Disorders",
        summary: "Care for hormonal conditions that affect cycles and wellbeing.",
      },
      {
        slug: "fibroid-ovarian-cyst-treatment",
        name: "Fibroid & Ovarian Cyst Treatment",
        summary: "Assessment and treatment options, medical or surgical, based on symptoms and size.",
      },
      { slug: "endometriosis-treatment", name: "Endometriosis Treatment", summary: "Managing pain and fertility concerns related to endometriosis." },
      { slug: "pelvic-pain-evaluation", name: "Pelvic Pain Evaluation", summary: "Structured evaluation of acute or long-standing pelvic pain." },
      {
        slug: "gynaecological-surgeries",
        name: "Gynaecological Surgeries",
        summary: "Surgical treatment when a gynaecological condition needs it.",
        detail: {
          review: "pending",
          intro: "When surgery is the right option, a careful plan — from the decision to operate through recovery.",
          whatIs: [
            "Some gynaecological conditions, such as certain fibroids, ovarian cysts or endometriosis, may need surgical treatment when symptoms persist or medical treatment is not suitable.",
            "Surgery is always considered alongside non-surgical options, and the choice of procedure depends on the condition, symptoms and your plans for the future, including fertility.",
          ],
          whoShouldConsult: [
            "Fibroids or ovarian cysts causing symptoms",
            "Endometriosis not controlled with medical treatment",
            "Abnormal bleeding that needs surgical evaluation",
            "A surgical recommendation you would like to discuss",
          ],
          care: [
            { title: "Evaluation", text: "Confirming the diagnosis and whether surgery is truly needed." },
            { title: "Discussion", text: "Explaining the procedure, alternatives, risks and recovery." },
            { title: "Surgery", text: "Planned procedure in a hospital setting." },
            { title: "Recovery", text: "Post-operative follow-up and guidance on returning to routine." },
          ],
          faqs: [
            {
              q: "Will surgery affect my ability to conceive?",
              a: "This depends on the condition and the procedure. Fertility plans are discussed before surgery so the approach can take them into account.",
            },
          ],
        },
      },
      {
        slug: "uti-pelvic-infection-treatment",
        name: "UTI / Pelvic Infection Treatment",
        summary: "Diagnosis and treatment of urinary and pelvic infections.",
      },
      {
        slug: "white-discharge-treatment",
        name: "White Discharge / Infection Treatment",
        summary: "Evaluation of abnormal discharge and its cause.",
      },
      {
        slug: "vaginal-infection-treatment",
        name: "Vaginal Infection Treatment",
        summary: "Treatment of vaginal infections, including recurrent infections.",
      },
    ],
  },
  {
    slug: "womens-wellness",
    name: "Women's Wellness",
    navLabel: "Wellness",
    eyebrow: "Prevention & life stages",
    description: "Preventive check-ups, cancer screening, HPV vaccination, and care through adolescence, perimenopause and menopause.",
    image: { src: "/images/category-wellness.jpg", alt: "Women's wellness care" },
    services: [
      {
        slug: "female-wellness-checkup",
        name: "Female Wellness Check-up",
        summary: "Preventive gynaecological check-up appropriate to your age and history.",
      },
      { slug: "cancer-screening", name: "Cancer Screening", summary: "Screening for gynaecological cancers, including cervical screening." },
      { slug: "breast-health-checkup", name: "Breast Health Check-up", summary: "Clinical breast examination and guidance on further screening." },
      { slug: "hpv-vaccination", name: "HPV Vaccination", summary: "Vaccination to help protect against HPV-related cervical cancer." },
      {
        slug: "menopause-management",
        name: "Perimenopause & Menopause Management",
        summary: "Managing symptoms and long-term health through the menopause transition.",
      },
      {
        slug: "adolescent-health-care",
        name: "Adolescent Health Care",
        summary: "Sensitive care for periods, hormones and health questions in the teenage years.",
      },
    ],
  },
];

export const allServices = categories.flatMap((c) => c.services.map((s) => ({ ...s, category: c })));
export const detailedServices = allServices.filter((s) => s.detail);

export function serviceHref(slug: string) {
  const s = allServices.find((x) => x.slug === slug);
  return s?.detail ? `/services/${slug}/` : undefined;
}
export const categoryHref = (slug: string) => `/expertise/${slug}/`;
